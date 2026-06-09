import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { MapPin, Phone, Mail, Github, Linkedin } from "lucide-react"

export const dynamic = "force-dynamic"

export default async function AboutPage() {
  const profile = await prisma.profile.findFirst().catch(() => null)

  const name = profile?.name || "Fitrah Andhika Ramadhan"
  const title = profile?.headline || "Web Developer & System Analyst"
  const bio = profile?.bio || "Fresh Graduate S1 Sistem Informasi di Telkom University yang passionate dalam mengembangkan solusi teknologi untuk memecahkan masalah nyata. Berfokus sebagai Web Developer dan System Analyst menggunakan teknologi web modern."
  const phone = profile?.phone || "+62 877 6028 7039"
  const email = profile?.email_contact || "fitrahramadhan310@gmail.com"
  const location = profile?.location || "Banten, Indonesia"
  const github = profile?.github_url || "https://github.com/Fitrah-Andhika-Ramadhan"
  const linkedin = profile?.linkedin_url || "#"

  return (
    <div className="w-full text-white min-h-screen">
      {/* Hero */}
      <section className="relative flex flex-col items-center justify-center pt-24 pb-16 px-4 text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 to-transparent pointer-events-none" />
        <div className="relative z-10 max-w-3xl mx-auto">
          <div className="w-28 h-28 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-5xl font-bold mx-auto mb-6 shadow-[0_0_40px_rgba(168,85,247,0.5)]">
            {name.charAt(0)}
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-3 drop-shadow-md">{name}</h1>
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
              View My Work →
            </Link>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 px-4 bg-white/5 backdrop-blur-sm border-y border-white/10">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold text-center text-white mb-12">What I Do</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: "🌐", title: "Web Development", desc: "Building modern, responsive web applications using React, Next.js, and Laravel." },
              { icon: "🔍", title: "System Analysis", desc: "Designing and analyzing systems to solve real-world business problems efficiently." },
              { icon: "🤖", title: "AI Integration", desc: "Integrating AI technologies to create smarter, more powerful applications." },
            ].map((item, i) => (
              <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center hover:border-purple-500/30 transition hover:bg-white/10">
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                <p className="text-purple-200/70 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
