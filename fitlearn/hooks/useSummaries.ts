"use client"

import { useState, useEffect } from "react"
import { summaryStorage, type Summary, initializeData } from "@/lib/storage"

export function useSummaries() {
  const [summaries, setSummaries] = useState<Summary[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    initializeData()
    setSummaries(summaryStorage.getAll())
    setLoading(false)
  }, [])

  const createSummary = (summary: Omit<Summary, "id" | "createdAt" | "updatedAt">) => {
    const newSummary = summaryStorage.create(summary)
    setSummaries((prev) => [...prev, newSummary])
    return newSummary
  }

  const updateSummary = (id: string, updates: Partial<Summary>) => {
    const updated = summaryStorage.update(id, updates)
    if (updated) {
      setSummaries((prev) => prev.map((s) => (s.id === id ? updated : s)))
    }
    return updated
  }

  const deleteSummary = (id: string) => {
    const success = summaryStorage.delete(id)
    if (success) {
      setSummaries((prev) => prev.filter((s) => s.id !== id))
    }
    return success
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
    refreshSummaries: () => setSummaries(summaryStorage.getAll()),
  }
}
