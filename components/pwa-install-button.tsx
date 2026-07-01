"use client"

import { useState, useEffect } from "react"
import { Download } from "lucide-react"

// Define a type for the BeforeInstallPromptEvent since it's non-standard
interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export function PWAInstallButton({ lang = 'en' }: { lang?: string }) {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [isInstallable, setIsInstallable] = useState(false)

  useEffect(() => {
    // Register Service Worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(err => {
        console.error('Service Worker registration failed:', err)
      })
    }

    // Listen for the beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault()
      // Stash the event so it can be triggered later.
      setDeferredPrompt(e as BeforeInstallPromptEvent)
      // Update UI notify the user they can install the PWA
      setIsInstallable(true)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)

    // Listen for successful installation
    const handleAppInstalled = () => {
      setDeferredPrompt(null)
      setIsInstallable(false)
      console.log('PWA was installed')
    }

    window.addEventListener('appinstalled', handleAppInstalled)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleAppInstalled)
    }
  }, [])

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      // Fallback for browsers that don't support beforeinstallprompt but still might allow installation via browser menu
      alert(lang === 'id' 
        ? "Gunakan menu browser (titik tiga) lalu pilih 'Tambahkan ke Layar Utama' atau 'Install App' untuk memasang aplikasi."
        : "Use your browser menu and select 'Add to Home Screen' or 'Install App' to install.")
      return
    }
    
    // Show the install prompt
    deferredPrompt.prompt()
    
    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice
    
    if (outcome === 'accepted') {
      console.log('User accepted the install prompt')
    } else {
      console.log('User dismissed the install prompt')
    }
    
    // We've used the prompt, and can't use it again, throw it away
    setDeferredPrompt(null)
    setIsInstallable(false)
  }

  return (
    <button
      onClick={handleInstallClick}
      title={lang === 'id' ? "Instal Aplikasi (APK)" : "Install App (APK)"}
      className={`p-2 rounded-full border border-purple-500/50 flex items-center justify-center shadow-[0_0_15px_rgba(168,85,247,0.3)] bg-purple-500/10 backdrop-blur-xl hover:scale-110 hover:shadow-[0_0_30px_rgba(168,85,247,0.6)] hover:bg-purple-500/30 transition-all duration-300 text-purple-300 relative group overflow-visible ${isInstallable ? 'animate-pulse' : ''}`}
    >
      <Download size={20} />
      
      {/* Tooltip */}
      <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-black/80 text-white text-[10px] rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none border border-white/10 hidden md:block">
        {lang === 'id' ? "Instal APK" : "Install APK"}
      </div>
    </button>
  )
}
