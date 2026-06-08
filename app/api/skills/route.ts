import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const mapSkill = (s: any) => ({
  id: s.id,
  name: s.tech?.name || "",
  level: s.proficiency || 50,
  category: s.category || "other",
  icon: s.tech?.icon_url || "",
  order: s.sort_order || 0,
  createdAt: s.created_at ? s.created_at.toISOString() : new Date().toISOString(),
  updatedAt: s.updated_at ? s.updated_at.toISOString() : new Date().toISOString()
});

export async function GET() {
  try {
    const skills = await prisma.userSkill.findMany({
      orderBy: { sort_order: "asc" },
      include: { tech: true }
    });
    return NextResponse.json(skills.map(mapSkill));
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch skills" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();

    const skill = await prisma.userSkill.create({
      data: {
        proficiency: body.level || 50,
        category: body.category || "other",
        sort_order: body.order || 0,
        user_id: (session.user as any).id,
        tech: {
          connectOrCreate: {
            where: { name: body.name },
            create: { name: body.name, slug: body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') }
          }
        }
      },
      include: { tech: true }
    });

    return NextResponse.json(mapSkill(skill), { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create skill" }, { status: 500 });
  }
}
