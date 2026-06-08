"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Settings, FolderOpen, User, BookOpen, BarChart3, FileText, Brain, Menu, X, Home, LogOut } from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { useAuth } from "@/hooks/useAuth"

const sidebarItems = [
  { href: "/admin", icon: BarChart3, label: "Dashboard" },
  { href: "/admin/projects", icon: FolderOpen, label: "Projects" },
  { href: "/admin/skills", icon: User, label: "Skills" },
  { href: "/admin/experience", icon: BookOpen, label: "Experience" },
  { href: "/admin/files", icon: FileText, label: "Study Files" },
  { href: "/admin/blog", icon: FileText, label: "Blog" },
  { href: "/admin/settings", icon: Settings, label: "Settings" },
]

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout } = useAuth()

  const handleLogout = () => {
    if (confirm("Are you sure you want to logout?")) {
      logout()
      router.push("/login")
    }
  }

  const SidebarContent = () => (
    <>
      {/* Logo */}
      <div className="flex items-center justify-between h-20 px-6 border-b border-white/10 flex-shrink-0">
        <Link href="/" className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl shadow-[0_0_15px_rgba(168,85,247,0.4)]">
            <Brain className="h-6 w-6 text-white" />
          </div>
          <span className="text-xl font-bold text-white tracking-wide">FitLearned</span>
        </Link>
        <Button variant="ghost" size="sm" className="lg:hidden text-white/70 hover:text-white" onClick={() => setSidebarOpen(false)}>
          <X className="h-5 w-5" />
        </Button>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-4 py-6 flex flex-col justify-between">
        <div className="space-y-1">
          <div className="px-3 mb-4 text-xs font-semibold text-white/30 uppercase tracking-widest">Admin Menu</div>
          {sidebarItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200
                  ${isActive
                    ? "bg-gradient-to-r from-purple-600/30 to-blue-600/20 text-white border border-purple-500/40 shadow-[inset_0_0_20px_rgba(168,85,247,0.1)]"
                    : "text-white/50 hover:bg-white/8 hover:text-white"}
                `}
                onClick={() => setSidebarOpen(false)}
              >
                <item.icon className={`mr-3 h-4 w-4 flex-shrink-0 ${isActive ? "text-purple-400" : "text-white/40"}`} />
                {item.label}
              </Link>
            )
          })}
        </div>

        <div className="space-y-1 mt-6">
          <div className="px-3 mb-3 text-xs font-semibold text-white/30 uppercase tracking-widest">System</div>
          <Link
            href="/"
            className="flex items-center px-4 py-3 text-sm font-medium text-white/50 rounded-xl hover:bg-white/8 hover:text-white transition-all duration-200"
            onClick={() => setSidebarOpen(false)}
          >
            <Home className="mr-3 h-4 w-4 flex-shrink-0 text-white/40" />
            Back to Site
          </Link>
          <button
            className="flex items-center w-full px-4 py-3 text-sm font-medium text-red-400/70 rounded-xl hover:bg-red-500/10 hover:text-red-400 transition-all duration-200"
            onClick={handleLogout}
          >
            <LogOut className="mr-3 h-4 w-4 flex-shrink-0" />
            Logout
          </button>
        </div>
      </nav>
    </>
  )

  return (
    <ProtectedRoute requireAdmin={true}>
      {/* Full-screen admin shell */}
      <div className="fixed inset-0 flex bg-[#0a0812] text-white overflow-hidden">

        {/* Background glows */}
        <div className="fixed top-0 left-0 w-[600px] h-[600px] bg-purple-700/10 blur-[140px] rounded-full pointer-events-none" />
        <div className="fixed bottom-0 right-0 w-[500px] h-[500px] bg-blue-700/8 blur-[160px] rounded-full pointer-events-none" />

        {/* Mobile overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* ─── Sidebar ─── */}
        {/* Desktop: always visible, static */}
        <aside className="hidden lg:flex flex-col w-60 flex-shrink-0 bg-white/[0.03] border-r border-white/[0.07] relative z-10">
          <SidebarContent />
        </aside>

        {/* Mobile: slide-in overlay */}
        <aside
          className={`
            fixed inset-y-0 left-0 z-50 flex flex-col w-64 bg-[#0f0c1e]/95 backdrop-blur-2xl border-r border-white/10
            transition-transform duration-300 ease-in-out lg:hidden
            ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          `}
        >
          <SidebarContent />
        </aside>

        {/* ─── Main area ─── */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Topbar */}
          <header className="flex-shrink-0 h-16 flex items-center justify-between px-4 lg:px-8 bg-white/[0.03] border-b border-white/[0.07] backdrop-blur-xl z-20">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden text-white/60 hover:text-white hover:bg-white/10"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="h-5 w-5" />
              </Button>
              <h2 className="text-base font-semibold text-white/80 tracking-wide">
                {sidebarItems.find(item => item.href === pathname)?.label || "Admin Panel"}
              </h2>
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden sm:flex flex-col items-end">
                <span className="text-sm font-medium text-white/80">{user?.name}</span>
                <span className="text-xs text-white/40 capitalize">{user?.role}</span>
              </div>
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center shadow-[0_0_12px_rgba(168,85,247,0.4)] border border-white/20 flex-shrink-0">
                <span className="text-white text-sm font-bold">{user?.name?.charAt(0).toUpperCase() || 'A'}</span>
              </div>
            </div>
          </header>

          {/* Page content */}
          <main className="flex-1 overflow-y-auto p-4 lg:p-8 relative z-10">
            {children}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  )
}
