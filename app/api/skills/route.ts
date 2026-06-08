import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const mapSkill = (s: any) => ({
  id: s.id,
  name: s.name || "",
  level: s.level || 50,
  category: s.category || "other",
  icon: s.icon_url || "",
  order: s.sort_order || 0,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
});

export async function GET() {
  try {
    const skills = await prisma.skill.findMany({
      orderBy: { sort_order: "asc" }
    });
    return NextResponse.json(skills.map(mapSkill), {
      headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" }
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch skills" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();

    const skill = await prisma.skill.create({
      data: {
        name: body.name,
        category: body.category || "other",
        level: body.level || 50,
        icon_url: body.icon || "",
        sort_order: body.order || 0,
      }
    });

    return NextResponse.json(mapSkill(skill), { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create skill" }, { status: 500 });
  }
}
