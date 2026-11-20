import 'server-only';
import { addDays, todayInParish } from './dates';
import { RETENTION_DAYS } from './retentionPolicy';
import { getSupabaseAdmin, RECEIPTS_BUCKET } from './supabase';

const BATCH_SIZE = 500;

/**
 * Deletes bookings (and their receipt images) whose retention period is over;
 * see scheduledDeletionDate in retentionPolicy.ts for the rule.
 *
 * Receipts are removed before the rows, so a storage failure leaves the rows to retry tomorrow.
 * Returns how many bookings were deleted.
 */
export async function purgeExpiredBookings(): Promise<number> {
  const supabase = getSupabaseAdmin();
  const cutoff = new Date(Date.now() - RETENTION_DAYS * 24 * 60 * 60 * 1000).toISOString();
  const cutoffDate = addDays(todayInParish(), -RETENTION_DAYS);

  const [rejected, approved] = await Promise.all([
    supabase
      .from('bookings')
      .select('id, receipt_path')
      .eq('status', 'rejected')
      .lte('decided_at', cutoff)
      .limit(BATCH_SIZE),
    supabase
      .from('bookings')
      .select('id, receipt_path')
      .in('status', ['approved', 'completed'])
      .lte('decided_at', cutoff)
      .lte('requested_date', cutoffDate)
      .limit(BATCH_SIZE),
  ]);
  if (rejected.error) throw rejected.error;
  if (approved.error) throw approved.error;

  const expired = [...rejected.data, ...approved.data];
  if (expired.length === 0) return 0;

  const receiptPaths = expired.flatMap(row => (row.receipt_path ? [row.receipt_path] : []));
  if (receiptPaths.length > 0) {
    const { error } = await supabase.storage.from(RECEIPTS_BUCKET).remove(receiptPaths);
    if (error) throw error;
  }

  const { error } = await supabase
    .from('bookings')
    .delete()
    .in('id', expired.map(row => row.id));
  if (error) throw error;

  return expired.length;
}

/** Runs the purge without ever failing the caller; problems are only logged. */
export async function purgeExpiredBookingsQuietly(): Promise<void> {
  try {
    await purgeExpiredBookings();
  } catch (error) {
    console.error('Failed to purge expired bookings:', error);
  }
}
