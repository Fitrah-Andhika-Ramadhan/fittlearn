import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const file = await prisma.studyFile.findUnique({
      where: { id: params.id },
    });
    if (!file) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(file);
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const data: any = {};
    if (body.name) data.name = body.name;
    if (body.type) data.type = body.type;
    if (body.subject) data.subject = body.subject;
    if (body.semester) data.semester = body.semester;
    if (body.category) data.category = body.category;
    if (body.size) data.size = body.size;
    if (body.description) data.description = body.description;
    if (body.fileUrl) data.file_url = body.fileUrl;

    const file = await prisma.studyFile.update({
      where: { id: params.id },
      data,
    });
    return NextResponse.json(file);
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    await prisma.studyFile.delete({
      where: { id: params.id },
    });
    return NextResponse.json({ message: "Deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
