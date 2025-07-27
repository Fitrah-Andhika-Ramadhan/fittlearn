import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Brain, Github, ExternalLink, Mail, Phone, MapPin, Calendar, Award, BookOpen, Briefcase } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function PortfolioPage() {
  const skills = [
    { name: "JavaScript", level: 90 },
    { name: "TypeScript", level: 85 },
    { name: "React/Next.js", level: 88 },
    { name: "Node.js", level: 82 },
    { name: "Laravel/PHP", level: 80 },
    { name: "Python", level: 75 },
    { name: "MySQL/PostgreSQL", level: 85 },
    { name: "MongoDB", level: 78 },
    { name: "Docker", level: 70 },
    { name: "AWS/Cloud", level: 72 },
  ]

  const projects = [
    {
      title: "FitLearned - AI Document Processor",
      description:
        "Platform untuk merangkum dokumen PDF dan Word menggunakan AI, membantu mahasiswa dan profesional menghemat waktu belajar.",
      tech: ["Next.js", "TypeScript", "AI Integration", "Tailwind CSS"],
      github: "https://github.com/Fitrah-Andhika-Ramadhan/fitlearned",
      demo: "/summarizer",
      image: "/placeholder.svg?height=200&width=300",
    },
    {
      title: "E-Learning Management System",
      description:
        "Sistem manajemen pembelajaran online dengan fitur video streaming, quiz interaktif, dan tracking progress.",
      tech: ["Laravel", "Vue.js", "MySQL", "Redis"],
      github: "https://github.com/Fitrah-Andhika-Ramadhan/elearning-lms",
      demo: "https://elearning-lms-i3jk.vercel.app/",
      image: "/placeholder.svg?height=200&width=300",
    },
    {
      title: "Smart Campus Mobile App",
      description: "Aplikasi mobile untuk kampus dengan fitur jadwal kuliah, absensi digital, dan notifikasi akademik.",
      tech: ["React Native", "Firebase", "Node.js", "Express"],
      github: "https://github.com/Fitrah-Andhika-Ramadhan/smart-campus",
      demo: "#",
      image: "/placeholder.svg?height=200&width=300",
    },
    {
      title: "Inventory Management Dashboard",
      description: "Dashboard untuk manajemen inventori dengan real-time analytics dan automated reporting.",
      tech: ["React", "Python", "FastAPI", "PostgreSQL"],
      github: "https://github.com/Fitrah-Andhika-Ramadhan/inventory-dashboard",
      demo: "#",
      image: "/placeholder.svg?height=200&width=300",
    },
  ]

  const experiences = [
    {
      title: "Frontend Developer Student",
      company: "Telkom University",
      period: "2021 - Present",
      description:
        "Currently studying Data Analytics & Software Development with AI, focusing on frontend development and modern web technologies.",
      achievements: [
        "Learning React, Next.js, and modern JavaScript frameworks",
        "Developing AI-integrated web applications",
        "Building responsive and user-friendly interfaces",
      ],
    },
    {
      title: "Freelance Web Developer",
      company: "Various Clients",
      period: "Jan 2023 - Present",
      description: "Mengerjakan berbagai proyek web development untuk UMKM dan startup lokal.",
      achievements: [
        "Menyelesaikan 10+ proyek web development",
        "Membantu klien meningkatkan online presence",
        "Memberikan maintenance dan support berkelanjutan",
      ],
    },
  ]

  const education = [
    {
      degree: "Sarjana Teknik Informatika",
      school: "Telkom University",
      period: "2021 - 2025",
      gpa: "3.75/4.00",
      achievements: [
        "Currently studying Data Analytics & Software Development with AI",
        "Active in programming communities and hackathons",
        "Focus on frontend development and AI integration",
      ],
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b bg-white sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <Brain className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">FitLearned</span>
            </Link>
            <div className="flex items-center space-x-4">
              <Link href="/files">
                <Button variant="outline">My Files</Button>
              </Link>
              <Link href="/summarizer">
                <Button>Summarizer</Button>
              </Link>
            </div>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-8">
              <Image
                src="/placeholder.svg?height=150&width=150"
                alt="Profile Picture"
                width={150}
                height={150}
                className="rounded-full mx-auto mb-6 border-4 border-white shadow-lg"
              />
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Fitrah Andhika Ramadhan</h1>
              <p className="text-xl text-gray-600 mb-6">Passionate Frontend Developer & AI Enthusiast</p>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
                Mahasiswa Teknik Informatika di Telkom University yang passionate dalam mengembangkan solusi teknologi
                untuk memecahkan masalah nyata. Sedang belajar Data Analytics & Software Development dengan AI, berfokus
                pada frontend development dan teknologi web modern.
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700" asChild>
                <Link href="mailto:fitrah.andhika@email.com">
                  <Mail className="mr-2 h-5 w-5" />
                  Contact Me
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="bg-transparent" asChild>
                <Link href="https://github.com/Fitrah-Andhika-Ramadhan/" target="_blank" rel="noopener noreferrer">
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
            </div>

            <div className="flex flex-wrap justify-center gap-6 text-gray-600">
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-2" />
                Bandung, Indonesia
              </div>
              <div className="flex items-center">
                <Phone className="h-4 w-4 mr-2" />
                +62 877 6028 7039
              </div>
              <div className="flex items-center">
                <Mail className="h-4 w-4 mr-2" />
                fitrah.andhika@email.com
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Technical Skills</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {skills.map((skill, index) => (
              <div key={index} className="space-y-2">
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
      </section>

      {/* Projects Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Featured Projects</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {projects.map((project, index) => (
              <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow">
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
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Experience & Education</h2>
          <div className="space-y-8">
            {experiences.map((exp, index) => (
              <Card key={index}>
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

      {/* Education Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Education</h2>
          <div className="space-y-6">
            {education.map((edu, index) => (
              <Card key={index}>
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
                    <h4 className="font-medium mb-2">Current Focus:</h4>
                    <ul className="space-y-1">
                      {edu.achievements.map((achievement, achIndex) => (
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

      {/* Contact Section */}
      <section className="py-16 px-4 bg-blue-600">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Let's Connect & Collaborate</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
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
