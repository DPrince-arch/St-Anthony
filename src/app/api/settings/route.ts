import { NextRequest, NextResponse } from 'next/server';
import { getPublicSettings, isAdminPasscode, updateSettings } from '@/lib/data';

function errorResponse(error: unknown) {
  return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
}

export async function GET() {
  try {
    return NextResponse.json({ success: true, data: getPublicSettings() });
  } catch (error) {
    return errorResponse(error);
  }
}

// Admin login: checks the passcode.
export async function POST(request: NextRequest) {
  try {
    const { passcode } = await request.json();
    if (isAdminPasscode(passcode)) {
      return NextResponse.json({ success: true, authenticated: true });
    }
    return NextResponse.json(
      { success: false, authenticated: false, error: "Invalid admin passcode" },
      { status: 401 }
    );
  } catch (error) {
    return errorResponse(error);
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { adminPasscode, ...changes } = await request.json();
    if (!isAdminPasscode(adminPasscode)) {
      return NextResponse.json({ success: false, error: "Unauthorized: Invalid passcode" }, { status: 401 });
    }
    return NextResponse.json({ success: true, data: updateSettings(changes) });
  } catch (error) {
    return errorResponse(error);
  }
}
