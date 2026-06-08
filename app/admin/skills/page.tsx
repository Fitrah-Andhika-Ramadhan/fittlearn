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
        return <Code className="h-5 w-5" />
      case "backend":
        return <TrendingUp className="h-5 w-5" />
      case "database":
        return <Database className="h-5 w-5" />
      case "tools":
        return <Wrench className="h-5 w-5" />
      default:
        return <Star className="h-5 w-5" />
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "frontend":
        return "bg-blue-500/20 text-blue-300 border-blue-500/30"
      case "backend":
        return "bg-green-500/20 text-green-300 border-green-500/30"
      case "database":
        return "bg-purple-500/20 text-purple-300 border-purple-500/30"
      case "tools":
        return "bg-orange-500/20 text-orange-300 border-orange-500/30"
      default:
        return "bg-white/10 text-white/70 border-white/20"
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
      <div className="flex items-center justify-between bg-white/5 backdrop-blur-xl p-6 rounded-2xl border border-white/10">
        <div>
          <h1 className="text-3xl font-bold text-white bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400">Skills Management</h1>
          <p className="text-white/60 mt-2">Manage your technical skills and expertise levels</p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)} className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white border-0 shadow-[0_0_15px_rgba(168,85,247,0.4)]">
          <Plus className="mr-2 h-4 w-4" />
          Add Skill
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {categories.map((category) => {
          const categorySkills = getSkillsByCategory(category.value)
          const avgLevel =
            categorySkills.length > 0
              ? Math.round(categorySkills.reduce((sum, skill) => sum + skill.level, 0) / categorySkills.length)
              : 0

          return (
            <Card key={category.value} className="bg-white/5 backdrop-blur-xl border-white/10 relative overflow-hidden group hover:border-white/30 transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
                <CardTitle className="text-sm font-medium text-white/60">{category.label}</CardTitle>
                <div className="p-2 rounded-lg bg-black/20 border border-white/5">
                  <category.icon className="h-4 w-4 text-purple-400" />
                </div>
              </CardHeader>
              <CardContent className="relative z-10">
                <div className="text-2xl font-bold text-white">{categorySkills.length}</div>
                <p className="text-xs text-white/40 mt-1">Avg Level: {avgLevel}%</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Filters */}
      <Card className="bg-white/5 backdrop-blur-xl border-white/10">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-white/40" />
              <Input
                placeholder="Search skills..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-black/40 border-white/10 text-white focus:border-purple-500/50 focus:ring-purple-500/20"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full sm:w-48 bg-black/40 border-white/10 text-white">
                <Filter className="mr-2 h-4 w-4 text-white/40" />
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent className="bg-[#1a142c] border-white/10 text-white">
                <SelectItem value="all" className="focus:bg-purple-600/30 focus:text-white">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.value} value={category.value} className="focus:bg-purple-600/30 focus:text-white">
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
            <div key={category.value} className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-purple-500/30">
                  <category.icon className="h-5 w-5 text-purple-300" />
                </div>
                <h2 className="text-xl font-semibold text-white tracking-wide">{category.label} Skills</h2>
                <Badge variant="secondary" className="bg-purple-500/20 text-purple-300 hover:bg-purple-500/30">{categorySkills.length}</Badge>
              </div>

              {categorySkills.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {categorySkills.map((skill) => (
                    <Card key={skill.id} className="bg-black/20 hover:bg-white/5 border-white/5 hover:border-purple-500/30 transition-all duration-300 group">
                      <CardContent className="p-5">
                        <div className="flex items-center justify-between">
                          <div className="flex-1 mr-4">
                            <div className="flex items-center gap-3 mb-4">
                              <div className="p-2 bg-white/5 rounded-lg text-white/70 group-hover:text-white transition-colors">
                                {getCategoryIcon(skill.category)}
                              </div>
                              <h3 className="text-lg font-semibold text-white group-hover:text-purple-300 transition-colors">{skill.name}</h3>
                              <Badge variant="outline" className={getCategoryColor(skill.category)}>{skill.category}</Badge>
                            </div>

                            <div className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span className="text-white/50 font-medium tracking-wide text-xs uppercase">Proficiency</span>
                                <span className="font-bold text-white/90">{skill.level}%</span>
                              </div>
                              <div className="w-full bg-white/10 rounded-full h-2.5 overflow-hidden border border-white/5">
                                <div
                                  className="h-full rounded-full transition-all duration-1000 bg-gradient-to-r from-purple-500 to-blue-500 relative"
                                  style={{ width: `${skill.level}%` }}
                                >
                                  <div className="absolute inset-0 bg-white/20 w-full h-full animate-[shimmer_2s_infinite]"></div>
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-4 mt-4 text-xs font-medium text-white/30">
                              <span className="bg-white/5 px-2 py-1 rounded">Order: {skill.order}</span>
                              <span>Updated: {new Date(skill.updatedAt).toLocaleDateString()}</span>
                            </div>
                          </div>

                          <div className="flex flex-col gap-2">
                            <Button size="icon" variant="outline" onClick={() => handleEdit(skill)} className="bg-transparent border-blue-500/50 text-blue-400 hover:bg-blue-500/20 hover:text-blue-300 h-8 w-8">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button size="icon" variant="destructive" onClick={() => handleDelete(skill.id, skill.name)} className="bg-transparent border-red-500/50 text-red-400 hover:bg-red-500/20 hover:text-red-300 h-8 w-8">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10 bg-black/20 rounded-xl border border-dashed border-white/10">
                  <category.icon className="h-10 w-10 text-white/20 mx-auto mb-3" />
                  <p className="text-white/40">No {category.label.toLowerCase()} skills yet</p>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Create / Edit Dialog */}
      {(() => {
        const DialogForm = ({ isOpen, setIsOpen, isEdit }: { isOpen: boolean, setIsOpen: (val: boolean) => void, isEdit: boolean }) => (
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="sm:max-w-[500px] bg-[#1a142c] border border-purple-500/30 text-white shadow-[0_0_50px_rgba(0,0,0,0.8)]">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400">
                  {isEdit ? "Edit Skill" : "Add New Skill"}
                </DialogTitle>
                <DialogDescription className="text-white/50">
                  {isEdit ? "Update skill information" : "Add a new technical skill to your portfolio"}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6 py-4">
                <div className="bg-black/30 p-5 rounded-xl border border-white/5 space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-white/80">Skill Name <span className="text-red-400">*</span></Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                      placeholder="e.g., React, Node.js, MySQL"
                      className="bg-black/50 border-white/10 text-white focus:border-purple-500/50 focus:ring-purple-500/20"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category" className="text-white/80">Category</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value: CMSSkill["category"]) => setFormData((prev) => ({ ...prev, category: value }))}
                    >
                      <SelectTrigger className="bg-black/50 border-white/10 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-[#1a142c] border-white/10 text-white">
                        {categories.map((category) => (
                          <SelectItem key={category.value} value={category.value} className="focus:bg-purple-600/30 focus:text-white">
                            {category.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="bg-black/30 p-5 rounded-xl border border-white/5 space-y-4">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <Label htmlFor="level" className="text-white/80">Proficiency Level</Label>
                      <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30 text-lg px-3 py-1">{formData.level}%</Badge>
                    </div>
                    <input
                      type="range"
                      id="level"
                      min="0"
                      max="100"
                      step="5"
                      value={formData.level}
                      onChange={(e) => setFormData((prev) => ({ ...prev, level: Number.parseInt(e.target.value) }))}
                      className="w-full h-3 bg-white/10 rounded-lg appearance-none cursor-pointer accent-purple-500 hover:accent-purple-400"
                    />
                    <div className="flex justify-between text-xs font-medium text-white/40 uppercase tracking-wider">
                      <span>Beginner</span>
                      <span>Intermediate</span>
                      <span>Expert</span>
                    </div>
                  </div>
                </div>

                <div className="bg-black/30 p-5 rounded-xl border border-white/5">
                  <div className="space-y-2">
                    <Label htmlFor="order" className="text-white/80">Display Order</Label>
                    <Input
                      id="order"
                      type="number"
                      value={formData.order}
                      onChange={(e) => setFormData((prev) => ({ ...prev, order: Number.parseInt(e.target.value) || 0 }))}
                      placeholder="1"
                      className="bg-black/50 border-white/10 text-white focus:border-purple-500/50 focus:ring-purple-500/20"
                    />
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setIsOpen(false)} className="bg-transparent border-white/20 text-white hover:bg-white/10">
                  Cancel
                </Button>
                <Button onClick={isEdit ? handleUpdate : handleCreate} disabled={isSubmitting} className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white border-0 shadow-[0_0_15px_rgba(168,85,247,0.4)]">
                  {isSubmitting ? (isEdit ? "Updating..." : "Adding...") : (isEdit ? "Update Skill" : "Add Skill")}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )

        return (
          <>
            {DialogForm({ isOpen: isCreateDialogOpen, setIsOpen: setIsCreateDialogOpen, isEdit: false })}
            {DialogForm({ isOpen: isEditDialogOpen, setIsOpen: setIsEditDialogOpen, isEdit: true })}
          </>
        )
      })()}
    </div>
  )
}
