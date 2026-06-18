import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { message, edit_token } = body;

    if (!message || !edit_token) {
      return NextResponse.json(
        { error: "Message and edit_token are required" },
        { status: 400 }
      );
    }

    // Verify ownership
    const entry = await prisma.guestbook.findUnique({
      where: { id },
    });

    if (!entry) {
      return NextResponse.json({ error: "Entry not found" }, { status: 404 });
    }

    if (entry.edit_token !== edit_token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const updatedEntry = await prisma.guestbook.update({
      where: { id },
      data: { message },
      select: {
        id: true,
        name: true,
        message: true,
        is_approved: true,
        created_at: true,
        parentId: true,
      },
    });

    return NextResponse.json(updatedEntry);
  } catch (error) {
    console.error("Error updating guestbook entry:", error);
    return NextResponse.json(
      { error: "Failed to update entry" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { edit_token } = body;

    if (!edit_token) {
      return NextResponse.json(
        { error: "edit_token is required" },
        { status: 400 }
      );
    }

    // Verify ownership
    const entry = await prisma.guestbook.findUnique({
      where: { id },
    });

    if (!entry) {
      return NextResponse.json({ error: "Entry not found" }, { status: 404 });
    }

    if (entry.edit_token !== edit_token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    await prisma.guestbook.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting guestbook entry:", error);
    return NextResponse.json(
      { error: "Failed to delete entry" },
      { status: 500 }
    );
  }
}
