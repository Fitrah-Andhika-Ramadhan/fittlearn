import type React from "react"
import type { Metadata } from "next"
import { Inter, Plus_Jakarta_Sans } from "next/font/google"
import "./globals.css"
import { NextAuthProvider } from "@/components/auth/session-provider"
import { CMSDataSync } from "@/components/cms-data-sync"
import { ThemeProvider } from "@/components/theme-provider"
import { PortfolioShell } from "@/components/portfolio-shell"
import { LanguageSwitcher } from "@/components/language-switcher"
import { AnalyticsTracker } from "@/components/analytics-tracker"
import { cookies } from "next/headers"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
const plusJakarta = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-plus-jakarta" })

import { Viewport } from "next"

export const viewport: Viewport = {
  themeColor: '#090714',
}

export const metadata: Metadata = {
  title: "FitLearned - AI Document Summarizer & Portfolio",
  description: "Creative UI Designer Portfolio & AI Summarizer",
  generator: 'v0.dev',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'FitLearned',
  },
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const cookieStore = await cookies()
  const lang = cookieStore.get('NEXT_LOCALE')?.value || 'id'

  return (
    <html lang={lang} suppressHydrationWarning className="overflow-x-hidden w-screen max-w-full">
      <body className={`${inter.variable} ${plusJakarta.variable} dark min-h-screen bg-cosmic-indigo text-white overflow-x-hidden relative font-sans w-full max-w-full`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <NextAuthProvider>
            <CMSDataSync />
            <AnalyticsTracker />
            <LanguageSwitcher />
            <PortfolioShell lang={lang}>
              {children}
            </PortfolioShell>
          </NextAuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

