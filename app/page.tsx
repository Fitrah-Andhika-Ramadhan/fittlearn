import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { ClientContactForm } from "@/components/client-contact-form";
import { Guestbook } from "@/components/guestbook";
import { CustomSvgAnimation } from "@/components/custom-svg-animation";
import { FeaturedProjectsCarousel } from "@/components/featured-projects-carousel";
import { AnimatedSection, StaggerContainer, StaggerItem } from "@/components/animated-section";
import { cookies } from "next/headers";
import { unstable_cache } from "next/cache";

export const dynamic = "force-dynamic"

export default async function HomePage() {
  // Fetch profile and featured projects from DB (Cached for 60 seconds to make page load instant)
  const getCachedProfile = unstable_cache(
    async () => {
      return prisma.profile.findFirst().catch(() => null)
    },
    ['home-profile'],
    { revalidate: 60, tags: ['profile'] }
  )

  const getCachedProjects = unstable_cache(
    async () => {
      return prisma.project.findMany({
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
    },
    ['home-featured-projects'],
    { revalidate: 60, tags: ['projects'] }
  )

  const [profile, dbFeaturedProjects] = await Promise.all([
    getCachedProfile(),
    getCachedProjects()
  ]);

  const featuredProjects = dbFeaturedProjects.map((p: any) => ({
    id: p.id,
    title: p.title,
    slug: p.slug,
    thumbnail_url: p.thumbnail_url,
    link: p.demo_url && p.demo_url !== "#" ? p.demo_url : (p.github_url || `/portfolio`),
  }));

  const cookieStore = await cookies();
  const lang = cookieStore.get('NEXT_LOCALE')?.value || 'id';

  const name = profile?.name || "Fitrah Andhika Ramadhan";
  let title = profile?.headline || "Web Developer & System Analyst";
  let bio = profile?.bio || "Fresh Graduate S1 Sistem Informasi di Telkom University yang passionate dalam mengembangkan solusi teknologi untuk memecahkan masalah nyata. Berfokus sebagai Web Developer dan System Analyst menggunakan teknologi web modern.";
  const phone = profile?.phone || "+62 877 6028 7039";
  const email = profile?.email_contact || "fitrah.andhika@email.com";
  const cvUrl = profile?.cv_url || "#";
  
  let heroIntro = profile?.hero_intro || "HELLO, I AM";
  let heroTagline = profile?.hero_tagline || "Development";
  let ctaPrimaryText = profile?.cta_primary_text || "See Portfolio";
  let ctaSecondaryText = profile?.cta_secondary_text || "Download CV";
  
  let contactIntro = profile?.contact_intro || "I'm very approachable and would love to speak to you. Feel free to call, send me an email or simply complete this enquiry form.";
  
  let portfolioTitle = profile?.portfolio_title || "My recent work";
  let portfolioSubtitle = profile?.portfolio_subtitle || "View all projects →";

  // Quick dictionary for CMS defaults when switching to ID
  if (lang === 'id') {
    if (title === "Web Developer & System Analyst") title = "Pengembang Web & Analis Sistem";
    if (bio.includes("Information Systems fresh graduate")) bio = "Fresh Graduate S1 Sistem Informasi di Telkom University yang passionate dalam mengembangkan solusi teknologi untuk memecahkan masalah nyata. Berfokus sebagai Web Developer dan System Analyst menggunakan teknologi web modern.";
    if (heroIntro.toUpperCase() === "HELLO, I AM" || heroIntro === "Hello, I Am") heroIntro = "HALO, SAYA";
    if (heroTagline === "Development") heroTagline = "Pengembangan";
    if (ctaPrimaryText === "See Portfolio") ctaPrimaryText = "Lihat Portofolio";
    if (ctaSecondaryText === "Download CV") ctaSecondaryText = "Unduh CV";
    if (contactIntro.includes("approachable")) contactIntro = "Saya sangat terbuka dan senang berdiskusi dengan Anda. Silakan hubungi via telepon, email, atau isi form ini.";
    if (portfolioTitle === "My recent work") portfolioTitle = "Karya terbaru saya";
    if (portfolioSubtitle === "View all projects →") portfolioSubtitle = "Lihat semua proyek →";
  } else {
    // English defaults
    if (title === "Pengembang Web & Analis Sistem") title = "Web Developer & System Analyst";
    if (bio.includes("Sistem Informasi")) bio = "Information Systems fresh graduate from Telkom University passionate about developing tech solutions to solve real problems. Focused on Web Development and System Analysis using modern web technologies.";
    if (heroIntro.toUpperCase() === "HALO, SAYA") heroIntro = "HELLO, I AM";
    if (heroTagline === "Pengembangan") heroTagline = "Development";
    if (ctaPrimaryText === "Lihat Portofolio") ctaPrimaryText = "See Portfolio";
    if (ctaSecondaryText === "Unduh CV") ctaSecondaryText = "Download CV";
    if (contactIntro.includes("sangat terbuka")) contactIntro = "I'm very approachable and would love to speak to you. Feel free to call, send me an email or simply complete this enquiry form.";
    if (portfolioTitle === "Karya terbaru saya") portfolioTitle = "My recent work";
    if (portfolioSubtitle === "Lihat semua proyek →") portfolioSubtitle = "View all projects →";
  }

  return (
    <div className="flex flex-col gap-20 w-full max-w-[100vw] overflow-x-hidden overflow-y-clip pb-10">
      <div className="flex flex-col lg:flex-row relative w-full max-w-full gap-12 lg:gap-8 items-center min-h-[70vh]">
      {/* Left Section (Hero) */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center relative pb-10 lg:pb-20 pt-10 lg:pt-0 z-10">
        <StaggerContainer className="space-y-4 mb-10">
          <StaggerItem>
            <p className="text-purple-400 text-lg font-medium tracking-wide uppercase flex items-center">
              <span className="w-10 h-px bg-purple-400 mr-4"></span>
              {heroIntro}
            </p>
          </StaggerItem>
          <StaggerItem>
            <h1 className="font-heading text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black leading-[1.1] tracking-tight text-white drop-shadow-lg">
              {name.split(" ").slice(0, 2).join(" ")}<br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-indigo-500 drop-shadow-sm">
                {name.split(" ").slice(2).join(" ") || "Ramadhan"}
              </span>
            </h1>
          </StaggerItem>
          <StaggerItem>
            <p className="text-lg text-purple-300 font-semibold">{title}</p>
          </StaggerItem>
          <StaggerItem>
            <p className="text-base md:text-lg text-purple-200/80 font-light max-w-lg mt-2 leading-relaxed">
              {bio}
            </p>
          </StaggerItem>
        </StaggerContainer>
        
        <AnimatedSection delay={0.4} direction="up" className="flex space-x-6">
          <Link prefetch={true} href="/portfolio" className="px-8 py-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition font-medium text-sm hover:scale-105 active:scale-95 duration-200">
            {ctaPrimaryText}
          </Link>
          {cvUrl !== "#" ? (
            <Link href={cvUrl} target="_blank" className="px-8 py-3 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 transition font-medium text-sm shadow-[0_0_20px_rgba(168,85,247,0.4)] hover:scale-105 active:scale-95 duration-200">
              {ctaSecondaryText}
            </Link>
          ) : (
            <button className="px-8 py-3 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 transition font-medium text-sm shadow-[0_0_20px_rgba(168,85,247,0.4)] hover:scale-105 active:scale-95 duration-200">
              {ctaSecondaryText}
            </button>
          )}
        </AnimatedSection>

        <AnimatedSection delay={0.6} direction="right" className="mt-20 relative z-20 hidden md:block">
          <h2 className="font-heading text-6xl sm:text-7xl md:text-8xl lg:text-[10rem] font-black text-white/5 drop-shadow-[0_10px_10px_rgba(0,0,0,0.1)] -mt-4 ml-8 tracking-tighter uppercase">{heroTagline}</h2>
        </AnimatedSection>
      </div>

      {/* Right Section - Custom Interactive Animation */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center relative z-10 min-h-[500px] [clip-path:inset(0)]">
        <AnimatedSection delay={0.2} direction="left" className="w-full h-full flex justify-center relative">
          <div className="w-full h-full max-w-xl aspect-square relative z-10 flex items-center justify-center drop-shadow-[0_0_30px_rgba(168,85,247,0.5)]">
            <CustomSvgAnimation lang={lang} />
          </div>
        </AnimatedSection>
      </div>
      </div>

      {/* Portfolio Section */}
      <div className="w-full flex justify-center mt-10">
        <AnimatedSection delay={0.2} direction="up" className="w-full max-w-[90vw] xl:max-w-[85vw]">
          <FeaturedProjectsCarousel 
            title={portfolioTitle} 
            subtitle={portfolioSubtitle} 
            projects={featuredProjects} 
          />
        </AnimatedSection>
      </div>

      {/* Contact Section */}
      <div className="w-full flex justify-center mt-20">
        <AnimatedSection delay={0.4} direction="up" className="w-full max-w-[90vw] xl:max-w-[85vw] glass-card rounded-[2.5rem] p-8 sm:p-12 flex flex-col sm:flex-row gap-12">
          <div className="w-full sm:w-5/12">
            <h3 className="font-heading text-3xl font-bold mb-6 text-white tracking-wide">{lang === 'id' ? 'Hubungi Saya' : 'Get in touch'}</h3>
            <p className="text-xs text-gray-400 leading-relaxed mb-6">
              {contactIntro}
            </p>
            <div className="text-xs font-medium text-white/80 space-y-1.5">
              <p className="hover:text-purple-400 transition-colors cursor-pointer">📞 {phone}</p>
              <p className="hover:text-purple-400 transition-colors cursor-pointer">✉️ {email}</p>
            </div>
          </div>
          <ClientContactForm email={email} variant="home" lang={lang} />
        </AnimatedSection>
      </div>

      {/* Guestbook Section */}
      <AnimatedSection delay={0.8} direction="up" className="w-full relative z-10 px-4 md:px-0">
        <Guestbook lang={lang} />
      </AnimatedSection>
    </div>
  );
}

