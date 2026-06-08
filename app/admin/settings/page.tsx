"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Save, User, Globe, Mail, Phone, MapPin, Github, Linkedin, Twitter, CheckCircle } from "lucide-react"
import { useCMSSettings } from "@/hooks/useCMS"

export default function AdminSettings() {
  const { settings, updateSettings } = useCMSSettings()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [formData, setFormData] = useState({
    siteName: settings?.siteName || "",
    siteDescription: settings?.siteDescription || "",
    ownerName: settings?.ownerName || "",
    ownerTitle: settings?.ownerTitle || "",
    ownerBio: settings?.ownerBio || "",
    email: settings?.email || "",
    phone: settings?.phone || "",
    location: settings?.location || "",
    github: settings?.github || "",
    linkedin: settings?.linkedin || "",
    twitter: settings?.twitter || "",
    avatar: settings?.avatar || "",
    heroImage: settings?.heroImage || "",
    resumeUrl: settings?.resumeUrl || "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      await updateSettings(formData)
      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 3000)
    } catch (error) {
      alert("Error updating settings")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const inputClass = "bg-black/50 border-white/10 text-white placeholder:text-white/30 focus:border-purple-500/50 focus:ring-purple-500/20"
  const labelClass = "text-white/70 font-medium"

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white/5 backdrop-blur-xl p-6 rounded-2xl border border-white/10">
        <h1 className="text-3xl font-bold text-white bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400">Settings</h1>
        <p className="text-white/60 mt-2">Manage your portfolio settings and personal information</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Site Information */}
        <Card className="bg-white/5 backdrop-blur-xl border-white/10">
          <CardHeader className="border-b border-white/5 pb-4">
            <CardTitle className="flex items-center text-white">
              <div className="p-2 rounded-lg bg-purple-500/20 border border-purple-500/30 mr-3">
                <Globe className="h-5 w-5 text-purple-400" />
              </div>
              Site Information
            </CardTitle>
            <CardDescription className="text-white/50 ml-12">Basic information about your portfolio website</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5 pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label htmlFor="siteName" className={labelClass}>Site Name</Label>
                <Input
                  id="siteName"
                  value={formData.siteName}
                  onChange={(e) => handleInputChange("siteName", e.target.value)}
                  placeholder="Your site name"
                  className={inputClass}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ownerTitle" className={labelClass}>Your Title</Label>
                <Input
                  id="ownerTitle"
                  value={formData.ownerTitle}
                  onChange={(e) => handleInputChange("ownerTitle", e.target.value)}
                  placeholder="e.g., Frontend Developer"
                  className={inputClass}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="siteDescription" className={labelClass}>Site Description</Label>
              <Textarea
                id="siteDescription"
                value={formData.siteDescription}
                onChange={(e) => handleInputChange("siteDescription", e.target.value)}
                placeholder="Brief description of your site for SEO"
                rows={3}
                className={inputClass}
              />
            </div>
          </CardContent>
        </Card>

        {/* Personal Information */}
        <Card className="bg-white/5 backdrop-blur-xl border-white/10">
          <CardHeader className="border-b border-white/5 pb-4">
            <CardTitle className="flex items-center text-white">
              <div className="p-2 rounded-lg bg-blue-500/20 border border-blue-500/30 mr-3">
                <User className="h-5 w-5 text-blue-400" />
              </div>
              Personal Information
            </CardTitle>
            <CardDescription className="text-white/50 ml-12">Your personal details and bio</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5 pt-6">
            <div className="space-y-2">
              <Label htmlFor="ownerName" className={labelClass}>Full Name</Label>
              <Input
                id="ownerName"
                value={formData.ownerName}
                onChange={(e) => handleInputChange("ownerName", e.target.value)}
                placeholder="Your full name"
                className={inputClass}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="ownerBio" className={labelClass}>Bio</Label>
              <Textarea
                id="ownerBio"
                value={formData.ownerBio}
                onChange={(e) => handleInputChange("ownerBio", e.target.value)}
                placeholder="Tell visitors about yourself..."
                rows={4}
                className={inputClass}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label htmlFor="avatar" className={labelClass}>Avatar URL</Label>
                <Input
                  id="avatar"
                  value={formData.avatar}
                  onChange={(e) => handleInputChange("avatar", e.target.value)}
                  placeholder="https://example.com/avatar.jpg"
                  className={inputClass}
                />
                {formData.avatar && (
                  <div className="mt-2 flex items-center gap-3">
                    <img src={formData.avatar} alt="Avatar preview" className="w-12 h-12 rounded-full object-cover border-2 border-purple-500/40" />
                    <span className="text-xs text-white/40">Preview</span>
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="heroImage" className={labelClass}>Hero Image URL</Label>
                <Input
                  id="heroImage"
                  value={formData.heroImage}
                  onChange={(e) => handleInputChange("heroImage", e.target.value)}
                  placeholder="https://example.com/hero.jpg"
                  className={inputClass}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="resumeUrl" className={labelClass}>Resume URL</Label>
              <Input
                id="resumeUrl"
                value={formData.resumeUrl}
                onChange={(e) => handleInputChange("resumeUrl", e.target.value)}
                placeholder="https://example.com/resume.pdf"
                className={inputClass}
              />
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card className="bg-white/5 backdrop-blur-xl border-white/10">
          <CardHeader className="border-b border-white/5 pb-4">
            <CardTitle className="flex items-center text-white">
              <div className="p-2 rounded-lg bg-green-500/20 border border-green-500/30 mr-3">
                <Mail className="h-5 w-5 text-green-400" />
              </div>
              Contact Information
            </CardTitle>
            <CardDescription className="text-white/50 ml-12">How people can reach you</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5 pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label htmlFor="email" className={`${labelClass} flex items-center gap-2`}>
                  <Mail className="h-4 w-4 text-green-400" />
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="fitrahramadhan310@gmail.com"
                  className={inputClass}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone" className={`${labelClass} flex items-center gap-2`}>
                  <Phone className="h-4 w-4 text-blue-400" />
                  Phone
                </Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  placeholder="+62 xxx xxxx xxxx"
                  className={inputClass}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location" className={`${labelClass} flex items-center gap-2`}>
                <MapPin className="h-4 w-4 text-yellow-400" />
                Location
              </Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => handleInputChange("location", e.target.value)}
                placeholder="City, Country"
                className={inputClass}
              />
            </div>
          </CardContent>
        </Card>

        {/* Social Media */}
        <Card className="bg-white/5 backdrop-blur-xl border-white/10">
          <CardHeader className="border-b border-white/5 pb-4">
            <CardTitle className="flex items-center text-white">
              <div className="p-2 rounded-lg bg-pink-500/20 border border-pink-500/30 mr-3">
                <Twitter className="h-5 w-5 text-pink-400" />
              </div>
              Social Media
            </CardTitle>
            <CardDescription className="text-white/50 ml-12">Your social media profiles</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5 pt-6">
            <div className="space-y-2">
              <Label htmlFor="github" className={`${labelClass} flex items-center gap-2`}>
                <Github className="h-4 w-4 text-white/60" />
                GitHub
              </Label>
              <Input
                id="github"
                value={formData.github}
                onChange={(e) => handleInputChange("github", e.target.value)}
                placeholder="https://github.com/username"
                className={inputClass}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label htmlFor="linkedin" className={`${labelClass} flex items-center gap-2`}>
                  <Linkedin className="h-4 w-4 text-blue-400" />
                  LinkedIn
                </Label>
                <Input
                  id="linkedin"
                  value={formData.linkedin}
                  onChange={(e) => handleInputChange("linkedin", e.target.value)}
                  placeholder="https://linkedin.com/in/username"
                  className={inputClass}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="twitter" className={`${labelClass} flex items-center gap-2`}>
                  <Twitter className="h-4 w-4 text-sky-400" />
                  Twitter
                </Label>
                <Input
                  id="twitter"
                  value={formData.twitter}
                  onChange={(e) => handleInputChange("twitter", e.target.value)}
                  placeholder="https://twitter.com/username"
                  className={inputClass}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex items-center justify-between bg-white/5 backdrop-blur-xl p-5 rounded-2xl border border-white/10">
          <div className="text-sm text-white/40">
            {saveSuccess ? (
              <span className="flex items-center gap-2 text-green-400">
                <CheckCircle className="h-4 w-4" />
                Settings saved successfully!
              </span>
            ) : (
              "Changes will be applied immediately to your portfolio"
            )}
          </div>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="min-w-40 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white border-0 shadow-[0_0_20px_rgba(168,85,247,0.4)] hover:shadow-[0_0_30px_rgba(168,85,247,0.6)] transition-all duration-300"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Saving...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Save className="h-4 w-4" />
                Save Settings
              </span>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
