import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const experience = await prisma.experience.findUnique({
      where: { id: params.id }
    });

    if (!experience) return NextResponse.json({ error: "Experience not found" }, { status: 404 });

    return NextResponse.json(experience);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch experience" }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    
    const updateData: any = {};
    if (body.title !== undefined) updateData.title = body.title;
    if (body.company !== undefined) updateData.organization = body.company;
    if (body.description !== undefined) updateData.description = body.description;
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

    const experience = await prisma.experience.update({
      where: { id: params.id },
      data: updateData
    });

    // We must map it back to the format the frontend expects (CMSExperience)
    const mapExperience = (e: any) => ({
      id: e.id,
      title: e.title,
      company: e.organization || "",
      period: (e.start_date ? new Date(e.start_date).getFullYear().toString() : "") + (e.end_date ? " - " + new Date(e.end_date).getFullYear().toString() : " - Present"),
      description: e.description || "",
      achievements: [],
      current: !e.end_date,
      order: e.sort_order || 0,
    });

    return NextResponse.json(mapExperience(experience));
  } catch (error) {
    return NextResponse.json({ error: "Failed to update experience" }, { status: 500 });
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
    return NextResponse.json({ error: "Failed to delete experience" }, { status: 500 });
  }
}
