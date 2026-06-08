"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
import { Plus, Edit, Trash2, Search, Briefcase, Calendar, Building, Clock } from "lucide-react"
import { useCMSExperiences } from "@/hooks/useCMS"
import type { CMSExperience } from "@/lib/types"

export default function AdminExperience() {
  const { experiences, createExperience, updateExperience, deleteExperience } = useCMSExperiences()
  const [searchTerm, setSearchTerm] = useState("")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingExperience, setEditingExperience] = useState<CMSExperience | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    company: "",
    period: "",
    description: "",
    achievements: [""],
    current: false,
    order: 0,
  })

  const filteredExperiences = experiences.filter(
    (exp) =>
      exp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exp.company.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const resetForm = () => {
    setFormData({
      title: "",
      company: "",
      period: "",
      description: "",
      achievements: [""],
      current: false,
      order: experiences.length + 1,
    })
  }

  const handleCreate = async () => {
    if (!formData.title || !formData.company || !formData.period) {
      alert("Please fill in required fields")
      return
    }

    setIsSubmitting(true)
    try {
      await createExperience({
        ...formData,
        achievements: formData.achievements.filter(Boolean),
        order: formData.order || experiences.length + 1,
      })

      setIsCreateDialogOpen(false)
      resetForm()
    } catch (error) {
      alert("Error creating experience")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEdit = (experience: CMSExperience) => {
    setEditingExperience(experience)
    setFormData({
      title: experience.title,
      company: experience.company,
      period: experience.period,
      description: experience.description,
      achievements: experience.achievements.length > 0 ? experience.achievements : [""],
      current: experience.current,
      order: experience.order,
    })
    setIsEditDialogOpen(true)
  }

  const handleUpdate = async () => {
    if (!editingExperience || !formData.title || !formData.company || !formData.period) {
      alert("Please fill in required fields")
      return
    }

    setIsSubmitting(true)
    try {
      await updateExperience(editingExperience.id, {
        ...formData,
        achievements: formData.achievements.filter(Boolean),
      })

      setIsEditDialogOpen(false)
      setEditingExperience(null)
      resetForm()
    } catch (error) {
      alert("Error updating experience")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return

    try {
      await deleteExperience(id)
    } catch (error) {
      alert("Error deleting experience")
    }
  }

  const addAchievement = () => {
    setFormData((prev) => ({
      ...prev,
      achievements: [...prev.achievements, ""],
    }))
  }

  const updateAchievement = (index: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      achievements: prev.achievements.map((ach, i) => (i === index ? value : ach)),
    }))
  }

  const removeAchievement = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      achievements: prev.achievements.filter((_, i) => i !== index),
    }))
  }

  const currentExperiences = filteredExperiences.filter((exp) => exp.current)
  const pastExperiences = filteredExperiences.filter((exp) => !exp.current)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Experience Management</h1>
          <p className="text-gray-600 mt-2">Manage your work experience and career history</p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Experience
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Experience</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{experiences.length}</div>
            <p className="text-xs text-muted-foreground">Work experiences</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Roles</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentExperiences.length}</div>
            <p className="text-xs text-muted-foreground">Active positions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Companies</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{new Set(experiences.map((exp) => exp.company)).size}</div>
            <p className="text-xs text-muted-foreground">Different organizations</p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search experiences..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Current Experience */}
      {currentExperiences.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <Clock className="h-5 w-5 mr-2 text-green-600" />
            Current Experience
          </h2>
          <div className="space-y-4">
            {currentExperiences.map((experience) => (
              <Card key={experience.id} className="border-l-4 border-l-green-500">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="flex items-center text-lg">
                        <Briefcase className="h-5 w-5 mr-2 text-blue-600" />
                        {experience.title}
                      </CardTitle>
                      <div className="flex items-center gap-4 mt-2 text-gray-600">
                        <div className="flex items-center">
                          <Building className="h-4 w-4 mr-1" />
                          {experience.company}
                        </div>
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {experience.period}
                        </div>
                        <Badge className="bg-green-100 text-green-800">Current</Badge>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline" onClick={() => handleEdit(experience)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleDelete(experience.id, experience.title)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 mb-4">{experience.description}</p>
                  <div>
                    <h4 className="font-medium mb-2">Key Achievements:</h4>
                    <ul className="space-y-1">
                      {experience.achievements.map((achievement, index) => (
                        <li key={index} className="flex items-start text-sm text-gray-600">
                          <span className="inline-block w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                          {achievement}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Past Experience */}
      {pastExperiences.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <Briefcase className="h-5 w-5 mr-2 text-gray-600" />
            Past Experience
          </h2>
          <div className="space-y-4">
            {pastExperiences.map((experience) => (
              <Card key={experience.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="flex items-center text-lg">
                        <Briefcase className="h-5 w-5 mr-2 text-blue-600" />
                        {experience.title}
                      </CardTitle>
                      <div className="flex items-center gap-4 mt-2 text-gray-600">
                        <div className="flex items-center">
                          <Building className="h-4 w-4 mr-1" />
                          {experience.company}
                        </div>
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {experience.period}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline" onClick={() => handleEdit(experience)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleDelete(experience.id, experience.title)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 mb-4">{experience.description}</p>
                  <div>
                    <h4 className="font-medium mb-2">Key Achievements:</h4>
                    <ul className="space-y-1">
                      {experience.achievements.map((achievement, index) => (
                        <li key={index} className="flex items-start text-sm text-gray-600">
                          <span className="inline-block w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                          {achievement}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {filteredExperiences.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Briefcase className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No experience found</h3>
            <p className="text-gray-500 mb-6">
              {searchTerm ? "Try adjusting your search terms" : "Start by adding your first work experience"}
            </p>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Your First Experience
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Create Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Experience</DialogTitle>
            <DialogDescription>Add a new work experience to your portfolio</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title">Job Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g., Frontend Developer"
                />
              </div>
              <div>
                <Label htmlFor="company">Company *</Label>
                <Input
                  id="company"
                  value={formData.company}
                  onChange={(e) => setFormData((prev) => ({ ...prev, company: e.target.value }))}
                  placeholder="e.g., Telkom University"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="period">Period *</Label>
              <Input
                id="period"
                value={formData.period}
                onChange={(e) => setFormData((prev) => ({ ...prev, period: e.target.value }))}
                placeholder="e.g., Jan 2023 - Present"
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                placeholder="Brief description of your role and responsibilities"
                rows={3}
              />
            </div>

            <div>
              <Label>Key Achievements</Label>
              <div className="space-y-2 mt-2">
                {formData.achievements.map((achievement, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Input
                      value={achievement}
                      onChange={(e) => updateAchievement(index, e.target.value)}
                      placeholder="Describe an achievement or responsibility"
                    />
                    {formData.achievements.length > 1 && (
                      <Button size="sm" variant="outline" onClick={() => removeAchievement(index)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button variant="outline" size="sm" onClick={addAchievement}>
                  Add Achievement
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="order">Display Order</Label>
                <Input
                  id="order"
                  type="number"
                  value={formData.order}
                  onChange={(e) => setFormData((prev) => ({ ...prev, order: Number.parseInt(e.target.value) || 0 }))}
                  placeholder="1"
                />
              </div>
              <div className="flex items-center space-x-2 pt-6">
                <input
                  type="checkbox"
                  id="current"
                  checked={formData.current}
                  onChange={(e) => setFormData((prev) => ({ ...prev, current: e.target.checked }))}
                  className="rounded"
                />
                <Label htmlFor="current">Current Position</Label>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreate} disabled={isSubmitting}>
              {isSubmitting ? "Adding..." : "Add Experience"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Experience</DialogTitle>
            <DialogDescription>Update experience information</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-title">Job Title *</Label>
                <Input
                  id="edit-title"
                  value={formData.title}
                  onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g., Frontend Developer"
                />
              </div>
              <div>
                <Label htmlFor="edit-company">Company *</Label>
                <Input
                  id="edit-company"
                  value={formData.company}
                  onChange={(e) => setFormData((prev) => ({ ...prev, company: e.target.value }))}
                  placeholder="e.g., Telkom University"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="edit-period">Period *</Label>
              <Input
                id="edit-period"
                value={formData.period}
                onChange={(e) => setFormData((prev) => ({ ...prev, period: e.target.value }))}
                placeholder="e.g., Jan 2023 - Present"
              />
            </div>

            <div>
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                placeholder="Brief description of your role and responsibilities"
                rows={3}
              />
            </div>

            <div>
              <Label>Key Achievements</Label>
              <div className="space-y-2 mt-2">
                {formData.achievements.map((achievement, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Input
                      value={achievement}
                      onChange={(e) => updateAchievement(index, e.target.value)}
                      placeholder="Describe an achievement or responsibility"
                    />
                    {formData.achievements.length > 1 && (
                      <Button size="sm" variant="outline" onClick={() => removeAchievement(index)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button variant="outline" size="sm" onClick={addAchievement}>
                  Add Achievement
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-order">Display Order</Label>
                <Input
                  id="edit-order"
                  type="number"
                  value={formData.order}
                  onChange={(e) => setFormData((prev) => ({ ...prev, order: Number.parseInt(e.target.value) || 0 }))}
                  placeholder="1"
                />
              </div>
              <div className="flex items-center space-x-2 pt-6">
                <input
                  type="checkbox"
                  id="edit-current"
                  checked={formData.current}
                  onChange={(e) => setFormData((prev) => ({ ...prev, current: e.target.checked }))}
                  className="rounded"
                />
                <Label htmlFor="edit-current">Current Position</Label>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdate} disabled={isSubmitting}>
              {isSubmitting ? "Updating..." : "Update Experience"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
