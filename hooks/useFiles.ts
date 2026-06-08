"use client"

import { useState, useEffect } from "react"
import { fileStorage, type StudyFile, initializeData } from "@/lib/storage"

export function useFiles() {
  const [files, setFiles] = useState<StudyFile[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    initializeData()
    setFiles(fileStorage.getAll())
    setLoading(false)
  }, [])

  const createFile = (file: Omit<StudyFile, "id" | "uploadDate">) => {
    const newFile = fileStorage.create(file)
    setFiles((prev) => [...prev, newFile])
    return newFile
  }

  const updateFile = (id: string, updates: Partial<StudyFile>) => {
    const updated = fileStorage.update(id, updates)
    if (updated) {
      setFiles((prev) => prev.map((f) => (f.id === id ? updated : f)))
    }
    return updated
  }

  const deleteFile = (id: string) => {
    const success = fileStorage.delete(id)
    if (success) {
      setFiles((prev) => prev.filter((f) => f.id !== id))
    }
    return success
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
    refreshFiles: () => setFiles(fileStorage.getAll()),
  }
}
