"use client"

import type React from "react"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/providers/auth-provider"
import { DashboardSidebar } from "@/components/layout/dashboard-sidebar"
import { TopNav } from "@/components/layout/top-nav"
import { LoadingSpinner } from "@/components/loading-spinner"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { useTenantContext } from "@/providers/tenant-provider"
import { ErrorBoundary } from "react-error-boundary"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, isLoading } = useAuth()
  const { currentTenant, isLoading: isTenantLoading } = useTenantContext()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
    } else if (!isTenantLoading && !currentTenant) {
      router.push("/select-tenant")
    }
  }, [user, isLoading, currentTenant, isTenantLoading, router])

  if (isLoading || isTenantLoading) {
    return <LoadingSpinner />
  }

  if (!user || !currentTenant) {
    return null
  }

  return (
    <SidebarProvider>
      <div className="relative flex min-h-[100dvh] w-full">
        <DashboardSidebar />
        <SidebarInset className="flex w-full flex-col">
          <TopNav />
          <main className="flex-1 overflow-y-auto bg-muted/10 w-full">
            <ErrorBoundary fallback={<DashboardError />}>
              <div className="container py-6 w-full">{children}</div>
            </ErrorBoundary>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}

function DashboardError() {
  return (
    <div className="flex h-[50vh] items-center justify-center">
      <div className="text-center">
        <h2 className="text-lg font-semibold">Something went wrong</h2>
        <p className="text-sm text-muted-foreground">Please try refreshing the page</p>
      </div>
    </div>
  )
}

