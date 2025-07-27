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
    return React.createElement(
      "div",
      { className: "min-h-screen bg-gray-50 flex items-center justify-center" },
      React.createElement(
        "div",
        { className: "text-center" },
        React.createElement(Loader2, { className: "h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" }),
        React.createElement("p", { className: "text-gray-600" }, "Loading..."),
      ),
    )
  }

  if (!isAuthenticated || (requireAdmin && !isAdmin)) {
    return null
  }

  return React.createElement(React.Fragment, null, children)
}
