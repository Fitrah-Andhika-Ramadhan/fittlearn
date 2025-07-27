"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
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
import { Brain, FileText, Search, Edit, Trash2, Eye, Plus, Download, Loader2 } from "lucide-react"
import Link from "next/link"
import { useSummaries } from "@/hooks/useSummaries"
import type { Summary } from "@/lib/storage"

export default function DashboardPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedSummary, setSelectedSummary] = useState<Summary | null>(null)
  const [editingSummary, setEditingSummary] = useState<Summary | null>(null)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState<string | null>(null)

  const { summaries, loading, updateSummary, deleteSummary } = useSummaries()

  const filteredSummaries = summaries.filter(
    (summary) =>
      summary.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      summary.summary.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleView = (summary: Summary) => {
    setSelectedSummary(summary)
    setIsViewDialogOpen(true)
  }

  const handleEdit = (summary: Summary) => {
    setEditingSummary({ ...summary })
    setIsEditDialogOpen(true)
  }

  const handleSaveEdit = () => {
    if (!editingSummary) return

    updateSummary(editingSummary.id, {
      title: editingSummary.title,
      summary: editingSummary.summary,
      keyPoints: editingSummary.keyPoints,
    })

    setIsEditDialogOpen(false)
    setEditingSummary(null)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this summary?")) return

    setIsDeleting(id)

    // Simulate deletion delay
    setTimeout(() => {
      deleteSummary(id)
      setIsDeleting(null)
    }, 500)
  }

  const handleExport = (summary: Summary) => {
    const exportData = {
      title: summary.title,
      summary: summary.summary,
      keyPoints: summary.keyPoints,
      createdAt: summary.createdAt,
      fileType: summary.fileType,
    }

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${summary.title.replace(/[^a-z0-9]/gi, "_").toLowerCase()}_summary.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
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
              <Link href="/files">
                <Button variant="outline">My Files</Button>
              </Link>
              <Link href="/summarizer">
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  New Summary
                </Button>
              </Link>
              <Link href="/">
                <Button variant="ghost">Home</Button>
              </Link>
            </div>
          </nav>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Dashboard Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
            <p className="text-gray-600">Manage your document summaries</p>
          </div>

          {/* Stats Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Summaries</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{summaries.length}</div>
                <p className="text-xs text-muted-foreground">Documents processed</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">This Month</CardTitle>
                <Brain className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {
                    summaries.filter((s) => {
                      const created = new Date(s.createdAt)
                      const now = new Date()
                      return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear()
                    }).length
                  }
                </div>
                <p className="text-xs text-muted-foreground">New summaries created</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Time Saved</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{summaries.length * 2}h</div>
                <p className="text-xs text-muted-foreground">Estimated reading time</p>
              </CardContent>
            </Card>
          </div>

          {/* Search and Filter */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Your Summaries</CardTitle>
              <CardDescription>Search and manage your document summaries</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <Search className="h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search summaries..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1"
                />
              </div>
            </CardContent>
          </Card>

          {/* Summaries List */}
          <div className="space-y-4">
            {filteredSummaries.map((summary) => (
              <Card key={summary.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-2">{summary.title}</CardTitle>
                      <div className="flex items-center space-x-2 mb-2">
                        <Badge variant="secondary">{summary.fileType}</Badge>
                        <span className="text-sm text-gray-500">
                          {new Date(summary.createdAt).toLocaleDateString()}
                        </span>
                        {summary.updatedAt !== summary.createdAt && (
                          <span className="text-xs text-gray-400">
                            (Updated {new Date(summary.updatedAt).toLocaleDateString()})
                          </span>
                        )}
                      </div>
                      <CardDescription className="line-clamp-2">{summary.summary}</CardDescription>
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      <Button size="sm" variant="outline" onClick={() => handleView(summary)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleEdit(summary)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleExport(summary)}>
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(summary.id)}
                        disabled={isDeleting === summary.id}
                      >
                        {isDeleting === summary.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div>
                    <h4 className="font-medium text-sm mb-2">Key Points:</h4>
                    <div className="space-y-1">
                      {summary.keyPoints.slice(0, 3).map((point, index) => (
                        <div key={index} className="flex items-start text-sm text-gray-600">
                          <span className="inline-block w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                          {point}
                        </div>
                      ))}
                      {summary.keyPoints.length > 3 && (
                        <div className="text-sm text-gray-500">+{summary.keyPoints.length - 3} more points</div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredSummaries.length === 0 && (
            <Card>
              <CardContent className="text-center py-8">
                <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No summaries found</h3>
                <p className="text-gray-500 mb-4">
                  {searchTerm ? "Try adjusting your search terms" : "Start by uploading your first document"}
                </p>
                <Link href="/summarizer">
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Create First Summary
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* View Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedSummary?.title}</DialogTitle>
            <DialogDescription>
              Created: {selectedSummary && new Date(selectedSummary.createdAt).toLocaleString()}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Summary</h4>
              <p className="text-gray-700 leading-relaxed">{selectedSummary?.summary}</p>
            </div>
            <div>
              <h4 className="font-medium mb-2">Key Points</h4>
              <ul className="space-y-2">
                {selectedSummary?.keyPoints.map((point, index) => (
                  <li key={index} className="flex items-start">
                    <span className="inline-block w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <span className="text-gray-700">{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Summary</DialogTitle>
            <DialogDescription>Make changes to your summary</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-title">Title</Label>
              <Input
                id="edit-title"
                value={editingSummary?.title || ""}
                onChange={(e) => setEditingSummary((prev) => (prev ? { ...prev, title: e.target.value } : null))}
              />
            </div>
            <div>
              <Label htmlFor="edit-summary">Summary</Label>
              <Textarea
                id="edit-summary"
                rows={6}
                value={editingSummary?.summary || ""}
                onChange={(e) => setEditingSummary((prev) => (prev ? { ...prev, summary: e.target.value } : null))}
              />
            </div>
            <div>
              <Label>Key Points</Label>
              <div className="space-y-2 mt-2">
                {editingSummary?.keyPoints.map((point, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Input
                      value={point}
                      onChange={(e) => {
                        if (!editingSummary) return
                        const newPoints = [...editingSummary.keyPoints]
                        newPoints[index] = e.target.value
                        setEditingSummary({ ...editingSummary, keyPoints: newPoints })
                      }}
                    />
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        if (!editingSummary) return
                        const newPoints = editingSummary.keyPoints.filter((_, i) => i !== index)
                        setEditingSummary({ ...editingSummary, keyPoints: newPoints })
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    if (!editingSummary) return
                    setEditingSummary({
                      ...editingSummary,
                      keyPoints: [...editingSummary.keyPoints, ""],
                    })
                  }}
                >
                  Add Key Point
                </Button>
              </div>
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
