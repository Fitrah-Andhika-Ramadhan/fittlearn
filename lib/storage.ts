// Simulated database using localStorage
export interface Summary {
  id: string
  title: string
  summary: string
  keyPoints: string[]
  createdAt: string
  updatedAt: string
  fileType: string
  fileName: string
  fileSize: string
}

export interface StudyFile {
  id: string
  name: string
  type: string
  subject: string
  semester: string
  category: string
  size: string
  uploadDate: string
  description: string
  content?: string
  url?: string
}

// Summary CRUD operations
export const summaryStorage = {
  getAll: (): Summary[] => {
    if (typeof window === "undefined") return []
    const data = localStorage.getItem("fitlearned_summaries")
    return data ? JSON.parse(data) : []
  },

  create: (summary: Omit<Summary, "id" | "createdAt" | "updatedAt">): Summary => {
    const summaries = summaryStorage.getAll()
    const newSummary: Summary = {
      ...summary,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    summaries.push(newSummary)
    localStorage.setItem("fitlearned_summaries", JSON.stringify(summaries))
    return newSummary
  },

  update: (id: string, updates: Partial<Summary>): Summary | null => {
    const summaries = summaryStorage.getAll()
    const index = summaries.findIndex((s) => s.id === id)
    if (index === -1) return null

    summaries[index] = {
      ...summaries[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    }
    localStorage.setItem("fitlearned_summaries", JSON.stringify(summaries))
    return summaries[index]
  },

  delete: (id: string): boolean => {
    const summaries = summaryStorage.getAll()
    const filtered = summaries.filter((s) => s.id !== id)
    if (filtered.length === summaries.length) return false

    localStorage.setItem("fitlearned_summaries", JSON.stringify(filtered))
    return true
  },

  getById: (id: string): Summary | null => {
    const summaries = summaryStorage.getAll()
    return summaries.find((s) => s.id === id) || null
  },
}

// File CRUD operations
export const fileStorage = {
  getAll: (): StudyFile[] => {
    if (typeof window === "undefined") return []
    const data = localStorage.getItem("fitlearned_files")
    return data ? JSON.parse(data) : []
  },

  create: (file: Omit<StudyFile, "id" | "uploadDate">): StudyFile => {
    const files = fileStorage.getAll()
    const newFile: StudyFile = {
      ...file,
      id: Date.now().toString(),
      uploadDate: new Date().toISOString().split("T")[0],
    }
    files.push(newFile)
    localStorage.setItem("fitlearned_files", JSON.stringify(files))
    return newFile
  },

  update: (id: string, updates: Partial<StudyFile>): StudyFile | null => {
    const files = fileStorage.getAll()
    const index = files.findIndex((f) => f.id === id)
    if (index === -1) return null

    files[index] = { ...files[index], ...updates }
    localStorage.setItem("fitlearned_files", JSON.stringify(files))
    return files[index]
  },

  delete: (id: string): boolean => {
    const files = fileStorage.getAll()
    const filtered = files.filter((f) => f.id !== id)
    if (filtered.length === files.length) return false

    localStorage.setItem("fitlearned_files", JSON.stringify(filtered))
    return true
  },

  getById: (id: string): StudyFile | null => {
    const files = fileStorage.getAll()
    return files.find((f) => f.id === id) || null
  },
}

// Initialize with sample data if empty
export const initializeData = () => {
  if (typeof window === "undefined") return

  // Initialize summaries if empty
  if (summaryStorage.getAll().length === 0) {
    const sampleSummaries = [
      {
        title: "Machine Learning Fundamentals",
        summary:
          "This document discusses the fundamental principles of machine learning and artificial intelligence. It covers various algorithms, their applications, and the importance of data preprocessing in achieving accurate results.",
        keyPoints: [
          "ML algorithms require quality data preprocessing",
          "Neural networks are fundamental to modern AI systems",
          "Model optimization is crucial for performance",
        ],
        fileType: "PDF",
        fileName: "ml-fundamentals.pdf",
        fileSize: "2.5 MB",
      },
      {
        title: "Web Development Best Practices",
        summary:
          "A comprehensive guide covering modern web development practices, including responsive design, performance optimization, and security considerations.",
        keyPoints: [
          "Responsive design is essential",
          "Performance optimization matters",
          "Security should be prioritized",
        ],
        fileType: "DOCX",
        fileName: "web-dev-practices.docx",
        fileSize: "1.8 MB",
      },
    ]

    sampleSummaries.forEach((summary) => summaryStorage.create(summary))
  }

  // Initialize files if empty
  if (fileStorage.getAll().length === 0) {
    const sampleFiles = [
      {
        name: "Algoritma dan Struktur Data - Materi Lengkap.pdf",
        type: "PDF",
        subject: "Algoritma dan Struktur Data",
        semester: "Semester 3",
        category: "Materi Kuliah",
        size: "2.5 MB",
        description: "Materi lengkap tentang algoritma sorting, searching, dan struktur data dasar",
      },
      {
        name: "Database Design - ER Diagram Examples.docx",
        type: "DOCX",
        subject: "Basis Data",
        semester: "Semester 4",
        category: "Tugas",
        size: "1.8 MB",
        description: "Contoh-contoh ER Diagram untuk desain database sistem informasi",
      },
      {
        name: "Machine Learning - Linear Regression Notes.pdf",
        type: "PDF",
        subject: "Machine Learning",
        semester: "Semester 6",
        category: "Catatan",
        size: "3.2 MB",
        description: "Catatan lengkap tentang linear regression dan implementasinya",
      },
    ]

    sampleFiles.forEach((file) => fileStorage.create(file))
  }
}
