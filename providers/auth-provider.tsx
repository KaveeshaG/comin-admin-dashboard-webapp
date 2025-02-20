"use client"

import { createContext, useContext, useEffect, useState } from "react"
import type { ReactNode } from "react"
import type { AuthUser } from "@/types/auth"
import { useMounted } from "@/lib/hooks/use-mounted"
import Cookies from "js-cookie"

interface AuthContextType {
  user: AuthUser | null
  login: (accessToken: string, organizationId: string) => Promise<void>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const mounted = useMounted()

  useEffect(() => {
    if (mounted) {
      // Check cookies for existing auth data
      const accessToken = Cookies.get("accessToken")
      const organizationId = Cookies.get("organizationId")

      if (accessToken && organizationId) {
        // Sync with localStorage for client-side access
        localStorage.setItem("accessToken", accessToken)
        localStorage.setItem("organizationId", organizationId)

        setUser({
          accessToken,
          organizationId,
          isAuthenticated: true,
        })
      }
      setIsLoading(false)
    }
  }, [mounted])

  const login = async (accessToken: string, organizationId: string) => {
    // Set cookies first (these will be used by middleware)
    Cookies.set("accessToken", accessToken, { path: "/" })
    Cookies.set("organizationId", organizationId, { path: "/" })

    // Then set localStorage for client-side access
    localStorage.setItem("accessToken", accessToken)
    localStorage.setItem("organizationId", organizationId)

    setUser({
      accessToken,
      organizationId,
      isAuthenticated: true,
    })

    return Promise.resolve()
  }

  const logout = () => {
    // Clear both cookies and localStorage
    Cookies.remove("accessToken", { path: "/" })
    Cookies.remove("organizationId", { path: "/" })
    localStorage.removeItem("accessToken")
    localStorage.removeItem("organizationId")
    setUser(null)
  }

  // Don't render anything until we've checked the authentication state
  if (!mounted || isLoading) {
    return null
  }

  return <AuthContext.Provider value={{ user, login, logout, isLoading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

