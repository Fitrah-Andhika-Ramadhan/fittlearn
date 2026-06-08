import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { NextAuthProvider } from "@/components/auth/session-provider"
import { CMSDataSync } from "@/components/cms-data-sync"
import { ThemeProvider } from "@/components/theme-provider"
import { PortfolioShell } from "@/components/portfolio-shell"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "FitLearned - AI Document Summarizer & Portfolio",
  description: "Creative UI Designer Portfolio & AI Summarizer",
  generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} dark min-h-screen bg-[#0f0c29] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#2e1a47] via-[#0b0914] to-[#05040a] text-white overflow-x-hidden relative font-sans`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <NextAuthProvider>
            <CMSDataSync />
            <PortfolioShell>
              {children}
            </PortfolioShell>
          </NextAuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
