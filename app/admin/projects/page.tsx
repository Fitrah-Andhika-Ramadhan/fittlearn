"use client"

import { CardFooter } from "@/components/ui/card"

import type React from "react"
import { useState, useEffect } from "react"
import { PlusCircle, Edit, Trash2, Save, XCircle } from "lucide-react"
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
  Badge,
  Switch,
} from "@/components/ui"
import { useCMSProjects } from "@/hooks/useCMS"
import type { CMSProject } from "@/lib/types"

type ProjectFormState = Omit<CMSProject, "id" | "createdAt" | "updatedAt" | "views" | "likes">

const initialFormState: ProjectFormState = {
  title: "",
  description: "",
  longDescription: "",
  tech: [],
  github: "",
  demo: "",
  image: "",
  featured: false,
  status: "draft",
  category: "",
}

export default function AdminProjects() {
  const { projects, loading, createProject, updateProject, deleteProject } = useCMSProjects()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingProject, setEditingProject] = useState<CMSProject | null>(null)
  const [formData, setFormData] = useState<ProjectFormState>(initialFormState)
  const [techInput, setTechInput] = useState("")
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null)

  useEffect(() => {
    if (editingProject) {
      setFormData({
        title: editingProject.title,
        description: editingProject.description,
        longDescription: editingProject.longDescription || "",
        tech: editingProject.tech,
        github: editingProject.github,
        demo: editingProject.demo,
        image: editingProject.image,
        featured: editingProject.featured,
        status: editingProject.status,
        category: editingProject.category,
      })
      setImagePreview(editingProject.image)
    } else {
      setFormData(initialFormState)
      setImagePreview(null)
    }
    setTechInput("")
    setSelectedImageFile(null)
  }, [editingProject, isModalOpen])

  const handleInputChange = (field: keyof ProjectFormState, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleTechAdd = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && techInput.trim() !== "") {
      e.preventDefault()
      setFormData((prev) => ({
        ...prev,
        tech: [...new Set([...prev.tech, techInput.trim()])],
      }))
      setTechInput("")
    }
  }

  const handleTechRemove = (techToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tech: prev.tech.filter((tech) => tech !== techToRemove),
    }))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
        setFormData((prev) => ({ ...prev, image: reader.result as string }))
      }
      reader.readAsDataURL(file)
    } else {
      setSelectedImageFile(null)
      setImagePreview(null)
      setFormData((prev) => ({ ...prev, image: "" }))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editingProject) {
        updateProject(editingProject.id, formData)
        alert("Project updated successfully!")
      } else {
        createProject(formData)
        alert("Project created successfully!")
      }
      setIsModalOpen(false)
    } catch (error) {
      console.error("Failed to save project:", error)
      alert("Failed to save project. Please try again.")
    }
  }

  const openCreateModal = () => {
    setEditingProject(null)
    setIsModalOpen(true)
  }

  const openEditModal = (project: CMSProject) => {
    setEditingProject(project)
    setIsModalOpen(true)
  }

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this project?")) {
      try {
        deleteProject(id)
        alert("Project deleted successfully!")
      } catch (error) {
        console.error("Failed to delete project:", error)
        alert("Failed to delete project. Please try again.")
      }
    }
  }

  if (loading) {
    return <div>Loading projects...</div>
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Project Management</h1>
          <p className="text-gray-600 mt-2">Manage your portfolio projects, add new ones, or edit existing entries.</p>
        </div>
        <Button onClick={openCreateModal}>
          <PlusCircle className="mr-2 h-5 w-5" />
          Add New Project
        </Button>
      </div>

      {/* Projects List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <Card key={project.id} className="flex flex-col">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{project.title}</CardTitle>
                <Badge variant={project.status === "published" ? "default" : "secondary"}>
                  {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                </Badge>
              </div>
              <CardDescription>{project.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              {project.image && (
                <img
                  src={project.image || "/placeholder.svg"}
                  alt={project.title}
                  className="w-full h-40 object-cover rounded-md mb-4"
                />
              )}
              <div className="flex flex-wrap gap-2 mb-4">
                {project.tech.map((tech, index) => (
                  <Badge key={index} variant="outline">
                    {tech}
                  </Badge>
                ))}
              </div>
              <p className="text-sm text-gray-700">Category: {project.category}</p>
              <p className="text-sm text-gray-700">Featured: {project.featured ? "Yes" : "No"}</p>
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
              <Button variant="outline" size="sm" onClick={() => openEditModal(project)}>
                <Edit className="h-4 w-4" />
                <span className="sr-only">Edit</span>
              </Button>
              <Button variant="destructive" size="sm" onClick={() => handleDelete(project.id)}>
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">Delete</span>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Project Add/Edit Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingProject ? "Edit Project" : "Add New Project"}</DialogTitle>
            <DialogDescription>
              {editingProject ? "Make changes to your project here." : "Add a new project to your portfolio."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                Title
              </Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Short Description
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                className="col-span-3"
                rows={2}
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="longDescription" className="text-right">
                Long Description
              </Label>
              <Textarea
                id="longDescription"
                value={formData.longDescription}
                onChange={(e) => handleInputChange("longDescription", e.target.value)}
                className="col-span-3"
                rows={4}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="category" className="text-right">
                Category
              </Label>
              <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Web Application">Web Application</SelectItem>
                  <SelectItem value="Mobile Application">Mobile Application</SelectItem>
                  <SelectItem value="Data Science">Data Science</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="tech" className="text-right">
                Technologies
              </Label>
              <div className="col-span-3">
                <Input
                  id="tech"
                  value={techInput}
                  onChange={(e) => setTechInput(e.target.value)}
                  onKeyDown={handleTechAdd}
                  placeholder="Type tech and press Enter (e.g., React, Node.js)"
                />
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.tech.map((tech, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      {tech}
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-auto p-0"
                        onClick={() => handleTechRemove(tech)}
                      >
                        <XCircle className="h-3 w-3" />
                        <span className="sr-only">Remove {tech}</span>
                      </Button>
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="github" className="text-right">
                GitHub URL
              </Label>
              <Input
                id="github"
                value={formData.github}
                onChange={(e) => handleInputChange("github", e.target.value)}
                className="col-span-3"
                type="url"
                placeholder="https://github.com/your-project"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="demo" className="text-right">
                Demo URL
              </Label>
              <Input
                id="demo"
                value={formData.demo}
                onChange={(e) => handleInputChange("demo", e.target.value)}
                className="col-span-3"
                type="url"
                placeholder="https://your-project-demo.com"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="image-upload" className="text-right">
                Project Image
              </Label>
              <div className="col-span-3">
                <Input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="col-span-3"
                />
                {imagePreview && (
                  <div className="mt-2">
                    <img
                      src={imagePreview || "/placeholder.svg"}
                      alt="Image Preview"
                      className="w-32 h-auto rounded-md object-cover"
                    />
                  </div>
                )}
                {!imagePreview && formData.image && (
                  <div className="mt-2">
                    <img
                      src={formData.image || "/placeholder.svg"}
                      alt="Current Image"
                      className="w-32 h-auto rounded-md object-cover"
                    />
                  </div>
                )}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="featured" className="text-right">
                Featured
              </Label>
              <Switch
                id="featured"
                checked={formData.featured}
                onCheckedChange={(checked) => handleInputChange("featured", checked)}
                className="col-span-3 justify-self-start"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">
                Status
              </Label>
              <Select
                value={formData.status}
                onValueChange={(value) => handleInputChange("status", value as "draft" | "published" | "archived")}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <DialogFooter>
              <Button type="submit">
                <Save className="mr-2 h-4 w-4" />
                {editingProject ? "Save Changes" : "Create Project"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
