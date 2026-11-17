import { NextRequest, NextResponse } from 'next/server';
import { getLiturgicalReadingsForDate, isValidIsoDate } from '@/lib/liturgicalData';

export async function GET(request: NextRequest) {
  const dateParam = new URL(request.url).searchParams.get('date');
  if (dateParam && !isValidIsoDate(dateParam)) {
    return NextResponse.json(
      { success: false, error: 'Date must be a valid date in YYYY-MM-DD format.' },
      { status: 400 }
    );
  }

  try {
    const readings = await getLiturgicalReadingsForDate(dateParam || new Date().toISOString().slice(0, 10));
    return NextResponse.json({ success: true, data: readings });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Unable to load liturgical readings.' },
      { status: 502 }
    );
  }
}
