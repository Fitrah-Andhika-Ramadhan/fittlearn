import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const summaries = await prisma.documentSummary.findMany({
      orderBy: { created_at: "desc" },
    });
    return NextResponse.json(summaries);
  } catch (error) {
    console.error("Error fetching summaries:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const summary = await prisma.documentSummary.create({
      data: {
        title: body.title,
        summary: body.summary,
        key_points: JSON.stringify(body.keyPoints || []),
        file_type: body.fileType,
        file_name: body.fileName,
        file_size: body.fileSize,
      },
    });
    return NextResponse.json(summary, { status: 201 });
  } catch (error) {
    console.error("Error creating summary:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
