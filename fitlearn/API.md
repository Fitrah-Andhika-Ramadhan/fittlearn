# FitLearned API Documentation

## 📋 Overview

FitLearned menggunakan client-side storage (localStorage) untuk data management. Berikut adalah dokumentasi untuk storage utilities dan data structures.

## 🗄️ Data Structures

### Summary Interface
\`\`\`typescript
interface Summary {
  id: string                    // Unique identifier
  title: string                 // Document title
  summary: string               // AI-generated summary
  keyPoints: string[]           // Array of key points
  createdAt: string            // ISO timestamp
  updatedAt: string            // ISO timestamp
  fileType: string             // File extension (PDF, DOCX, etc.)
  fileName: string             // Original filename
  fileSize: string             // File size (e.g., "2.5 MB")
}
\`\`\`

### StudyFile Interface
\`\`\`typescript
interface StudyFile {
  id: string                    // Unique identifier
  name: string                  // File name
  type: string                  // File type (PDF, DOCX, PPTX)
  subject: string               // Academic subject
  semester: string              // Semester (e.g., "Semester 3")
  category: string              // Category (Materi Kuliah, Tugas, etc.)
  size: string                  // File size
  uploadDate: string            // Upload date (YYYY-MM-DD)
  description: string           // File description
  content?: string              // Optional file content
  url?: string                  // Optional file URL
}
\`\`\`

## 🔧 Storage API

### Summary Storage

#### `summaryStorage.getAll()`
Mengambil semua summary dari localStorage.

\`\`\`typescript
const summaries: Summary[] = summaryStorage.getAll()
\`\`\`

**Returns**: Array of Summary objects

#### `summaryStorage.create(summary)`
Membuat summary baru.

\`\`\`typescript
const newSummary = summaryStorage.create({
  title: "Machine Learning Basics",
  summary: "This document covers...",
  keyPoints: ["Point 1", "Point 2"],
  fileType: "PDF",
  fileName: "ml-basics.pdf",
  fileSize: "2.5 MB"
})
\`\`\`

**Parameters**:
- `summary`: Omit<Summary, "id" | "createdAt" | "updatedAt">

**Returns**: Complete Summary object with generated id and timestamps

#### `summaryStorage.update(id, updates)`
Update summary yang sudah ada.

\`\`\`typescript
const updated = summaryStorage.update("123", {
  title: "Updated Title",
  summary: "Updated summary content"
})
\`\`\`

**Parameters**:
- `id`: string - Summary ID
- `updates`: Partial<Summary> - Fields to update

**Returns**: Updated Summary object or null if not found

#### `summaryStorage.delete(id)`
Hapus summary berdasarkan ID.

\`\`\`typescript
const success = summaryStorage.delete("123")
\`\`\`

**Parameters**:
- `id`: string - Summary ID

**Returns**: boolean - true if deleted, false if not found

#### `summaryStorage.getById(id)`
Ambil summary berdasarkan ID.

\`\`\`typescript
const summary = summaryStorage.getById("123")
\`\`\`

**Parameters**:
- `id`: string - Summary ID

**Returns**: Summary object or null if not found

### File Storage

#### `fileStorage.getAll()`
Mengambil semua file dari localStorage.

\`\`\`typescript
const files: StudyFile[] = fileStorage.getAll()
\`\`\`

**Returns**: Array of StudyFile objects

#### `fileStorage.create(file)`
Membuat file entry baru.

\`\`\`typescript
const newFile = fileStorage.create({
  name: "Algorithm Notes.pdf",
  type: "PDF",
  subject: "Data Structures",
  semester: "Semester 3",
  category: "Materi Kuliah",
  size: "1.5 MB",
  description: "Complete notes on algorithms"
})
\`\`\`

**Parameters**:
- `file`: Omit<StudyFile, "id" | "uploadDate">

**Returns**: Complete StudyFile object with generated id and uploadDate

#### `fileStorage.update(id, updates)`
Update file entry.

\`\`\`typescript
const updated = fileStorage.update("456", {
  name: "Updated filename.pdf",
  description: "Updated description"
})
\`\`\`

**Parameters**:
- `id`: string - File ID
- `updates`: Partial<StudyFile> - Fields to update

**Returns**: Updated StudyFile object or null if not found

#### `fileStorage.delete(id)`
Hapus file entry.

\`\`\`typescript
const success = fileStorage.delete("456")
\`\`\`

**Parameters**:
- `id`: string - File ID

**Returns**: boolean - true if deleted, false if not found

#### `fileStorage.getById(id)`
Ambil file berdasarkan ID.

\`\`\`typescript
const file = fileStorage.getById("456")
\`\`\`

**Parameters**:
- `id`: string - File ID

**Returns**: StudyFile object or null if not found

## 🎣 Custom Hooks

### useSummaries Hook

\`\`\`typescript
const {
  summaries,           // Summary[] - All summaries
  loading,             // boolean - Loading state
  createSummary,       // Function to create summary
  updateSummary,       // Function to update summary
  deleteSummary,       // Function to delete summary
  getSummary,          // Function to get summary by ID
  refreshSummaries     // Function to refresh data
} = useSummaries()
\`\`\`

#### Methods

**createSummary(summary)**
\`\`\`typescript
const newSummary = createSummary({
  title: "New Summary",
  summary: "Content...",
  keyPoints: ["Point 1"],
  fileType: "PDF",
  fileName: "document.pdf",
  fileSize: "1.2 MB"
})
\`\`\`

**updateSummary(id, updates)**
\`\`\`typescript
const updated = updateSummary("123", {
  title: "Updated Title"
})
\`\`\`

**deleteSummary(id)**
\`\`\`typescript
const success = deleteSummary("123")
\`\`\`

### useFiles Hook

\`\`\`typescript
const {
  files,               // StudyFile[] - All files
  loading,             // boolean - Loading state
  createFile,          // Function to create file
  updateFile,          // Function to update file
  deleteFile,          // Function to delete file
  getFile,             // Function to get file by ID
  refreshFiles         // Function to refresh data
} = useFiles()
\`\`\`

#### Methods

**createFile(file)**
\`\`\`typescript
const newFile = createFile({
  name: "Study Notes.pdf",
  type: "PDF",
  subject: "Mathematics",
  semester: "Semester 2",
  category: "Catatan",
  size: "800 KB",
  description: "Calculus notes"
})
\`\`\`

**updateFile(id, updates)**
\`\`\`typescript
const updated = updateFile("456", {
  name: "Updated Notes.pdf"
})
\`\`\`

**deleteFile(id)**
\`\`\`typescript
const success = deleteFile("456")
\`\`\`

## 🔄 Data Flow

### Summary Creation Flow
1. User uploads file → `handleFileUpload()`
2. File processed → `handleSummarize()`
3. AI generates summary → Summary state updated
4. User saves → `createSummary()` → localStorage updated
5. UI refreshed → New summary appears in dashboard

### File Management Flow
1. User opens upload dialog → `setIsUploadDialogOpen(true)`
2. User fills form → Form state updated
3. User submits → `createFile()` → localStorage updated
4. Dialog closes → File list refreshed

## 🛠️ Utility Functions

### Data Initialization
\`\`\`typescript
initializeData() // Initialize sample data if localStorage is empty
\`\`\`

### File Processing
\`\`\`typescript
// File upload handling
const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
  const file = event.target.files?.[0]
  // Process file...
}

// Export functionality
const handleExport = (data: any) => {
  const blob = new Blob([JSON.stringify(data, null, 2)], { 
    type: "application/json" 
  })
  // Download file...
}
\`\`\`

## 🔍 Search & Filter

### Summary Search
\`\`\`typescript
const filteredSummaries = summaries.filter(summary =>
  summary.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
  summary.summary.toLowerCase().includes(searchTerm.toLowerCase())
)
\`\`\`

### File Filtering
\`\`\`typescript
const filteredFiles = files.filter(file => {
  const matchesSearch = file.name.toLowerCase().includes(searchTerm.toLowerCase())
  const matchesSubject = selectedSubject === "all" || file.subject === selectedSubject
  const matchesSemester = selectedSemester === "all" || file.semester === selectedSemester
  const matchesCategory = selectedCategory === "all" || file.category === selectedCategory
  
  return matchesSearch && matchesSubject && matchesSemester && matchesCategory
})
\`\`\`

## 📊 Statistics

### Dashboard Stats
\`\`\`typescript
// Total summaries
const totalSummaries = summaries.length

// This month summaries
const thisMonthSummaries = summaries.filter(s => {
  const created = new Date(s.createdAt)
  const now = new Date()
  return created.getMonth() === now.getMonth() && 
         created.getFullYear() === now.getFullYear()
}).length

// Estimated time saved
const timeSaved = summaries.length * 2 // 2 hours per summary
\`\`\`

## 🚨 Error Handling

### Storage Errors
\`\`\`typescript
try {
  const summaries = summaryStorage.getAll()
} catch (error) {
  console.error("Failed to load summaries:", error)
  // Handle error (show toast, fallback data, etc.)
}
\`\`\`

### File Upload Errors
\`\`\`typescript
const handleFileUpload = (event) => {
  const file = event.target.files?.[0]
  
  if (!file) {
    alert("Please select a file")
    return
  }
  
  if (file.size > 10 * 1024 * 1024) { // 10MB limit
    alert("File too large. Maximum size is 10MB")
    return
  }
  
  const allowedTypes = ['.pdf', '.doc', '.docx']
  const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'))
  
  if (!allowedTypes.includes(fileExtension)) {
    alert("Unsupported file type. Please upload PDF or Word documents.")
    return
  }
  
  // Process file...
}
\`\`\`

## 🔐 Security Considerations

### Data Validation
\`\`\`typescript
// Validate summary data before saving
const validateSummary = (summary: Partial<Summary>): boolean => {
  if (!summary.title || summary.title.trim().length === 0) {
    return false
  }
  
  if (!summary.summary || summary.summary.trim().length === 0) {
    return false
  }
  
  if (!summary.keyPoints || summary.keyPoints.length === 0) {
    return false
  }
  
  return true
}
\`\`\`

### XSS Prevention
\`\`\`typescript
// Sanitize user input
const sanitizeInput = (input: string): string => {
  return input
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
}
\`\`\`

---

**API Documentation v1.0.0**

*Last updated: January 2024*
