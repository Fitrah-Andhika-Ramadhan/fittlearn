import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const files = await prisma.studyFile.findMany({
      orderBy: { created_at: "desc" },
    });
    return NextResponse.json(files);
  } catch (error) {
    console.error("Error fetching files:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const file = await prisma.studyFile.create({
      data: {
        name: body.name,
        type: body.type,
        subject: body.subject,
        semester: body.semester,
        category: body.category,
        size: body.size,
        description: body.description,
        file_url: body.fileUrl || "#",
      },
    });
    return NextResponse.json(file, { status: 201 });
  } catch (error) {
    console.error("Error creating file:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
