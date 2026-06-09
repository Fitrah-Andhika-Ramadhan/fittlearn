import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const education = await prisma.experience.findUnique({
      where: { id: params.id }
    });

    if (!education || education.type !== "education") {
      return NextResponse.json({ error: "Education not found" }, { status: 404 });
    }

    return NextResponse.json(education);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch education" }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    
    const updateData: any = {};
    if (body.degree !== undefined) updateData.title = body.degree;
    if (body.school !== undefined) updateData.organization = body.school;
    if (body.gpa !== undefined) updateData.description = body.gpa;
    if (body.achievements !== undefined) updateData.key_points = body.achievements?.length > 0 ? JSON.stringify(body.achievements.filter(Boolean)) : null;
    if (body.order !== undefined) updateData.sort_order = body.order;

    if (body.period) {
      const parts = body.period.split("-").map((p: string) => p.trim());
      if (parts[0]) {
        const year = parseInt(parts[0]);
        if (!isNaN(year)) updateData.start_date = new Date(`${year}-01-01`);
      }
      if (parts.length > 1 && parts[1].toLowerCase() !== "present" && !body.current) {
        const year = parseInt(parts[1]);
        if (!isNaN(year)) updateData.end_date = new Date(`${year}-01-01`);
      }
    }
    
    if (body.current === true) {
      updateData.end_date = null;
    }

    const education = await prisma.experience.update({
      where: { id: params.id },
      data: updateData
    });

    const mapEducation = (e: any) => ({
      id: e.id,
      degree: e.title,
      school: e.organization || "",
      period: (e.start_date ? new Date(e.start_date).getFullYear().toString() : "") + (e.end_date ? " - " + new Date(e.end_date).getFullYear().toString() : " - Present"),
      gpa: e.description || "",
      achievements: (() => {
        try { return e.key_points ? JSON.parse(e.key_points) : [] } catch { return [] }
      })(),
      current: !e.end_date,
      order: e.sort_order || 0,
    });

    return NextResponse.json(mapEducation(education));
  } catch (error) {
    return NextResponse.json({ error: "Failed to update education" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await prisma.experience.delete({
      where: { id: params.id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete education" }, { status: 500 });
  }
}
