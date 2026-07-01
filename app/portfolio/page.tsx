import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Brain, Github, ExternalLink, Mail, Phone, MapPin, Calendar, Award, BookOpen, Briefcase } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { AnimatedSection, StaggerContainer, StaggerItem } from "@/components/animated-section"
import { cookies } from "next/headers"

import { prisma } from "@/lib/prisma"

export const revalidate = 30

export default async function PortfolioPage() {
  const cookieStore = await cookies()
  const lang = cookieStore.get('NEXT_LOCALE')?.value || 'id'
  // Fetch real data from Database concurrently
  const [dbProjects, dbSkills, dbExperiences, dbProfile] = await Promise.all([
    prisma.project.findMany({
      where: { status: "published" },
      orderBy: { sort_order: "asc" },
      include: { techs: { include: { tech: true } } }
    }),
    prisma.skill.findMany({
      orderBy: { sort_order: "asc" }
    }),
    prisma.experience.findMany({
      orderBy: { sort_order: "asc" }
    }),
    prisma.profile.findFirst()
  ]);

  const projects = dbProjects.map(p => ({
    title: p.title,
    description: p.short_desc,
    tech: p.techs.map(t => t.tech.name),
    github: p.github_url || "#",
    demo: p.demo_url || "#",
    image: p.thumbnail_url || "/placeholder.svg?height=200&width=300",
  }));

  const skills = dbSkills.length > 0 ? dbSkills : [
    { name: "JavaScript", level: 90 },
    { name: "TypeScript", level: 85 },
    { name: "React/Next.js", level: 88 },
    { name: "Node.js", level: 82 },
    { name: "Laravel/PHP", level: 80 },
    { name: "MySQL/PostgreSQL", level: 85 },
  ];

  const experiences = dbExperiences.filter(e => e.type === "work" || e.type === "achievement").length > 0 
    ? dbExperiences.filter(e => e.type === "work" || e.type === "achievement").map(e => ({
        title: e.title,
        company: e.organization,
        period: `${e.start_date.getFullYear()} - ${e.end_date ? e.end_date.getFullYear() : 'Present'}`,
        description: e.description || "",
        achievements: (() => {
          try { return e.key_points ? JSON.parse(e.key_points) : [] } catch { return [] }
        })()
      }))
    : [
    {
      title: "Frontend Developer Student",
      company: "Telkom University",
      period: "2021 - Present",
      description: "Currently studying Data Analytics & Software Development with AI.",
      achievements: [
        "Learning React, Next.js, and modern JavaScript frameworks"
      ],
    }
  ];

  const profile = dbProfile ? {
    name: dbProfile.name || "Fitrah Andhika Ramadhan",
    title: dbProfile.headline || (lang === 'id' ? "Pengembang Web & Analis Sistem" : "Web Developer & System Analyst"),
    bio: dbProfile.bio || (lang === 'id' ? "Fresh Graduate S1 Sistem Informasi di Telkom University yang passionate dalam mengembangkan solusi teknologi untuk memecahkan masalah nyata. Berfokus sebagai Web Developer dan System Analyst menggunakan teknologi web modern." : "Information Systems fresh graduate from Telkom University passionate about developing tech solutions to solve real problems. Focused on Web Development and System Analysis using modern web technologies."),
    email: dbProfile.email_contact || "fitrah.andhika@email.com",
    phone: dbProfile.phone || "+62 877 6028 7039",
    location: dbProfile.location || "Bandung, Indonesia",
    github_url: dbProfile.github_url || "https://github.com/Fitrah-Andhika-Ramadhan/",
    btn_contact: dbProfile.portfolio_btn_contact || (lang === 'id' ? "Hubungi Saya" : "Contact Me"),
    btn_github: dbProfile.portfolio_btn_github || "GitHub",
    btn_files: dbProfile.portfolio_btn_files || (lang === 'id' ? "File Belajar Saya" : "My Study Files"),
    skills_title: dbProfile.portfolio_skills_title || (lang === 'id' ? "Keahlian Teknis" : "Technical Skills"),
    projects_title: dbProfile.portfolio_projects_title || (lang === 'id' ? "Proyek Unggulan" : "Featured Projects"),
    experience_title: dbProfile.portfolio_experience_title || (lang === 'id' ? "Pengalaman & Pendidikan" : "Experience & Education")
  } : {
    name: "Fitrah Andhika Ramadhan",
    title: lang === 'id' ? "Pengembang Web & Analis Sistem" : "Web Developer & System Analyst",
    bio: lang === 'id' ? "Fresh Graduate S1 Sistem Informasi di Telkom University yang passionate dalam mengembangkan solusi teknologi untuk memecahkan masalah nyata. Berfokus sebagai Web Developer dan System Analyst menggunakan teknologi web modern." : "Information Systems fresh graduate from Telkom University passionate about developing tech solutions to solve real problems. Focused on Web Development and System Analysis using modern web technologies.",
    email: "fitrah.andhika@email.com",
    phone: "+62 877 6028 7039",
    location: "Bandung, Indonesia",
    github_url: "https://github.com/Fitrah-Andhika-Ramadhan/",
    btn_contact: lang === 'id' ? "Hubungi Saya" : "Contact Me",
    btn_github: "GitHub",
    btn_files: lang === 'id' ? "File Belajar Saya" : "My Study Files",
    skills_title: lang === 'id' ? "Keahlian Teknis" : "Technical Skills",
    projects_title: lang === 'id' ? "Proyek Unggulan" : "Featured Projects",
    experience_title: lang === 'id' ? "Pengalaman & Pendidikan" : "Experience & Education"
  };

  const education = dbExperiences.filter(e => e.type === "education").length > 0
    ? dbExperiences.filter(e => e.type === "education").map(e => ({
        degree: e.title,
        school: e.organization,
        period: `${e.start_date.getFullYear()} - ${e.end_date ? e.end_date.getFullYear() : 'Present'}`,
        gpa: e.description || "3.64/4.00",
        achievements: (() => {
          try { return e.key_points ? JSON.parse(e.key_points) : [] } catch { return [] }
        })()
      }))
    : [
    {
      degree: "Sarjana Sistem Informasi",
      school: "Telkom University",
      period: "2021 - 2025",
      gpa: "3.75/4.00",
      achievements: [
        "Currently studying Data Analytics & Software Development with AI"
      ],
    },
  ];

  return (
    <div className="w-full text-white">
      <div className="w-full">
        {/* Hero Section */}
        <section className="relative min-h-[80vh] flex items-center justify-center pt-20 pb-16 px-4 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 to-transparent pointer-events-none"></div>

          <div className="relative z-10 w-full max-w-4xl mx-auto">
            <StaggerContainer className="text-center mb-10">
              <StaggerItem>
                <h1 className="text-4xl md:text-5xl lg:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-200 to-indigo-400 mb-6 drop-shadow-lg">{profile.name}</h1>
              </StaggerItem>
              <StaggerItem>
                <p className="text-xl md:text-2xl text-purple-300 mb-6 font-semibold tracking-wide">{profile.title}</p>
              </StaggerItem>
              <StaggerItem>
                <p className="text-base md:text-lg text-purple-100/80 max-w-2xl mx-auto mb-10 leading-relaxed">
                  {profile.bio}
                </p>
              </StaggerItem>
            </StaggerContainer>

            <AnimatedSection delay={0.4} direction="up" className="flex flex-wrap justify-center gap-6 mb-12">
              <Button size="lg" className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white rounded-full px-8 transition-all hover:scale-105 shadow-[0_0_20px_rgba(168,85,247,0.4)] border-0" asChild>
                <Link href={`mailto:${profile.email}`}>
                  <Mail className="mr-2 h-5 w-5" />
                  {profile.btn_contact}
                </Link>
              </Button>
              {profile.github_url && (
                <Button size="lg" variant="outline" className="rounded-full px-8 bg-white/5 backdrop-blur-md border-white/20 hover:bg-white/10 hover:text-white transition-all hover:scale-105" asChild>
                  <Link href={profile.github_url} target="_blank" rel="noopener noreferrer">
                    <Github className="mr-2 h-5 w-5" />
                    {profile.btn_github}
                  </Link>
                </Button>
              )}
              <Link href="/files">
                <Button size="lg" variant="outline" className="bg-transparent">
                  <BookOpen className="mr-2 h-5 w-5" />
                  {profile.btn_files}
                </Button>
              </Link>
            </AnimatedSection>

            <div className="flex flex-wrap justify-center gap-6 text-purple-200">
              {profile.location && (
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2" />
                  {profile.location}
                </div>
              )}
              {profile.phone && (
                <div className="flex items-center">
                  <Phone className="h-4 w-4 mr-2" />
                  {profile.phone}
                </div>
              )}
              {profile.email && (
                <div className="flex items-center">
                  <Mail className="h-4 w-4 mr-2" />
                  {profile.email}
                </div>
              )}
            </div>
          </div>
        </section>
      </div>

      {/* Skills Section */}
      <section className="py-24 px-4 bg-white/5 backdrop-blur-md border-y border-white/10 relative z-10 shadow-[0_0_50px_rgba(0,0,0,0.2)]">
        <div className="container mx-auto max-w-6xl">
          <AnimatedSection delay={0.2} direction="up">
            <h2 className="text-4xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-indigo-400 mb-16 drop-shadow-lg tracking-tight">{profile.skills_title}</h2>
          </AnimatedSection>
          <StaggerContainer className="grid md:grid-cols-2 gap-10">
            {skills.map((skill, index) => (
              <StaggerItem key={index} className="space-y-4 bg-white/5 p-6 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors">
                <div className="flex justify-between items-end">
                  <span className="font-bold text-lg text-white tracking-wide">{skill.name}</span>
                  <span className="text-purple-300 font-mono font-medium bg-purple-900/30 px-3 py-1 rounded-full text-sm">{skill.level}%</span>
                </div>
                <div className="w-full bg-black/40 rounded-full h-3 shadow-inner overflow-hidden border border-white/5">
                  <div
                    className="bg-gradient-to-r from-purple-600 to-indigo-400 h-full rounded-full transition-all duration-1000 shadow-[0_0_15px_rgba(168,85,247,0.8)] relative"
                    style={{ width: `${skill.level}%` }}
                  >
                    <div className="absolute top-0 right-0 bottom-0 w-10 bg-gradient-to-l from-white/30 to-transparent"></div>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Projects Section */}
      <section className="py-24 px-4 relative z-10">
        <div className="container mx-auto max-w-7xl">
          <AnimatedSection delay={0.2} direction="down">
            <h2 className="text-4xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-indigo-400 mb-16 drop-shadow-lg tracking-tight">{profile.projects_title}</h2>
          </AnimatedSection>
          
          <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            {projects.map((project, index) => (
              <StaggerItem key={index}>
                <Card className="h-full flex flex-col overflow-hidden glass-card rounded-3xl border-white/10 group cursor-pointer hover:-translate-y-2">
                  <div className="aspect-video relative overflow-hidden">
                    <div className="absolute inset-0 bg-purple-500/20 group-hover:bg-transparent transition-colors duration-500 z-10 mix-blend-overlay"></div>
                    <Image src={project.image || "/placeholder.svg"} alt={project.title} fill className="object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out" />
                  </div>
                  <CardHeader className="pt-6 relative z-20 bg-gradient-to-t from-transparent via-[#1a153a]/50 to-[#1a153a]">
                    <CardTitle className="text-2xl font-bold text-white group-hover:text-purple-300 transition-colors">{project.title}</CardTitle>
                    <CardDescription className="text-purple-200/70 text-sm leading-relaxed mt-2">{project.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-col flex-grow justify-between mt-4">
                    <div className="flex flex-wrap gap-2 mb-8">
                      {project.tech.map((tech, techIndex) => (
                        <Badge key={techIndex} variant="secondary" className="bg-purple-900/30 text-purple-200 border border-purple-500/30 hover:bg-purple-800/50 transition-colors">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex space-x-3 w-full">
                      <Button size="sm" variant="outline" className="flex-1 rounded-xl bg-white/5 border-white/10 hover:bg-white/10 hover:text-white transition-all" asChild>
                        <Link href={project.github} target="_blank" rel="noopener noreferrer">
                          <Github className="h-4 w-4 mr-2" />
                          Code
                        </Link>
                      </Button>
                      <Button size="sm" className="flex-1 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 border-0 shadow-[0_0_15px_rgba(168,85,247,0.3)] transition-all" asChild>
                        <Link href={project.demo}>
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Demo
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Experience Section */}
      <section className="py-24 px-4 bg-white/5 backdrop-blur-md border-y border-white/10 relative z-10 shadow-[0_0_50px_rgba(0,0,0,0.2)]">
        <div className="container mx-auto max-w-5xl">
          <AnimatedSection delay={0.2} direction="up">
            <h2 className="text-4xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-indigo-400 mb-16 drop-shadow-lg tracking-tight">{profile.experience_title}</h2>
          </AnimatedSection>
          
          <StaggerContainer className="space-y-8">
            {experiences.map((exp, index) => (
              <StaggerItem key={index}>
                <Card className="glass-card rounded-[2rem] border-purple-500/10 hover:border-purple-400/30 transition-all duration-300 group">
                  <CardHeader className="pb-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <CardTitle className="flex items-center text-2xl font-bold text-white group-hover:text-purple-300 transition-colors">
                          <Briefcase className="h-6 w-6 mr-3 text-purple-400" />
                          {exp.title}
                        </CardTitle>
                        <CardDescription className="text-xl font-medium text-purple-300/80 mt-2">{exp.company}</CardDescription>
                      </div>
                      <Badge variant="outline" className="flex items-center w-fit bg-purple-900/20 border-purple-500/30 text-purple-200 py-1.5 px-4 rounded-full">
                        <Calendar className="h-4 w-4 mr-2" />
                        {exp.period}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {exp.description && (
                      <p className="text-purple-100/70 mb-6 text-base leading-relaxed">{exp.description}</p>
                    )}
                    {exp.achievements.length > 0 && (
                      <div className="bg-white/5 rounded-2xl p-6 border border-white/5">
                        <h4 className="font-semibold mb-4 text-white text-sm tracking-widest uppercase">Key Activities & Achievements</h4>
                        <ul className="space-y-3">
                          {exp.achievements.map((achievement: string, achIndex: number) => (
                            <li key={achIndex} className="flex items-start text-base text-purple-100/80">
                              <span className="inline-block w-2 h-2 bg-purple-400 rounded-full mt-2 mr-4 flex-shrink-0 shadow-[0_0_8px_rgba(168,85,247,0.8)]"></span>
                              {achievement}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Education Section */}
      <section className="py-24 px-4 relative z-10">
        <div className="container mx-auto max-w-5xl">
          <AnimatedSection delay={0.2} direction="up">
            <h2 className="text-4xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-indigo-400 mb-16 drop-shadow-lg tracking-tight">Education</h2>
          </AnimatedSection>
          
          <StaggerContainer className="space-y-8">
            {education.map((edu, index) => (
              <StaggerItem key={index}>
                <Card className="glass-card rounded-[2rem] border-purple-500/10 hover:border-purple-400/30 transition-all duration-300 group">
                  <CardHeader className="pb-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <CardTitle className="flex items-center text-2xl font-bold text-white group-hover:text-purple-300 transition-colors">
                          <Award className="h-6 w-6 mr-3 text-purple-400" />
                          {edu.degree}
                        </CardTitle>
                        <CardDescription className="text-xl font-medium text-purple-300/80 mt-2">{edu.school}</CardDescription>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <Badge variant="outline" className="flex items-center bg-purple-900/20 border-purple-500/30 text-purple-200 py-1.5 px-4 rounded-full">
                          <Calendar className="h-4 w-4 mr-2" />
                          {edu.period}
                        </Badge>
                        <div className="text-sm font-semibold text-white/60 bg-white/5 px-3 py-1 rounded-lg border border-white/5">GPA: <span className="text-purple-300">{edu.gpa}</span></div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-white/5 rounded-2xl p-6 border border-white/5 mt-2">
                      <h4 className="font-semibold mb-4 text-white text-sm tracking-widest uppercase">Current Focus & Achievements</h4>
                      <ul className="space-y-3">
                        {edu.achievements.map((achievement: string, achIndex: number) => (
                          <li key={achIndex} className="flex items-start text-base text-purple-100/80">
                            <span className="inline-block w-2 h-2 bg-purple-400 rounded-full mt-2 mr-4 flex-shrink-0 shadow-[0_0_8px_rgba(168,85,247,0.8)]"></span>
                            {achievement}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 px-4 bg-gradient-to-t from-[#1a153a] to-transparent">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Let's Connect & Collaborate</h2>
          <p className="text-xl text-purple-200 mb-8 max-w-2xl mx-auto">
            Tertarik untuk berkolaborasi atau memiliki proyek yang menarik? Saya selalu terbuka untuk diskusi dan
            kesempatan baru dalam dunia teknologi.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="text-lg px-8 py-3" asChild>
              <Link href="mailto:fitrah.andhika@email.com">
                <Mail className="mr-2 h-5 w-5" />
                Send Email
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-lg px-8 py-3 bg-transparent text-white border-white hover:bg-white hover:text-blue-600"
              asChild
            >
              <Link href="tel:+6287760287039">
                <Phone className="mr-2 h-5 w-5" />
                Call Me
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}

