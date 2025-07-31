"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useCMSProjects } from "@/hooks/useCMS"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import Image from "next/image"
import type { CMSProject } from "@/lib/types"

export default function ProjectsPage() {
  const { projects, loading, createProject, updateProject, deleteProject } = useCMSProjects()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [currentProject, setCurrentProject] = useState<CMSProject | null>(null)
  const [formData, setFormData] = useState<Omit<CMSProject, "id" | "createdAt" | "updatedAt" | "views" | "likes">>({
    name: "",
    description: "",
    longDescription: "",
    category: "Web Development",
    status: "In Progress",
    technologies: [],
    image: "/placeholder.svg?height=200&width=300",
    url: "",
    github: "",
    isFeatured: false,
  })
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null)
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null)

  useEffect(() => {
    if (currentProject) {
      setFormData({
        name: currentProject.name,
        description: currentProject.description,
        longDescription: currentProject.longDescription,
        category: currentProject.category,
        status: currentProject.status,
        technologies: currentProject.technologies,
        image: currentProject.image,
        url: currentProject.url,
        github: currentProject.github,
        isFeatured: currentProject.isFeatured,
      })
      setImagePreviewUrl(currentProject.image)
    } else {
      setFormData({
        name: "",
        description: "",
        longDescription: "",
        category: "Web Development",
        status: "In Progress",
        technologies: [],
        image: "/placeholder.svg?height=200&width=300",
        url: "",
        github: "",
        isFeatured: false,
      })
      setSelectedImageFile(null)
      setImagePreviewUrl(null)
    }
  }, [currentProject, isDialogOpen]) // Reset form when dialog closes or currentProject changes

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type, checked } = e.target as HTMLInputElement
    if (name === "technologies") {
      setFormData((prev) => ({
        ...prev,
        technologies: value.split(",").map((tech) => tech.trim()),
      }))
    } else if (type === "checkbox") {
      setFormData((prev) => ({
        ...prev,
        [name]: checked,
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }))
    }
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreviewUrl(reader.result as string)
        setFormData((prev) => ({
          ...prev,
          image: reader.result as string, // Store as Data URL
        }))
      }
      reader.readAsDataURL(file)
    } else {
      setSelectedImageFile(null)
      setImagePreviewUrl(null)
      setFormData((prev) => ({
        ...prev,
        image: "/placeholder.svg?height=200&width=300", // Reset to placeholder
      }))
    }
  }

  const handleCreate = () => {
    createProject(formData)
    setIsDialogOpen(false)
  }

  const handleUpdate = () => {
    if (currentProject) {
      updateProject(currentProject.id, formData)
      setIsDialogOpen(false)
    }
  }

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      deleteProject(id)
    }
  }

  if (loading) {
    return <div>Loading projects...</div>
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Project Management</h1>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button onClick={() => setCurrentProject(null)} className="mb-6">
            Add New Project
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{currentProject ? "Edit Project" : "Add New Project"}</DialogTitle>
            <DialogDescription>
              {currentProject ? "Make changes to your project here." : "Add a new project to your portfolio."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input id="name" name="name" value={formData.name} onChange={handleInputChange} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Short Description
              </Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="longDescription" className="text-right">
                Long Description
              </Label>
              <Textarea
                id="longDescription"
                name="longDescription"
                value={formData.longDescription}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="category" className="text-right">
                Category
              </Label>
              <Select
                name="category"
                value={formData.category}
                onValueChange={(value) => handleSelectChange("category", value)}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Web Development">Web Development</SelectItem>
                  <SelectItem value="Mobile Application">Mobile Application</SelectItem>
                  <SelectItem value="Data Science">Data Science</SelectItem>
                  <SelectItem value="Machine Learning">Machine Learning</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">
                Status
              </Label>
              <Select
                name="status"
                value={formData.status}
                onValueChange={(value) => handleSelectChange("status", value)}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Completed">Completed</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Planned">Planned</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="technologies" className="text-right">
                Technologies (comma-separated)
              </Label>
              <Input
                id="technologies"
                name="technologies"
                value={formData.technologies.join(", ")}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="image" className="text-right">
                Image
              </Label>
              <div className="col-span-3 flex flex-col gap-2">
                <Input id="image" name="image" type="file" accept="image/*" onChange={handleImageChange} />
                {imagePreviewUrl && (
                  <Image
                    src={imagePreviewUrl || "/placeholder.svg"}
                    alt="Project Preview"
                    width={200}
                    height={150}
                    className="mt-2 rounded-md object-cover"
                  />
                )}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="url" className="text-right">
                Live URL
              </Label>
              <Input id="url" name="url" value={formData.url} onChange={handleInputChange} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="github" className="text-right">
                GitHub URL
              </Label>
              <Input
                id="github"
                name="github"
                value={formData.github}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="isFeatured" className="text-right">
                Featured
              </Label>
              <Input
                id="isFeatured"
                name="isFeatured"
                type="checkbox"
                checked={formData.isFeatured}
                onChange={handleInputChange}
                className="col-span-3 h-4 w-4"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" onClick={currentProject ? handleUpdate : handleCreate}>
              {currentProject ? "Save Changes" : "Add Project"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <Card key={project.id}>
            <CardHeader>
              <CardTitle>{project.name}</CardTitle>
              <CardDescription>{project.description}</CardDescription>
            </CardHeader>
            <CardContent>
              {project.image && (
                <Image
                  src={project.image || "/placeholder.svg"}
                  alt={project.name}
                  width={300}
                  height={200}
                  className="mb-4 rounded-md object-cover w-full h-48"
                />
              )}
              <p className="text-sm text-gray-500 dark:text-gray-400">Category: {project.category}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Status: {project.status}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Technologies: {project.technologies.join(", ")}
              </p>
              {project.url && (
                <a
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline text-sm"
                >
                  Live Demo
                </a>
              )}
              {project.github && (
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline text-sm ml-2"
                >
                  GitHub
                </a>
              )}
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setCurrentProject(project)
                  setIsDialogOpen(true)
                }}
              >
                Edit
              </Button>
              <Button variant="destructive" size="sm" onClick={() => handleDelete(project.id)}>
                Delete
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
