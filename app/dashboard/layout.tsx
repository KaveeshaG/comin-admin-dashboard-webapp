"use client"

import type React from "react"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/providers/auth-provider"
import { DashboardSidebar } from "@/components/layout/dashboard-sidebar"
import { TopNav } from "@/components/layout/top-nav"
import { LoadingSpinner } from "@/components/loading-spinner"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return <LoadingSpinner />
  }

  if (!user) {
    return null
  }

  return (
    <SidebarProvider>
      <div className="relative flex min-h-[100dvh] w-full">
        <DashboardSidebar />
        <SidebarInset className="flex w-full flex-col">
          <TopNav />
          <main className="flex-1 overflow-y-auto bg-muted/10 w-full">
            <div className="container py-6 w-full">{children}</div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}

