import { randomUUID } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error('Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local before migration.');
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false }
});
const source = JSON.parse(await readFile(new URL('../data/bookings.json', import.meta.url), 'utf8'));

if (!Array.isArray(source)) {
  throw new Error('data/bookings.json must contain an array of legacy bookings.');
}

for (const booking of source) {
  if (!booking.referenceCode || !booking.parishionerName || !booking.phone || !booking.requestedDate) {
    throw new Error('A legacy booking is missing required fields; migration stopped without deleting source data.');
  }

  const { data: existing, error: lookupError } = await supabase
    .from('bookings')
    .select('id')
    .eq('reference_code', booking.referenceCode)
    .maybeSingle();
  if (lookupError) throw lookupError;
  if (existing) {
    console.log(`Skipped existing booking ${booking.referenceCode}`);
    continue;
  }

  let receiptPath = null;
  if (booking.receiptImage) {
    const match = /^data:(image\/(?:jpeg|png|webp));base64,([\s\S]+)$/.exec(booking.receiptImage);
    if (!match) {
      throw new Error(`Receipt for ${booking.referenceCode} is not a supported base64 image; migration stopped.`);
    }

    const mimeType = match[1];
    const extension = mimeType === 'image/jpeg' ? 'jpg' : mimeType.split('/')[1];
    const id = randomUUID();
    receiptPath = `${id}/${randomUUID()}.${extension}`;
    const { error: uploadError } = await supabase.storage
      .from('booking-receipts')
      .upload(receiptPath, Buffer.from(match[2], 'base64'), { contentType: mimeType, upsert: false });
    if (uploadError) throw uploadError;
  }

  const { error: insertError } = await supabase.from('bookings').insert({
    reference_code: booking.referenceCode,
    type: booking.type,
    parishioner_name: booking.parishionerName,
    email: booking.email || '',
    phone: booking.phone,
    intention_type: booking.intentionType || null,
    intention_for: booking.intentionFor || null,
    requested_date: booking.requestedDate,
    mass_time: booking.massTime || null,
    appointment_reason: booking.appointmentReason || null,
    preferred_time_slot: booking.preferredTimeSlot || null,
    notes: booking.notes || null,
    receipt_path: receiptPath,
    receipt_uploaded_at: receiptPath ? booking.receiptUploadedAt || new Date().toISOString() : null,
    status: booking.status || 'pending',
    admin_notes: booking.adminNotes || '',
    created_at: booking.createdAt || new Date().toISOString()
  });

  if (insertError) {
    if (receiptPath) {
      const { error: cleanupError } = await supabase.storage.from('booking-receipts').remove([receiptPath]);
      if (cleanupError) console.error(`Could not clean up receipt ${receiptPath}:`, cleanupError);
    }
    throw insertError;
  }

  console.log(`Migrated booking ${booking.referenceCode}`);
}

console.log(`Finished migrating ${source.length} booking record(s). The original JSON file was not changed.`);
