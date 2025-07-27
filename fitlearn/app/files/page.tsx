"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Brain,
  FileText,
  Search,
  Upload,
  Download,
  Eye,
  Trash2,
  FolderOpen,
  BookOpen,
  GraduationCap,
  Calendar,
  Filter,
  Edit,
  Loader2,
} from "lucide-react"
import Link from "next/link"
import { useFiles } from "@/hooks/useFiles"
import type { StudyFile } from "@/lib/storage"

export default function FilesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedSubject, setSelectedSubject] = useState("all")
  const [selectedSemester, setSelectedSemester] = useState("all")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingFile, setEditingFile] = useState<StudyFile | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [isDeleting, setIsDeleting] = useState<string | null>(null)

  // Upload form state
  const [uploadForm, setUploadForm] = useState({
    name: "",
    subject: "",
    semester: "",
    category: "",
    description: "",
    file: null as File | null,
  })

  const { files, loading, createFile, updateFile, deleteFile } = useFiles()

  const subjects = ["all", ...Array.from(new Set(files.map((file) => file.subject)))]
  const semesters = ["all", ...Array.from(new Set(files.map((file) => file.semester)))]
  const categories = ["all", ...Array.from(new Set(files.map((file) => file.category)))]

  const filteredFiles = files.filter((file) => {
    const matchesSearch =
      file.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      file.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesSubject = selectedSubject === "all" || file.subject === selectedSubject
    const matchesSemester = selectedSemester === "all" || file.semester === selectedSemester
    const matchesCategory = selectedCategory === "all" || file.category === selectedCategory

    return matchesSearch && matchesSubject && matchesSemester && matchesCategory
  })

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0]
    if (selectedFile) {
      setUploadForm((prev) => ({
        ...prev,
        file: selectedFile,
        name: prev.name || selectedFile.name,
      }))
    }
  }

  const handleUpload = async () => {
    if (!uploadForm.file || !uploadForm.name || !uploadForm.subject || !uploadForm.semester || !uploadForm.category) {
      alert("Please fill in all required fields")
      return
    }

    setIsUploading(true)

    // Simulate upload delay
    setTimeout(() => {
      const fileType = uploadForm.file!.name.split(".").pop()?.toUpperCase() || "UNKNOWN"
      const fileSize = `${(uploadForm.file!.size / 1024 / 1024).toFixed(1)} MB`

      createFile({
        name: uploadForm.name,
        type: fileType,
        subject: uploadForm.subject,
        semester: uploadForm.semester,
        category: uploadForm.category,
        size: fileSize,
        description: uploadForm.description,
      })

      // Reset form
      setUploadForm({
        name: "",
        subject: "",
        semester: "",
        category: "",
        description: "",
        file: null,
      })

      setIsUploadDialogOpen(false)
      setIsUploading(false)
    }, 1000)
  }

  const handleEdit = (file: StudyFile) => {
    setEditingFile({ ...file })
    setIsEditDialogOpen(true)
  }

  const handleSaveEdit = () => {
    if (!editingFile) return

    updateFile(editingFile.id, {
      name: editingFile.name,
      subject: editingFile.subject,
      semester: editingFile.semester,
      category: editingFile.category,
      description: editingFile.description,
    })

    setIsEditDialogOpen(false)
    setEditingFile(null)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this file?")) return

    setIsDeleting(id)

    // Simulate deletion delay
    setTimeout(() => {
      deleteFile(id)
      setIsDeleting(null)
    }, 500)
  }

  const handleDownload = (file: StudyFile) => {
    // Simulate file download
    const blob = new Blob([`File: ${file.name}\nSubject: ${file.subject}\nDescription: ${file.description}`], {
      type: "text/plain",
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = file.name
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const getFileIcon = (type: string) => {
    switch (type) {
      case "PDF":
        return <FileText className="h-5 w-5 text-red-600" />
      case "DOCX":
        return <FileText className="h-5 w-5 text-blue-600" />
      case "PPTX":
        return <FileText className="h-5 w-5 text-orange-600" />
      default:
        return <FileText className="h-5 w-5 text-gray-600" />
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Materi Kuliah":
        return "bg-blue-100 text-blue-800"
      case "Tugas":
        return "bg-green-100 text-green-800"
      case "Catatan":
        return "bg-yellow-100 text-yellow-800"
      case "Tutorial":
        return "bg-purple-100 text-purple-800"
      case "Presentasi":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <Brain className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">FitLearned</span>
            </Link>
            <div className="flex items-center space-x-4">
              <Link href="/portfolio">
                <Button variant="outline">Portfolio</Button>
              </Link>
              <Link href="/summarizer">
                <Button variant="outline">Summarizer</Button>
              </Link>
              <Link href="/dashboard">
                <Button>Dashboard</Button>
              </Link>
            </div>
          </nav>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center mb-4">
              <BookOpen className="h-8 w-8 text-blue-600 mr-3" />
              <h1 className="text-3xl font-bold text-gray-900">My Study Files</h1>
            </div>
            <p className="text-gray-600">Organize and manage your college files, notes, and study materials</p>
          </div>

          {/* Stats Cards */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Files</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{files.length}</div>
                <p className="text-xs text-muted-foreground">Study materials</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Subjects</CardTitle>
                <GraduationCap className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{subjects.length - 1}</div>
                <p className="text-xs text-muted-foreground">Different courses</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">This Month</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {
                    files.filter((f) => {
                      const uploaded = new Date(f.uploadDate)
                      const now = new Date()
                      return uploaded.getMonth() === now.getMonth() && uploaded.getFullYear() === now.getFullYear()
                    }).length
                  }
                </div>
                <p className="text-xs text-muted-foreground">Files uploaded</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Storage Used</CardTitle>
                <FolderOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {files
                    .reduce((total, file) => {
                      const size = Number.parseFloat(file.size.replace(" MB", ""))
                      return total + size
                    }, 0)
                    .toFixed(1)}{" "}
                  MB
                </div>
                <p className="text-xs text-muted-foreground">Total file size</p>
              </CardContent>
            </Card>
          </div>

          {/* Upload Section */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Upload className="mr-2 h-5 w-5" />
                Upload New File
              </CardTitle>
              <CardDescription>Add new study materials to your collection</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => setIsUploadDialogOpen(true)}>
                <Upload className="mr-2 h-4 w-4" />
                Upload File
              </Button>
            </CardContent>
          </Card>

          {/* Search and Filters */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Filter className="mr-2 h-5 w-5" />
                Search & Filter
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-4 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search files..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Subject" />
                  </SelectTrigger>
                  <SelectContent>
                    {subjects.map((subject) => (
                      <SelectItem key={subject} value={subject}>
                        {subject === "all" ? "All Subjects" : subject}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedSemester} onValueChange={setSelectedSemester}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Semester" />
                  </SelectTrigger>
                  <SelectContent>
                    {semesters.map((semester) => (
                      <SelectItem key={semester} value={semester}>
                        {semester === "all" ? "All Semesters" : semester}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category === "all" ? "All Categories" : category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Files List */}
          <div className="space-y-4">
            {filteredFiles.map((file) => (
              <Card key={file.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      <div className="flex-shrink-0">{getFileIcon(file.type)}</div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-medium text-gray-900 mb-2">{file.name}</h3>
                        <p className="text-gray-600 text-sm mb-3">{file.description}</p>

                        <div className="flex flex-wrap gap-2 mb-3">
                          <Badge variant="outline">{file.subject}</Badge>
                          <Badge variant="outline">{file.semester}</Badge>
                          <Badge className={getCategoryColor(file.category)}>{file.category}</Badge>
                          <Badge variant="secondary">{file.type}</Badge>
                        </div>

                        <div className="flex items-center text-sm text-gray-500 space-x-4">
                          <span>{file.size}</span>
                          <span>•</span>
                          <span>Uploaded {file.uploadDate}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 ml-4">
                      <Button size="sm" variant="outline" onClick={() => alert(`Viewing ${file.name}`)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleDownload(file)}>
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleEdit(file)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Link href={`/summarizer?file=${file.id}`}>
                        <Button size="sm" variant="outline">
                          <Brain className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(file.id)}
                        disabled={isDeleting === file.id}
                      >
                        {isDeleting === file.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredFiles.length === 0 && (
            <Card>
              <CardContent className="text-center py-12">
                <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No files found</h3>
                <p className="text-gray-500 mb-6">
                  {searchTerm || selectedSubject !== "all" || selectedSemester !== "all" || selectedCategory !== "all"
                    ? "Try adjusting your search or filter criteria"
                    : "Start by uploading your first study file"}
                </p>
                <Button onClick={() => setIsUploadDialogOpen(true)}>
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Your First File
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Upload Dialog */}
      <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Upload New File</DialogTitle>
            <DialogDescription>Add a new study file to your collection</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="upload-file">Choose File</Label>
              <Input id="upload-file" type="file" accept=".pdf,.doc,.docx,.ppt,.pptx" onChange={handleFileUpload} />
            </div>
            <div>
              <Label htmlFor="upload-name">File Name</Label>
              <Input
                id="upload-name"
                value={uploadForm.name}
                onChange={(e) => setUploadForm((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="Enter file name"
              />
            </div>
            <div>
              <Label htmlFor="upload-subject">Subject</Label>
              <Input
                id="upload-subject"
                value={uploadForm.subject}
                onChange={(e) => setUploadForm((prev) => ({ ...prev, subject: e.target.value }))}
                placeholder="e.g., Algoritma dan Struktur Data"
              />
            </div>
            <div>
              <Label htmlFor="upload-semester">Semester</Label>
              <Select
                value={uploadForm.semester}
                onValueChange={(value) => setUploadForm((prev) => ({ ...prev, semester: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select semester" />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                    <SelectItem key={sem} value={`Semester ${sem}`}>
                      Semester {sem}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="upload-category">Category</Label>
              <Select
                value={uploadForm.category}
                onValueChange={(value) => setUploadForm((prev) => ({ ...prev, category: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Materi Kuliah">Materi Kuliah</SelectItem>
                  <SelectItem value="Tugas">Tugas</SelectItem>
                  <SelectItem value="Catatan">Catatan</SelectItem>
                  <SelectItem value="Tutorial">Tutorial</SelectItem>
                  <SelectItem value="Presentasi">Presentasi</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="upload-description">Description</Label>
              <Textarea
                id="upload-description"
                value={uploadForm.description}
                onChange={(e) => setUploadForm((prev) => ({ ...prev, description: e.target.value }))}
                placeholder="Brief description of the file content"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsUploadDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpload} disabled={isUploading}>
              {isUploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Upload File
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit File</DialogTitle>
            <DialogDescription>Update file information</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-name">File Name</Label>
              <Input
                id="edit-name"
                value={editingFile?.name || ""}
                onChange={(e) => setEditingFile((prev) => (prev ? { ...prev, name: e.target.value } : null))}
              />
            </div>
            <div>
              <Label htmlFor="edit-subject">Subject</Label>
              <Input
                id="edit-subject"
                value={editingFile?.subject || ""}
                onChange={(e) => setEditingFile((prev) => (prev ? { ...prev, subject: e.target.value } : null))}
              />
            </div>
            <div>
              <Label htmlFor="edit-semester">Semester</Label>
              <Select
                value={editingFile?.semester || ""}
                onValueChange={(value) => setEditingFile((prev) => (prev ? { ...prev, semester: value } : null))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select semester" />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                    <SelectItem key={sem} value={`Semester ${sem}`}>
                      Semester {sem}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="edit-category">Category</Label>
              <Select
                value={editingFile?.category || ""}
                onValueChange={(value) => setEditingFile((prev) => (prev ? { ...prev, category: value } : null))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Materi Kuliah">Materi Kuliah</SelectItem>
                  <SelectItem value="Tugas">Tugas</SelectItem>
                  <SelectItem value="Catatan">Catatan</SelectItem>
                  <SelectItem value="Tutorial">Tutorial</SelectItem>
                  <SelectItem value="Presentasi">Presentasi</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={editingFile?.description || ""}
                onChange={(e) => setEditingFile((prev) => (prev ? { ...prev, description: e.target.value } : null))}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveEdit}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
