"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FolderOpen, User, BookOpen, FileText, Eye, TrendingUp, Users, ArrowRight } from "lucide-react"
import Link from "next/link"
import { useCMSProjects, useCMSSkills, useCMSExperiences, useCMSBlog } from "@/hooks/useCMS"

export default function AdminDashboard() {
  const { projects } = useCMSProjects()
  const { skills } = useCMSSkills()
  const { experiences } = useCMSExperiences()
  const { posts } = useCMSBlog()

  const stats = [
    {
      title: "Total Projects",
      value: projects.length,
      description: `${projects.filter((p) => p.status === "published").length} published`,
      icon: FolderOpen,
      color: "text-blue-300",
      bgColor: "bg-blue-500/25",
      borderColor: "border-blue-400/40",
      glow: "shadow-[0_0_20px_rgba(59,130,246,0.25)]",
    },
    {
      title: "Skills",
      value: skills.length,
      description: "Technical skills",
      icon: User,
      color: "text-emerald-300",
      bgColor: "bg-emerald-500/25",
      borderColor: "border-emerald-400/40",
      glow: "shadow-[0_0_20px_rgba(52,211,153,0.25)]",
    },
    {
      title: "Experience",
      value: experiences.length,
      description: "Work experiences",
      icon: BookOpen,
      color: "text-purple-300",
      bgColor: "bg-purple-500/25",
      borderColor: "border-purple-400/40",
      glow: "shadow-[0_0_20px_rgba(168,85,247,0.25)]",
    },
    {
      title: "Blog Posts",
      value: posts.length,
      description: `${posts.filter((p) => p.status === "published").length} published`,
      icon: FileText,
      color: "text-orange-300",
      bgColor: "bg-orange-500/25",
      borderColor: "border-orange-400/40",
      glow: "shadow-[0_0_20px_rgba(251,146,60,0.25)]",
    },
  ]

  const recentProjects = projects.slice(0, 5)
  const recentPosts = posts.slice(0, 5)

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="bg-white/[0.07] border border-white/[0.12] rounded-2xl p-6">
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        <p className="text-white/70 mt-1 text-base">Welcome to your portfolio CMS</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className={`bg-white/[0.07] border ${stat.borderColor} rounded-2xl p-5 ${stat.glow} hover:bg-white/[0.10] transition-all duration-300`}>
            <div className="flex items-start justify-between mb-4">
              <p className="text-white/70 text-sm font-medium">{stat.title}</p>
              <div className={`p-2.5 rounded-xl ${stat.bgColor} border ${stat.borderColor}`}>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
            </div>
            <div className="text-4xl font-bold text-white mb-1">{stat.value}</div>
            <p className="text-white/50 text-xs">{stat.description}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white/[0.07] border border-white/[0.12] rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-white mb-1">Quick Actions</h2>
        <p className="text-white/60 text-sm mb-5">Manage your portfolio content</p>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { href: "/admin/projects", icon: FolderOpen, label: "Manage Projects", color: "hover:border-blue-400/50 hover:bg-blue-500/15 hover:text-blue-300", iconColor: "text-blue-400" },
            { href: "/admin/skills", icon: User, label: "Edit Skills", color: "hover:border-emerald-400/50 hover:bg-emerald-500/15 hover:text-emerald-300", iconColor: "text-emerald-400" },
            { href: "/admin/experience", icon: BookOpen, label: "Update Experience", color: "hover:border-purple-400/50 hover:bg-purple-500/15 hover:text-purple-300", iconColor: "text-purple-400" },
            { href: "/admin/blog", icon: FileText, label: "Write Blog Post", color: "hover:border-orange-400/50 hover:bg-orange-500/15 hover:text-orange-300", iconColor: "text-orange-400" },
          ].map((action) => (
            <Link key={action.href} href={action.href}>
              <div className={`flex items-center gap-3 px-4 py-3.5 rounded-xl bg-white/[0.05] border border-white/[0.12] text-white/80 text-sm font-medium transition-all duration-200 cursor-pointer ${action.color}`}>
                <action.icon className={`h-4 w-4 flex-shrink-0 ${action.iconColor}`} />
                <span className="truncate">{action.label}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        {/* Recent Projects */}
        <div className="bg-white/[0.07] border border-white/[0.12] rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-lg font-semibold text-white">Recent Projects</h2>
              <p className="text-white/60 text-sm">Your latest portfolio projects</p>
            </div>
            <Link href="/admin/projects">
              <Button variant="outline" size="sm" className="bg-white/[0.07] text-white/80 border-white/[0.20] hover:bg-white/[0.12] hover:text-white gap-1">
                View All <ArrowRight className="h-3 w-3" />
              </Button>
            </Link>
          </div>
          <div className="space-y-3">
            {recentProjects.length > 0 ? (
              recentProjects.map((project) => (
                <div key={project.id} className="flex items-start justify-between p-4 bg-black/30 hover:bg-black/40 border border-white/[0.10] rounded-xl transition-all duration-200 group">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-white group-hover:text-purple-300 transition-colors truncate">{project.title}</h4>
                    <p className="text-sm text-white/60 truncate mt-0.5">{project.description}</p>
                    <div className="flex items-center mt-2 gap-2">
                      <span className={`px-2 py-0.5 text-xs rounded-full font-medium border ${
                        project.status === "published"
                          ? "bg-emerald-500/20 text-emerald-300 border-emerald-400/40"
                          : "bg-yellow-500/20 text-yellow-300 border-yellow-400/40"
                      }`}>
                        {project.status}
                      </span>
                      {project.featured && (
                        <span className="px-2 py-0.5 text-xs bg-blue-500/20 text-blue-300 border border-blue-400/40 rounded-full font-medium">Featured</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 text-sm text-white/50 ml-3 flex-shrink-0">
                    <Eye className="h-4 w-4" />
                    <span>{project.views}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-white/50 text-center py-8 border border-dashed border-white/[0.15] rounded-xl">
                No projects yet
              </div>
            )}
          </div>
        </div>

        {/* Recent Blog Posts */}
        <div className="bg-white/[0.07] border border-white/[0.12] rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-lg font-semibold text-white">Recent Blog Posts</h2>
              <p className="text-white/60 text-sm">Your latest blog content</p>
            </div>
            <Link href="/admin/blog">
              <Button variant="outline" size="sm" className="bg-white/[0.07] text-white/80 border-white/[0.20] hover:bg-white/[0.12] hover:text-white gap-1">
                View All <ArrowRight className="h-3 w-3" />
              </Button>
            </Link>
          </div>
          <div className="space-y-3">
            {recentPosts.length > 0 ? (
              recentPosts.map((post) => (
                <div key={post.id} className="flex items-start justify-between p-4 bg-black/30 hover:bg-black/40 border border-white/[0.10] rounded-xl transition-all duration-200 group">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-white group-hover:text-blue-300 transition-colors truncate">{post.title}</h4>
                    <p className="text-sm text-white/60 truncate mt-0.5">{post.excerpt}</p>
                    <div className="flex items-center mt-2 gap-2">
                      <span className={`px-2 py-0.5 text-xs rounded-full font-medium border ${
                        post.status === "published"
                          ? "bg-emerald-500/20 text-emerald-300 border-emerald-400/40"
                          : "bg-yellow-500/20 text-yellow-300 border-yellow-400/40"
                      }`}>
                        {post.status}
                      </span>
                      <span className="text-xs text-white/40">{new Date(post.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 text-sm text-white/50 ml-3 flex-shrink-0">
                    <Eye className="h-4 w-4" />
                    <span>{post.views}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-white/50 text-center py-8 border border-dashed border-white/[0.15] rounded-xl">
                No blog posts yet
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Analytics Overview */}
      <div className="bg-white/[0.07] border border-white/[0.12] rounded-2xl p-6 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-72 h-72 bg-purple-600/10 blur-[100px] rounded-full pointer-events-none" />
        <h2 className="text-lg font-semibold text-white mb-1 relative z-10">Analytics Overview</h2>
        <p className="text-white/60 text-sm mb-6 relative z-10">Portfolio performance metrics</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative z-10">
          {[
            { icon: Eye, label: "Total Views", value: "1,234", color: "text-blue-300", bg: "bg-blue-500/20", border: "border-blue-400/40", glow: "shadow-[0_0_20px_rgba(59,130,246,0.2)]" },
            { icon: Users, label: "Unique Visitors", value: "567", color: "text-emerald-300", bg: "bg-emerald-500/20", border: "border-emerald-400/40", glow: "shadow-[0_0_20px_rgba(52,211,153,0.2)]" },
            { icon: TrendingUp, label: "Growth Rate", value: "+23%", color: "text-purple-300", bg: "bg-purple-500/20", border: "border-purple-400/40", glow: "shadow-[0_0_20px_rgba(168,85,247,0.2)]" },
          ].map((item) => (
            <div key={item.label} className={`text-center p-6 bg-black/30 rounded-2xl border ${item.border} ${item.glow} hover:bg-black/40 transition-colors`}>
              <div className={`flex items-center justify-center w-14 h-14 ${item.bg} border ${item.border} rounded-2xl mx-auto mb-4`}>
                <item.icon className={`h-6 w-6 ${item.color}`} />
              </div>
              <div className={`text-3xl font-bold ${item.color} mb-1`}>{item.value}</div>
              <div className="text-sm font-medium text-white/60 uppercase tracking-wider">{item.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
