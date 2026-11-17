import { randomUUID } from 'node:crypto';
import { NextRequest, NextResponse } from 'next/server';
import { isAdminRequest } from '@/lib/data';
import { getSupabaseAdmin, RECEIPTS_BUCKET, toBooking } from '@/lib/supabase';
import { BookingStatus, BookingType } from '@/lib/types';

const bookingStatuses: BookingStatus[] = ['pending', 'approved', 'rejected', 'completed'];
const bookingTypes: BookingType[] = ['mass_intention', 'thanksgiving', 'priest_appointment'];
const emptyStatusCounts: Record<BookingStatus, number> = {
  pending: 0,
  approved: 0,
  rejected: 0,
  completed: 0
};

function errorResponse(error: unknown) {
  const message = error instanceof Error ? error.message : 'Unexpected server error';
  return NextResponse.json({ success: false, error: message }, { status: 500 });
}

export async function GET(request: NextRequest) {
  try {
    if (!isAdminRequest(request)) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = Number(searchParams.get('page') ?? '1');
    const pageSize = Number(searchParams.get('pageSize') ?? '20');
    const status = searchParams.get('status') ?? 'all';
    const type = searchParams.get('type') ?? 'all';
    const requestedDate = searchParams.get('requestedDate');
    const massTime = searchParams.get('massTime');

    if (!Number.isInteger(page) || page < 1 || !Number.isInteger(pageSize) || pageSize < 1 || pageSize > 100) {
      return NextResponse.json({ success: false, error: 'Invalid pagination parameters' }, { status: 400 });
    }
    if (status !== 'all' && !bookingStatuses.includes(status as BookingStatus)) {
      return NextResponse.json({ success: false, error: 'Invalid booking status filter' }, { status: 400 });
    }
    if (type !== 'all' && !bookingTypes.includes(type as BookingType)) {
      return NextResponse.json({ success: false, error: 'Invalid booking type filter' }, { status: 400 });
    }
    if (requestedDate && !/^\d{4}-\d{2}-\d{2}$/.test(requestedDate)) {
      return NextResponse.json({ success: false, error: 'Invalid requested date filter' }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();
    let bookingsQuery = supabase
      .from('bookings')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false });

    if (status !== 'all') bookingsQuery = bookingsQuery.eq('status', status as BookingStatus);
    if (type !== 'all') bookingsQuery = bookingsQuery.eq('type', type as BookingType);
    if (requestedDate) bookingsQuery = bookingsQuery.eq('requested_date', requestedDate);
    if (massTime) bookingsQuery = bookingsQuery.eq('mass_time', massTime);

    const [{ data, error, count }, { data: countRows, error: countError }] = await Promise.all([
      bookingsQuery.range((page - 1) * pageSize, page * pageSize - 1),
      supabase.rpc('booking_status_counts')
    ]);

    if (error) throw error;
    if (countError) throw countError;

    const statusCounts = { ...emptyStatusCounts };
    for (const row of countRows ?? []) {
      if (bookingStatuses.includes(row.status as BookingStatus)) {
        statusCounts[row.status as BookingStatus] = Number(row.booking_count);
      }
    }

    const total = count ?? 0;
    return NextResponse.json({
      success: true,
      data: data.map(toBooking),
      pagination: {
        page,
        pageSize,
        total,
        pages: Math.max(1, Math.ceil(total / pageSize)),
        statusCounts
      }
    });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function POST(request: NextRequest) {
  let uploadedPath: string | undefined;

  try {
    const formData = await request.formData();
    const text = (name: string) => {
      const value = formData.get(name);
      return typeof value === 'string' ? value.trim() : '';
    };

    const type = text('type');
    const parishionerName = text('parishionerName');
    const phone = text('phone');
    const requestedDate = text('requestedDate');
    const receiptEntry = formData.get('receipt');
    const receipt = receiptEntry instanceof File ? receiptEntry : null;

    if (!parishionerName || !phone || !requestedDate || !bookingTypes.includes(type as BookingType)) {
      return NextResponse.json(
        { success: false, error: 'Please fill in all required fields (Name, Phone, Date, Type)' },
        { status: 400 }
      );
    }
    if (receiptEntry !== null && !receipt) {
      return NextResponse.json({ success: false, error: 'Receipt must be an image file' }, { status: 400 });
    }
    if ((type === 'mass_intention' || type === 'thanksgiving') && !text('intentionFor')) {
      return NextResponse.json({ success: false, error: 'Please describe the Mass intention' }, { status: 400 });
    }
    if ((type === 'mass_intention' || type === 'thanksgiving') && !receipt) {
      return NextResponse.json({ success: false, error: 'A receipt image is required' }, { status: 400 });
    }
    if (receipt && (receipt.size > 5 * 1024 * 1024 || !['image/jpeg', 'image/png', 'image/webp'].includes(receipt.type))) {
      return NextResponse.json(
        { success: false, error: 'Receipt must be a JPEG, PNG, or WebP image smaller than 5MB' },
        { status: 400 }
      );
    }

    const id = randomUUID();
    const prefix = type === 'mass_intention' ? 'STA-MASS' : type === 'thanksgiving' ? 'STA-THX' : 'STA-PRIEST';
    const referenceCode = `${prefix}-${Math.floor(1000 + Math.random() * 9000)}`;
    const supabase = getSupabaseAdmin();

    if (receipt) {
      const extension = receipt.type === 'image/jpeg' ? 'jpg' : receipt.type.split('/')[1];
      uploadedPath = `${id}/${randomUUID()}.${extension}`;
      const { error: uploadError } = await supabase.storage
        .from(RECEIPTS_BUCKET)
        .upload(uploadedPath, Buffer.from(await receipt.arrayBuffer()), {
          contentType: receipt.type,
          upsert: false
        });
      if (uploadError) throw uploadError;
    }

    const { data, error } = await supabase
      .from('bookings')
      .insert({
        id,
        reference_code: referenceCode,
        type: type as BookingType,
        parishioner_name: parishionerName,
        email: text('email'),
        phone,
        intention_type: text('intentionType') || null,
        intention_for: text('intentionFor') || null,
        requested_date: requestedDate,
        mass_time: text('massTime') || null,
        appointment_reason: text('appointmentReason') || null,
        preferred_time_slot: text('preferredTimeSlot') || null,
        notes: text('notes') || null,
        receipt_path: uploadedPath ?? null,
        receipt_uploaded_at: uploadedPath ? new Date().toISOString() : null,
        admin_notes: ''
      })
      .select('*')
      .single();

    if (error) {
      if (uploadedPath) {
        const { error: cleanupError } = await supabase.storage.from(RECEIPTS_BUCKET).remove([uploadedPath]);
        if (cleanupError) console.error('Failed to remove receipt after booking insert failure:', cleanupError);
      }
      throw error;
    }

    return NextResponse.json({ success: true, data: toBooking(data) }, { status: 201 });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function PATCH(request: NextRequest) {
  try {
    if (!isAdminRequest(request)) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { id, status, adminNotes } = body;

    if (typeof id !== 'string' || !bookingStatuses.includes(status as BookingStatus)) {
      return NextResponse.json(
        { success: false, error: 'Booking ID and valid status are required' },
        { status: 400 }
      );
    }

    const { data, error } = await getSupabaseAdmin()
      .from('bookings')
      .update({
        status,
        ...(typeof adminNotes === 'string' ? { admin_notes: adminNotes } : {})
      })
      .eq('id', id)
      .select('*')
      .maybeSingle();

    if (error) throw error;
    if (!data) {
      return NextResponse.json({ success: false, error: 'Booking not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: toBooking(data) });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function DELETE(request: NextRequest) {
  try {
    if (!isAdminRequest(request)) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const id = new URL(request.url).searchParams.get('id');
    if (!id) {
      return NextResponse.json({ success: false, error: 'Booking ID is required' }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from('bookings')
      .delete()
      .eq('id', id)
      .select('receipt_path')
      .maybeSingle();

    if (error) throw error;
    if (!data) {
      return NextResponse.json({ success: false, error: 'Booking not found' }, { status: 404 });
    }

    if (data.receipt_path) {
      const { error: removeError } = await supabase.storage.from(RECEIPTS_BUCKET).remove([data.receipt_path]);
      if (removeError) console.error('Failed to remove deleted booking receipt:', removeError);
    }

    return NextResponse.json({ success: true, message: 'Booking removed successfully' });
  } catch (error) {
    return errorResponse(error);
  }
}
