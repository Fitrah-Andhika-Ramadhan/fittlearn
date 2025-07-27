"use client"

import React, { useState, useEffect, createContext, useContext, type ReactNode } from "react"
import { authService, type AuthUser, type LoginCredentials } from "@/lib/auth"

interface AuthContextType {
  user: AuthUser | null
  loading: boolean
  login: (credentials: LoginCredentials) => Promise<{ success: boolean; error?: string }>
  logout: () => void
  isAuthenticated: boolean
  isAdmin: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Initialize auth and check for existing session
    authService.initializeAuth()
    const currentUser = authService.getCurrentUser()
    setUser(currentUser)
    setLoading(false)
  }, [])

  const login = async (credentials: LoginCredentials) => {
    setLoading(true)
    try {
      const result = await authService.login(credentials)
      if (result.success && result.user) {
        setUser(result.user)
        return { success: true }
      }
      return { success: false, error: result.error }
    } catch (error) {
      return { success: false, error: "Login failed" }
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    authService.logout()
    setUser(null)
  }

  const value: AuthContextType = {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.role === "admin",
  }

  return React.createElement(AuthContext.Provider, { value }, children)
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
