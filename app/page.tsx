import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ClientContactForm } from "@/components/client-contact-form";
import { Guestbook } from "@/components/guestbook";
import { FeaturedProjectsCarousel } from "@/components/featured-projects-carousel";

export const revalidate = 60; // ISR: revalidate every 60s

export default async function HomePage() {
  // Fetch profile and featured projects from DB
  const [profile, dbFeaturedProjects] = await Promise.all([
    prisma.profile.findFirst().catch(() => null),
    prisma.project.findMany({
      where: { is_featured: true, status: "published" },
      orderBy: { created_at: "desc" },
      select: {
        id: true,
        title: true,
        slug: true,
        thumbnail_url: true,
        demo_url: true,
        github_url: true,
      }
    }).catch(() => [])
  ]);

  const featuredProjects = dbFeaturedProjects.map(p => ({
    id: p.id,
    title: p.title,
    slug: p.slug,
    thumbnail_url: p.thumbnail_url,
    link: p.demo_url && p.demo_url !== "#" ? p.demo_url : (p.github_url || `/portfolio`),
  }));

  const name = profile?.name || "Fitrah Andhika Ramadhan";
  const title = profile?.headline || "Web Developer & System Analyst";
  const bio = profile?.bio || "A passionate Web Developer & System Analyst based in Bandung, Indonesia. I build modern, beautiful, and intelligent web applications.";
  const phone = profile?.phone || "+62 877 6028 7039";
  const email = profile?.email_contact || "fitrah.andhika@email.com";
  const cvUrl = profile?.cv_url || "#";
  
  const heroIntro = profile?.hero_intro || "Hello, I Am";
  const heroTagline = profile?.hero_tagline || "Development";
  const ctaPrimaryText = profile?.cta_primary_text || "See Portfolio";
  const ctaSecondaryText = profile?.cta_secondary_text || "Download CV";
  
  const contactIntro = profile?.contact_intro || "I'm very approachable and would love to speak to you. Feel free to call, send me an email or simply complete this enquiry form.";
  
  const portfolioTitle = profile?.portfolio_title || "My recent work";
  const portfolioSubtitle = profile?.portfolio_subtitle || "View all projects →";

  return (
    <div className="flex flex-col gap-20 w-full pb-10">
      <div className="flex flex-col lg:flex-row relative w-full gap-12 lg:gap-0">
      {/* Left Section (Hero) */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center relative pb-10 lg:pb-20 pt-10 lg:pt-0">
        <div className="space-y-4 mb-10">
          <p className="text-purple-400 text-lg font-medium tracking-wide uppercase flex items-center">
            <span className="w-10 h-px bg-purple-400 mr-4"></span>
            {heroIntro}
          </p>
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight tracking-tight text-white drop-shadow-lg">
            {name.split(" ").slice(0, 2).join(" ")}<br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-indigo-500">
              {name.split(" ").slice(2).join(" ") || "Ramadhan"}
            </span>
          </h1>
          <p className="text-lg text-purple-300 font-semibold">{title}</p>
          <p className="text-base md:text-lg text-purple-200/80 font-light max-w-lg mt-2 leading-relaxed">
            {bio}
          </p>
        </div>
        
        <div className="flex space-x-6">
          <Link href="/portfolio" className="px-8 py-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition font-medium text-sm">
            {ctaPrimaryText}
          </Link>
          {cvUrl !== "#" ? (
            <Link href={cvUrl} target="_blank" className="px-8 py-3 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 transition font-medium text-sm shadow-[0_0_20px_rgba(168,85,247,0.4)]">
              {ctaSecondaryText}
            </Link>
          ) : (
            <button className="px-8 py-3 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 transition font-medium text-sm shadow-[0_0_20px_rgba(168,85,247,0.4)]">
              {ctaSecondaryText}
            </button>
          )}
        </div>

        <div className="mt-16 lg:mt-24 relative z-20 hidden md:block">
          <h2 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-white/80 drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)] -mt-4 ml-8 tracking-tighter">{heroTagline}</h2>
        </div>
      </div>

      {/* Right Section */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center space-y-12 lg:space-y-16 pb-20">
        
        {/* Dynamic Featured Projects Carousel */}
        <FeaturedProjectsCarousel 
          title={portfolioTitle} 
          subtitle={portfolioSubtitle} 
          projects={featuredProjects} 
        />

        {/* Contact */}
        <div className="w-full max-w-lg bg-[#1a153a]/80 backdrop-blur-2xl border border-white/10 rounded-[2rem] p-6 sm:p-10 flex flex-col sm:flex-row gap-8 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
          <div className="w-full sm:w-5/12">
            <h3 className="text-xl font-bold mb-4 text-white">Get in touch</h3>
            <p className="text-xs text-gray-400 leading-relaxed mb-6">
              {contactIntro}
            </p>
            <div className="text-xs font-medium text-white/80 space-y-1.5">
              <p>📞 {phone}</p>
              <p>✉️ {email}</p>
            </div>
          </div>
          <ClientContactForm email={email} variant="home" />
        </div>
      </div>
      </div>

      {/* Guestbook Section */}
      <div className="w-full relative z-10 px-4 md:px-0">
        <Guestbook />
      </div>
    </div>
  );
}
