import { NextRequest, NextResponse } from 'next/server';
import { StorageService } from '@/lib/storage';

export async function GET() {
  try {
    const announcements = StorageService.getAnnouncements();
    return NextResponse.json({ success: true, data: announcements });
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

    if (!body.title || !body.content || !body.category) {
      return NextResponse.json(
        { success: false, error: "Title, content, and category are required" },
        { status: 400 }
      );
    }

    const created = StorageService.createAnnouncement({
      title: body.title.trim(),
      category: body.category,
      content: body.content.trim(),
      isPinned: Boolean(body.isPinned),
      expiryDate: body.expiryDate || undefined,
      author: body.author?.trim() || "Parish Office"
    });

    return NextResponse.json({ success: true, data: created }, { status: 201 });
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
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Announcement ID is required" },
        { status: 400 }
      );
    }

    const updated = StorageService.updateAnnouncement(id, updates);
    if (!updated) {
      return NextResponse.json(
        { success: false, error: "Announcement not found" },
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
        { success: false, error: "Announcement ID is required" },
        { status: 400 }
      );
    }

    const deleted = StorageService.deleteAnnouncement(id);
    if (!deleted) {
      return NextResponse.json(
        { success: false, error: "Announcement not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, message: "Announcement deleted" });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}
