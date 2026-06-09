import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { revalidatePath } from "next/cache";

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

export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      orderBy: { sort_order: "asc" },
      include: {
        categories: { include: { category: true } },
        techs: { include: { tech: true } }
      }
    });
    return NextResponse.json(projects.map(mapProject));
  } catch (error) {
    console.error("Failed to fetch projects:", error);
    return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const slug = body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') + '-' + Date.now();

    const project = await prisma.project.create({
      data: {
        title: body.title,
        slug: slug,
        short_desc: body.description || "",
        long_desc: body.longDescription || "",
        thumbnail_url: body.image || "",
        github_url: body.github || "",
        demo_url: body.demo || "",
        status: body.status || "draft",
        is_featured: body.featured || false,
        sort_order: 0,
        gallery_urls: "",
        techs: body.tech && Array.isArray(body.tech) ? {
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
          create: [{
            category: {
              connectOrCreate: {
                where: { name: body.category },
                create: { name: body.category, slug: body.category.toLowerCase().replace(/[^a-z0-9]+/g, '-'), color: "#A855F7" }
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

    revalidatePath("/portfolio");
    revalidatePath("/");
    return NextResponse.json(mapProject(project), { status: 201 });
  } catch (error) {
    console.error("Failed to create project:", error);
    return NextResponse.json({ error: "Failed to create project" }, { status: 500 });
  }
}
