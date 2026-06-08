"use client"

import { useState, useEffect, useRef } from "react"
import type { Summary } from "@/lib/storage"

// Simple in-module cache
let summaryCache: Summary[] | null = null
let summaryFetchPromise: Promise<Summary[]> | null = null

export function useSummaries() {
  const [summaries, setSummaries] = useState<Summary[]>(summaryCache ?? [])
  const [loading, setLoading] = useState(summaryCache === null)
  const mountedRef = useRef(true)

  useEffect(() => {
    mountedRef.current = true
    return () => { mountedRef.current = false }
  }, [])

  const fetchSummaries = async (showLoading = false) => {
    // If already cached, use cache immediately
    if (summaryCache && !showLoading) {
      setSummaries(summaryCache)
      setLoading(false)
      return
    }

    // Deduplicate in-flight requests
    if (!summaryFetchPromise) {
      summaryFetchPromise = fetch("/api/summaries")
        .then((res) => {
          if (!res.ok) return []
          return res.json()
        })
        .then((data) => {
          return data.map((item: any) => ({
            id: item.id,
            title: item.title,
            summary: item.summary,
            keyPoints: typeof item.key_points === "string"
              ? JSON.parse(item.key_points || "[]")
              : (item.key_points ?? []),
            fileType: item.file_type,
            fileName: item.file_name,
            fileSize: item.file_size,
            createdAt: item.created_at,
            updatedAt: item.updated_at,
          }))
        })
        .catch((err) => {
          console.error("Failed to fetch summaries:", err)
          return summaryCache ?? []
        })
        .finally(() => {
          summaryFetchPromise = null
        })
    }

    if (showLoading) setLoading(true)

    const result = await summaryFetchPromise
    summaryCache = result

    if (mountedRef.current) {
      setSummaries(result)
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSummaries()
  }, [])

  const createSummary = async (summary: Omit<Summary, "id" | "createdAt" | "updatedAt">) => {
    try {
      const res = await fetch("/api/summaries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(summary),
      })
      if (res.ok) {
        const created = await res.json()
        summaryCache = null // invalidate
        await fetchSummaries()
        return created
      }
    } catch (error) {
      console.error("Failed to create summary:", error)
    }
    return null
  }

  const updateSummary = async (id: string, updates: Partial<Summary>) => {
    // Optimistic update
    setSummaries((prev) => prev.map((s) => s.id === id ? { ...s, ...updates } : s))
    if (summaryCache) summaryCache = summaryCache.map((s) => s.id === id ? { ...s, ...updates } : s)

    try {
      const res = await fetch(`/api/summaries/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      })
      if (res.ok) return await res.json()
    } catch (error) {
      console.error("Failed to update summary:", error)
      // Revert on error
      summaryCache = null
      await fetchSummaries()
    }
    return null
  }

  const deleteSummary = async (id: string) => {
    // Optimistic delete
    setSummaries((prev) => prev.filter((s) => s.id !== id))
    if (summaryCache) summaryCache = summaryCache.filter((s) => s.id !== id)

    try {
      const res = await fetch(`/api/summaries/${id}`, { method: "DELETE" })
      return res.ok
    } catch (error) {
      console.error("Failed to delete summary:", error)
      // Revert on error
      summaryCache = null
      await fetchSummaries()
      return false
    }
  }

  const getSummary = (id: string) => summaries.find((s) => s.id === id) || null

  return {
    summaries,
    loading,
    createSummary,
    updateSummary,
    deleteSummary,
    getSummary,
    refreshSummaries: () => {
      summaryCache = null
      fetchSummaries(true)
    },
  }
}
