import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { MapPin, Phone, Mail, Github, Linkedin } from "lucide-react"
import { AnimatedSection, StaggerContainer, StaggerItem } from "@/components/animated-section"
import { cookies } from "next/headers"

export const dynamic = "force-dynamic"

export default async function AboutPage() {
  const profile = await prisma.profile.findFirst().catch(() => null)

  const cookieStore = await cookies()
  const lang = cookieStore.get('NEXT_LOCALE')?.value || 'id'

  const name = profile?.name || "Fitrah Andhika Ramadhan"
  const title = profile?.headline || (lang === 'id' ? "Pengembang Web & Analis Sistem" : "Web Developer & System Analyst")
  const bio = profile?.bio || (lang === 'id' ? "Fresh Graduate S1 Sistem Informasi di Telkom University yang passionate dalam mengembangkan solusi teknologi untuk memecahkan masalah nyata. Berfokus sebagai Web Developer dan System Analyst menggunakan teknologi web modern." : "Information Systems fresh graduate from Telkom University passionate about developing tech solutions to solve real problems. Focused on Web Development and System Analysis using modern web technologies.")
  const phone = profile?.phone || "+62 877 6028 7039"
  const email = profile?.email_contact || "fitrahramadhan310@gmail.com"
  const location = profile?.location || "Banten, Indonesia"
  const github = profile?.github_url || "https://github.com/Fitrah-Andhika-Ramadhan"
  const linkedin = profile?.linkedin_url || "#"

  return (
    <div className="w-full text-white min-h-screen">
      {/* Hero */}
      <section className="relative flex flex-col items-center justify-center pt-32 pb-16 px-4 text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 to-transparent pointer-events-none" />
        <AnimatedSection delay={0.2} direction="up" className="relative z-10 max-w-3xl mx-auto">
          <div className="w-32 h-32 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-6xl font-bold mx-auto mb-8 shadow-[0_0_40px_rgba(168,85,247,0.5)] border-4 border-white/10">
            {name.charAt(0)}
          </div>
          <h1 className="font-heading text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-200 to-indigo-400 mb-4 drop-shadow-md">{name}</h1>
          <p className="text-xl text-purple-300 font-semibold mb-6">{title}</p>
          <p className="text-base md:text-lg text-purple-100/80 leading-relaxed mb-8">{bio}</p>

          <div className="flex flex-wrap justify-center gap-4 text-sm text-purple-200 mb-10">
            {location && (
              <span className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full border border-white/10">
                <MapPin className="w-4 h-4" /> {location}
              </span>
            )}
            {phone && (
              <span className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full border border-white/10">
                <Phone className="w-4 h-4" /> {phone}
              </span>
            )}
            {email && (
              <span className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full border border-white/10">
                <Mail className="w-4 h-4" /> {email}
              </span>
            )}
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            {github && github !== "#" && (
              <Link
                href={github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 transition border border-white/10 font-medium"
              >
                <Github className="w-5 h-5" /> GitHub
              </Link>
            )}
            {linkedin && linkedin !== "#" && (
              <Link
                href={linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-6 py-3 rounded-full bg-blue-600/80 hover:bg-blue-600 transition border border-blue-500/30 font-medium"
              >
                <Linkedin className="w-5 h-5" /> LinkedIn
              </Link>
            )}
            <Link
              href="/portfolio"
              className="flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 transition font-medium shadow-[0_0_20px_rgba(168,85,247,0.4)]"
            >
              {lang === 'id' ? 'Lihat Karya Saya →' : 'View My Work →'}
            </Link>
          </div>
        </AnimatedSection>
      </section>

      {/* Values */}
      <section className="py-24 px-4 relative z-10 shadow-[0_0_50px_rgba(0,0,0,0.2)]">
        <div className="container mx-auto max-w-5xl">
          <AnimatedSection delay={0.4} direction="up">
            <h2 className="font-heading text-4xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-indigo-400 mb-16 tracking-tight">
              {lang === 'id' ? 'Apa yang Saya Lakukan' : 'What I Do'}
            </h2>
          </AnimatedSection>
          <StaggerContainer className="grid md:grid-cols-3 gap-8">
            {[
              { 
                icon: "🌐", 
                title: lang === 'id' ? "Pengembangan Web" : "Web Development", 
                desc: lang === 'id' ? "Membangun aplikasi web yang modern dan responsif menggunakan React, Next.js, dan alat modern." : "Building modern, responsive web applications using React, Next.js, and modern tools." 
              },
              { 
                icon: "🔍", 
                title: lang === 'id' ? "Analisis Sistem" : "System Analysis", 
                desc: lang === 'id' ? "Merancang dan menganalisis sistem untuk menyelesaikan masalah bisnis di dunia nyata secara efisien." : "Designing and analyzing systems to solve real-world business problems efficiently." 
              },
              { 
                icon: "🤖", 
                title: lang === 'id' ? "Integrasi AI" : "AI Integration", 
                desc: lang === 'id' ? "Mengintegrasikan teknologi AI untuk menciptakan aplikasi yang lebih cerdas dan kuat." : "Integrating AI technologies to create smarter, more powerful applications." 
              },
            ].map((item, i) => (
              <StaggerItem key={i} className="glass-card rounded-3xl p-8 text-center group cursor-default hover:-translate-y-2 transition-all duration-300">
                <div className="text-5xl mb-6 group-hover:scale-110 transition-transform duration-300">{item.icon}</div>
                <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                <p className="text-purple-200/70 text-base leading-relaxed">{item.desc}</p>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>
    </div>
  )
}

