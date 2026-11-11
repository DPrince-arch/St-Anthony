import { NextRequest, NextResponse } from 'next/server';
import { StorageService } from '@/lib/storage';

export async function GET() {
  try {
    const settings = StorageService.getSettings();
    // Exclude passcode from public output
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { adminPasscode, ...publicSettings } = settings;
    return NextResponse.json({ success: true, data: publicSettings });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { passcode } = body;
    const settings = StorageService.getSettings();

    if (passcode && passcode === settings.adminPasscode) {
      return NextResponse.json({ success: true, authenticated: true });
    }

    return NextResponse.json(
      { success: false, authenticated: false, error: "Invalid admin passcode" },
      { status: 401 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { adminPasscode, ...newSettings } = body;
    const currentSettings = StorageService.getSettings();

    // Verify passcode before allowing modification
    if (adminPasscode !== currentSettings.adminPasscode) {
      return NextResponse.json(
        { success: false, error: "Unauthorized: Invalid passcode" },
        { status: 401 }
      );
    }

    const updated = StorageService.updateSettings(newSettings);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { adminPasscode: _, ...safeUpdated } = updated;
    return NextResponse.json({ success: true, data: safeUpdated });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}
