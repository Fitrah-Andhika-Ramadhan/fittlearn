"use client"

import { useSession, signOut } from "next-auth/react"

export interface AuthUser {
  id: string
  email: string
  name: string
  role?: string
}

export function useAuth() {
  const { data: session, status } = useSession()
  const loading = status === "loading"
  const isAuthenticated = status === "authenticated"
  const user = session?.user as AuthUser | null

  // Since NextAuth logic handles login, the useAuth `login` isn't strictly needed, 
  // but we keep the stub to prevent breaking changes if it's called elsewhere.
  const login = async () => { return { success: false } }
  
  const logout = () => {
    signOut({ callbackUrl: "/login" })
  }

  return {
    user,
    loading,
    login,
    logout,
    isAuthenticated,
    // By default all valid database users are admins in this simple setup
    isAdmin: isAuthenticated
  }
}
