import { NextRequest, NextResponse } from 'next/server';
import { StorageService } from '@/lib/storage';

export async function GET() {
  try {
    const bookings = StorageService.getBookings();
    return NextResponse.json({ success: true, data: bookings });
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
    
    // Validation
    if (!body.parishionerName || !body.phone || !body.requestedDate || !body.type) {
      return NextResponse.json(
        { success: false, error: "Please fill in all required fields (Name, Phone, Date, Type)" },
        { status: 400 }
      );
    }

    const newBooking = StorageService.createBooking({
      type: body.type,
      parishionerName: body.parishionerName.trim(),
      email: body.email?.trim() || "",
      phone: body.phone.trim(),
      intentionType: body.intentionType,
      intentionFor: body.intentionFor?.trim(),
      requestedDate: body.requestedDate,
      massTime: body.massTime,
      appointmentReason: body.appointmentReason,
      preferredTimeSlot: body.preferredTimeSlot,
      notes: body.notes?.trim(),
      receiptImage: body.receiptImage || undefined,
      receiptUploadedAt: body.receiptImage ? new Date().toISOString() : undefined,
      adminNotes: ""
    });

    return NextResponse.json({ success: true, data: newBooking }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, status, adminNotes } = body;

    if (!id || !status) {
      return NextResponse.json(
        { success: false, error: "Booking ID and new status are required" },
        { status: 400 }
      );
    }

    const updated = StorageService.updateBookingStatus(id, status, adminNotes);
    if (!updated) {
      return NextResponse.json(
        { success: false, error: "Booking not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Booking ID is required" },
        { status: 400 }
      );
    }

    const deleted = StorageService.deleteBooking(id);
    if (!deleted) {
      return NextResponse.json(
        { success: false, error: "Booking not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, message: "Booking removed successfully" });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}
