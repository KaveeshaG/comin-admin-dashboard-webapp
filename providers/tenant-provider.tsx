"use client"

import type React from "react"

import { createContext, useContext, useState } from "react"

interface Tenant {
  id: string
  name: string
  domain?: string
}

interface TenantContextType {
  currentTenant: Tenant | null
  availableTenants: Tenant[]
  setCurrentTenant: (tenant: Tenant) => void
}

const TenantContext = createContext<TenantContextType | undefined>(undefined)

// Static tenant data until API is ready
const staticTenants = [
  { id: "1", name: "Organization One" },
  { id: "2", name: "Organization Two" },
  { id: "3", name: "Organization Three" },
]

export function TenantProvider({ children }: { children: React.ReactNode }) {
  const [currentTenant, setCurrentTenant] = useState<Tenant | null>(null)

  return (
    <TenantContext.Provider
      value={{
        currentTenant,
        availableTenants: staticTenants,
        setCurrentTenant,
      }}
    >
      {children}
    </TenantContext.Provider>
  )
}

export const useTenantContext = () => {
  const context = useContext(TenantContext)
  if (context === undefined) {
    throw new Error("useTenantContext must be used within a TenantProvider")
  }
  return context
}

