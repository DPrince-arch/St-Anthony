import { timingSafeEqual } from 'node:crypto';
import { NextRequest, NextResponse } from 'next/server';
import { purgeExpiredBookings } from '@/lib/bookingRetention';

/**
 * Daily housekeeping, called by a scheduler (see .github/workflows/daily-cleanup.yml):
 * deletes bookings and receipts past their one-week retention. Because it queries the
 * database every day, it also keeps a free Supabase project from pausing for inactivity.
 *
 * Requires the header `Authorization: Bearer <CRON_SECRET>`.
 */
export async function GET(request: NextRequest) {
  const secret = process.env.CRON_SECRET;
  const provided = request.headers.get('authorization')?.replace(/^Bearer /, '') ?? '';

  if (!secret) {
    return NextResponse.json({ success: false, error: 'CRON_SECRET is not configured' }, { status: 500 });
  }
  const expected = Buffer.from(secret);
  const actual = Buffer.from(provided);
  if (actual.length !== expected.length || !timingSafeEqual(actual, expected)) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const deleted = await purgeExpiredBookings();
    return NextResponse.json({ success: true, deleted });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unexpected server error';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
