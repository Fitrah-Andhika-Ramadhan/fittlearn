// Enhanced types for CMS system
export interface User {
  id: string
  email: string
  name: string
  role: "admin" | "user"
  avatar?: string
  createdAt: string
  updatedAt: string
}

export interface CMSProject {
  id: string
  title: string
  description: string
  longDescription?: string
  tech: string[]
  github: string
  demo: string
  image: string
  featured: boolean
  status: "draft" | "published" | "archived"
  category: string
  createdAt: string
  updatedAt: string
  views: number
  likes: number
}

export interface CMSExperience {
  id: string
  title: string
  company: string
  period: string
  description: string
  achievements: string[]
  current: boolean
  order: number
  createdAt: string
  updatedAt: string
}

export interface CMSSkill {
  id: string
  name: string
  level: number
  category: "frontend" | "backend" | "database" | "tools" | "other"
  icon?: string
  order: number
  createdAt: string
  updatedAt: string
}

export interface CMSEducation {
  id: string
  degree: string
  school: string
  period: string
  gpa?: string
  achievements: string[]
  current: boolean
  order: number
  createdAt: string
  updatedAt: string
}

export interface CMSSettings {
  id: string
  siteName: string
  siteDescription: string
  ownerName: string
  ownerTitle: string
  ownerBio: string
  email: string
  phone: string
  location: string
  github: string
  linkedin?: string
  twitter?: string
  avatar: string
  heroImage: string
  resumeUrl?: string
  updatedAt: string
}

export interface BlogPost {
  id: string
  title: string
  slug: string
  content: string
  excerpt: string
  image?: string
  status: "draft" | "published"
  tags: string[]
  category: string
  views: number
  likes: number
  createdAt: string
  updatedAt: string
}

export interface CMSAnalytics {
  id: string
  pageViews: number
  uniqueVisitors: number
  projectViews: Record<string, number>
  popularPages: Array<{ path: string; views: number }>
  date: string
}
