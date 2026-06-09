"use client"

import { CardFooter } from "@/components/ui/card"

import type React from "react"
import { useState, useEffect } from "react"
import { PlusCircle, Edit, Trash2, Save, XCircle, Loader2, Plus, Trophy } from "lucide-react"
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
import { uploadFile } from "@/lib/supabase"

type ProjectFormState = Omit<CMSProject, "id" | "createdAt" | "updatedAt" | "views" | "likes"> & { keyAchievements: string[] }

const initialFormState: ProjectFormState = {
  title: "",
  description: "",
  longDescription: "",
  keyAchievements: [""],
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
  const [isUploading, setIsUploading] = useState(false)

  useEffect(() => {
    if (editingProject) {
      setFormData({
        title: editingProject.title,
        description: editingProject.description,
        longDescription: editingProject.longDescription || "",
        keyAchievements: editingProject.keyAchievements?.length > 0 ? editingProject.keyAchievements : [""],
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
      }
      reader.readAsDataURL(file)
    } else {
      setSelectedImageFile(null)
      setImagePreview(null)
      setFormData((prev) => ({ ...prev, image: "" }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsUploading(true)
    try {
      let finalImageUrl = formData.image

      if (selectedImageFile) {
        try {
          finalImageUrl = await uploadFile(selectedImageFile, "portfolio-storage", "projects")
        } catch (uploadError) {
          console.error("Upload failed", uploadError)
          alert("Failed to upload image to Supabase. Check if the bucket exists and is public.")
          setIsUploading(false)
          return
        }
      }

      const finalData = { ...formData, image: finalImageUrl, keyAchievements: formData.keyAchievements.filter(Boolean) }

      if (editingProject) {
        updateProject(editingProject.id, finalData)
        alert("Project updated successfully!")
      } else {
        createProject(finalData)
        alert("Project created successfully!")
      }
      setIsModalOpen(false)
    } catch (error) {
      console.error("Failed to save project:", error)
      alert("Failed to save project. Please try again.")
    } finally {
      setIsUploading(false)
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
    return <div className="text-white">Loading projects...</div>
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center bg-white/5 backdrop-blur-xl p-6 rounded-2xl border border-white/10">
        <div>
          <h1 className="text-3xl font-bold text-white bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400">Project Management</h1>
          <p className="text-white/60 mt-2">Manage your portfolio projects, add new ones, or edit existing entries.</p>
        </div>
        <Button onClick={openCreateModal} className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white border-0 shadow-[0_0_15px_rgba(168,85,247,0.4)]">
          <PlusCircle className="mr-2 h-5 w-5" />
          Add New Project
        </Button>
      </div>

      {/* Projects List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <Card key={project.id} className="flex flex-col bg-white/5 backdrop-blur-xl border-white/10 overflow-hidden relative group hover:border-white/30 transition-all duration-300">
            <div className={`absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
            <CardHeader className="relative z-10">
              <div className="flex items-center justify-between">
                <CardTitle className="text-white text-xl">{project.title}</CardTitle>
                <span
                  className={`px-3 py-1 text-xs rounded-full font-medium border ${
                    (project.status || "draft") === "published"
                      ? "bg-green-500/10 text-green-400 border-green-500/30"
                      : "bg-yellow-500/10 text-yellow-400 border-yellow-500/30"
                  }`}
                >
                  {(project.status || "draft").charAt(0).toUpperCase() + (project.status || "draft").slice(1)}
                </span>
              </div>
              <CardDescription className="text-white/50">{project.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow relative z-10">
              {project.image ? (
                <div className="w-full h-40 overflow-hidden rounded-xl mb-4 relative border border-white/10">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500"></div>
                </div>
              ) : (
                <div className="w-full h-40 bg-black/40 border border-white/5 rounded-xl mb-4 flex items-center justify-center">
                  <span className="text-white/30">No Image</span>
                </div>
              )}
              <div className="flex flex-wrap gap-2 mb-4">
                {project.tech.map((tech, index) => (
                  <Badge key={index} variant="outline" className="bg-white/5 text-purple-300 border-purple-500/30">
                    {tech}
                  </Badge>
                ))}
              </div>
              <div className="space-y-1 bg-black/20 p-3 rounded-lg border border-white/5">
                <p className="text-sm text-white/70"><span className="text-white/40">Category:</span> {project.category}</p>
                <p className="text-sm text-white/70"><span className="text-white/40">Featured:</span> {project.featured ? "Yes" : "No"}</p>
              </div>
              {project.keyAchievements?.length > 0 && project.keyAchievements.some(Boolean) && (
                <div className="mt-3">
                  <p className="text-xs text-white/40 mb-1.5 flex items-center gap-1">
                    <Trophy className="h-3 w-3 text-yellow-400" /> Key Achievements
                  </p>
                  <ul className="space-y-1">
                    {project.keyAchievements.filter(Boolean).slice(0, 2).map((ach, i) => (
                      <li key={i} className="flex items-start text-xs text-white/60">
                        <span className="inline-block w-1.5 h-1.5 bg-purple-500 rounded-full mt-1 mr-2 flex-shrink-0" />
                        {ach}
                      </li>
                    ))}
                    {project.keyAchievements.filter(Boolean).length > 2 && (
                      <li className="text-xs text-white/30 pl-3.5">+{project.keyAchievements.filter(Boolean).length - 2} more...</li>
                    )}
                  </ul>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-end gap-3 border-t border-white/5 pt-4 relative z-10 bg-black/10">
              <Button variant="outline" size="sm" onClick={() => openEditModal(project)} className="bg-transparent border-blue-500/50 text-blue-400 hover:bg-blue-500/20 hover:text-blue-300">
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
              <Button variant="destructive" size="sm" onClick={() => handleDelete(project.id)} className="bg-red-500/20 text-red-400 border border-red-500/50 hover:bg-red-500/40 hover:text-red-300">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Project Add/Edit Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto bg-[#1a142c] border border-purple-500/30 text-white shadow-[0_0_50px_rgba(0,0,0,0.8)]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400">
              {editingProject ? "Edit Project" : "Add New Project"}
            </DialogTitle>
            <DialogDescription className="text-white/50">
              {editingProject ? "Make changes to your project here." : "Add a new project to your portfolio."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="grid gap-6 py-4">
            
            <div className="bg-black/30 p-5 rounded-xl border border-white/5 space-y-5">
              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="title" className="text-right mt-3 text-white/80">Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  className="col-span-3 bg-black/50 border-white/10 text-white focus:border-purple-500/50 focus:ring-purple-500/20"
                  required
                />
              </div>
              
              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="description" className="text-right mt-3 text-white/80">Short Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  className="col-span-3 bg-black/50 border-white/10 text-white focus:border-purple-500/50 focus:ring-purple-500/20"
                  rows={2}
                  required
                />
              </div>
              
              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="longDescription" className="text-right mt-3 text-white/80">Long Description</Label>
                <Textarea
                  id="longDescription"
                  value={formData.longDescription}
                  onChange={(e) => handleInputChange("longDescription", e.target.value)}
                  className="col-span-3 bg-black/50 border-white/10 text-white focus:border-purple-500/50 focus:ring-purple-500/20"
                  rows={4}
                />
              </div>
            </div>

            {/* Key Achievements */}
            <div className="bg-black/30 p-5 rounded-xl border border-white/5 space-y-4">
              <Label className="text-white/80 flex items-center gap-2">
                <Trophy className="h-4 w-4 text-yellow-400" />
                Key Achievements
              </Label>
              <div className="space-y-3">
                {formData.keyAchievements.map((achievement, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-purple-500 flex-shrink-0" />
                    <input
                      type="text"
                      value={achievement}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          keyAchievements: prev.keyAchievements.map((a, i) => (i === index ? e.target.value : a)),
                        }))
                      }
                      placeholder="Describe a key achievement or impact"
                      className="flex-1 bg-black/50 border border-white/10 text-white text-sm rounded-md px-3 py-2 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20 placeholder:text-white/30"
                    />
                    {formData.keyAchievements.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setFormData((prev) => ({
                            ...prev,
                            keyAchievements: prev.keyAchievements.filter((_, i) => i !== index),
                          }))
                        }
                        className="bg-transparent border-red-500/50 text-red-400 hover:bg-red-500/20 hover:text-red-300 h-8 w-8 p-0 flex-shrink-0"
                      >
                        <XCircle className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      keyAchievements: [...prev.keyAchievements, ""],
                    }))
                  }
                  className="mt-1 bg-purple-500/10 border-purple-500/30 text-purple-300 hover:bg-purple-500/20 hover:text-purple-200"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Achievement
                </Button>
              </div>
            </div>

            <div className="bg-black/30 p-5 rounded-xl border border-white/5 space-y-5">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="category" className="text-right text-white/80">Category</Label>
                <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                  <SelectTrigger className="col-span-3 bg-black/50 border-white/10 text-white">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1a142c] border-white/10 text-white">
                    <SelectItem value="Web Application" className="focus:bg-purple-600/30 focus:text-white">Web Application</SelectItem>
                    <SelectItem value="Mobile Application" className="focus:bg-purple-600/30 focus:text-white">Mobile Application</SelectItem>
                    <SelectItem value="Data Science" className="focus:bg-purple-600/30 focus:text-white">Data Science</SelectItem>
                    <SelectItem value="Other" className="focus:bg-purple-600/30 focus:text-white">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="tech" className="text-right mt-3 text-white/80">Technologies</Label>
                <div className="col-span-3">
                  <Input
                    id="tech"
                    value={techInput}
                    onChange={(e) => setTechInput(e.target.value)}
                    onKeyDown={handleTechAdd}
                    placeholder="Type tech and press Enter (e.g., React)"
                    className="bg-black/50 border-white/10 text-white focus:border-purple-500/50 focus:ring-purple-500/20"
                  />
                  <div className="flex flex-wrap gap-2 mt-3">
                    {formData.tech.map((tech, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center gap-1 bg-purple-500/20 text-purple-300 border border-purple-500/30 hover:bg-purple-500/40 pr-1 py-1">
                        {tech}
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-5 w-5 p-0 rounded-full hover:bg-purple-500/50 ml-1 text-purple-200"
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
            </div>

            <div className="bg-black/30 p-5 rounded-xl border border-white/5 space-y-5">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="github" className="text-right text-white/80">GitHub URL</Label>
                <Input
                  id="github"
                  value={formData.github}
                  onChange={(e) => handleInputChange("github", e.target.value)}
                  className="col-span-3 bg-black/50 border-white/10 text-white focus:border-purple-500/50 focus:ring-purple-500/20"
                  type="url"
                  placeholder="https://github.com/..."
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="demo" className="text-right text-white/80">Demo URL</Label>
                <Input
                  id="demo"
                  value={formData.demo}
                  onChange={(e) => handleInputChange("demo", e.target.value)}
                  className="col-span-3 bg-black/50 border-white/10 text-white focus:border-purple-500/50 focus:ring-purple-500/20"
                  type="url"
                  placeholder="https://..."
                />
              </div>
            </div>

            <div className="bg-black/30 p-5 rounded-xl border border-white/5 space-y-5">
              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="image-upload" className="text-right mt-3 text-white/80">Project Image</Label>
                <div className="col-span-3">
                  <Input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="bg-black/50 border-white/10 text-white file:bg-white/10 file:text-white file:border-0 file:mr-4 file:py-1 file:px-3 file:rounded-md hover:file:bg-white/20"
                  />
                  <div className="mt-3 bg-black/40 p-2 rounded-lg border border-white/5 inline-block">
                    {imagePreview ? (
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-40 h-28 rounded-md object-cover border border-white/10"
                      />
                    ) : formData.image ? (
                      <img
                        src={formData.image}
                        alt="Current"
                        className="w-40 h-28 rounded-md object-cover border border-white/10"
                      />
                    ) : (
                      <div className="w-40 h-28 rounded-md bg-black/50 border border-dashed border-white/20 flex flex-col items-center justify-center text-white/30 text-xs">
                        <span>No Image</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-6 p-4 bg-purple-500/10 border border-purple-500/20 rounded-xl">
              <div className="flex-1 flex items-center gap-4">
                <Label htmlFor="status" className="text-white/80 whitespace-nowrap">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => handleInputChange("status", value as "draft" | "published" | "archived")}
                >
                  <SelectTrigger className="w-full bg-black/50 border-white/10 text-white">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1a142c] border-white/10 text-white">
                    <SelectItem value="draft" className="focus:bg-purple-600/30 focus:text-white">Draft</SelectItem>
                    <SelectItem value="published" className="focus:bg-purple-600/30 focus:text-white text-green-400">Published</SelectItem>
                    <SelectItem value="archived" className="focus:bg-purple-600/30 focus:text-white text-yellow-400">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-4 border-l border-white/10 pl-6">
                <Label htmlFor="featured" className="text-white/80">Featured</Label>
                <Switch
                  id="featured"
                  checked={formData.featured}
                  onCheckedChange={(checked) => handleInputChange("featured", checked)}
                  className="data-[state=checked]:bg-purple-500"
                />
              </div>
            </div>

            <DialogFooter className="mt-4">
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)} className="bg-transparent border-white/20 text-white hover:bg-white/10">
                Cancel
              </Button>
              <Button type="submit" disabled={isUploading} className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white border-0 shadow-[0_0_15px_rgba(168,85,247,0.4)]">
                {isUploading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Save className="mr-2 h-4 w-4" />
                )}
                {editingProject ? "Save Changes" : "Create Project"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
