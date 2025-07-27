import type { CMSProject, CMSExperience, CMSSkill, CMSEducation, CMSSettings, BlogPost, CMSAnalytics } from "./types"

// Enhanced CMS Storage System
class CMSStorage {
  private getStorageKey(type: string): string {
    return `fitlearned_cms_${type}`
  }

  private getData<T>(type: string): T[] {
    if (typeof window === "undefined") return []
    const data = localStorage.getItem(this.getStorageKey(type))
    return data ? JSON.parse(data) : []
  }

  private setData<T>(type: string, data: T[]): void {
    if (typeof window === "undefined") return
    localStorage.setItem(this.getStorageKey(type), JSON.stringify(data))
  }

  // Projects CRUD
  getProjects(): CMSProject[] {
    return this.getData<CMSProject>("projects")
  }

  createProject(project: Omit<CMSProject, "id" | "createdAt" | "updatedAt" | "views" | "likes">): CMSProject {
    const projects = this.getProjects()
    const newProject: CMSProject = {
      ...project,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      views: 0,
      likes: 0,
    }
    projects.push(newProject)
    this.setData("projects", projects)
    return newProject
  }

  updateProject(id: string, updates: Partial<CMSProject>): CMSProject | null {
    const projects = this.getProjects()
    const index = projects.findIndex((p) => p.id === id)
    if (index === -1) return null

    projects[index] = {
      ...projects[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    }
    this.setData("projects", projects)
    return projects[index]
  }

  deleteProject(id: string): boolean {
    const projects = this.getProjects()
    const filtered = projects.filter((p) => p.id !== id)
    if (filtered.length === projects.length) return false
    this.setData("projects", filtered)
    return true
  }

  // Experience CRUD
  getExperiences(): CMSExperience[] {
    return this.getData<CMSExperience>("experiences").sort((a, b) => a.order - b.order)
  }

  createExperience(experience: Omit<CMSExperience, "id" | "createdAt" | "updatedAt">): CMSExperience {
    const experiences = this.getExperiences()
    const newExperience: CMSExperience = {
      ...experience,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    experiences.push(newExperience)
    this.setData("experiences", experiences)
    return newExperience
  }

  updateExperience(id: string, updates: Partial<CMSExperience>): CMSExperience | null {
    const experiences = this.getExperiences()
    const index = experiences.findIndex((e) => e.id === id)
    if (index === -1) return null

    experiences[index] = {
      ...experiences[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    }
    this.setData("experiences", experiences)
    return experiences[index]
  }

  deleteExperience(id: string): boolean {
    const experiences = this.getExperiences()
    const filtered = experiences.filter((e) => e.id !== id)
    if (filtered.length === experiences.length) return false
    this.setData("experiences", filtered)
    return true
  }

  // Skills CRUD
  getSkills(): CMSSkill[] {
    return this.getData<CMSSkill>("skills").sort((a, b) => a.order - b.order)
  }

  createSkill(skill: Omit<CMSSkill, "id" | "createdAt" | "updatedAt">): CMSSkill {
    const skills = this.getSkills()
    const newSkill: CMSSkill = {
      ...skill,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    skills.push(newSkill)
    this.setData("skills", skills)
    return newSkill
  }

  updateSkill(id: string, updates: Partial<CMSSkill>): CMSSkill | null {
    const skills = this.getSkills()
    const index = skills.findIndex((s) => s.id === id)
    if (index === -1) return null

    skills[index] = {
      ...skills[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    }
    this.setData("skills", skills)
    return skills[index]
  }

  deleteSkill(id: string): boolean {
    const skills = this.getSkills()
    const filtered = skills.filter((s) => s.id !== id)
    if (filtered.length === skills.length) return false
    this.setData("skills", filtered)
    return true
  }

  // Education CRUD
  getEducation(): CMSEducation[] {
    return this.getData<CMSEducation>("education").sort((a, b) => a.order - b.order)
  }

  createEducation(education: Omit<CMSEducation, "id" | "createdAt" | "updatedAt">): CMSEducation {
    const educations = this.getEducation()
    const newEducation: CMSEducation = {
      ...education,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    educations.push(newEducation)
    this.setData("education", educations)
    return newEducation
  }

  updateEducation(id: string, updates: Partial<CMSEducation>): CMSEducation | null {
    const educations = this.getEducation()
    const index = educations.findIndex((e) => e.id === id)
    if (index === -1) return null

    educations[index] = {
      ...educations[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    }
    this.setData("education", educations)
    return educations[index]
  }

  deleteEducation(id: string): boolean {
    const educations = this.getEducation()
    const filtered = educations.filter((e) => e.id !== id)
    if (filtered.length === educations.length) return false
    this.setData("education", filtered)
    return true
  }

  // Settings
  getSettings(): CMSSettings | null {
    const settings = this.getData<CMSSettings>("settings")
    return settings.length > 0 ? settings[0] : null
  }

  updateSettings(settings: Partial<CMSSettings>): CMSSettings {
    const currentSettings = this.getSettings()
    const updatedSettings: CMSSettings = {
      ...currentSettings,
      ...settings,
      id: currentSettings?.id || "1",
      updatedAt: new Date().toISOString(),
    } as CMSSettings

    this.setData("settings", [updatedSettings])
    return updatedSettings
  }

  // Blog Posts CRUD
  getBlogPosts(): BlogPost[] {
    return this.getData<BlogPost>("blog_posts")
  }

  createBlogPost(post: Omit<BlogPost, "id" | "createdAt" | "updatedAt" | "views" | "likes">): BlogPost {
    const posts = this.getBlogPosts()
    const newPost: BlogPost = {
      ...post,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      views: 0,
      likes: 0,
    }
    posts.push(newPost)
    this.setData("blog_posts", posts)
    return newPost
  }

  updateBlogPost(id: string, updates: Partial<BlogPost>): BlogPost | null {
    const posts = this.getBlogPosts()
    const index = posts.findIndex((p) => p.id === id)
    if (index === -1) return null

    posts[index] = {
      ...posts[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    }
    this.setData("blog_posts", posts)
    return posts[index]
  }

  deleteBlogPost(id: string): boolean {
    const posts = this.getBlogPosts()
    const filtered = posts.filter((p) => p.id !== id)
    if (filtered.length === posts.length) return false
    this.setData("blog_posts", filtered)
    return true
  }

  // Analytics
  getAnalytics(): CMSAnalytics[] {
    return this.getData<CMSAnalytics>("analytics")
  }

  updateAnalytics(data: Partial<CMSAnalytics>): void {
    const analytics = this.getAnalytics()
    const today = new Date().toISOString().split("T")[0]
    const todayIndex = analytics.findIndex((a) => a.date === today)

    if (todayIndex >= 0) {
      analytics[todayIndex] = {
        ...analytics[todayIndex],
        ...data,
        date: today,
      }
    } else {
      analytics.push({
        id: Date.now().toString(),
        pageViews: 0,
        uniqueVisitors: 0,
        projectViews: {},
        popularPages: [],
        ...data,
        date: today,
      })
    }

    this.setData("analytics", analytics)
  }

  // Initialize with sample data
  initializeCMSData(): void {
    if (typeof window === "undefined") return

    // Initialize settings first
    if (!this.getSettings()) {
      this.updateSettings({
        siteName: "FitLearned",
        siteDescription: "AI-powered document summarization platform for students and professionals",
        ownerName: "Fitrah Andhika Ramadhan",
        ownerTitle: "Frontend Developer & AI Enthusiast",
        ownerBio:
          "Mahasiswa S1 Sistem Informasi di Telkom University yang passionate dalam mengembangkan solusi teknologi untuk memecahkan masalah nyata. Sedang belajar Data Analytics & Software Development dengan AI, berfokus pada frontend development dan teknologi web modern.",
        email: "fitrah.andhika@email.com",
        phone: "+62 877 6028 7039",
        location: "Bandung, Indonesia",
        github: "https://github.com/Fitrah-Andhika-Ramadhan/",
        avatar: "/placeholder.svg?height=150&width=150",
        heroImage: "/placeholder.svg?height=400&width=500",
      })
    }

    // Initialize projects if empty
    if (this.getProjects().length === 0) {
      const sampleProjects = [
        {
          title: "FitLearned - AI Document Processor",
          description:
            "Platform untuk merangkum dokumen PDF dan Word menggunakan AI, membantu mahasiswa dan profesional menghemat waktu belajar.",
          longDescription:
            "FitLearned adalah platform AI-powered yang dirancang khusus untuk membantu mahasiswa dan profesional dalam memproses dokumen dengan lebih efisien. Aplikasi ini menggunakan teknologi AI canggih untuk mengekstrak informasi penting dari dokumen PDF dan Word, kemudian mengubahnya menjadi ringkasan yang mudah dipahami beserta poin-poin kunci.",
          tech: ["Next.js", "TypeScript", "AI Integration", "Tailwind CSS", "React"],
          github: "https://github.com/Fitrah-Andhika-Ramadhan/fitlearned",
          demo: "/summarizer",
          image: "/placeholder.svg?height=200&width=300&text=FitLearned",
          featured: true,
          status: "published" as const,
          category: "Web Application",
        },
        {
          title: "E-Learning Management System",
          description:
            "Sistem manajemen pembelajaran online dengan fitur video streaming, quiz interaktif, dan tracking progress.",
          longDescription:
            "Sistem LMS lengkap yang dibangun dengan Laravel dan Vue.js, menyediakan platform pembelajaran online yang komprehensif dengan fitur-fitur modern seperti video streaming, quiz interaktif, tracking progress siswa, dan dashboard analytics untuk instructor.",
          tech: ["Laravel", "Vue.js", "MySQL", "Redis", "PHP"],
          github: "https://github.com/Fitrah-Andhika-Ramadhan/elearning-lms",
          demo: "https://elearning-lms-i3jk.vercel.app/",
          image: "/placeholder.svg?height=200&width=300&text=E-Learning",
          featured: true,
          status: "published" as const,
          category: "Web Application",
        },
        {
          title: "Smart Campus Mobile App",
          description:
            "Aplikasi mobile untuk kampus dengan fitur jadwal kuliah, absensi digital, dan notifikasi akademik.",
          longDescription:
            "Aplikasi mobile yang memudahkan mahasiswa dalam mengakses informasi kampus, melihat jadwal kuliah, melakukan absensi digital, dan menerima notifikasi penting dari kampus.",
          tech: ["React Native", "Firebase", "Node.js", "Express"],
          github: "https://github.com/Fitrah-Andhika-Ramadhan/smart-campus",
          demo: "#",
          image: "/placeholder.svg?height=200&width=300&text=Smart+Campus",
          featured: false,
          status: "published" as const,
          category: "Mobile Application",
        },
      ]

      sampleProjects.forEach((project) => this.createProject(project))
    }

    // Initialize skills if empty
    if (this.getSkills().length === 0) {
      const sampleSkills = [
        // Frontend Skills
        { name: "JavaScript", level: 90, category: "frontend" as const, order: 1 },
        { name: "TypeScript", level: 85, category: "frontend" as const, order: 2 },
        { name: "React", level: 88, category: "frontend" as const, order: 3 },
        { name: "Next.js", level: 85, category: "frontend" as const, order: 4 },
        { name: "Vue.js", level: 80, category: "frontend" as const, order: 5 },
        { name: "HTML5", level: 95, category: "frontend" as const, order: 6 },
        { name: "CSS3", level: 90, category: "frontend" as const, order: 7 },
        { name: "Tailwind CSS", level: 88, category: "frontend" as const, order: 8 },

        // Backend Skills
        { name: "Node.js", level: 82, category: "backend" as const, order: 9 },
        { name: "Laravel", level: 80, category: "backend" as const, order: 10 },
        { name: "PHP", level: 78, category: "backend" as const, order: 11 },
        { name: "Python", level: 75, category: "backend" as const, order: 12 },
        { name: "Express.js", level: 80, category: "backend" as const, order: 13 },

        // Database Skills
        { name: "MySQL", level: 85, category: "database" as const, order: 14 },
        { name: "PostgreSQL", level: 80, category: "database" as const, order: 15 },
        { name: "MongoDB", level: 78, category: "database" as const, order: 16 },
        { name: "Redis", level: 70, category: "database" as const, order: 17 },

        // Tools & Others
        { name: "Git", level: 90, category: "tools" as const, order: 18 },
        { name: "Docker", level: 70, category: "tools" as const, order: 19 },
        { name: "AWS", level: 65, category: "tools" as const, order: 20 },
        { name: "Figma", level: 75, category: "tools" as const, order: 21 },
      ]

      sampleSkills.forEach((skill) => this.createSkill(skill))
    }

    // Initialize experiences if empty
    if (this.getExperiences().length === 0) {
      const sampleExperiences = [
        {
          title: "Frontend Developer Student",
          company: "Telkom University",
          period: "2021 - Present",
          description:
            "Currently studying Data Analytics & Software Development with AI, focusing on frontend development and modern web technologies.",
          achievements: [
            "Learning React, Next.js, and modern JavaScript frameworks",
            "Developing AI-integrated web applications like FitLearned",
            "Building responsive and user-friendly interfaces",
            "Participating in programming communities and hackathons",
            "Focus on frontend development and AI integration",
          ],
          current: true,
          order: 1,
        },
        {
          title: "Freelance Web Developer",
          company: "Various Clients",
          period: "Jan 2023 - Present",
          description:
            "Mengerjakan berbagai proyek web development untuk UMKM dan startup lokal, membantu mereka membangun presence online yang kuat.",
          achievements: [
            "Menyelesaikan 10+ proyek web development",
            "Membantu klien meningkatkan online presence dan penjualan",
            "Memberikan maintenance dan support berkelanjutan",
            "Menggunakan teknologi modern seperti React, Laravel, dan Vue.js",
            "Membangun aplikasi e-commerce dan company profile",
          ],
          current: true,
          order: 2,
        },
      ]

      sampleExperiences.forEach((exp) => this.createExperience(exp))
    }

    // Initialize education if empty
    if (this.getEducation().length === 0) {
      const sampleEducation = [
        {
          degree: "S1 Sistem Informasi",
          school: "Telkom University",
          period: "2021 - 2025",
          gpa: "3.75",
          achievements: [
            "Currently studying Data Analytics & Software Development with AI",
            "Active in programming communities and hackathons",
            "Focus on frontend development and AI integration",
            "Relevant coursework: Database Systems, Web Programming, AI & Machine Learning",
          ],
          current: true,
          order: 1,
        },
      ]

      sampleEducation.forEach((edu) => this.createEducation(edu))
    }
  }
}

export const cmsStorage = new CMSStorage()
