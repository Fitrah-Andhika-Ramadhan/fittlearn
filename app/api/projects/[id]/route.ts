import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const mapProject = (p: any) => ({
  id: p.id,
  title: p.title,
  description: p.short_desc || "",
  longDescription: p.long_desc || "",
  tech: Array.isArray(p.techs) ? p.techs.map((t: any) => t.tech?.name).filter(Boolean) : [],
  github: p.github_url || "",
  demo: p.demo_url || "",
  image: p.thumbnail_url || "",
  featured: p.is_featured || false,
  status: p.status || "draft",
  category: p.categories?.[0]?.category?.name || "Other",
  createdAt: p.created_at ? p.created_at.toISOString() : new Date().toISOString(),
  updatedAt: p.updated_at ? p.updated_at.toISOString() : new Date().toISOString(),
  views: 0,
  likes: 0
});

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const project = await prisma.project.findUnique({
      where: { id: params.id },
      include: {
        categories: { include: { category: true } },
        techs: { include: { tech: true } }
      }
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    return NextResponse.json(mapProject(project));
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch project" }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();

    const project = await prisma.project.update({
      where: { id: params.id },
      data: {
        title: body.title,
        short_desc: body.description,
        long_desc: body.longDescription,
        thumbnail_url: body.image,
        github_url: body.github,
        demo_url: body.demo,
        status: body.status,
        is_featured: body.featured,
        techs: body.tech && Array.isArray(body.tech) ? {
          deleteMany: {},
          create: body.tech.map((t: string) => ({
            tech: {
              connectOrCreate: {
                where: { name: t },
                create: { name: t, slug: t.toLowerCase().replace(/[^a-z0-9]+/g, '-') }
              }
            }
          }))
        } : undefined,
        categories: body.category ? {
          deleteMany: {},
          create: [{
            category: {
              connectOrCreate: {
                where: { name: body.category },
                create: { name: body.category, slug: body.category.toLowerCase().replace(/[^a-z0-9]+/g, '-') }
              }
            }
          }]
        } : undefined
      },
      include: {
        categories: { include: { category: true } },
        techs: { include: { tech: true } }
      }
    });

    return NextResponse.json(mapProject(project));
  } catch (error) {
    console.error("Failed to update project:", error);
    return NextResponse.json({ error: "Failed to update project" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await prisma.project.delete({
      where: { id: params.id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete project" }, { status: 500 });
  }
}
