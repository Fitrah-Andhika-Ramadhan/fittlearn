"use client"

import { useState, useEffect } from "react"
import { cmsStorage } from "@/lib/cms-storage"
import type { CMSProject, CMSExperience, CMSSkill, CMSSettings, BlogPost } from "@/lib/types"

export function useCMSProjects() {
  const [projects, setProjects] = useState<CMSProject[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    cmsStorage.initializeCMSData()
    setProjects(cmsStorage.getProjects())
    setLoading(false)
  }, [])

  const createProject = (project: Omit<CMSProject, "id" | "createdAt" | "updatedAt" | "views" | "likes">) => {
    const newProject = cmsStorage.createProject(project)
    setProjects((prev) => [...prev, newProject])
    return newProject
  }

  const updateProject = (id: string, updates: Partial<CMSProject>) => {
    const updated = cmsStorage.updateProject(id, updates)
    if (updated) {
      setProjects((prev) => prev.map((p) => (p.id === id ? updated : p)))
    }
    return updated
  }

  const deleteProject = (id: string) => {
    const success = cmsStorage.deleteProject(id)
    if (success) {
      setProjects((prev) => prev.filter((p) => p.id !== id))
    }
    return success
  }

  const getFeaturedProjects = () => projects.filter((p) => p.featured && p.status === "published")
  const getPublishedProjects = () => projects.filter((p) => p.status === "published")

  return {
    projects,
    loading,
    createProject,
    updateProject,
    deleteProject,
    getFeaturedProjects,
    getPublishedProjects,
    refreshProjects: () => setProjects(cmsStorage.getProjects()),
  }
}

export function useCMSSkills() {
  const [skills, setSkills] = useState<CMSSkill[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    cmsStorage.initializeCMSData()
    setSkills(cmsStorage.getSkills())
    setLoading(false)
  }, [])

  const createSkill = (skill: Omit<CMSSkill, "id" | "createdAt" | "updatedAt">) => {
    const newSkill = cmsStorage.createSkill(skill)
    setSkills((prev) => [...prev, newSkill])
    return newSkill
  }

  const updateSkill = (id: string, updates: Partial<CMSSkill>) => {
    const updated = cmsStorage.updateSkill(id, updates)
    if (updated) {
      setSkills((prev) => prev.map((s) => (s.id === id ? updated : s)))
    }
    return updated
  }

  const deleteSkill = (id: string) => {
    const success = cmsStorage.deleteSkill(id)
    if (success) {
      setSkills((prev) => prev.filter((s) => s.id !== id))
    }
    return success
  }

  const getSkillsByCategory = (category: CMSSkill["category"]) => skills.filter((s) => s.category === category)

  return {
    skills,
    loading,
    createSkill,
    updateSkill,
    deleteSkill,
    getSkillsByCategory,
    refreshSkills: () => setSkills(cmsStorage.getSkills()),
  }
}

export function useCMSExperiences() {
  const [experiences, setExperiences] = useState<CMSExperience[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    cmsStorage.initializeCMSData()
    setExperiences(cmsStorage.getExperiences())
    setLoading(false)
  }, [])

  const createExperience = (experience: Omit<CMSExperience, "id" | "createdAt" | "updatedAt">) => {
    const newExperience = cmsStorage.createExperience(experience)
    setExperiences((prev) => [...prev, newExperience])
    return newExperience
  }

  const updateExperience = (id: string, updates: Partial<CMSExperience>) => {
    const updated = cmsStorage.updateExperience(id, updates)
    if (updated) {
      setExperiences((prev) => prev.map((e) => (e.id === id ? updated : e)))
    }
    return updated
  }

  const deleteExperience = (id: string) => {
    const success = cmsStorage.deleteExperience(id)
    if (success) {
      setExperiences((prev) => prev.filter((e) => e.id !== id))
    }
    return success
  }

  return {
    experiences,
    loading,
    createExperience,
    updateExperience,
    deleteExperience,
    refreshExperiences: () => setExperiences(cmsStorage.getExperiences()),
  }
}

export function useCMSSettings() {
  const [settings, setSettings] = useState<CMSSettings | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    cmsStorage.initializeCMSData()
    setSettings(cmsStorage.getSettings())
    setLoading(false)
  }, [])

  const updateSettings = (updates: Partial<CMSSettings>) => {
    const updated = cmsStorage.updateSettings(updates)
    setSettings(updated)
    return updated
  }

  return {
    settings,
    loading,
    updateSettings,
    refreshSettings: () => setSettings(cmsStorage.getSettings()),
  }
}

export function useCMSBlog() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setPosts(cmsStorage.getBlogPosts())
    setLoading(false)
  }, [])

  const createPost = (post: Omit<BlogPost, "id" | "createdAt" | "updatedAt" | "views" | "likes">) => {
    const newPost = cmsStorage.createBlogPost(post)
    setPosts((prev) => [...prev, newPost])
    return newPost
  }

  const updatePost = (id: string, updates: Partial<BlogPost>) => {
    const updated = cmsStorage.updateBlogPost(id, updates)
    if (updated) {
      setPosts((prev) => prev.map((p) => (p.id === id ? updated : p)))
    }
    return updated
  }

  const deletePost = (id: string) => {
    const success = cmsStorage.deleteBlogPost(id)
    if (success) {
      setPosts((prev) => prev.filter((p) => p.id !== id))
    }
    return success
  }

  const getPublishedPosts = () => posts.filter((p) => p.status === "published")

  return {
    posts,
    loading,
    createPost,
    updatePost,
    deletePost,
    getPublishedPosts,
    refreshPosts: () => setPosts(cmsStorage.getBlogPosts()),
  }
}
