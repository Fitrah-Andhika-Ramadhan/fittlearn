import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const summary = await prisma.documentSummary.findUnique({
      where: { id: params.id },
    });
    if (!summary) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(summary);
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const data: any = {};
    if (body.title) data.title = body.title;
    if (body.summary) data.summary = body.summary;
    if (body.keyPoints) data.key_points = JSON.stringify(body.keyPoints);

    const summary = await prisma.documentSummary.update({
      where: { id: params.id },
      data,
    });
    return NextResponse.json(summary);
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    await prisma.documentSummary.delete({
      where: { id: params.id },
    });
    return NextResponse.json({ message: "Deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
