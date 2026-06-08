import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const revalidate = 60; // ISR: revalidate every 60s

export default async function HomePage() {
  // Fetch profile from DB
  const profile = await prisma.profile.findFirst().catch(() => null);

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
    <div className="flex relative w-full">
      {/* Left Section (Hero) */}
      <div className="w-1/2 flex flex-col justify-center relative pb-20">
        <div className="space-y-4 mb-10">
          <p className="text-purple-400 text-lg font-medium tracking-wide uppercase flex items-center">
            <span className="w-10 h-px bg-purple-400 mr-4"></span>
            {heroIntro}
          </p>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight tracking-tight text-white drop-shadow-lg">
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

        <div className="mt-24 relative z-20">
          <h2 className="text-6xl md:text-7xl lg:text-8xl font-black text-white/80 drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)] -mt-4 ml-8 tracking-tighter">{heroTagline}</h2>
        </div>
      </div>

      {/* Right Section */}
      <div className="w-1/2 flex flex-col justify-center items-center space-y-16 pb-20">
        
        {/* Work Preview */}
        <div className="w-full max-w-lg bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2rem] p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none"></div>
          <h3 className="text-center text-lg font-semibold mb-8">{portfolioTitle}</h3>
          <div className="flex justify-center items-end space-x-6">
            <div className="w-28 h-40 bg-gradient-to-b from-blue-900/40 to-purple-900/40 rounded-xl flex flex-col items-center justify-center p-3 opacity-60 scale-90 border border-white/5 shadow-inner">
              <div className="w-full h-full bg-black/40 rounded-lg mb-2 overflow-hidden flex items-center justify-center">
                <div className="w-16 h-10 bg-blue-500/30 rounded"></div>
              </div>
              <div className="text-xs font-medium">Mockups</div>
            </div>
            <div className="w-40 h-56 bg-gradient-to-b from-slate-800 to-indigo-950 rounded-2xl border border-purple-500/50 shadow-[0_0_40px_rgba(168,85,247,0.4)] flex flex-col items-center justify-start p-3 z-10 relative">
              <div className="absolute top-0 inset-x-0 h-1/2 bg-gradient-to-b from-purple-500/20 to-transparent rounded-t-2xl pointer-events-none"></div>
              <div className="w-full flex justify-between space-x-2 mt-2">
                <div className="w-1/3 h-28 bg-black rounded-lg border border-white/10"></div>
                <div className="w-1/3 h-32 bg-black rounded-lg border border-white/10 -mt-2 shadow-lg"></div>
                <div className="w-1/3 h-28 bg-black rounded-lg border border-white/10"></div>
              </div>
              <div className="text-sm font-bold mt-auto mb-2 text-white">UI Designs</div>
              <div className="w-1/2 h-1 bg-purple-500/50 rounded-full mb-1"></div>
            </div>
            <div className="w-28 h-40 bg-gradient-to-b from-pink-900/40 to-purple-900/40 rounded-xl flex flex-col items-center justify-center p-3 opacity-60 scale-90 border border-white/5 shadow-inner">
              <div className="w-full h-full bg-black/40 rounded-lg mb-2 overflow-hidden flex flex-col items-center justify-center">
                <div className="w-12 h-16 bg-pink-500/30 rounded rotate-12"></div>
              </div>
              <div className="text-xs font-medium">Mockups</div>
            </div>
          </div>
          <div className="text-center mt-6">
            <Link href="/portfolio" className="text-sm text-purple-300 hover:text-purple-200 transition underline underline-offset-4">
              {portfolioSubtitle}
            </Link>
          </div>
        </div>

        {/* Contact */}
        <div className="w-full max-w-lg bg-[#1a153a]/80 backdrop-blur-2xl border border-white/10 rounded-[2rem] p-10 flex space-x-8 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
          <div className="w-5/12">
            <h3 className="text-xl font-bold mb-4 text-white">Get in touch</h3>
            <p className="text-xs text-gray-400 leading-relaxed mb-6">
              {contactIntro}
            </p>
            <div className="text-xs font-medium text-white/80 space-y-1.5">
              <p>📞 {phone}</p>
              <p>✉️ {email}</p>
            </div>
          </div>
          <div className="w-7/12 space-y-3">
            <h3 className="text-sm font-bold mb-4 text-white">Send me a message</h3>
            <input type="text" placeholder="Name" className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 text-xs outline-none focus:border-purple-500 transition focus:bg-white/10" />
            <input type="email" placeholder="Email Address" className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 text-xs outline-none focus:border-purple-500 transition focus:bg-white/10" />
            <input type="text" placeholder="Subject" className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 text-xs outline-none focus:border-purple-500 transition focus:bg-white/10" />
            <textarea placeholder="Your message" rows={3} className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 text-xs outline-none focus:border-purple-500 transition resize-none focus:bg-white/10"></textarea>
            <button className="w-2/3 py-2.5 rounded-lg bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 transition text-xs font-bold mt-2 shadow-[0_0_15px_rgba(168,85,247,0.3)]">Send Message</button>
          </div>
        </div>
      </div>
    </div>
  );
}
