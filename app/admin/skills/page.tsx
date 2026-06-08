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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Edit, Trash2, Search, Filter, Star, TrendingUp, Code, Database, Wrench } from "lucide-react"
import { useCMSSkills } from "@/hooks/useCMS"
import type { CMSSkill } from "@/lib/types"

export default function AdminSkills() {
  const { skills, createSkill, updateSkill, deleteSkill } = useCMSSkills()
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingSkill, setEditingSkill] = useState<CMSSkill | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    level: 50,
    category: "frontend" as CMSSkill["category"],
    icon: "",
    order: 0,
  })

  const filteredSkills = skills.filter((skill) => {
    const matchesSearch = skill.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === "all" || skill.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  const resetForm = () => {
    setFormData({
      name: "",
      level: 50,
      category: "frontend",
      icon: "",
      order: skills.length + 1,
    })
  }

  const handleCreate = async () => {
    if (!formData.name) {
      alert("Please enter skill name")
      return
    }

    setIsSubmitting(true)
    try {
      await createSkill({
        ...formData,
        order: formData.order || skills.length + 1,
      })

      setIsCreateDialogOpen(false)
      resetForm()
    } catch (error) {
      alert("Error creating skill")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEdit = (skill: CMSSkill) => {
    setEditingSkill(skill)
    setFormData({
      name: skill.name,
      level: skill.level,
      category: skill.category,
      icon: skill.icon || "",
      order: skill.order,
    })
    setIsEditDialogOpen(true)
  }

  const handleUpdate = async () => {
    if (!editingSkill || !formData.name) {
      alert("Please enter skill name")
      return
    }

    setIsSubmitting(true)
    try {
      await updateSkill(editingSkill.id, formData)

      setIsEditDialogOpen(false)
      setEditingSkill(null)
      resetForm()
    } catch (error) {
      alert("Error updating skill")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return

    try {
      await deleteSkill(id)
    } catch (error) {
      alert("Error deleting skill")
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "frontend":
        return <Code className="h-4 w-4" />
      case "backend":
        return <TrendingUp className="h-4 w-4" />
      case "database":
        return <Database className="h-4 w-4" />
      case "tools":
        return <Wrench className="h-4 w-4" />
      default:
        return <Star className="h-4 w-4" />
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "frontend":
        return "bg-blue-100 text-blue-800"
      case "backend":
        return "bg-green-100 text-green-800"
      case "database":
        return "bg-purple-100 text-purple-800"
      case "tools":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getSkillsByCategory = (category: string) => {
    return filteredSkills.filter((skill) => skill.category === category)
  }

  const categories = [
    { value: "frontend", label: "Frontend", icon: Code },
    { value: "backend", label: "Backend", icon: TrendingUp },
    { value: "database", label: "Database", icon: Database },
    { value: "tools", label: "Tools", icon: Wrench },
    { value: "other", label: "Other", icon: Star },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Skills Management</h1>
          <p className="text-gray-600 mt-2">Manage your technical skills and expertise levels</p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Skill
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {categories.map((category) => {
          const categorySkills = getSkillsByCategory(category.value)
          const avgLevel =
            categorySkills.length > 0
              ? Math.round(categorySkills.reduce((sum, skill) => sum + skill.level, 0) / categorySkills.length)
              : 0

          return (
            <Card key={category.value}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{category.label}</CardTitle>
                <category.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{categorySkills.length}</div>
                <p className="text-xs text-muted-foreground">Avg Level: {avgLevel}%</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search skills..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Skills by Category */}
      <div className="space-y-8">
        {categories.map((category) => {
          const categorySkills = getSkillsByCategory(category.value)

          if (categorySkills.length === 0 && categoryFilter !== "all" && categoryFilter !== category.value) {
            return null
          }

          return (
            <div key={category.value}>
              <div className="flex items-center gap-3 mb-4">
                <category.icon className="h-6 w-6 text-gray-600" />
                <h2 className="text-xl font-semibold text-gray-900">{category.label} Skills</h2>
                <Badge variant="secondary">{categorySkills.length}</Badge>
              </div>

              {categorySkills.length > 0 ? (
                <div className="grid gap-4">
                  {categorySkills.map((skill) => (
                    <Card key={skill.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-3">
                              {getCategoryIcon(skill.category)}
                              <h3 className="text-lg font-semibold text-gray-900">{skill.name}</h3>
                              <Badge className={getCategoryColor(skill.category)}>{skill.category}</Badge>
                            </div>

                            <div className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Proficiency Level</span>
                                <span className="font-medium">{skill.level}%</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                  style={{ width: `${skill.level}%` }}
                                />
                              </div>
                            </div>

                            <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                              <span>Order: {skill.order}</span>
                              <span>Updated: {new Date(skill.updatedAt).toLocaleDateString()}</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 ml-4">
                            <Button size="sm" variant="outline" onClick={() => handleEdit(skill)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => handleDelete(skill.id, skill.name)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="text-center py-8">
                    <category.icon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No {category.label.toLowerCase()} skills yet</p>
                  </CardContent>
                </Card>
              )}
            </div>
          )
        })}
      </div>

      {/* Create Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Skill</DialogTitle>
            <DialogDescription>Add a new technical skill to your portfolio</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Skill Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., React, Node.js, MySQL"
              />
            </div>

            <div>
              <Label htmlFor="category">Category</Label>
              <Select
                value={formData.category}
                onValueChange={(value: CMSSkill["category"]) => setFormData((prev) => ({ ...prev, category: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="level">Proficiency Level: {formData.level}%</Label>
              <input
                type="range"
                id="level"
                min="0"
                max="100"
                step="5"
                value={formData.level}
                onChange={(e) => setFormData((prev) => ({ ...prev, level: Number.parseInt(e.target.value) }))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Beginner</span>
                <span>Intermediate</span>
                <span>Expert</span>
              </div>
            </div>

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
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreate} disabled={isSubmitting}>
              {isSubmitting ? "Adding..." : "Add Skill"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Skill</DialogTitle>
            <DialogDescription>Update skill information</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-name">Skill Name *</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., React, Node.js, MySQL"
              />
            </div>

            <div>
              <Label htmlFor="edit-category">Category</Label>
              <Select
                value={formData.category}
                onValueChange={(value: CMSSkill["category"]) => setFormData((prev) => ({ ...prev, category: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="edit-level">Proficiency Level: {formData.level}%</Label>
              <input
                type="range"
                id="edit-level"
                min="0"
                max="100"
                step="5"
                value={formData.level}
                onChange={(e) => setFormData((prev) => ({ ...prev, level: Number.parseInt(e.target.value) }))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Beginner</span>
                <span>Intermediate</span>
                <span>Expert</span>
              </div>
            </div>

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
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdate} disabled={isSubmitting}>
              {isSubmitting ? "Updating..." : "Update Skill"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
