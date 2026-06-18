import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const entries = await prisma.guestbook.findMany({
      where: {
        is_approved: true,
      },
      select: {
        id: true,
        name: true,
        message: true,
        is_approved: true,
        created_at: true,
        parentId: true,
      },
      orderBy: {
        created_at: "desc",
      },
    });

    return NextResponse.json(entries);
  } catch (error) {
    console.error("Error fetching guestbook entries:", error);
    return NextResponse.json(
      { error: "Failed to fetch guestbook entries" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, message, parentId } = body;

    if (!name || !message) {
      return NextResponse.json(
        { error: "Name and message are required" },
        { status: 400 }
      );
    }

    const newEntry = await prisma.guestbook.create({
      data: {
        name,
        message,
        parentId: parentId || null,
        is_approved: true, // Default to true
      },
    });

    // We return the newEntry which includes the auto-generated edit_token
    return NextResponse.json(newEntry, { status: 201 });
  } catch (error) {
    console.error("Error creating guestbook entry:", error);
    return NextResponse.json(
      { error: "Failed to create guestbook entry" },
      { status: 500 }
    );
  }
}
