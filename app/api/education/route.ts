import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

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
  createdAt: e.created_at ? e.created_at.toISOString() : new Date().toISOString(),
  updatedAt: e.updated_at ? e.updated_at.toISOString() : new Date().toISOString()
});

export async function GET() {
  try {
    const educationList = await prisma.experience.findMany({
      where: { type: "education" },
      orderBy: { sort_order: "asc" },
    });
    return NextResponse.json(educationList.map(mapEducation), {
      headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" }
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch education" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();

    let start_date = new Date();
    let end_date: Date | null = null;
    
    if (body.period) {
      const parts = body.period.split("-").map((p: string) => p.trim());
      if (parts[0]) {
        const year = parseInt(parts[0]);
        if (!isNaN(year)) start_date = new Date(`${year}-01-01`);
      }
      if (parts.length > 1 && parts[1].toLowerCase() !== "present" && !body.current) {
        const year = parseInt(parts[1]);
        if (!isNaN(year)) end_date = new Date(`${year}-01-01`);
      }
    }

    const education = await prisma.experience.create({
      data: {
        type: "education",
        title: body.degree,
        organization: body.school || "",
        description: body.gpa || "",
        key_points: body.achievements?.length > 0 ? JSON.stringify(body.achievements.filter(Boolean)) : null,
        start_date,
        end_date: body.current ? null : (end_date || new Date()),
        sort_order: body.order || 0,
      }
    });

    return NextResponse.json(mapEducation(education), { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create education" }, { status: 500 });
  }
}
