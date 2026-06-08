"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Save, User, Globe, Mail, Phone, MapPin, Github, Linkedin, Twitter } from "lucide-react"
import { useCMSSettings } from "@/hooks/useCMS"

export default function AdminSettings() {
  const { settings, updateSettings } = useCMSSettings()
  const [isSubmitting, setIsSubmitting] = useState(false)
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
      alert("Settings updated successfully!")
    } catch (error) {
      alert("Error updating settings")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-2">Manage your portfolio settings and personal information</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Site Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Globe className="mr-2 h-5 w-5" />
              Site Information
            </CardTitle>
            <CardDescription>Basic information about your portfolio website</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="siteName">Site Name</Label>
                <Input
                  id="siteName"
                  value={formData.siteName}
                  onChange={(e) => handleInputChange("siteName", e.target.value)}
                  placeholder="Your site name"
                />
              </div>
              <div>
                <Label htmlFor="ownerTitle">Your Title</Label>
                <Input
                  id="ownerTitle"
                  value={formData.ownerTitle}
                  onChange={(e) => handleInputChange("ownerTitle", e.target.value)}
                  placeholder="e.g., Frontend Developer"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="siteDescription">Site Description</Label>
              <Textarea
                id="siteDescription"
                value={formData.siteDescription}
                onChange={(e) => handleInputChange("siteDescription", e.target.value)}
                placeholder="Brief description of your site"
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="mr-2 h-5 w-5" />
              Personal Information
            </CardTitle>
            <CardDescription>Your personal details and bio</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="ownerName">Full Name</Label>
              <Input
                id="ownerName"
                value={formData.ownerName}
                onChange={(e) => handleInputChange("ownerName", e.target.value)}
                placeholder="Your full name"
              />
            </div>

            <div>
              <Label htmlFor="ownerBio">Bio</Label>
              <Textarea
                id="ownerBio"
                value={formData.ownerBio}
                onChange={(e) => handleInputChange("ownerBio", e.target.value)}
                placeholder="Tell visitors about yourself"
                rows={4}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="avatar">Avatar URL</Label>
                <Input
                  id="avatar"
                  value={formData.avatar}
                  onChange={(e) => handleInputChange("avatar", e.target.value)}
                  placeholder="https://example.com/avatar.jpg"
                />
              </div>
              <div>
                <Label htmlFor="heroImage">Hero Image URL</Label>
                <Input
                  id="heroImage"
                  value={formData.heroImage}
                  onChange={(e) => handleInputChange("heroImage", e.target.value)}
                  placeholder="https://example.com/hero.jpg"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="resumeUrl">Resume URL</Label>
              <Input
                id="resumeUrl"
                value={formData.resumeUrl}
                onChange={(e) => handleInputChange("resumeUrl", e.target.value)}
                placeholder="https://example.com/resume.pdf"
              />
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Mail className="mr-2 h-5 w-5" />
              Contact Information
            </CardTitle>
            <CardDescription>How people can reach you</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="email" className="flex items-center">
                  <Mail className="mr-2 h-4 w-4" />
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="fitrahramadhan310@gmail.com"
                />
              </div>
              <div>
                <Label htmlFor="phone" className="flex items-center">
                  <Phone className="mr-2 h-4 w-4" />
                  Phone
                </Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  placeholder="+62 xxx xxxx xxxx"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="location" className="flex items-center">
                <MapPin className="mr-2 h-4 w-4" />
                Location
              </Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => handleInputChange("location", e.target.value)}
                placeholder="City, Country"
              />
            </div>
          </CardContent>
        </Card>

        {/* Social Media */}
        <Card>
          <CardHeader>
            <CardTitle>Social Media</CardTitle>
            <CardDescription>Your social media profiles</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="github" className="flex items-center">
                <Github className="mr-2 h-4 w-4" />
                GitHub
              </Label>
              <Input
                id="github"
                value={formData.github}
                onChange={(e) => handleInputChange("github", e.target.value)}
                placeholder="https://github.com/username"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="linkedin" className="flex items-center">
                  <Linkedin className="mr-2 h-4 w-4" />
                  LinkedIn
                </Label>
                <Input
                  id="linkedin"
                  value={formData.linkedin}
                  onChange={(e) => handleInputChange("linkedin", e.target.value)}
                  placeholder="https://linkedin.com/in/username"
                />
              </div>
              <div>
                <Label htmlFor="twitter" className="flex items-center">
                  <Twitter className="mr-2 h-4 w-4" />
                  Twitter
                </Label>
                <Input
                  id="twitter"
                  value={formData.twitter}
                  onChange={(e) => handleInputChange("twitter", e.target.value)}
                  placeholder="https://twitter.com/username"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting} className="min-w-32">
            {isSubmitting ? (
              "Saving..."
            ) : (
              <span className="flex items-center">
                <Save className="mr-2 h-4 w-4" />
                Save Settings
              </span>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
