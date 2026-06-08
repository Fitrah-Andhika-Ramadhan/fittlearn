"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import {
  Github,
  ExternalLink,
  Mail,
  MapPin,
  Briefcase,
  Loader2,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"

interface Project {
  id: string
  title: string
  description: string
  tech: string[]
  github: string
  demo: string
  image: string
  featured: boolean
  status: string
}

interface Skill {
  id: string
  name: string
  level: number
  category: string
}

interface Experience {
  id: string
  title: string
  company: string
  period: string
  description: string
}

interface Profile {
  ownerName: string
  ownerTitle: string
  ownerBio: string
  email: string
  location: string
  github: string
  linkedin: string
  twitter: string
  avatar: string
  resumeUrl: string
}

export function CMSPortfolioContent() {
  const [projects, setProjects] = useState<Project[]>([])
  const [skills, setSkills] = useState<Skill[]>([])
  const [experiences, setExperiences] = useState<Experience[]>([])
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Fetch all data in parallel from API (same source as admin CRUD)
    Promise.all([
      fetch("/api/projects").then(r => r.ok ? r.json() : []),
      fetch("/api/skills").then(r => r.ok ? r.json() : []),
      fetch("/api/experience").then(r => r.ok ? r.json() : []),
      fetch("/api/profile").then(r => r.ok ? r.json() : null),
    ]).then(([proj, skl, exp, prof]) => {
      setProjects(proj.filter((p: Project) => p.status === "published"))
      setSkills(skl)
      setExperiences(exp)
      setProfile(prof)
    }).catch(console.error)
    .finally(() => setLoading(false))
  }, [])

  const frontendSkills = skills.filter(s => s.category === "frontend")
  const backendSkills = skills.filter(s => s.category === "backend")
  const otherSkills = skills.filter(s => !["frontend", "backend"].includes(s.category))

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-purple-400 mx-auto mb-3" />
          <p className="text-white/50 text-sm">Loading portfolio...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-20 text-white">

      {/* ── Hero ── */}
      <section className="py-12">
        <div className="flex flex-col md:flex-row items-center gap-10">
          {profile?.avatar && (
            <div className="flex-shrink-0">
              <div className="w-32 h-32 rounded-2xl overflow-hidden border-2 border-purple-500/40 shadow-[0_0_30px_rgba(168,85,247,0.3)]">
                <Image src={profile.avatar} alt={profile.ownerName || "Avatar"} width={128} height={128} className="w-full h-full object-cover" />
              </div>
            </div>
          )}
          <div>
            <p className="text-purple-400 font-medium tracking-wide uppercase text-sm mb-2">Hello, I am</p>
            <h1 className="text-4xl md:text-5xl font-extrabold text-white leading-tight mb-3">
              {profile?.ownerName || "Fitrah Andhika Ramadhan"}
            </h1>
            <p className="text-xl text-purple-300 font-medium mb-4">
              {profile?.ownerTitle || "Web Developer & System Analyst"}
            </p>
            <p className="text-white/65 leading-relaxed max-w-2xl mb-6">
              {profile?.ownerBio || "A passionate Web Developer & System Analyst based in Bandung, Indonesia."}
            </p>
            <div className="flex flex-wrap gap-4 text-sm text-white/60">
              {profile?.email && (
                <span className="flex items-center gap-2 bg-white/[0.06] px-3 py-1.5 rounded-full border border-white/[0.10]">
                  <Mail className="h-3.5 w-3.5 text-blue-400" /> {profile.email}
                </span>
              )}
              {profile?.location && (
                <span className="flex items-center gap-2 bg-white/[0.06] px-3 py-1.5 rounded-full border border-white/[0.10]">
                  <MapPin className="h-3.5 w-3.5 text-red-400" /> {profile.location}
                </span>
              )}
            </div>
            <div className="flex gap-3 mt-6">
              {profile?.github && (
                <Link href={profile.github} target="_blank" className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.07] border border-white/[0.12] hover:bg-white/[0.12] text-sm font-medium transition-all">
                  <Github className="h-4 w-4" /> GitHub
                </Link>
              )}
              {profile?.resumeUrl && (
                <Link href={profile.resumeUrl} target="_blank" className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-sm font-medium transition-all shadow-[0_0_15px_rgba(168,85,247,0.3)]">
                  Download CV
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── Projects ── */}
      {projects.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
            <div className="w-1 h-7 bg-gradient-to-b from-purple-400 to-blue-400 rounded-full" />
            My Projects
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {projects.map((project) => (
              <div key={project.id} className="bg-white/[0.06] border border-white/[0.10] hover:border-white/[0.20] rounded-2xl overflow-hidden transition-all duration-300 group">
                {project.image && (
                  <div className="h-44 overflow-hidden bg-black/20">
                    <Image src={project.image} alt={project.title} width={400} height={200} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                )}
                <div className="p-5">
                  <h3 className="font-semibold text-white text-base mb-2">{project.title}</h3>
                  <p className="text-white/60 text-sm line-clamp-2 mb-4 leading-relaxed">{project.description}</p>
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {project.tech.slice(0, 4).map((t) => (
                      <Badge key={t} className="bg-purple-500/20 text-purple-300 border border-purple-400/30 text-xs">{t}</Badge>
                    ))}
                    {project.tech.length > 4 && <Badge className="bg-white/10 text-white/60 border border-white/10 text-xs">+{project.tech.length - 4}</Badge>}
                  </div>
                  <div className="flex gap-2">
                    {project.github && project.github !== "#" && (
                      <Link href={project.github} target="_blank" className="flex items-center gap-1.5 text-xs text-white/60 hover:text-white px-3 py-1.5 rounded-lg bg-white/[0.05] border border-white/[0.10] hover:bg-white/[0.10] transition-all">
                        <Github className="h-3.5 w-3.5" /> Code
                      </Link>
                    )}
                    {project.demo && project.demo !== "#" && (
                      <Link href={project.demo} target="_blank" className="flex items-center gap-1.5 text-xs text-purple-300 hover:text-purple-200 px-3 py-1.5 rounded-lg bg-purple-500/15 border border-purple-400/30 hover:bg-purple-500/25 transition-all">
                        <ExternalLink className="h-3.5 w-3.5" /> Live Demo
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── Skills ── */}
      {skills.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
            <div className="w-1 h-7 bg-gradient-to-b from-blue-400 to-emerald-400 rounded-full" />
            Skills
          </h2>
          <div className="grid md:grid-cols-3 gap-5">
            {[
              { label: "Frontend", data: frontendSkills, color: "bg-blue-500", glow: "text-blue-300" },
              { label: "Backend", data: backendSkills, color: "bg-emerald-500", glow: "text-emerald-300" },
              { label: "Other", data: otherSkills, color: "bg-purple-500", glow: "text-purple-300" },
            ].filter(g => g.data.length > 0).map(({ label, data, color, glow }) => (
              <div key={label} className="bg-white/[0.06] border border-white/[0.10] rounded-2xl p-5">
                <h3 className={`font-semibold text-sm uppercase tracking-wider ${glow} mb-4`}>{label}</h3>
                <div className="space-y-3">
                  {data.map(skill => (
                    <div key={skill.id}>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm text-white/80">{skill.name}</span>
                        <span className="text-xs text-white/50">{skill.level}%</span>
                      </div>
                      <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                        <div className={`h-full ${color} rounded-full transition-all duration-700`} style={{ width: `${skill.level}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── Experience ── */}
      {experiences.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
            <div className="w-1 h-7 bg-gradient-to-b from-orange-400 to-pink-400 rounded-full" />
            Experience
          </h2>
          <div className="space-y-4">
            {experiences.map(exp => (
              <div key={exp.id} className="bg-white/[0.06] border border-white/[0.10] rounded-2xl p-5 hover:border-white/[0.18] transition-all">
                <div className="flex items-start gap-4">
                  <div className="p-2.5 bg-orange-500/20 border border-orange-400/30 rounded-xl flex-shrink-0">
                    <Briefcase className="h-4 w-4 text-orange-300" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-white">{exp.title}</h3>
                    <div className="flex flex-wrap items-center gap-2 mt-1 mb-3">
                      <span className="text-sm text-white/70">{exp.company}</span>
                      <span className="text-white/30">·</span>
                      <span className="text-xs text-white/50 bg-white/[0.06] px-2 py-0.5 rounded-full border border-white/[0.08]">{exp.period}</span>
                    </div>
                    {exp.description && <p className="text-sm text-white/60 leading-relaxed">{exp.description}</p>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
