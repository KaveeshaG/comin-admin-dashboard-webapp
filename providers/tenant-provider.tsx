"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import type { Organization } from "@/types/organization"
import { mockOrganizations } from "@/lib/mock-data" // Import mock data

interface TenantContextType {
  currentTenant: Organization | null
  availableTenants: Organization[]
  setCurrentTenant: (tenant: Organization | null) => Promise<void>
  isLoading: boolean
}

const TenantContext = createContext<TenantContextType | undefined>(undefined)

export function TenantProvider({ children }: { children: React.ReactNode }) {
  const [currentTenant, setCurrentTenant] = useState<Organization | null>(null)
  const [availableTenants, setAvailableTenants] = useState<Organization[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    loadInitialData()
  }, [])

  const loadInitialData = async () => {
    try {
      // Load available tenants (using mock data for now)
      setAvailableTenants(mockOrganizations)

      // Load current tenant from storage
      const storedTenant = localStorage.getItem("currentTenant")
      if (storedTenant) {
        setCurrentTenant(JSON.parse(storedTenant))
      }
    } catch (error) {
      console.error("Failed to load tenant data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSetCurrentTenant = async (tenant: Organization | null) => {
    try {
      if (tenant) {
        // Store in localStorage
        localStorage.setItem("currentTenant", JSON.stringify(tenant))
        // Set cookie for middleware
        document.cookie = `currentTenantId=${tenant.id}; path=/`
        setCurrentTenant(tenant)
      } else {
        // Clear tenant data
        localStorage.removeItem("currentTenant")
        document.cookie = "currentTenantId=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
        setCurrentTenant(null)
      }
    } catch (error) {
      console.error("Failed to set tenant:", error)
      throw new Error("Failed to set tenant")
    }
  }

  return (
    <TenantContext.Provider
      value={{
        currentTenant,
        availableTenants,
        setCurrentTenant: handleSetCurrentTenant,
        isLoading,
      }}
    >
      {children}
    </TenantContext.Provider>
  )
}

export function useTenantContext() {
  const context = useContext(TenantContext)
  if (context === undefined) {
    throw new Error("useTenantContext must be used within a TenantProvider")
  }
  return context
}

