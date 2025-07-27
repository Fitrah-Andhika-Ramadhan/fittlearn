"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Edit, Trash2, Eye, Star, Search, Filter, ExternalLink, Github } from "lucide-react"
import { useCMSProjects } from "@/hooks/useCMS"
import type { CMSProject } from "@/lib/types"

export default function AdminProjects() {
  const { projects, createProject, updateProject, deleteProject } = useCMSProjects()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingProject, setEditingProject] = useState<CMSProject | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    longDescription: "",
    tech: "",
    github: "",
    demo: "",
    image: "",
    category: "",
    featured: false,
    status: "draft" as "draft" | "published" | "archived",
  })

  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || project.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      longDescription: "",
      tech: "",
      github: "",
      demo: "",
      image: "",
      category: "",
      featured: false,
      status: "draft",
    })
  }

  const handleCreate = async () => {
    if (!formData.title || !formData.description) {
      alert("Please fill in required fields")
      return
    }

    setIsSubmitting(true)
    try {
      await createProject({
        ...formData,
        tech: formData.tech
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        image: formData.image || "/placeholder.svg?height=200&width=300",
      })

      setIsCreateDialogOpen(false)
      resetForm()
    } catch (error) {
      alert("Error creating project")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEdit = (project: CMSProject) => {
    setEditingProject(project)
    setFormData({
      title: project.title,
      description: project.description,
      longDescription: project.longDescription || "",
      tech: project.tech.join(", "),
      github: project.github,
      demo: project.demo,
      image: project.image,
      category: project.category,
      featured: project.featured,
      status: project.status,
    })
    setIsEditDialogOpen(true)
  }

  const handleUpdate = async () => {
    if (!editingProject || !formData.title || !formData.description) {
      alert("Please fill in required fields")
      return
    }

    setIsSubmitting(true)
    try {
      await updateProject(editingProject.id, {
        ...formData,
        tech: formData.tech
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
      })

      setIsEditDialogOpen(false)
      setEditingProject(null)
      resetForm()
    } catch (error) {
      alert("Error updating project")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return

    try {
      await deleteProject(id)
    } catch (error) {
      alert("Error deleting project")
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "published":
        return "bg-green-100 text-green-800"
      case "draft":
        return "bg-yellow-100 text-yellow-800"
      case "archived":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Projects</h1>
          <p className="text-gray-600 mt-2">Manage your portfolio projects</p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Project
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Projects Grid */}
      <div className="grid gap-6">
        {filteredProjects.map((project) => (
          <Card key={project.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="text-xl font-semibold text-gray-900">{project.title}</h3>
                    {project.featured && <Star className="h-5 w-5 text-yellow-500 fill-current" />}
                    <Badge className={getStatusColor(project.status)}>{project.status}</Badge>
                  </div>

                  <p className="text-gray-600 mb-4">{project.description}</p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tech.map((tech, index) => (
                      <Badge key={index} variant="secondary">
                        {tech}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Eye className="h-4 w-4" />
                      <span>{project.views} views</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span>Category: {project.category}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span>Updated: {new Date(project.updatedAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 ml-4">
                  <Button size="sm" variant="outline" asChild>
                    <a href={project.github} target="_blank" rel="noopener noreferrer">
                      <Github className="h-4 w-4" />
                    </a>
                  </Button>
                  <Button size="sm" variant="outline" asChild>
                    <a href={project.demo} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleEdit(project)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleDelete(project.id, project.title)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredProjects.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Plus className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No projects found</h3>
            <p className="text-gray-500 mb-6">
              {searchTerm || statusFilter !== "all"
                ? "Try adjusting your search or filter criteria"
                : "Get started by creating your first project"}
            </p>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Your First Project
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Create Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Project</DialogTitle>
            <DialogDescription>Create a new project for your portfolio</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                  placeholder="Project title"
                />
              </div>
              <div>
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  value={formData.category}
                  onChange={(e) => setFormData((prev) => ({ ...prev, category: e.target.value }))}
                  placeholder="e.g., Web Application"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                placeholder="Brief project description"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="longDescription">Long Description</Label>
              <Textarea
                id="longDescription"
                value={formData.longDescription}
                onChange={(e) => setFormData((prev) => ({ ...prev, longDescription: e.target.value }))}
                placeholder="Detailed project description"
                rows={4}
              />
            </div>

            <div>
              <Label htmlFor="tech">Technologies</Label>
              <Input
                id="tech"
                value={formData.tech}
                onChange={(e) => setFormData((prev) => ({ ...prev, tech: e.target.value }))}
                placeholder="React, Next.js, TypeScript (comma separated)"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="github">GitHub URL</Label>
                <Input
                  id="github"
                  value={formData.github}
                  onChange={(e) => setFormData((prev) => ({ ...prev, github: e.target.value }))}
                  placeholder="https://github.com/..."
                />
              </div>
              <div>
                <Label htmlFor="demo">Demo URL</Label>
                <Input
                  id="demo"
                  value={formData.demo}
                  onChange={(e) => setFormData((prev) => ({ ...prev, demo: e.target.value }))}
                  placeholder="https://demo.com"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="image">Image URL</Label>
              <Input
                id="image"
                value={formData.image}
                onChange={(e) => setFormData((prev) => ({ ...prev, image: e.target.value }))}
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value: "draft" | "published" | "archived") =>
                    setFormData((prev) => ({ ...prev, status: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2 pt-6">
                <input
                  type="checkbox"
                  id="featured"
                  checked={formData.featured}
                  onChange={(e) => setFormData((prev) => ({ ...prev, featured: e.target.checked }))}
                  className="rounded"
                />
                <Label htmlFor="featured">Featured Project</Label>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreate} disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Project"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Project</DialogTitle>
            <DialogDescription>Update project information</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-title">Title *</Label>
                <Input
                  id="edit-title"
                  value={formData.title}
                  onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                  placeholder="Project title"
                />
              </div>
              <div>
                <Label htmlFor="edit-category">Category</Label>
                <Input
                  id="edit-category"
                  value={formData.category}
                  onChange={(e) => setFormData((prev) => ({ ...prev, category: e.target.value }))}
                  placeholder="e.g., Web Application"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="edit-description">Description *</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                placeholder="Brief project description"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="edit-longDescription">Long Description</Label>
              <Textarea
                id="edit-longDescription"
                value={formData.longDescription}
                onChange={(e) => setFormData((prev) => ({ ...prev, longDescription: e.target.value }))}
                placeholder="Detailed project description"
                rows={4}
              />
            </div>

            <div>
              <Label htmlFor="edit-tech">Technologies</Label>
              <Input
                id="edit-tech"
                value={formData.tech}
                onChange={(e) => setFormData((prev) => ({ ...prev, tech: e.target.value }))}
                placeholder="React, Next.js, TypeScript (comma separated)"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-github">GitHub URL</Label>
                <Input
                  id="edit-github"
                  value={formData.github}
                  onChange={(e) => setFormData((prev) => ({ ...prev, github: e.target.value }))}
                  placeholder="https://github.com/..."
                />
              </div>
              <div>
                <Label htmlFor="edit-demo">Demo URL</Label>
                <Input
                  id="edit-demo"
                  value={formData.demo}
                  onChange={(e) => setFormData((prev) => ({ ...prev, demo: e.target.value }))}
                  placeholder="https://demo.com"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="edit-image">Image URL</Label>
              <Input
                id="edit-image"
                value={formData.image}
                onChange={(e) => setFormData((prev) => ({ ...prev, image: e.target.value }))}
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value: "draft" | "published" | "archived") =>
                    setFormData((prev) => ({ ...prev, status: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2 pt-6">
                <input
                  type="checkbox"
                  id="edit-featured"
                  checked={formData.featured}
                  onChange={(e) => setFormData((prev) => ({ ...prev, featured: e.target.checked }))}
                  className="rounded"
                />
                <Label htmlFor="edit-featured">Featured Project</Label>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdate} disabled={isSubmitting}>
              {isSubmitting ? "Updating..." : "Update Project"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
