"use client"

import { Building2, Users, Calendar, Clock, FileText, CreditCard, BarChart, LogOut } from "lucide-react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { TenantSwitcher } from "./tenant-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { useAuth } from "@/providers/auth-provider"

export function DashboardSidebar() {
  const pathname = usePathname()
  const { logout } = useAuth()

  const menuItems = [
    {
      title: "Dashboard",
      icon: Building2,
      href: "/dashboard",
    },
    {
      title: "Organization",
      icon: Building2,
      href: "/dashboard/organization",
    },
    {
      title: "Employees",
      icon: Users,
      href: "/dashboard/employees",
    },
    {
      title: "Leave Management",
      icon: Calendar,
      href: "/dashboard/leave",
    },
    {
      title: "Attendance",
      icon: Clock,
      href: "/dashboard/attendance",
    },
    {
      title: "Timesheet",
      icon: FileText,
      href: "/dashboard/timesheet",
    },
    {
      title: "Billing",
      icon: CreditCard,
      href: "/dashboard/billing",
    },
    {
      title: "Reports",
      icon: BarChart,
      href: "/dashboard/reports",
    },
  ]

  return (
    <Sidebar variant="inset" className="border-r bg-sidebar">
      <SidebarHeader className="border-b border-border/10 p-4">
        <TenantSwitcher />
      </SidebarHeader>
      <SidebarContent>
        <ScrollArea className="flex-1 py-2">
          <SidebarMenu>
            {menuItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === item.href}
                  className={cn("w-full", pathname === item.href && "bg-primary/10 text-primary")}
                >
                  <Link href={item.href}>
                    <item.icon className="mr-2 h-4 w-4" />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </ScrollArea>
      </SidebarContent>
      <SidebarFooter className="border-t border-border/10 p-4">
        <Button
          variant="ghost"
          className="w-full justify-start text-destructive hover:bg-destructive/10"
          onClick={() => logout()}
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Logout</span>
        </Button>
      </SidebarFooter>
    </Sidebar>
  )
}

