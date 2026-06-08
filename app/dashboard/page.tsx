"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
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
import { Brain, FileText, Search, Edit, Trash2, Eye, Plus, Download, Loader2, Clock } from "lucide-react"
import Link from "next/link"
import { useSummaries } from "@/hooks/useSummaries"
import type { Summary } from "@/lib/storage"

function SkeletonCard() {
  return (
    <div className="bg-white/[0.06] border border-white/[0.10] rounded-2xl p-6 animate-pulse">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="h-5 bg-white/10 rounded-lg w-3/4 mb-3" />
          <div className="flex gap-2 mb-3">
            <div className="h-4 bg-white/10 rounded-full w-16" />
            <div className="h-4 bg-white/10 rounded-full w-24" />
          </div>
          <div className="h-4 bg-white/10 rounded w-full mb-2" />
          <div className="h-4 bg-white/10 rounded w-5/6" />
        </div>
        <div className="flex gap-2 ml-4">
          {[1,2,3,4].map(i => <div key={i} className="h-8 w-8 bg-white/10 rounded-lg" />)}
        </div>
      </div>
    </div>
  )
}

export default function DashboardPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedSummary, setSelectedSummary] = useState<Summary | null>(null)
  const [editingSummary, setEditingSummary] = useState<Summary | null>(null)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState<string | null>(null)

  const { summaries, loading, updateSummary, deleteSummary } = useSummaries()

  const filteredSummaries = useMemo(() =>
    summaries.filter(
      (s) =>
        s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.summary.toLowerCase().includes(searchTerm.toLowerCase()),
    ),
    [summaries, searchTerm]
  )

  const thisMonthCount = useMemo(() => {
    const now = new Date()
    return summaries.filter((s) => {
      const d = new Date(s.createdAt)
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
    }).length
  }, [summaries])

  const handleView = (summary: Summary) => {
    setSelectedSummary(summary)
    setIsViewDialogOpen(true)
  }

  const handleEdit = (summary: Summary) => {
    setEditingSummary({ ...summary })
    setIsEditDialogOpen(true)
  }

  const handleSaveEdit = async () => {
    if (!editingSummary) return
    await updateSummary(editingSummary.id, {
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
    await deleteSummary(id)
    setIsDeleting(null)
  }

  const handleExport = (summary: Summary) => {
    const blob = new Blob(
      [JSON.stringify({ title: summary.title, summary: summary.summary, keyPoints: summary.keyPoints, createdAt: summary.createdAt, fileType: summary.fileType }, null, 2)],
      { type: "application/json" }
    )
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${summary.title.replace(/[^a-z0-9]/gi, "_").toLowerCase()}_summary.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const inputClass = "bg-white/[0.06] border-white/[0.15] text-white placeholder:text-white/40 focus:border-purple-500/60 focus:ring-purple-500/20"

  return (
    <div className="w-full text-white">
      <div className="w-full py-8">
        <div className="max-w-5xl mx-auto space-y-6">

          {/* Header */}
          <div>
            <h1 className="text-4xl font-bold text-white mb-1">Dashboard</h1>
            <p className="text-white/60">Manage your document summaries</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: "Total Summaries", value: loading ? "—" : summaries.length, icon: FileText, color: "text-purple-300", bg: "bg-purple-500/20", border: "border-purple-400/30" },
              { label: "This Month", value: loading ? "—" : thisMonthCount, icon: Brain, color: "text-blue-300", bg: "bg-blue-500/20", border: "border-blue-400/30" },
              { label: "Time Saved", value: loading ? "—" : `${summaries.length * 2}h`, icon: Clock, color: "text-emerald-300", bg: "bg-emerald-500/20", border: "border-emerald-400/30" },
            ].map((stat) => (
              <div key={stat.label} className={`bg-white/[0.06] border ${stat.border} rounded-2xl p-5 flex items-center gap-4`}>
                <div className={`p-3 rounded-xl ${stat.bg} border ${stat.border} flex-shrink-0`}>
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">{stat.value}</div>
                  <div className="text-xs text-white/60 mt-0.5">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Search bar */}
          <div className="bg-white/[0.06] border border-white/[0.12] rounded-2xl p-5">
            <h2 className="text-base font-semibold text-white mb-4">Your Summaries</h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
              <Input
                placeholder="Search summaries..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`pl-10 ${inputClass}`}
              />
            </div>
          </div>

          {/* List */}
          <div className="space-y-3">
            {loading ? (
              // Skeleton loading — no blank white screen
              [1, 2, 3].map((i) => <SkeletonCard key={i} />)
            ) : filteredSummaries.length === 0 ? (
              <div className="bg-white/[0.06] border border-dashed border-white/[0.15] rounded-2xl p-12 text-center">
                <div className="w-16 h-16 bg-white/[0.06] rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="h-8 w-8 text-white/30" />
                </div>
                <h3 className="text-lg font-medium text-white mb-2">No summaries found</h3>
                <p className="text-white/50 mb-6 text-sm">
                  {searchTerm ? "Try adjusting your search terms" : "Start by uploading your first document"}
                </p>
                <Link href="/summarizer">
                  <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white border-0">
                    <Plus className="mr-2 h-4 w-4" />
                    Create First Summary
                  </Button>
                </Link>
              </div>
            ) : (
              filteredSummaries.map((summary) => (
                <div key={summary.id} className="bg-white/[0.06] border border-white/[0.10] hover:border-white/[0.20] rounded-2xl p-5 transition-all duration-200">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base font-semibold text-white mb-2 truncate">{summary.title}</h3>
                      <div className="flex items-center gap-3 mb-3">
                        <Badge className="bg-purple-500/25 text-purple-300 border border-purple-400/40 text-xs">
                          {summary.fileType}
                        </Badge>
                        <span className="text-xs text-white/50">
                          {new Date(summary.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                        </span>
                        {summary.updatedAt !== summary.createdAt && (
                          <span className="text-xs text-white/35">(Edited)</span>
                        )}
                      </div>
                      <p className="text-sm text-white/65 line-clamp-2 leading-relaxed mb-3">{summary.summary}</p>

                      {summary.keyPoints.length > 0 && (
                        <div className="space-y-1">
                          {summary.keyPoints.slice(0, 3).map((point, idx) => (
                            <div key={idx} className="flex items-start gap-2 text-xs text-white/55">
                              <span className="mt-1.5 w-1.5 h-1.5 bg-purple-400 rounded-full flex-shrink-0" />
                              <span className="line-clamp-1">{point}</span>
                            </div>
                          ))}
                          {summary.keyPoints.length > 3 && (
                            <span className="text-xs text-white/40 pl-3.5">+{summary.keyPoints.length - 3} more points</span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-1.5 flex-shrink-0">
                      <Button size="icon" variant="ghost" onClick={() => handleView(summary)}
                        className="h-8 w-8 text-white/60 hover:text-blue-300 hover:bg-blue-500/15 rounded-lg">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="ghost" onClick={() => handleEdit(summary)}
                        className="h-8 w-8 text-white/60 hover:text-purple-300 hover:bg-purple-500/15 rounded-lg">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="ghost" onClick={() => handleExport(summary)}
                        className="h-8 w-8 text-white/60 hover:text-emerald-300 hover:bg-emerald-500/15 rounded-lg">
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="ghost" onClick={() => handleDelete(summary.id)} disabled={isDeleting === summary.id}
                        className="h-8 w-8 text-white/60 hover:text-red-300 hover:bg-red-500/15 rounded-lg">
                        {isDeleting === summary.id
                          ? <Loader2 className="h-4 w-4 animate-spin" />
                          : <Trash2 className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* View Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto bg-[#150f28] border border-purple-500/30 text-white">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-white">{selectedSummary?.title}</DialogTitle>
            <DialogDescription className="text-white/50">
              Created: {selectedSummary && new Date(selectedSummary.createdAt).toLocaleString("id-ID")}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-5 py-2">
            <div>
              <h4 className="font-semibold text-white/80 text-sm uppercase tracking-wider mb-3">Summary</h4>
              <p className="text-white/70 leading-relaxed text-sm bg-white/[0.04] p-4 rounded-xl border border-white/[0.08]">
                {selectedSummary?.summary}
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-white/80 text-sm uppercase tracking-wider mb-3">Key Points</h4>
              <ul className="space-y-2">
                {selectedSummary?.keyPoints.map((point, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-sm text-white/70 bg-white/[0.04] p-3 rounded-xl border border-white/[0.06]">
                    <span className="mt-1.5 w-2 h-2 bg-purple-400 rounded-full flex-shrink-0" />
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto bg-[#150f28] border border-purple-500/30 text-white">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-white">Edit Summary</DialogTitle>
            <DialogDescription className="text-white/50">Make changes to your summary</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label className="text-white/70 text-sm">Title</Label>
              <Input
                value={editingSummary?.title || ""}
                onChange={(e) => setEditingSummary((p) => p ? { ...p, title: e.target.value } : null)}
                className="bg-black/40 border-white/[0.15] text-white focus:border-purple-500/60"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-white/70 text-sm">Summary</Label>
              <Textarea
                rows={6}
                value={editingSummary?.summary || ""}
                onChange={(e) => setEditingSummary((p) => p ? { ...p, summary: e.target.value } : null)}
                className="bg-black/40 border-white/[0.15] text-white focus:border-purple-500/60 resize-none"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-white/70 text-sm">Key Points</Label>
              <div className="space-y-2">
                {editingSummary?.keyPoints.map((point, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <Input
                      value={point}
                      onChange={(e) => {
                        if (!editingSummary) return
                        const pts = [...editingSummary.keyPoints]
                        pts[idx] = e.target.value
                        setEditingSummary({ ...editingSummary, keyPoints: pts })
                      }}
                      className="bg-black/40 border-white/[0.15] text-white focus:border-purple-500/60"
                    />
                    <Button size="icon" variant="ghost"
                      onClick={() => {
                        if (!editingSummary) return
                        setEditingSummary({ ...editingSummary, keyPoints: editingSummary.keyPoints.filter((_, i) => i !== idx) })
                      }}
                      className="flex-shrink-0 text-red-400/70 hover:text-red-400 hover:bg-red-500/15 h-9 w-9">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button variant="outline" size="sm"
                  onClick={() => {
                    if (!editingSummary) return
                    setEditingSummary({ ...editingSummary, keyPoints: [...editingSummary.keyPoints, ""] })
                  }}
                  className="bg-transparent border-white/[0.20] text-white/70 hover:bg-white/[0.08] hover:text-white">
                  + Add Key Point
                </Button>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}
              className="bg-transparent border-white/[0.20] text-white/70 hover:bg-white/[0.08] hover:text-white">
              Cancel
            </Button>
            <Button onClick={handleSaveEdit}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white border-0">
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
