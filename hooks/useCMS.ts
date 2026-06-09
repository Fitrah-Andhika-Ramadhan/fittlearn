"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import type { CMSProject, CMSExperience, CMSSkill, CMSSettings, BlogPost } from "@/lib/types"

// ─────────────────────────────────────────
// Simple in-memory cache with TTL (5 min)
// ─────────────────────────────────────────
const CACHE_TTL = 5 * 60 * 1000 // 5 minutes

const cache: Record<string, { data: any; timestamp: number }> = {}

function getCached(key: string) {
  const entry = cache[key]
  if (!entry) return null
  if (Date.now() - entry.timestamp > CACHE_TTL) {
    delete cache[key]
    return null
  }
  return entry.data
}

function setCache(key: string, data: any) {
  cache[key] = { data, timestamp: Date.now() }
}

function invalidateCache(key: string) {
  delete cache[key]
}

// ─────────────────────────────────────────
// Fetch with deduplication (prevents
// multiple simultaneous calls for same URL)
// ─────────────────────────────────────────
const inflight: Record<string, Promise<any>> = {}

async function fetchDedup(url: string) {
  if (inflight[url]) return inflight[url]
  inflight[url] = fetch(url, { cache: "no-store" })
    .then((r) => r.json())
    .finally(() => delete inflight[url])
  return inflight[url]
}

// ─────────────────────────────────────────
// Sync hook — debounced so rapid events
// don't trigger multiple fetches
// ─────────────────────────────────────────
function useCMSSync() {
  const [syncTrigger, setSyncTrigger] = useState(0)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const handle = () => {
      if (timerRef.current) clearTimeout(timerRef.current)
      timerRef.current = setTimeout(() => {
        setSyncTrigger((prev) => prev + 1)
      }, 300) // debounce 300ms
    }
    window.addEventListener("cms-data-changed", handle)
    return () => {
      window.removeEventListener("cms-data-changed", handle)
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [])

  return syncTrigger
}

// ─────────────────────────────────────────
// Projects
// ─────────────────────────────────────────
export function useCMSProjects() {
  const [projects, setProjects] = useState<CMSProject[]>([])
  const [loading, setLoading] = useState(true)
  const syncTrigger = useCMSSync()
  const isFirstLoad = useRef(true)

  const fetchProjects = useCallback(async (force = false) => {
    const cacheKey = "projects"
    if (!force) {
      const cached = getCached(cacheKey)
      if (cached) {
        setProjects(cached)
        setLoading(false)
        return
      }
    }
    // Only show loading spinner on first load
    if (isFirstLoad.current) setLoading(true)
    try {
      const data = await fetchDedup("/api/projects")
      setProjects(data)
      setCache(cacheKey, data)
    } catch (err) {
      console.error("Projects fetch error:", err)
    } finally {
      setLoading(false)
      isFirstLoad.current = false
    }
  }, [])

  useEffect(() => {
    fetchProjects(syncTrigger > 0) // force=true on sync events
  }, [fetchProjects, syncTrigger])

  const createProject = async (project: any) => {
    const res = await fetch("/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(project),
    })
    if (!res.ok) {
      throw new Error("Failed to create project")
    }
    const newProject = await res.json()
    invalidateCache("projects")
    setProjects((prev) => [...prev, newProject])
    window.dispatchEvent(new CustomEvent("cms-data-changed"))
    return newProject
  }

  const updateProject = async (id: string, updates: any) => {
    const res = await fetch(`/api/projects/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    })
    if (!res.ok) {
      throw new Error("Failed to update project")
    }
    const updated = await res.json()
    invalidateCache("projects")
    setProjects((prev) => prev.map((p) => (p.id === id ? updated : p)))
    window.dispatchEvent(new CustomEvent("cms-data-changed"))
    return updated
  }

  const deleteProject = async (id: string) => {
    const res = await fetch(`/api/projects/${id}`, { method: "DELETE" })
    if (res.ok) {
      invalidateCache("projects")
      setProjects((prev) => prev.filter((p) => p.id !== id))
      window.dispatchEvent(new CustomEvent("cms-data-changed"))
      return true
    }
    return false
  }

  return {
    projects,
    loading,
    createProject,
    updateProject,
    deleteProject,
    getFeaturedProjects: () => projects.filter((p) => p.is_featured && p.status === "published"),
    getPublishedProjects: () => projects.filter((p) => p.status === "published"),
    refreshProjects: () => fetchProjects(true),
  }
}

// ─────────────────────────────────────────
// Skills
// ─────────────────────────────────────────
export function useCMSSkills() {
  const [skills, setSkills] = useState<CMSSkill[]>([])
  const [loading, setLoading] = useState(true)
  const syncTrigger = useCMSSync()
  const isFirstLoad = useRef(true)

  const fetchSkills = useCallback(async (force = false) => {
    const cacheKey = "skills"
    if (!force) {
      const cached = getCached(cacheKey)
      if (cached) {
        setSkills(cached)
        setLoading(false)
        return
      }
    }
    if (isFirstLoad.current) setLoading(true)
    try {
      const data = await fetchDedup("/api/skills")
      setSkills(data)
      setCache(cacheKey, data)
    } catch (err) {
      console.error("Skills fetch error:", err)
    } finally {
      setLoading(false)
      isFirstLoad.current = false
    }
  }, [])

  useEffect(() => {
    fetchSkills(syncTrigger > 0)
  }, [fetchSkills, syncTrigger])

  const createSkill = async (skill: any) => {
    const res = await fetch("/api/skills", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(skill),
    })
    const newSkill = await res.json()
    invalidateCache("skills")
    setSkills((prev) => [...prev, newSkill])
    window.dispatchEvent(new CustomEvent("cms-data-changed"))
    return newSkill
  }

  const updateSkill = async (id: string, updates: any) => {
    const res = await fetch(`/api/skills/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    })
    const updated = await res.json()
    invalidateCache("skills")
    setSkills((prev) => prev.map((s) => (s.id === id ? updated : s)))
    window.dispatchEvent(new CustomEvent("cms-data-changed"))
    return updated
  }

  const deleteSkill = async (id: string) => {
    const res = await fetch(`/api/skills/${id}`, { method: "DELETE" })
    if (res.ok) {
      invalidateCache("skills")
      setSkills((prev) => prev.filter((s) => s.id !== id))
      window.dispatchEvent(new CustomEvent("cms-data-changed"))
      return true
    }
    return false
  }

  return {
    skills,
    loading,
    createSkill,
    updateSkill,
    deleteSkill,
    getSkillsByCategory: (category: string) => skills.filter((s) => s.category === category),
    refreshSkills: () => fetchSkills(true),
  }
}

// ─────────────────────────────────────────
// Experiences
// ─────────────────────────────────────────
export function useCMSExperiences() {
  const [experiences, setExperiences] = useState<CMSExperience[]>([])
  const [loading, setLoading] = useState(true)
  const syncTrigger = useCMSSync()
  const isFirstLoad = useRef(true)

  const fetchExperiences = useCallback(async (force = false) => {
    const cacheKey = "experiences"
    if (!force) {
      const cached = getCached(cacheKey)
      if (cached) {
        setExperiences(cached)
        setLoading(false)
        return
      }
    }
    if (isFirstLoad.current) setLoading(true)
    try {
      const data = await fetchDedup("/api/experience")
      setExperiences(data)
      setCache(cacheKey, data)
    } catch (err) {
      console.error("Experiences fetch error:", err)
    } finally {
      setLoading(false)
      isFirstLoad.current = false
    }
  }, [])

  useEffect(() => {
    fetchExperiences(syncTrigger > 0)
  }, [fetchExperiences, syncTrigger])

  const createExperience = async (experience: any) => {
    const res = await fetch("/api/experience", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(experience),
    })
    const newExp = await res.json()
    invalidateCache("experiences")
    setExperiences((prev) => [...prev, newExp])
    window.dispatchEvent(new CustomEvent("cms-data-changed"))
    return newExp
  }

  const updateExperience = async (id: string, updates: any) => {
    const res = await fetch(`/api/experience/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    })
    const updated = await res.json()
    invalidateCache("experiences")
    setExperiences((prev) => prev.map((e) => (e.id === id ? updated : e)))
    window.dispatchEvent(new CustomEvent("cms-data-changed"))
    return updated
  }

  const deleteExperience = async (id: string) => {
    const res = await fetch(`/api/experience/${id}`, { method: "DELETE" })
    if (res.ok) {
      invalidateCache("experiences")
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
    refreshExperiences: () => fetchExperiences(true),
  }
}

// ─────────────────────────────────────────
// Settings / Profile
// ─────────────────────────────────────────
export function useCMSSettings() {
  const [settings, setSettings] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const cached = getCached("settings")
    if (cached) {
      setSettings(cached)
      setLoading(false)
      return
    }
    fetch("/api/profile")
      .then((r) => r.json())
      .then((data) => {
        setSettings(data)
        setCache("settings", data)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const updateSettings = async (updates: any) => {
    const res = await fetch("/api/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    })
    const updated = await res.json()
    setSettings(updated)
    setCache("settings", updated)
    return updated
  }

  return { settings, loading, updateSettings, refreshSettings: () => {} }
}

// ─────────────────────────────────────────
// Blog (mock — no DB model yet)
// ─────────────────────────────────────────
export function useCMSBlog() {
  const [posts, setPosts] = useState<BlogPost[]>([])

  return {
    posts,
    loading: false,
    createPost: (_: any) => Promise.resolve(null),
    updatePost: (_id: string, _updates: any) => Promise.resolve(null),
    deletePost: (_id: string) => Promise.resolve(false),
    getPublishedPosts: () => [],
    refreshPosts: () => {},
  }
}
