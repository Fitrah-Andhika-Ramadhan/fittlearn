"use client"

import { useState, useEffect } from "react"
import type { Summary } from "@/lib/storage"

export function useSummaries() {
  const [summaries, setSummaries] = useState<Summary[]>([])
  const [loading, setLoading] = useState(true)

  const fetchSummaries = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/summaries")
      if (res.ok) {
        const data = await res.json()
        setSummaries(data.map((item: any) => ({
          id: item.id,
          title: item.title,
          summary: item.summary,
          keyPoints: JSON.parse(item.key_points || "[]"),
          fileType: item.file_type,
          fileName: item.file_name,
          fileSize: item.file_size,
          createdAt: item.created_at,
          updatedAt: item.updated_at
        })))
      }
    } catch (error) {
      console.error("Failed to fetch summaries:", error)
    } finally {
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
        fetchSummaries()
        return await res.json()
      }
    } catch (error) {
      console.error("Failed to create summary:", error)
    }
    return null
  }

  const updateSummary = async (id: string, updates: Partial<Summary>) => {
    try {
      const res = await fetch(`/api/summaries/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      })
      if (res.ok) {
        fetchSummaries()
        return await res.json()
      }
    } catch (error) {
      console.error("Failed to update summary:", error)
    }
    return null
  }

  const deleteSummary = async (id: string) => {
    try {
      const res = await fetch(`/api/summaries/${id}`, {
        method: "DELETE",
      })
      if (res.ok) {
        setSummaries((prev) => prev.filter((s) => s.id !== id))
        return true
      }
    } catch (error) {
      console.error("Failed to delete summary:", error)
    }
    return false
  }

  const getSummary = (id: string) => {
    return summaries.find((s) => s.id === id) || null
  }

  return {
    summaries,
    loading,
    createSummary,
    updateSummary,
    deleteSummary,
    getSummary,
    refreshSummaries: fetchSummaries,
  }
}
