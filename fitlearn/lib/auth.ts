// Authentication system for CMS
export interface AuthUser {
  id: string
  email: string
  name: string
  role: "admin" | "user"
  avatar?: string
  createdAt: string
  lastLogin: string
}

export interface LoginCredentials {
  email: string
  password: string
}

class AuthService {
  private readonly STORAGE_KEY = "fitlearned_auth"
  private readonly SESSION_KEY = "fitlearned_session"

  // Default admin credentials (in production, this should be in a secure database)
  private readonly DEFAULT_ADMIN = {
    id: "admin-1",
    email: "admin@fitlearned.com",
    password: "admin123", // In production, this should be hashed
    name: "Fitrah Andhika Ramadhan",
    role: "admin" as const,
    avatar: "/placeholder.svg?height=40&width=40",
    createdAt: new Date().toISOString(),
  }

  // Initialize default admin if not exists
  initializeAuth(): void {
    if (typeof window === "undefined") return

    const users = this.getUsers()
    if (users.length === 0) {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify([this.DEFAULT_ADMIN]))
    }
  }

  // Get all users from storage
  private getUsers(): any[] {
    if (typeof window === "undefined") return []
    const data = localStorage.getItem(this.STORAGE_KEY)
    return data ? JSON.parse(data) : []
  }

  // Login function
  async login(credentials: LoginCredentials): Promise<{ success: boolean; user?: AuthUser; error?: string }> {
    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const users = this.getUsers()
      const user = users.find((u) => u.email === credentials.email && u.password === credentials.password)

      if (!user) {
        return { success: false, error: "Invalid email or password" }
      }

      // Update last login
      user.lastLogin = new Date().toISOString()
      const updatedUsers = users.map((u) => (u.id === user.id ? user : u))
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updatedUsers))

      // Create session
      const authUser: AuthUser = {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        avatar: user.avatar,
        createdAt: user.createdAt,
        lastLogin: user.lastLogin,
      }

      // Store session
      localStorage.setItem(
        this.SESSION_KEY,
        JSON.stringify({
          user: authUser,
          token: this.generateToken(),
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
        }),
      )

      return { success: true, user: authUser }
    } catch (error) {
      return { success: false, error: "Login failed. Please try again." }
    }
  }

  // Logout function
  logout(): void {
    if (typeof window === "undefined") return
    localStorage.removeItem(this.SESSION_KEY)
  }

  // Get current user from session
  getCurrentUser(): AuthUser | null {
    if (typeof window === "undefined") return null

    try {
      const sessionData = localStorage.getItem(this.SESSION_KEY)
      if (!sessionData) return null

      const session = JSON.parse(sessionData)

      // Check if session is expired
      if (new Date() > new Date(session.expiresAt)) {
        this.logout()
        return null
      }

      return session.user
    } catch (error) {
      return null
    }
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return this.getCurrentUser() !== null
  }

  // Check if user is admin
  isAdmin(): boolean {
    const user = this.getCurrentUser()
    return user?.role === "admin"
  }

  // Generate simple token (in production, use proper JWT)
  private generateToken(): string {
    return btoa(Date.now().toString() + Math.random().toString())
  }

  // Change password
  async changePassword(currentPassword: string, newPassword: string): Promise<{ success: boolean; error?: string }> {
    const currentUser = this.getCurrentUser()
    if (!currentUser) {
      return { success: false, error: "Not authenticated" }
    }

    const users = this.getUsers()
    const user = users.find((u) => u.id === currentUser.id)

    if (!user || user.password !== currentPassword) {
      return { success: false, error: "Current password is incorrect" }
    }

    // Update password
    user.password = newPassword
    const updatedUsers = users.map((u) => (u.id === user.id ? user : u))
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updatedUsers))

    return { success: true }
  }

  // Create new admin user (for future expansion)
  async createUser(userData: {
    email: string
    password: string
    name: string
    role: "admin" | "user"
  }): Promise<{ success: boolean; user?: AuthUser; error?: string }> {
    const users = this.getUsers()

    // Check if email already exists
    if (users.find((u) => u.email === userData.email)) {
      return { success: false, error: "Email already exists" }
    }

    const newUser = {
      id: `user-${Date.now()}`,
      ...userData,
      avatar: "/placeholder.svg?height=40&width=40",
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
    }

    users.push(newUser)
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(users))

    const authUser: AuthUser = {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      role: newUser.role,
      avatar: newUser.avatar,
      createdAt: newUser.createdAt,
      lastLogin: newUser.lastLogin,
    }

    return { success: true, user: authUser }
  }
}

export const authService = new AuthService()
