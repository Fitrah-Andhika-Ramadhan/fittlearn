import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const mapSettings = (p: any) => ({
  id: p.id,
  siteName: "FitLearned",
  siteDescription: "Portfolio",
  ownerName: ((p.first_name || "") + " " + (p.last_name || "")).trim(),
  ownerTitle: p.title || "",
  ownerBio: p.bio || "",
  email: p.email_contact || "",
  phone: p.phone_contact || "",
  location: p.location || "",
  github: p.github_url || "",
  linkedin: p.linkedin_url || "",
  twitter: p.twitter_url || "",
  avatar: p.avatar_url || "",
  heroImage: "",
  resumeUrl: p.resume_url || "",
  updatedAt: p.updated_at ? p.updated_at.toISOString() : new Date().toISOString()
});

export async function GET() {
  try {
    const profile = await prisma.profile.findFirst();
    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }
    return NextResponse.json(mapSettings(profile));
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    let profile = await prisma.profile.findFirst();

    const names = (body.ownerName || "").split(" ");
    const firstName = names[0] || "";
    const lastName = names.slice(1).join(" ") || "";

    const data = {
      first_name: firstName,
      last_name: lastName,
      title: body.ownerTitle,
      bio: body.ownerBio,
      email_contact: body.email,
      phone_contact: body.phone,
      location: body.location,
      github_url: body.github,
      linkedin_url: body.linkedin,
      twitter_url: body.twitter,
      avatar_url: body.avatar,
      resume_url: body.resumeUrl,
    };

    if (profile) {
      profile = await prisma.profile.update({
        where: { id: profile.id },
        data
      });
    } else {
      profile = await prisma.profile.create({
        data: {
          ...data,
          user_id: (session.user as any).id
        }
      });
    }

    return NextResponse.json(mapSettings(profile));
  } catch (error) {
    console.error("Failed to update profile:", error);
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
}
