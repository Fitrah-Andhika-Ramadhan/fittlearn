"use client"

import type React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { User, Briefcase, Phone, Search, Home } from "lucide-react"

export function PortfolioShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  // Don't render portfolio sidebar/navbar on admin or login routes
  const isAdminRoute = pathname?.startsWith("/admin")
  const isLoginRoute = pathname?.startsWith("/login")
  const hidePortfolioUI = isAdminRoute || isLoginRoute

  if (hidePortfolioUI) {
    // Clean render for admin/login — no extra shells
    return <>{children}</>
  }

  return (
    <>
      {/* Glow Effects */}
      <div className="fixed top-[10%] left-[10%] w-[20%] h-[20%] bg-purple-600/40 blur-[120px] rounded-full mix-blend-screen pointer-events-none z-0"></div>
      <div className="fixed bottom-[10%] right-[10%] w-[30%] h-[30%] bg-blue-600/30 blur-[150px] rounded-full mix-blend-screen pointer-events-none z-0"></div>

      {/* Vertical Sidebar */}
      <aside className="fixed left-0 top-1/2 -translate-y-1/2 w-16 h-3/4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-r-3xl flex flex-col items-center justify-center space-y-8 z-50 shadow-[5px_0_30px_rgba(0,0,0,0.5)]">
        <Link href="/" className="p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition shadow-inner"><Home size={20}/></Link>
        <Link href="/dashboard" className="p-3 rounded-full text-white/50 hover:text-white hover:bg-white/10 transition"><User size={20}/></Link>
        <Link href="/portfolio" className="p-3 rounded-full text-white/50 hover:text-white hover:bg-white/10 transition"><Briefcase size={20}/></Link>
        <Link href="/contact" className="p-3 rounded-full text-white/50 hover:text-white hover:bg-white/10 transition"><Phone size={20}/></Link>
        <Link href="/summarizer" className="p-3 rounded-full text-white/50 hover:text-white hover:bg-white/10 transition"><Search size={20}/></Link>
      </aside>

      {/* Top Navbar */}
      <header className="fixed top-0 w-full pl-24 pr-12 py-8 flex justify-start items-center z-40 bg-gradient-to-b from-[#0b0914] to-transparent pointer-events-none">
        <nav className="flex items-center space-x-16 ml-16 text-xs font-medium tracking-widest uppercase text-white/70 pointer-events-auto">
          <Link href="/" className="hover:text-purple-400 transition text-white">Home</Link>
          <Link href="/about" className="hover:text-purple-400 transition">About</Link>
          <div className="w-12 h-12 rounded-full border border-purple-500/50 flex items-center justify-center text-2xl font-serif text-purple-400 mx-8 shadow-[0_0_15px_rgba(168,85,247,0.3)] bg-purple-900/20 backdrop-blur-sm">S</div>
          <Link href="/portfolio" className="hover:text-purple-400 transition">Work</Link>
          <Link href="/contact" className="hover:text-purple-400 transition">Contact</Link>
        </nav>
      </header>

      {/* Main Content Area */}
      <div className="pl-32 pr-12 pt-32 min-h-screen relative z-10 pb-20">
        {children}
      </div>

      {/* 3D Orbs */}
      <div className="fixed top-[20%] left-[25%] w-32 h-32 rounded-full bg-[radial-gradient(circle_at_30%_30%,_#fff,_#f0abfc,_#a855f7,_#4c1d95)] shadow-[0_0_50px_rgba(232,121,249,0.6)] z-20 opacity-90 animate-pulse pointer-events-none"></div>
      <div className="fixed top-[30%] left-[35%] w-16 h-16 rounded-full bg-[radial-gradient(circle_at_30%_30%,_#fff,_#93c5fd,_#3b82f6,_#1e3a8a)] shadow-[0_0_30px_rgba(96,165,250,0.6)] z-10 opacity-80 pointer-events-none"></div>
      <div className="fixed bottom-[5%] right-[10%] w-48 h-48 rounded-full bg-[radial-gradient(circle_at_30%_30%,_#e0e7ff,_#818cf8,_#4338ca,_#111827)] shadow-[0_0_60px_rgba(99,102,241,0.5)] z-20 pointer-events-none"></div>
    </>
  )
}
