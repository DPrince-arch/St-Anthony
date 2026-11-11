import { NextRequest, NextResponse } from 'next/server';
import { getLiturgicalReadingsForDate } from '@/lib/liturgicalData';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const dateParam = searchParams.get('date') || undefined;
    const readings = getLiturgicalReadingsForDate(dateParam);
    return NextResponse.json({ success: true, data: readings });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}
