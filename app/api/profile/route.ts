import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const mapSettings = (p: any) => ({
  id: p.id,
  siteName: p.meta_title || "FitLearned",
  siteDescription: p.meta_description || "Portfolio",
  ownerName: p.name || "",
  ownerTitle: p.headline || "",
  ownerBio: p.bio || "",
  email: p.email_contact || "",
  phone: p.phone || "",
  location: p.location || "",
  github: p.github_url || "",
  linkedin: p.linkedin_url || "",
  twitter: p.twitter_url || "",
  avatar: p.photo_url || "",
  heroImage: "",
  resumeUrl: p.cv_url || "",
  heroTagline: p.hero_tagline || "Development",
  heroIntro: p.hero_intro || "Hello, I Am",
  ctaPrimaryText: p.cta_primary_text || "See Portfolio",
  ctaSecondaryText: p.cta_secondary_text || "Download CV",
  contactIntro: p.contact_intro || "I'm very approachable and would love to speak to you. Feel free to call, send me an email or simply complete this enquiry form.",
  portfolioTitle: p.portfolio_title || "My recent work",
  portfolioSubtitle: p.portfolio_subtitle || "View all projects",
  updatedAt: new Date().toISOString()
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

    const data = {
      name: body.ownerName || "",
      headline: body.ownerTitle || "",
      bio: body.ownerBio || "",
      email_contact: body.email || "",
      phone: body.phone || "",
      location: body.location || "",
      github_url: body.github || "",
      linkedin_url: body.linkedin || "",
      twitter_url: body.twitter || "",
      photo_url: body.avatar || "",
      cv_url: body.resumeUrl || "",
      meta_title: body.siteName || "",
      meta_description: body.siteDescription || "",
      hero_tagline: body.heroTagline || "",
      hero_intro: body.heroIntro || "",
      cta_primary_text: body.ctaPrimaryText || "",
      cta_secondary_text: body.ctaSecondaryText || "",
      contact_intro: body.contactIntro || "",
      portfolio_title: body.portfolioTitle || "",
      portfolio_subtitle: body.portfolioSubtitle || ""
    };

    if (profile) {
      profile = await prisma.profile.update({
        where: { id: profile.id },
        data
      });
    } else {
      profile = await prisma.profile.create({
        data
      });
    }

    return NextResponse.json(mapSettings(profile));
  } catch (error) {
    console.error("Failed to update profile:", error);
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
}
