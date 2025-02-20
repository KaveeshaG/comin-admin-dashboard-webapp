"use client"

import { useEffect, useState } from "react"
import { Users, UserCheck, Calendar, UserPlus, Building2, FileCheck, AlertCircle, Percent } from "lucide-react"
import { getDashboardStats, getRecentActivity } from "@/lib/api/dashboard"
import { StatsCard } from "@/components/dashboard/stats-card"
import { ActivityList } from "@/components/dashboard/activity-list"
import { CalendarWidget } from "@/components/dashboard/calendar-widget"
import DashboardLoading from "./loading"
import { useTenantContext } from "@/providers/tenant-provider"
import { useToast } from "@/components/ui/use-toast"
import type { DashboardStats, RecentActivity } from "@/types/dashboard"

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [activities, setActivities] = useState<RecentActivity[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { currentTenant } = useTenantContext()
  const { toast } = useToast()

  useEffect(() => {
    if (currentTenant?.id) {
      loadDashboardData()
    }
  }, [currentTenant?.id])

  const loadDashboardData = async () => {
    if (!currentTenant?.id) return

    setIsLoading(true)
    try {
      const [statsData, activitiesData] = await Promise.all([
        getDashboardStats(currentTenant.id),
        getRecentActivity(currentTenant.id),
      ])
      setStats(statsData)
      setActivities(activitiesData)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load dashboard data",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading || !stats) {
    return <DashboardLoading />
  }

  return (
    <div className="flex flex-col space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard Overview</h1>
        <p className="text-sm text-muted-foreground">
          Welcome back! Here's what's happening with {currentTenant?.name} today.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Employees"
          value={stats.totalEmployees}
          icon={<Users className="h-4 w-4 text-blue-500" />}
        />
        <StatsCard
          title="Active Employees"
          value={stats.activeEmployees}
          icon={<UserCheck className="h-4 w-4 text-green-500" />}
        />
        <StatsCard title="On Leave" value={stats.onLeave} icon={<Calendar className="h-4 w-4 text-amber-500" />} />
        <StatsCard
          title="New Joinees"
          value={stats.newJoinees}
          icon={<UserPlus className="h-4 w-4 text-violet-500" />}
        />
        <StatsCard
          title="Departments"
          value={stats.departments}
          icon={<Building2 className="h-4 w-4 text-blue-500" />}
        />
        <StatsCard
          title="Upcoming Reviews"
          value={stats.upcomingReviews}
          icon={<FileCheck className="h-4 w-4 text-green-500" />}
        />
        <StatsCard
          title="Pending Requests"
          value={stats.pendingRequests}
          icon={<AlertCircle className="h-4 w-4 text-amber-500" />}
        />
        <StatsCard
          title="Attendance Rate"
          value={`${stats.attendanceRate}%`}
          icon={<Percent className="h-4 w-4 text-violet-500" />}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-7">
        <div className="min-h-[500px] lg:col-span-3">
          <CalendarWidget organizationId={currentTenant?.id} />
        </div>
        <div className="min-h-[500px] lg:col-span-4">
          <ActivityList activities={activities} />
        </div>
      </div>
    </div>
  )
}

