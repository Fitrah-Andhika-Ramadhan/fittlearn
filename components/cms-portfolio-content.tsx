"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Brain,
  Github,
  ExternalLink,
  Mail,
  Phone,
  MapPin,
  Calendar,
  BookOpen,
  Briefcase,
  FileText,
  Upload,
  Users,
  Zap,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useCMSProjects, useCMSSkills, useCMSExperiences, useCMSSettings } from "@/hooks/useCMS"

export function CMSPortfolioContent() {
  const { getFeaturedProjects } = useCMSProjects()
  const { skills } = useCMSSkills()
  const { experiences } = useCMSExperiences()
  const { settings } = useCMSSettings()

  const featuredProjects = getFeaturedProjects()
  const frontendSkills = skills.filter((s) => s.category === "frontend")
  const backendSkills = skills.filter((s) => s.category === "backend")
  const otherSkills = skills.filter((s) => !["frontend", "backend"].includes(s.category))

  if (!settings) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  return (
    <>
      {/* Hero Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-8">
              <Image
                src={settings.avatar || "/placeholder.svg"}
                alt="Profile Picture"
                width={150}
                height={150}
                className="rounded-full mx-auto mb-6 border-4 border-white shadow-lg"
              />
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">{settings.ownerName}</h1>
              <p className="text-xl text-gray-600 mb-6">{settings.ownerTitle}</p>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">{settings.ownerBio}</p>
            </div>

            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700" asChild>
                <Link href={`mailto:${settings.email}`}>
                  <Mail className="mr-2 h-5 w-5" />
                  Contact Me
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="bg-transparent" asChild>
                <Link href={settings.github} target="_blank" rel="noopener noreferrer">
                  <Github className="mr-2 h-5 w-5" />
                  GitHub
                </Link>
              </Button>
              <Link href="/files">
                <Button size="lg" variant="outline" className="bg-transparent">
                  <BookOpen className="mr-2 h-5 w-5" />
                  My Study Files
                </Button>
              </Link>
              <Link href="/summarizer">
                <Button size="lg" className="bg-green-600 hover:bg-green-700">
                  <Brain className="mr-2 h-5 w-5" />
                  Try AI Summarizer
                </Button>
              </Link>
            </div>

            <div className="flex flex-wrap justify-center gap-6 text-gray-600">
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-2" />
                {settings.location}
              </div>
              <div className="flex items-center">
                <Phone className="h-4 w-4 mr-2" />
                {settings.phone}
              </div>
              <div className="flex items-center">
                <Mail className="h-4 w-4 mr-2" />
                {settings.email}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-4 bg-white">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">About Me & {settings.siteName}</h2>
              <p className="text-gray-600 mb-4">{settings.ownerBio}</p>
              <p className="text-gray-600 mb-6">{settings.siteDescription}</p>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">Next.js</span>
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">AI Integration</span>
                <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                  Document Processing
                </span>
                <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm">Full-Stack</span>
              </div>
            </div>
            <div className="relative">
              <Image
                src={settings.heroImage || "/placeholder.svg"}
                alt="Developer workspace"
                width={500}
                height={400}
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Technical Skills</h2>

          <div className="space-y-8">
            {frontendSkills.length > 0 && (
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Frontend Development</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {frontendSkills.map((skill) => (
                    <div key={skill.id} className="space-y-2">
                      <div className="flex justify-between">
                        <span className="font-medium text-gray-700">{skill.name}</span>
                        <span className="text-gray-500">{skill.level}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all duration-1000"
                          style={{ width: `${skill.level}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {backendSkills.length > 0 && (
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Backend Development</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {backendSkills.map((skill) => (
                    <div key={skill.id} className="space-y-2">
                      <div className="flex justify-between">
                        <span className="font-medium text-gray-700">{skill.name}</span>
                        <span className="text-gray-500">{skill.level}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-600 h-2 rounded-full transition-all duration-1000"
                          style={{ width: `${skill.level}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {otherSkills.length > 0 && (
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Other Skills</h3>
                <div className="flex flex-wrap justify-center gap-3">
                  {otherSkills.map((skill) => (
                    <Badge
                      key={skill.id}
                      variant="secondary"
                      className="px-4 py-2 text-sm bg-purple-100 text-purple-800"
                    >
                      {skill.name}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* FitLearned Features Section */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">{settings.siteName} Features</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need to transform your documents into actionable insights
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <FileText className="h-12 w-12 text-blue-600 mb-4" />
                <CardTitle>Multi-Format Support</CardTitle>
                <CardDescription>
                  Upload PDF dan Word documents dengan mudah. Sistem kami menangani berbagai format file dengan lancar.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <Brain className="h-12 w-12 text-green-600 mb-4" />
                <CardTitle>AI-Powered Summaries</CardTitle>
                <CardDescription>
                  AI canggih mengekstrak informasi penting dan membuat ringkasan singkat dengan poin-poin kunci.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <BookOpen className="h-12 w-12 text-purple-600 mb-4" />
                <CardTitle>Study-Friendly Format</CardTitle>
                <CardDescription>
                  Dapatkan ringkasan dalam format paragraf plus poin kunci untuk belajar dan referensi cepat.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <Zap className="h-12 w-12 text-orange-600 mb-4" />
                <CardTitle>Fast Processing</CardTitle>
                <CardDescription>
                  Analisis dokumen dan pembuatan ringkasan yang cepat untuk menghemat waktu berharga Anda.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <Users className="h-12 w-12 text-red-600 mb-4" />
                <CardTitle>User Management</CardTitle>
                <CardDescription>
                  Operasi CRUD lengkap untuk mengelola ringkasan Anda, edit, hapus, dan atur konten Anda.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <FileText className="h-12 w-12 text-indigo-600 mb-4" />
                <CardTitle>Export Options</CardTitle>
                <CardDescription>
                  Export ringkasan Anda dalam berbagai format untuk berbagi dan akses offline yang mudah.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Featured Projects</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {featuredProjects.map((project) => (
              <Card key={project.id} className="overflow-hidden hover:shadow-lg transition-shadow">
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
      <section id="experience" className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Experience</h2>
          <div className="space-y-8">
            {experiences.map((exp) => (
              <Card key={exp.id}>
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
                  <p className="text-gray-600 mb-4">{exp.description}</p>
                  <div>
                    <h4 className="font-medium mb-2">Key Activities:</h4>
                    <ul className="space-y-1">
                      {exp.achievements.map((achievement, achIndex) => (
                        <li key={achIndex} className="flex items-start text-sm text-gray-600">
                          <span className="inline-block w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
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

      {/* CTA Section */}
      <section className="py-20 px-4 bg-blue-600">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Ready to Transform Your Learning?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Bergabunglah dengan ribuan mahasiswa dan profesional yang sudah menggunakan {settings.siteName} untuk
            membuat sesi belajar mereka lebih efektif.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/summarizer">
              <Button size="lg" variant="secondary" className="text-lg px-8 py-3">
                <Upload className="mr-2 h-5 w-5" />
                Start Your First Summary
              </Button>
            </Link>
            <Button
              size="lg"
              variant="outline"
              className="text-lg px-8 py-3 bg-transparent text-white border-white hover:bg-white hover:text-blue-600"
              asChild
            >
              <Link href={`mailto:${settings.email}`}>
                <Mail className="mr-2 h-5 w-5" />
                Contact Me
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  )
}
