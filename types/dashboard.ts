export interface DashboardStats {
    totalEmployees: number
    activeEmployees: number
    onLeave: number
    newJoinees: number
    departments: number
    upcomingReviews: number
    pendingRequests: number
    attendanceRate: number
  }
  
  export interface RecentActivity {
    id: string
    type: "leave" | "attendance" | "review" | "onboarding"
    user: {
      name: string
      avatar?: string
    }
    description: string
    timestamp: string
  }
  
  