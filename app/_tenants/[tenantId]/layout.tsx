import type React from "react"
import { DashboardSidebar } from "@/components/layout/dashboard-sidebar"

export default function TenantLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { tenantId: string }
}) {
  return (
    <div className="flex h-screen">
      <DashboardSidebar />
      <main className="flex-1 overflow-y-auto p-8">
        <div className="mb-4">Current Tenant ID: {params.tenantId}</div>
        {children}
      </main>
    </div>
  )
}

