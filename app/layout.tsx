import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/hooks/useAuth"
import { CMSDataSync } from "@/components/cms-data-sync"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "FitLearned - AI Document Summarizer",
  description: "Transform your documents into actionable insights with AI-powered summarization",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <CMSDataSync />
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
