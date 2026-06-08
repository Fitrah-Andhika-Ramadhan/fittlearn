"use client"

import React, { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/useAuth"
import { Loader2 } from "lucide-react"

interface ProtectedRouteProps {
  children: React.ReactNode
  requireAdmin?: boolean
}

export function ProtectedRoute({ children, requireAdmin = false }: ProtectedRouteProps) {
  const { user, loading, isAuthenticated, isAdmin } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        router.push("/login")
        return
      }

      if (requireAdmin && !isAdmin) {
        router.push("/")
        return
      }
    }
  }, [loading, isAuthenticated, isAdmin, requireAdmin, router])

  if (loading) {
    return (
      <div className="fixed inset-0 bg-[#0f0c29] flex items-center justify-center z-50">
        <div className="text-center">
          <div className="relative mb-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(168,85,247,0.5)]">
              <Loader2 className="h-8 w-8 animate-spin text-white" />
            </div>
          </div>
          <p className="text-white/60 text-sm font-medium">Loading admin panel...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated || (requireAdmin && !isAdmin)) {
    return null
  }

  return React.createElement(React.Fragment, null, children)
}
