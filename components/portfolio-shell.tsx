"use client"

import type React from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { User, Briefcase, Phone, Search, Home, Book } from "lucide-react"
import { CosmicBackground } from "@/components/cosmic-background"
import { PWAInstallButton } from "@/components/pwa-install-button"

export function PortfolioShell({ children, lang = 'en' }: { children: React.ReactNode, lang?: string }) {
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
      {/* Cosmic WebGL Background */}
      <CosmicBackground />

      {/* Navigation Bar (Vertical on Desktop, Bottom Horizontal on Mobile) */}
      <aside className="fixed bottom-0 left-0 w-full h-16 lg:top-1/2 lg:-translate-y-1/2 lg:w-16 lg:h-3/4 glass border-t lg:border-t-0 lg:border-r rounded-t-3xl lg:rounded-t-none lg:rounded-r-3xl flex flex-row lg:flex-col items-center justify-around lg:justify-center space-x-2 lg:space-x-0 lg:space-y-8 z-50 px-4 lg:px-0">
        <Link prefetch={true} href="/" className="p-2 lg:p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-all hover:scale-110 hover:-translate-y-1 shadow-inner"><Home size={20}/></Link>
        <Link prefetch={true} href="/portfolio" className="p-2 lg:p-3 rounded-full text-white/50 hover:text-white hover:bg-white/10 transition-all hover:scale-110 hover:-translate-y-1"><Briefcase size={20}/></Link>
        <Link prefetch={true} href="/blog" className="p-2 lg:p-3 rounded-full text-white/50 hover:text-white hover:bg-white/10 transition-all hover:scale-110 hover:-translate-y-1"><Book size={20}/></Link>
        <Link prefetch={true} href="/contact" className="p-2 lg:p-3 rounded-full text-white/50 hover:text-white hover:bg-white/10 transition-all hover:scale-110 hover:-translate-y-1"><Phone size={20}/></Link>
        <Link prefetch={true} href="/summarizer" className="p-2 lg:p-3 rounded-full text-white/50 hover:text-white hover:bg-white/10 transition-all hover:scale-110 hover:-translate-y-1"><Search size={20}/></Link>
      </aside>

      {/* Top Navbar */}
      <header className="fixed top-0 w-full lg:pl-24 lg:pr-12 py-4 lg:py-6 flex justify-center lg:justify-start items-center z-40 glass border-b-0 shadow-none pointer-events-none transition-all duration-300">
        <nav className="hidden lg:flex items-center space-x-12 ml-16 text-xs font-semibold tracking-widest uppercase text-white/70 pointer-events-auto">
          <Link prefetch={true} href="/" className="relative text-white transition-colors py-2 after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:bg-purple-400">
            {lang === 'id' ? 'Beranda' : 'Home'}
          </Link>
          <Link prefetch={true} href="/about" className="relative hover:text-white transition-colors py-2 after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 hover:after:w-full after:bg-purple-400 after:transition-all after:duration-300">
            {lang === 'id' ? 'Tentang' : 'About'}
          </Link>
          <div className="w-12 h-12 rounded-full border border-purple-500/50 flex items-center justify-center mx-8 shadow-[0_0_20px_rgba(168,85,247,0.4)] bg-white/5 backdrop-blur-xl hover:scale-110 hover:shadow-[0_0_30px_rgba(168,85,247,0.6)] transition-all duration-500 cursor-pointer overflow-hidden relative">
            <Image src="/logo.png" alt="Logo" fill className="object-cover" />
          </div>
          <Link prefetch={true} href="/portfolio" className="relative hover:text-white transition-colors py-2 after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 hover:after:w-full after:bg-purple-400 after:transition-all after:duration-300">
            {lang === 'id' ? 'Karya' : 'Work'}
          </Link>
          <Link prefetch={true} href="/blog" className="relative hover:text-white transition-colors py-2 after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 hover:after:w-full after:bg-purple-400 after:transition-all after:duration-300">
            Blog
          </Link>
          <Link prefetch={true} href="/contact" className="relative hover:text-white transition-colors py-2 after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 hover:after:w-full after:bg-purple-400 after:transition-all after:duration-300">
            {lang === 'id' ? 'Kontak' : 'Contact'}
          </Link>
        </nav>
        
        {/* Left side icons (Mobile) / Right side (Desktop) */}
        <div className="absolute left-4 lg:left-auto lg:right-64 flex items-center space-x-3 pointer-events-auto z-50">
          <PWAInstallButton lang={lang} />
        </div>

        {/* Mobile Logo */}
        <div className="flex lg:hidden w-10 h-10 rounded-full border border-purple-500/50 items-center justify-center shadow-[0_0_15px_rgba(168,85,247,0.3)] bg-white/5 backdrop-blur-xl pointer-events-auto mt-2 overflow-hidden relative">
          <Image src="/logo.png" alt="Logo" fill className="object-cover" />
        </div>
      </header>

      {/* Main Content Area */}
      <div className="px-4 pt-20 lg:pl-32 lg:pr-12 lg:pt-32 min-h-screen relative z-10 pb-24 lg:pb-20 max-w-[100vw] overflow-x-hidden">
        {children}
      </div>

    </>
  )
}
