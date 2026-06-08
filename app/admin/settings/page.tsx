"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Save, User, Globe, Mail, Phone, MapPin, Github, Linkedin, Twitter, CheckCircle, Loader2, AlertCircle } from "lucide-react"
import { useCMSSettings } from "@/hooks/useCMS"

const emptyForm = {
  siteName: "",
  siteDescription: "",
  ownerName: "",
  ownerTitle: "",
  ownerBio: "",
  email: "",
  phone: "",
  location: "",
  github: "",
  linkedin: "",
  twitter: "",
  avatar: "",
  heroImage: "",
  resumeUrl: "",
  heroTagline: "",
  heroIntro: "",
  ctaPrimaryText: "",
  ctaSecondaryText: "",
  contactIntro: "",
  portfolioTitle: "",
  portfolioSubtitle: "",
  portfolioSkillsTitle: "",
  portfolioProjectsTitle: "",
  portfolioExperienceTitle: "",
  portfolioBtnContact: "",
  portfolioBtnGithub: "",
  portfolioBtnFiles: "",
}

export default function AdminSettings() {
  const { settings, loading, updateSettings } = useCMSSettings()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [saveError, setSaveError] = useState("")
  const [formData, setFormData] = useState(emptyForm)
  const [formInitialized, setFormInitialized] = useState(false)

  // ─── KEY FIX: populate form AFTER settings loads from API ───
  useEffect(() => {
    if (settings && !formInitialized) {
      setFormData({
        siteName: settings.siteName || "",
        siteDescription: settings.siteDescription || "",
        ownerName: settings.ownerName || "",
        ownerTitle: settings.ownerTitle || "",
        ownerBio: settings.ownerBio || "",
        email: settings.email || "",
        phone: settings.phone || "",
        location: settings.location || "",
        github: settings.github || "",
        linkedin: settings.linkedin || "",
        twitter: settings.twitter || "",
        avatar: settings.avatar || "",
        heroImage: settings.heroImage || "",
        resumeUrl: settings.resumeUrl || "",
        heroTagline: settings.heroTagline || "Development",
        heroIntro: settings.heroIntro || "Hello, I Am",
        ctaPrimaryText: settings.ctaPrimaryText || "See Portfolio",
        ctaSecondaryText: settings.ctaSecondaryText || "Download CV",
        contactIntro: settings.contactIntro || "I'm very approachable and would love to speak to you. Feel free to call, send me an email or simply complete this enquiry form.",
        portfolioTitle: settings.portfolioTitle || "My recent work",
        portfolioSubtitle: settings.portfolioSubtitle || "View all projects",
        portfolioSkillsTitle: settings.portfolioSkillsTitle || "Technical Skills",
        portfolioProjectsTitle: settings.portfolioProjectsTitle || "Featured Projects",
        portfolioExperienceTitle: settings.portfolioExperienceTitle || "Experience & Education",
        portfolioBtnContact: settings.portfolioBtnContact || "Contact Me",
        portfolioBtnGithub: settings.portfolioBtnGithub || "GitHub",
        portfolioBtnFiles: settings.portfolioBtnFiles || "My Study Files",
      })
      setFormInitialized(true)
    }
  }, [settings, formInitialized])


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSaveError("")

    try {
      const result = await updateSettings(formData)
      if (result?.error) {
        setSaveError(result.error)
      } else {
        setSaveSuccess(true)
        setTimeout(() => setSaveSuccess(false), 3000)
      }
    } catch (error) {
      setSaveError("Gagal menyimpan pengaturan. Coba lagi.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const inputClass = "bg-black/50 border-white/[0.15] text-white placeholder:text-white/30 focus:border-purple-500/60 focus:ring-purple-500/20"
  const labelClass = "text-white/75 font-medium text-sm"

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center space-y-3">
          <Loader2 className="h-8 w-8 animate-spin text-purple-400 mx-auto" />
          <p className="text-white/60 text-sm">Loading settings...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Header */}
      <div className="bg-white/[0.07] border border-white/[0.12] rounded-2xl p-6">
        <h1 className="text-3xl font-bold text-white">Settings</h1>
        <p className="text-white/60 mt-2">Manage your portfolio settings and personal information</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Site Information */}
        <div className="bg-white/[0.07] border border-white/[0.12] rounded-2xl overflow-hidden">
          <div className="flex items-center gap-3 px-6 py-4 border-b border-white/[0.08]">
            <div className="p-2 rounded-lg bg-purple-500/20 border border-purple-500/30">
              <Globe className="h-4 w-4 text-purple-400" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-white">Site Information</h2>
              <p className="text-white/50 text-xs">Basic information about your portfolio website</p>
            </div>
          </div>
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="siteName" className={labelClass}>Site Name</Label>
                <Input id="siteName" value={formData.siteName} onChange={(e) => handleInputChange("siteName", e.target.value)} placeholder="FitLearned" className={inputClass} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ownerTitle" className={labelClass}>Your Title</Label>
                <Input id="ownerTitle" value={formData.ownerTitle} onChange={(e) => handleInputChange("ownerTitle", e.target.value)} placeholder="e.g., Frontend Developer" className={inputClass} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="siteDescription" className={labelClass}>Site Description</Label>
              <Textarea id="siteDescription" value={formData.siteDescription} onChange={(e) => handleInputChange("siteDescription", e.target.value)} placeholder="Brief description for SEO" rows={3} className={`${inputClass} resize-none`} />
            </div>
          </div>
        </div>

        {/* Personal Information */}
        <div className="bg-white/[0.07] border border-white/[0.12] rounded-2xl overflow-hidden">
          <div className="flex items-center gap-3 px-6 py-4 border-b border-white/[0.08]">
            <div className="p-2 rounded-lg bg-blue-500/20 border border-blue-500/30">
              <User className="h-4 w-4 text-blue-400" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-white">Personal Information</h2>
              <p className="text-white/50 text-xs">Your personal details and bio</p>
            </div>
          </div>
          <div className="p-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="ownerName" className={labelClass}>Full Name</Label>
              <Input id="ownerName" value={formData.ownerName} onChange={(e) => handleInputChange("ownerName", e.target.value)} placeholder="Your full name" className={inputClass} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ownerBio" className={labelClass}>Bio</Label>
              <Textarea id="ownerBio" value={formData.ownerBio} onChange={(e) => handleInputChange("ownerBio", e.target.value)} placeholder="Tell visitors about yourself..." rows={4} className={`${inputClass} resize-none`} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="avatar" className={labelClass}>Avatar URL</Label>
                <Input id="avatar" value={formData.avatar} onChange={(e) => handleInputChange("avatar", e.target.value)} placeholder="https://example.com/avatar.jpg" className={inputClass} />
                {formData.avatar && (
                  <div className="mt-2 flex items-center gap-3">
                    <img src={formData.avatar} alt="Avatar preview" className="w-10 h-10 rounded-full object-cover border-2 border-purple-500/40" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
                    <span className="text-xs text-white/40">Preview</span>
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="resumeUrl" className={labelClass}>Resume URL</Label>
                <Input id="resumeUrl" value={formData.resumeUrl} onChange={(e) => handleInputChange("resumeUrl", e.target.value)} placeholder="https://example.com/resume.pdf" className={inputClass} />
              </div>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-white/[0.07] border border-white/[0.12] rounded-2xl overflow-hidden">
          <div className="flex items-center gap-3 px-6 py-4 border-b border-white/[0.08]">
            <div className="p-2 rounded-lg bg-emerald-500/20 border border-emerald-500/30">
              <Mail className="h-4 w-4 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-white">Contact Information</h2>
              <p className="text-white/50 text-xs">How people can reach you</p>
            </div>
          </div>
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email" className={`${labelClass} flex items-center gap-1.5`}>
                  <Mail className="h-3.5 w-3.5 text-emerald-400" /> Email
                </Label>
                <Input id="email" type="email" value={formData.email} onChange={(e) => handleInputChange("email", e.target.value)} placeholder="your@email.com" className={inputClass} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone" className={`${labelClass} flex items-center gap-1.5`}>
                  <Phone className="h-3.5 w-3.5 text-blue-400" /> Phone
                </Label>
                <Input id="phone" value={formData.phone} onChange={(e) => handleInputChange("phone", e.target.value)} placeholder="+62 xxx xxxx xxxx" className={inputClass} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="location" className={`${labelClass} flex items-center gap-1.5`}>
                <MapPin className="h-3.5 w-3.5 text-yellow-400" /> Location
              </Label>
              <Input id="location" value={formData.location} onChange={(e) => handleInputChange("location", e.target.value)} placeholder="City, Country" className={inputClass} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contactIntro" className={labelClass}>Contact Box Intro Text</Label>
              <Textarea id="contactIntro" value={formData.contactIntro} onChange={(e) => handleInputChange("contactIntro", e.target.value)} placeholder="I'm very approachable..." rows={3} className={`${inputClass} resize-none`} />
            </div>
          </div>
        </div>

        {/* Homepage Configuration */}
        <div className="bg-white/[0.07] border border-white/[0.12] rounded-2xl overflow-hidden">
          <div className="flex items-center gap-3 px-6 py-4 border-b border-white/[0.08]">
            <div className="p-2 rounded-lg bg-orange-500/20 border border-orange-500/30">
              <Globe className="h-4 w-4 text-orange-400" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-white">Homepage Configuration</h2>
              <p className="text-white/50 text-xs">Customize the hero section and buttons</p>
            </div>
          </div>
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="heroIntro" className={labelClass}>Hero Intro Text</Label>
                <Input id="heroIntro" value={formData.heroIntro} onChange={(e) => handleInputChange("heroIntro", e.target.value)} placeholder="e.g. Hello, I Am" className={inputClass} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="heroTagline" className={labelClass}>Background Tagline</Label>
                <Input id="heroTagline" value={formData.heroTagline} onChange={(e) => handleInputChange("heroTagline", e.target.value)} placeholder="e.g. Development" className={inputClass} />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="ctaPrimaryText" className={labelClass}>Primary Button Text</Label>
                <Input id="ctaPrimaryText" value={formData.ctaPrimaryText} onChange={(e) => handleInputChange("ctaPrimaryText", e.target.value)} placeholder="e.g. See Portfolio" className={inputClass} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ctaSecondaryText" className={labelClass}>Secondary Button Text</Label>
                <Input id="ctaSecondaryText" value={formData.ctaSecondaryText} onChange={(e) => handleInputChange("ctaSecondaryText", e.target.value)} placeholder="e.g. Download CV" className={inputClass} />
              </div>
            </div>
          </div>
        </div>

        {/* Portfolio Section Configuration */}
        <div className="bg-white/[0.07] border border-white/[0.12] rounded-2xl overflow-hidden">
          <div className="flex items-center gap-3 px-6 py-4 border-b border-white/[0.08]">
            <div className="p-2 rounded-lg bg-indigo-500/20 border border-indigo-500/30">
              <Globe className="h-4 w-4 text-indigo-400" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-white">Portfolio Section Settings</h2>
              <p className="text-white/50 text-xs">Customize the portfolio area on the homepage</p>
            </div>
          </div>
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="portfolioTitle" className={labelClass}>Section Title</Label>
                <Input id="portfolioTitle" value={formData.portfolioTitle} onChange={(e) => handleInputChange("portfolioTitle", e.target.value)} placeholder="e.g. My recent work" className={inputClass} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="portfolioSubtitle" className={labelClass}>Link Text</Label>
                <Input id="portfolioSubtitle" value={formData.portfolioSubtitle} onChange={(e) => handleInputChange("portfolioSubtitle", e.target.value)} placeholder="e.g. View all projects →" className={inputClass} />
              </div>
            </div>
          </div>
        </div>

        {/* Full Portfolio Page Configuration */}
        <div className="bg-white/[0.07] border border-white/[0.12] rounded-2xl overflow-hidden">
          <div className="flex items-center gap-3 px-6 py-4 border-b border-white/[0.08]">
            <div className="p-2 rounded-lg bg-teal-500/20 border border-teal-500/30">
              <Globe className="h-4 w-4 text-teal-400" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-white">Full Portfolio Page Settings</h2>
              <p className="text-white/50 text-xs">Customize the /portfolio page sections and buttons</p>
            </div>
          </div>
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="portfolioBtnContact" className={labelClass}>Contact Button</Label>
                <Input id="portfolioBtnContact" value={formData.portfolioBtnContact} onChange={(e) => handleInputChange("portfolioBtnContact", e.target.value)} placeholder="e.g. Contact Me" className={inputClass} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="portfolioBtnGithub" className={labelClass}>GitHub Button</Label>
                <Input id="portfolioBtnGithub" value={formData.portfolioBtnGithub} onChange={(e) => handleInputChange("portfolioBtnGithub", e.target.value)} placeholder="e.g. GitHub" className={inputClass} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="portfolioBtnFiles" className={labelClass}>Study Files Button</Label>
                <Input id="portfolioBtnFiles" value={formData.portfolioBtnFiles} onChange={(e) => handleInputChange("portfolioBtnFiles", e.target.value)} placeholder="e.g. My Study Files" className={inputClass} />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="portfolioSkillsTitle" className={labelClass}>Skills Section Title</Label>
                <Input id="portfolioSkillsTitle" value={formData.portfolioSkillsTitle} onChange={(e) => handleInputChange("portfolioSkillsTitle", e.target.value)} placeholder="e.g. Technical Skills" className={inputClass} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="portfolioProjectsTitle" className={labelClass}>Projects Section Title</Label>
                <Input id="portfolioProjectsTitle" value={formData.portfolioProjectsTitle} onChange={(e) => handleInputChange("portfolioProjectsTitle", e.target.value)} placeholder="e.g. Featured Projects" className={inputClass} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="portfolioExperienceTitle" className={labelClass}>Experience Section Title</Label>
                <Input id="portfolioExperienceTitle" value={formData.portfolioExperienceTitle} onChange={(e) => handleInputChange("portfolioExperienceTitle", e.target.value)} placeholder="e.g. Experience & Education" className={inputClass} />
              </div>
            </div>
          </div>
        </div>

        {/* Social Media */}
        <div className="bg-white/[0.07] border border-white/[0.12] rounded-2xl overflow-hidden">
          <div className="flex items-center gap-3 px-6 py-4 border-b border-white/[0.08]">
            <div className="p-2 rounded-lg bg-pink-500/20 border border-pink-500/30">
              <Twitter className="h-4 w-4 text-pink-400" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-white">Social Media</h2>
              <p className="text-white/50 text-xs">Your social media profiles</p>
            </div>
          </div>
          <div className="p-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="github" className={`${labelClass} flex items-center gap-1.5`}>
                <Github className="h-3.5 w-3.5 text-white/60" /> GitHub
              </Label>
              <Input id="github" value={formData.github} onChange={(e) => handleInputChange("github", e.target.value)} placeholder="https://github.com/username" className={inputClass} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="linkedin" className={`${labelClass} flex items-center gap-1.5`}>
                  <Linkedin className="h-3.5 w-3.5 text-blue-400" /> LinkedIn
                </Label>
                <Input id="linkedin" value={formData.linkedin} onChange={(e) => handleInputChange("linkedin", e.target.value)} placeholder="https://linkedin.com/in/username" className={inputClass} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="twitter" className={`${labelClass} flex items-center gap-1.5`}>
                  <Twitter className="h-3.5 w-3.5 text-sky-400" /> Twitter / X
                </Label>
                <Input id="twitter" value={formData.twitter} onChange={(e) => handleInputChange("twitter", e.target.value)} placeholder="https://twitter.com/username" className={inputClass} />
              </div>
            </div>
          </div>
        </div>

        {/* Save bar */}
        <div className="flex items-center justify-between bg-white/[0.07] border border-white/[0.12] rounded-2xl px-6 py-4">
          <div className="text-sm">
            {saveSuccess && (
              <span className="flex items-center gap-2 text-emerald-400">
                <CheckCircle className="h-4 w-4" />
                Settings saved successfully!
              </span>
            )}
            {saveError && (
              <span className="flex items-center gap-2 text-red-400">
                <AlertCircle className="h-4 w-4" />
                {saveError}
              </span>
            )}
            {!saveSuccess && !saveError && (
              <span className="text-white/40">Changes are saved to database permanently</span>
            )}
          </div>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="min-w-40 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white border-0 shadow-[0_0_20px_rgba(168,85,247,0.35)]"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
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
