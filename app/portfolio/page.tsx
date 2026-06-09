import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Brain, Github, ExternalLink, Mail, Phone, MapPin, Calendar, Award, BookOpen, Briefcase } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

import { prisma } from "@/lib/prisma"

export const dynamic = "force-dynamic"

export default async function PortfolioPage() {
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
        achievements: []
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
    title: dbProfile.headline || "Web Developer & System Analyst",
    bio: dbProfile.bio || "Fresh Graduate S1 Sistem Informasi di Telkom University yang passionate dalam mengembangkan solusi teknologi untuk memecahkan masalah nyata. Berfokus sebagai Web Developer dan System Analyst menggunakan teknologi web modern.",
    email: dbProfile.email_contact || "fitrah.andhika@email.com",
    phone: dbProfile.phone || "+62 877 6028 7039",
    location: dbProfile.location || "Bandung, Indonesia",
    github_url: dbProfile.github_url || "https://github.com/Fitrah-Andhika-Ramadhan/",
    btn_contact: dbProfile.portfolio_btn_contact || "Contact Me",
    btn_github: dbProfile.portfolio_btn_github || "GitHub",
    btn_files: dbProfile.portfolio_btn_files || "My Study Files",
    skills_title: dbProfile.portfolio_skills_title || "Technical Skills",
    projects_title: dbProfile.portfolio_projects_title || "Featured Projects",
    experience_title: dbProfile.portfolio_experience_title || "Experience & Education"
  } : {
    name: "Fitrah Andhika Ramadhan",
    title: "Web Developer & System Analyst",
    bio: "Fresh Graduate S1 Sistem Informasi di Telkom University yang passionate dalam mengembangkan solusi teknologi untuk memecahkan masalah nyata. Berfokus sebagai Web Developer dan System Analyst menggunakan teknologi web modern.",
    email: "fitrah.andhika@email.com",
    phone: "+62 877 6028 7039",
    location: "Bandung, Indonesia",
    github_url: "https://github.com/Fitrah-Andhika-Ramadhan/",
    btn_contact: "Contact Me",
    btn_github: "GitHub",
    btn_files: "My Study Files",
    skills_title: "Technical Skills",
    projects_title: "Featured Projects",
    experience_title: "Experience & Education"
  };

  const education = dbExperiences.filter(e => e.type === "education").length > 0
    ? dbExperiences.filter(e => e.type === "education").map(e => ({
        degree: e.title,
        school: e.organization,
        period: `${e.start_date.getFullYear()} - ${e.end_date ? e.end_date.getFullYear() : 'Present'}`,
        gpa: "3.75/4.00",
        achievements: []
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
            <div className="text-center mb-10">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-md">{profile.name}</h1>
              <p className="text-xl text-purple-300 mb-6 font-medium">{profile.title}</p>
              <p className="text-lg text-purple-100 max-w-2xl mx-auto mb-8 opacity-80">
                {profile.bio}
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700" asChild>
                <Link href={`mailto:${profile.email}`}>
                  <Mail className="mr-2 h-5 w-5" />
                  {profile.btn_contact}
                </Link>
              </Button>
              {profile.github_url && (
                <Button size="lg" variant="outline" className="bg-transparent" asChild>
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
            </div>

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
      <section className="py-16 px-4 bg-white/5 backdrop-blur-sm border-y border-white/10">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center text-white mb-12 drop-shadow-md">{profile.skills_title}</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {skills.map((skill, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between">
                  <span className="font-medium text-white">{skill.name}</span>
                  <span className="text-purple-300">{skill.level}%</span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-2">
                  <div
                    className="bg-purple-500 h-2 rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(168,85,247,0.5)]"
                    style={{ width: `${skill.level}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center text-white mb-12 drop-shadow-md">{profile.projects_title}</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {projects.map((project, index) => (
              <Card key={index} className="overflow-hidden hover:shadow-[0_0_30px_rgba(168,85,247,0.3)] transition-shadow bg-white/5 border-white/10 backdrop-blur-md text-white">
                <div className="aspect-video relative">
                  <Image src={project.image || "/placeholder.svg"} alt={project.title} fill className="object-cover" />
                </div>
                <CardHeader>
                  <CardTitle className="text-lg">{project.title}</CardTitle>
                  <CardDescription>{project.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tech.map((tech, techIndex) => (
                      <Badge key={techIndex} variant="secondary">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline" asChild>
                      <Link href={project.github} target="_blank" rel="noopener noreferrer">
                        <Github className="h-4 w-4 mr-2" />
                        Code
                      </Link>
                    </Button>
                    <Button size="sm" asChild>
                      <Link href={project.demo}>
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Demo
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section className="py-16 px-4 bg-white/5 backdrop-blur-sm border-y border-white/10">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold text-center text-white mb-12 drop-shadow-md">{profile.experience_title}</h2>
          <div className="space-y-8">
            {experiences.map((exp, index) => (
              <Card key={index} className="bg-white/5 border-white/10 backdrop-blur-md text-white shadow-xl">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="flex items-center">
                        <Briefcase className="h-5 w-5 mr-2 text-blue-600" />
                        {exp.title}
                      </CardTitle>
                      <CardDescription className="text-lg font-medium text-blue-600">{exp.company}</CardDescription>
                    </div>
                    <Badge variant="outline" className="flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      {exp.period}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-purple-100 mb-4">{exp.description}</p>
                  <div>
                    <h4 className="font-medium mb-2 text-white">Key Activities:</h4>
                    <ul className="space-y-1">
                      {exp.achievements.map((achievement, achIndex) => (
                        <li key={achIndex} className="flex items-start text-sm text-purple-200">
                          <span className="inline-block w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                          {achievement}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Education Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold text-center text-white mb-12 drop-shadow-md">Education</h2>
          <div className="space-y-6">
            {education.map((edu, index) => (
              <Card key={index} className="bg-white/5 border-white/10 backdrop-blur-md text-white shadow-xl">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="flex items-center">
                        <Award className="h-5 w-5 mr-2 text-blue-600" />
                        {edu.degree}
                      </CardTitle>
                      <CardDescription className="text-lg font-medium text-blue-600">{edu.school}</CardDescription>
                    </div>
                    <div className="text-right">
                      <Badge variant="outline" className="flex items-center mb-2">
                        <Calendar className="h-3 w-3 mr-1" />
                        {edu.period}
                      </Badge>
                      <div className="text-sm text-gray-600">GPA: {edu.gpa}</div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div>
                    <h4 className="font-medium mb-2 text-white">Current Focus:</h4>
                    <ul className="space-y-1">
                      {edu.achievements.map((achievement, achIndex) => (
                        <li key={achIndex} className="flex items-start text-sm text-purple-200">
                          <span className="inline-block w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                          {achievement}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
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
