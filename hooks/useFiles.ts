"use client"

import { useState, useEffect } from "react"
import type { StudyFile } from "@/lib/storage"

export function useFiles() {
  const [files, setFiles] = useState<StudyFile[]>([])
  const [loading, setLoading] = useState(true)

  const fetchFiles = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/files")
      if (res.ok) {
        const data = await res.json()
        setFiles(data.map((item: any) => ({
          id: item.id,
          name: item.name,
          type: item.type,
          subject: item.subject,
          semester: item.semester,
          category: item.category,
          size: item.size,
          uploadDate: item.created_at,
          description: item.description,
          fileUrl: item.file_url
        })))
      }
    } catch (error) {
      console.error("Failed to fetch files:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchFiles()
  }, [])

  const createFile = async (file: Omit<StudyFile, "id" | "uploadDate">) => {
    try {
      const res = await fetch("/api/files", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(file),
      })
      if (res.ok) {
        fetchFiles()
        return await res.json()
      }
    } catch (error) {
      console.error("Failed to create file:", error)
    }
    return null
  }

  const updateFile = async (id: string, updates: Partial<StudyFile>) => {
    try {
      const res = await fetch(`/api/files/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      })
      if (res.ok) {
        fetchFiles()
        return await res.json()
      }
    } catch (error) {
      console.error("Failed to update file:", error)
    }
    return null
  }

  const deleteFile = async (id: string) => {
    try {
      const res = await fetch(`/api/files/${id}`, {
        method: "DELETE",
      })
      if (res.ok) {
        setFiles((prev) => prev.filter((f) => f.id !== id))
        return true
      }
    } catch (error) {
      console.error("Failed to delete file:", error)
    }
    return false
  }

  const getFile = (id: string) => {
    return files.find((f) => f.id === id) || null
  }

  return {
    files,
    loading,
    createFile,
    updateFile,
    deleteFile,
    getFile,
    refreshFiles: fetchFiles,
  }
}
