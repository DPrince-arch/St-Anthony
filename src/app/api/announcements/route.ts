import { NextRequest, NextResponse } from 'next/server';
import { createAnnouncement, deleteAnnouncement } from '@/lib/data';

function errorResponse(error: unknown) {
  return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
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

    const created = createAnnouncement({
      title: body.title.trim(),
      category: body.category,
      content: body.content.trim(),
      isPinned: Boolean(body.isPinned),
      expiryDate: body.expiryDate || undefined,
      author: body.author?.trim() || "Parish Office"
    });

    return NextResponse.json({ success: true, data: created }, { status: 201 });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const id = new URL(request.url).searchParams.get('id');
    if (!id) {
      return NextResponse.json({ success: false, error: "Announcement ID is required" }, { status: 400 });
    }

    if (!deleteAnnouncement(id)) {
      return NextResponse.json({ success: false, error: "Announcement not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Announcement deleted" });
  } catch (error) {
    return errorResponse(error);
  }
}
