import { NextRequest, NextResponse } from 'next/server';
import { StorageService } from '@/lib/storage';
import { getSupabaseAdmin, RECEIPTS_BUCKET } from '@/lib/supabase';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authorization = request.headers.get('authorization');
    const passcode = authorization?.startsWith('Bearer ') ? authorization.slice(7) : '';
    if (!passcode || passcode !== StorageService.getSettings().adminPasscode) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const supabase = getSupabaseAdmin();
    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .select('receipt_path')
      .eq('id', id)
      .maybeSingle();

    if (bookingError) throw bookingError;
    if (!booking?.receipt_path) {
      return NextResponse.json({ success: false, error: 'Receipt not found' }, { status: 404 });
    }

    const { data, error } = await supabase.storage
      .from(RECEIPTS_BUCKET)
      .createSignedUrl(booking.receipt_path, 60);
    if (error) throw error;

    return NextResponse.json({ success: true, url: data.signedUrl });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unexpected server error';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
