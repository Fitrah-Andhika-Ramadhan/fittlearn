"use client"

import { useState, useEffect } from "react"
import type { CMSProject, CMSExperience, CMSSkill, CMSSettings, BlogPost } from "@/lib/types"

// Custom hook for real-time CMS data synchronization
function useCMSSync() {
  const [syncTrigger, setSyncTrigger] = useState(0)

  useEffect(() => {
    const handleCMSDataChange = () => {
      setSyncTrigger((prev) => prev + 1)
    }

    window.addEventListener("cms-data-changed", handleCMSDataChange)

    return () => {
      window.removeEventListener("cms-data-changed", handleCMSDataChange)
    }
  }, [])

  return syncTrigger
}

export function useCMSProjects() {
  const [projects, setProjects] = useState<CMSProject[]>([])
  const [loading, setLoading] = useState(true)
  const syncTrigger = useCMSSync()

  const fetchProjects = async () => {
    try {
      const res = await fetch('/api/projects')
      const data = await res.json()
      setProjects(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProjects()
  }, [syncTrigger])

  const createProject = async (project: any) => {
    const res = await fetch('/api/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(project)
    })
    const newProject = await res.json()
    setProjects((prev) => [...prev, newProject])
    window.dispatchEvent(new CustomEvent("cms-data-changed"))
    return newProject
  }

  const updateProject = async (id: string, updates: any) => {
    const res = await fetch(`/api/projects/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    })
    const updated = await res.json()
    setProjects((prev) => prev.map((p) => (p.id === id ? updated : p)))
    window.dispatchEvent(new CustomEvent("cms-data-changed"))
    return updated
  }

  const deleteProject = async (id: string) => {
    const res = await fetch(`/api/projects/${id}`, { method: 'DELETE' })
    if (res.ok) {
      setProjects((prev) => prev.filter((p) => p.id !== id))
      window.dispatchEvent(new CustomEvent("cms-data-changed"))
      return true
    }
    return false
  }

  const getFeaturedProjects = () => projects.filter((p) => p.is_featured && p.status === "published")
  const getPublishedProjects = () => projects.filter((p) => p.status === "published")

  return {
    projects,
    loading,
    createProject,
    updateProject,
    deleteProject,
    getFeaturedProjects,
    getPublishedProjects,
    refreshProjects: fetchProjects,
  }
}

export function useCMSSkills() {
  const [skills, setSkills] = useState<CMSSkill[]>([])
  const [loading, setLoading] = useState(true)
  const syncTrigger = useCMSSync()

  const fetchSkills = async () => {
    try {
      const res = await fetch('/api/skills')
      const data = await res.json()
      setSkills(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSkills()
  }, [syncTrigger])

  const createSkill = async (skill: any) => {
    const res = await fetch('/api/skills', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(skill)
    })
    const newSkill = await res.json()
    setSkills((prev) => [...prev, newSkill])
    window.dispatchEvent(new CustomEvent("cms-data-changed"))
    return newSkill
  }

  const updateSkill = async (id: string, updates: any) => {
    const res = await fetch(`/api/skills/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    })
    const updated = await res.json()
    setSkills((prev) => prev.map((s) => (s.id === id ? updated : s)))
    window.dispatchEvent(new CustomEvent("cms-data-changed"))
    return updated
  }

  const deleteSkill = async (id: string) => {
    const res = await fetch(`/api/skills/${id}`, { method: 'DELETE' })
    if (res.ok) {
      setSkills((prev) => prev.filter((s) => s.id !== id))
      window.dispatchEvent(new CustomEvent("cms-data-changed"))
      return true
    }
    return false
  }

  const getSkillsByCategory = (category: string) => skills.filter((s) => s.category === category)

  return {
    skills,
    loading,
    createSkill,
    updateSkill,
    deleteSkill,
    getSkillsByCategory,
    refreshSkills: fetchSkills,
  }
}

export function useCMSExperiences() {
  const [experiences, setExperiences] = useState<CMSExperience[]>([])
  const [loading, setLoading] = useState(true)
  const syncTrigger = useCMSSync()

  const fetchExperiences = async () => {
    try {
      const res = await fetch('/api/experience')
      const data = await res.json()
      setExperiences(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchExperiences()
  }, [syncTrigger])

  const createExperience = async (experience: any) => {
    const res = await fetch('/api/experience', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(experience)
    })
    const newExperience = await res.json()
    setExperiences((prev) => [...prev, newExperience])
    window.dispatchEvent(new CustomEvent("cms-data-changed"))
    return newExperience
  }

  const updateExperience = async (id: string, updates: any) => {
    const res = await fetch(`/api/experience/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    })
    const updated = await res.json()
    setExperiences((prev) => prev.map((e) => (e.id === id ? updated : e)))
    window.dispatchEvent(new CustomEvent("cms-data-changed"))
    return updated
  }

  const deleteExperience = async (id: string) => {
    const res = await fetch(`/api/experience/${id}`, { method: 'DELETE' })
    if (res.ok) {
      setExperiences((prev) => prev.filter((e) => e.id !== id))
      window.dispatchEvent(new CustomEvent("cms-data-changed"))
      return true
    }
    return false
  }

  return {
    experiences,
    loading,
    createExperience,
    updateExperience,
    deleteExperience,
    refreshExperiences: fetchExperiences,
  }
}

export function useCMSSettings() {
  const [settings, setSettings] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)
  const syncTrigger = useCMSSync()

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/profile')
      if (res.ok) {
        const data = await res.json()
        setSettings(data)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSettings()
  }, [syncTrigger])

  const updateSettings = async (updates: any) => {
    const res = await fetch('/api/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    })
    const updated = await res.json()
    setSettings(updated)
    window.dispatchEvent(new CustomEvent("cms-data-changed"))
    return updated
  }

  return {
    settings,
    loading,
    updateSettings,
    refreshSettings: fetchSettings,
  }
}

export function useCMSBlog() {
  // Temporary mock for blog posts until DB model is added
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(false)

  return {
    posts,
    loading,
    createPost: () => {},
    updatePost: () => {},
    deletePost: () => false,
    getPublishedPosts: () => [],
    refreshPosts: () => {},
  }
}
