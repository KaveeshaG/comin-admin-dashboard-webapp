import type { DashboardStats, RecentActivity } from "@/types/dashboard"

export async function getDashboardStats(organizationId: string): Promise<DashboardStats> {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // In a real app, this would fetch data for the specific organization
  return {
    totalEmployees: 156,
    activeEmployees: 142,
    onLeave: 14,
    newJoinees: 5,
    departments: 8,
    upcomingReviews: 12,
    pendingRequests: 7,
    attendanceRate: 95.5,
  }
}

export async function getRecentActivity(organizationId: string): Promise<RecentActivity[]> {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // In a real app, this would fetch activities for the specific organization
  return [
    {
      id: "1",
      type: "leave",
      user: {
        name: "John Doe",
        avatar: "/placeholder.svg?height=32&width=32",
      },
      description: "Requested annual leave",
      timestamp: "2 hours ago",
    },
    {
      id: "2",
      type: "attendance",
      user: {
        name: "Jane Smith",
        avatar: "/placeholder.svg?height=32&width=32",
      },
      description: "Marked attendance for today",
      timestamp: "3 hours ago",
    },
    {
      id: "3",
      type: "review",
      user: {
        name: "Mike Johnson",
        avatar: "/placeholder.svg?height=32&width=32",
      },
      description: "Completed quarterly review",
      timestamp: "5 hours ago",
    },
    {
      id: "4",
      type: "onboarding",
      user: {
        name: "Sarah Wilson",
        avatar: "/placeholder.svg?height=32&width=32",
      },
      description: "Completed onboarding process",
      timestamp: "1 day ago",
    },
  ]
}

