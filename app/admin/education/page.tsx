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
import { Plus, Edit, Trash2, Search, Award, Calendar, BookOpen, Clock } from "lucide-react"
import { useCMSEducation } from "@/hooks/useCMS"
import type { CMSEducation } from "@/lib/types"

export default function AdminEducation() {
  const { educationList: educations, createEducation, updateEducation, deleteEducation } = useCMSEducation()
  const [searchTerm, setSearchTerm] = useState("")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingEducation, setEditingEducation] = useState<CMSEducation | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    degree: "",
    school: "",
    period: "",
    gpa: "",
    achievements: [""],
    current: false,
    order: 0,
  })

  const filteredEducations = educations.filter(
    (exp) =>
      exp.degree.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exp.school.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const resetForm = () => {
    setFormData({
      degree: "",
      school: "",
      period: "",
      gpa: "",
      achievements: [""],
      current: false,
      order: educations.length + 1,
    })
  }

  const handleCreate = async () => {
    if (!formData.degree || !formData.school || !formData.period) {
      alert("Please fill in required fields")
      return
    }

    setIsSubmitting(true)
    try {
      await createEducation({
        ...formData,
        achievements: formData.achievements.filter(Boolean),
        order: formData.order || educations.length + 1,
      })

      setIsCreateDialogOpen(false)
      resetForm()
    } catch (error) {
      alert("Error creating education")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEdit = (education: CMSEducation) => {
    setEditingEducation(education)
    setFormData({
      degree: education.degree,
      school: education.school,
      period: education.period,
      gpa: education.gpa || "",
      achievements: education.achievements.length > 0 ? education.achievements : [""],
      current: education.current,
      order: education.order,
    })
    setIsEditDialogOpen(true)
  }

  const handleUpdate = async () => {
    if (!editingEducation || !formData.degree || !formData.school || !formData.period) {
      alert("Please fill in required fields")
      return
    }

    setIsSubmitting(true)
    try {
      await updateEducation(editingEducation.id, {
        ...formData,
        achievements: formData.achievements.filter(Boolean),
      })

      setIsEditDialogOpen(false)
      setEditingEducation(null)
      resetForm()
    } catch (error) {
      alert("Error updating education")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (id: string, degree: string) => {
    if (!confirm(`Are you sure you want to delete "${degree}"?`)) return

    try {
      await deleteEducation(id)
    } catch (error) {
      alert("Error deleting education")
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

  const currentEducations = filteredEducations.filter((exp) => exp.current)
  const pastEducations = filteredEducations.filter((exp) => !exp.current)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between bg-white/5 backdrop-blur-xl p-6 rounded-2xl border border-white/10">
        <div>
          <h1 className="text-3xl font-bold text-white bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400">Education Management</h1>
          <p className="text-white/60 mt-2">Manage your work education and career history</p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)} className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white border-0 shadow-[0_0_15px_rgba(168,85,247,0.4)]">
          <Plus className="mr-2 h-4 w-4" />
          Add Education
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-white/5 backdrop-blur-xl border-white/10 relative overflow-hidden group hover:border-white/30 transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
            <CardTitle className="text-sm font-medium text-white/60">Total Education</CardTitle>
            <div className="p-2 rounded-lg bg-black/20 border border-white/5">
              <Award className="h-4 w-4 text-purple-400" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-2xl font-bold text-white">{educations.length}</div>
            <p className="text-xs text-white/40 mt-1">Work educations</p>
          </CardContent>
        </Card>

        <Card className="bg-white/5 backdrop-blur-xl border-white/10 relative overflow-hidden group hover:border-white/30 transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
            <CardTitle className="text-sm font-medium text-white/60">Current Roles</CardTitle>
            <div className="p-2 rounded-lg bg-black/20 border border-white/5">
              <Clock className="h-4 w-4 text-blue-400" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-2xl font-bold text-white">{currentEducations.length}</div>
            <p className="text-xs text-white/40 mt-1">Active positions</p>
          </CardContent>
        </Card>

        <Card className="bg-white/5 backdrop-blur-xl border-white/10 relative overflow-hidden group hover:border-white/30 transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
            <CardTitle className="text-sm font-medium text-white/60">Companies</CardTitle>
            <div className="p-2 rounded-lg bg-black/20 border border-white/5">
              <BookOpen className="h-4 w-4 text-green-400" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-2xl font-bold text-white">{new Set(educations.map((exp) => exp.school)).size}</div>
            <p className="text-xs text-white/40 mt-1">Different organizations</p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card className="bg-white/5 backdrop-blur-xl border-white/10">
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-white/40" />
            <Input
              placeholder="Search educations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-black/40 border-white/10 text-white focus:border-purple-500/50 focus:ring-purple-500/20"
            />
          </div>
        </CardContent>
      </Card>

      {/* Current Education */}
      {currentEducations.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
            <div className="p-2 rounded-lg bg-green-500/20 border border-green-500/30 mr-3">
              <Clock className="h-5 w-5 text-green-400" />
            </div>
            Current Education
          </h2>
          <div className="space-y-4">
            {currentEducations.map((education) => (
              <Card key={education.id} className="bg-white/5 backdrop-blur-xl border-white/10 border-l-4 border-l-green-500 hover:border-white/30 hover:border-l-green-400 transition-all duration-300">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="flex items-center text-xl text-white">
                        <Award className="h-5 w-5 mr-3 text-purple-400" />
                        {education.degree}
                      </CardTitle>
                      <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-white/60">
                        <div className="flex items-center bg-black/20 px-3 py-1 rounded-full border border-white/5">
                          <BookOpen className="h-4 w-4 mr-2 text-blue-400" />
                          {education.school}
                        </div>
                        <div className="flex items-center bg-black/20 px-3 py-1 rounded-full border border-white/5">
                          <Calendar className="h-4 w-4 mr-2 text-yellow-400" />
                          {education.period}
                        </div>
                        <Badge className="bg-green-500/20 text-green-300 border-green-500/30">Current</Badge>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button size="icon" variant="outline" onClick={() => handleEdit(education)} className="bg-transparent border-blue-500/50 text-blue-400 hover:bg-blue-500/20 hover:text-blue-300 h-8 w-8">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="destructive" onClick={() => handleDelete(education.id, education.degree)} className="bg-transparent border-red-500/50 text-red-400 hover:bg-red-500/20 hover:text-red-300 h-8 w-8">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-white/70 mb-5 leading-relaxed bg-black/20 p-4 rounded-xl border border-white/5">{education.gpa}</p>
                  <div>
                    <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
                      <div className="w-1.5 h-4 bg-purple-500 rounded-full"></div>
                      Key Achievements:
                    </h4>
                    <ul className="space-y-2">
                      {education.achievements.map((achievement: string, index: number) => (
                        <li key={index} className="flex items-start text-sm text-white/70 bg-white/5 p-3 rounded-lg border border-white/5 hover:bg-white/10 transition-colors">
                          <span className="inline-block w-2 h-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full mt-1.5 mr-3 flex-shrink-0 shadow-[0_0_8px_rgba(168,85,247,0.6)]"></span>
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

      {/* Past Education */}
      {pastEducations.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
            <div className="p-2 rounded-lg bg-blue-500/20 border border-blue-500/30 mr-3">
              <Award className="h-5 w-5 text-blue-400" />
            </div>
            Past Education
          </h2>
          <div className="space-y-4">
            {pastEducations.map((education) => (
              <Card key={education.id} className="bg-white/5 backdrop-blur-xl border-white/10 hover:border-white/30 transition-all duration-300">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="flex items-center text-xl text-white">
                        <Award className="h-5 w-5 mr-3 text-blue-400" />
                        {education.degree}
                      </CardTitle>
                      <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-white/60">
                        <div className="flex items-center bg-black/20 px-3 py-1 rounded-full border border-white/5">
                          <BookOpen className="h-4 w-4 mr-2 text-purple-400" />
                          {education.school}
                        </div>
                        <div className="flex items-center bg-black/20 px-3 py-1 rounded-full border border-white/5">
                          <Calendar className="h-4 w-4 mr-2 text-yellow-400" />
                          {education.period}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button size="icon" variant="outline" onClick={() => handleEdit(education)} className="bg-transparent border-blue-500/50 text-blue-400 hover:bg-blue-500/20 hover:text-blue-300 h-8 w-8">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="destructive" onClick={() => handleDelete(education.id, education.degree)} className="bg-transparent border-red-500/50 text-red-400 hover:bg-red-500/20 hover:text-red-300 h-8 w-8">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-white/70 mb-5 leading-relaxed bg-black/20 p-4 rounded-xl border border-white/5">{education.gpa}</p>
                  <div>
                    <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
                      <div className="w-1.5 h-4 bg-blue-500 rounded-full"></div>
                      Key Achievements:
                    </h4>
                    <ul className="space-y-2">
                      {education.achievements.map((achievement: string, index: number) => (
                        <li key={index} className="flex items-start text-sm text-white/70 bg-white/5 p-3 rounded-lg border border-white/5 hover:bg-white/10 transition-colors">
                          <span className="inline-block w-2 h-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full mt-1.5 mr-3 flex-shrink-0 shadow-[0_0_8px_rgba(59,130,246,0.6)]"></span>
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

      {filteredEducations.length === 0 && (
        <Card className="bg-white/5 backdrop-blur-xl border-white/10 border-dashed border-2">
          <CardContent className="text-center py-12">
            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
              <Award className="h-10 w-10 text-white/20" />
            </div>
            <h3 className="text-xl font-medium text-white mb-2">No education found</h3>
            <p className="text-white/50 mb-8 max-w-md mx-auto">
              {searchTerm ? "Try adjusting your search terms" : "Start by adding your first work education to showcase your career history."}
            </p>
            <Button onClick={() => setIsCreateDialogOpen(true)} className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white border-0 shadow-[0_0_15px_rgba(168,85,247,0.4)]">
              <Plus className="mr-2 h-4 w-4" />
              Add Your First Education
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Create / Edit Dialog */}
      {(() => {
        const DialogForm = ({ isOpen, setIsOpen, isEdit }: { isOpen: boolean, setIsOpen: (val: boolean) => void, isEdit: boolean }) => (
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-[#1a142c] border border-purple-500/30 text-white shadow-[0_0_50px_rgba(0,0,0,0.8)]">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400">
                  {isEdit ? "Edit Education" : "Add New Education"}
                </DialogTitle>
                <DialogDescription className="text-white/50">
                  {isEdit ? "Update education information" : "Add a new work education to your portfolio"}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6 py-4">
                <div className="bg-black/30 p-5 rounded-xl border border-white/5 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="degree" className="text-white/80">Degree <span className="text-red-400">*</span></Label>
                      <Input
                        id="degree"
                        value={formData.degree}
                        onChange={(e) => setFormData((prev) => ({ ...prev, degree: e.target.value }))}
                        placeholder="e.g., Frontend Developer"
                        className="bg-black/50 border-white/10 text-white focus:border-purple-500/50 focus:ring-purple-500/20"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="school" className="text-white/80">School <span className="text-red-400">*</span></Label>
                      <Input
                        id="school"
                        value={formData.school}
                        onChange={(e) => setFormData((prev) => ({ ...prev, school: e.target.value }))}
                        placeholder="e.g., Telkom University"
                        className="bg-black/50 border-white/10 text-white focus:border-purple-500/50 focus:ring-purple-500/20"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="period" className="text-white/80">Period <span className="text-red-400">*</span></Label>
                    <Input
                      id="period"
                      value={formData.period}
                      onChange={(e) => setFormData((prev) => ({ ...prev, period: e.target.value }))}
                      placeholder="e.g., Jan 2023 - Present"
                      className="bg-black/50 border-white/10 text-white focus:border-purple-500/50 focus:ring-purple-500/20"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="gpa" className="text-white/80">GPA</Label>
                    <Textarea
                      id="gpa"
                      value={formData.gpa}
                      onChange={(e) => setFormData((prev) => ({ ...prev, gpa: e.target.value }))}
                      placeholder="Brief gpa of your role and responsibilities"
                      rows={3}
                      className="bg-black/50 border-white/10 text-white focus:border-purple-500/50 focus:ring-purple-500/20"
                    />
                  </div>
                </div>

                <div className="bg-black/30 p-5 rounded-xl border border-white/5 space-y-4">
                  <Label className="text-white/80 block mb-3">Key Achievements</Label>
                  <div className="space-y-3">
                    {formData.achievements.map((achievement, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <div className="pt-2">
                          <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                        </div>
                        <Input
                          value={achievement}
                          onChange={(e) => updateAchievement(index, e.target.value)}
                          placeholder="Describe an achievement or responsibility"
                          className="bg-black/50 border-white/10 text-white focus:border-purple-500/50 focus:ring-purple-500/20"
                        />
                        {formData.achievements.length > 1 && (
                          <Button size="icon" variant="outline" onClick={() => removeAchievement(index)} className="bg-transparent border-red-500/50 text-red-400 hover:bg-red-500/20 hover:text-red-300 flex-shrink-0">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                    <Button variant="outline" size="sm" onClick={addAchievement} className="mt-2 bg-purple-500/10 border-purple-500/30 text-purple-300 hover:bg-purple-500/20 hover:text-purple-200">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Achievement
                    </Button>
                  </div>
                </div>

                <div className="bg-black/30 p-5 rounded-xl border border-white/5">
                  <div className="grid grid-cols-2 gap-4 items-center">
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
                    <div className="flex items-center space-x-3 bg-purple-500/10 border border-purple-500/20 p-4 rounded-lg mt-6">
                      <input
                        type="checkbox"
                        id="current"
                        checked={formData.current}
                        onChange={(e) => setFormData((prev) => ({ ...prev, current: e.target.checked }))}
                        className="rounded w-5 h-5 accent-purple-500 bg-black/50 border-white/20"
                      />
                      <Label htmlFor="current" className="text-white font-medium cursor-pointer">Current Position</Label>
                    </div>
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setIsOpen(false)} className="bg-transparent border-white/20 text-white hover:bg-white/10">
                  Cancel
                </Button>
                <Button onClick={isEdit ? handleUpdate : handleCreate} disabled={isSubmitting} className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white border-0 shadow-[0_0_15px_rgba(168,85,247,0.4)]">
                  {isSubmitting ? (isEdit ? "Updating..." : "Adding...") : (isEdit ? "Update Education" : "Add Education")}
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
