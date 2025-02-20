import type { LeaveRequest, LeaveBalance, CreateLeaveRequestDto } from "@/types/leave"

// Mock data - replace with actual API calls
const mockLeaveRequests: LeaveRequest[] = [
  {
    id: "1",
    employee_id: "1",
    leave_type_id: "acf38160-da05-4f36-94f5-5bf31cff82b8",
    start_date: "2024-03-01T00:00:00Z",
    end_date: "2024-03-05T00:00:00Z",
    reason: "Annual vacation",
    status: "pending",
    created_at: "2024-02-20T10:00:00Z",
    updated_at: "2024-02-20T10:00:00Z",
    days: 5,
    employee: {
      first_name: "John",
      last_name: "Doe",
      avatar: "/placeholder.svg?height=40&width=40",
    },
  },
  // Add more mock data as needed
]

const mockLeaveBalances: LeaveBalance[] = [
  {
    employee_id: "1",
    leave_type_id: "acf38160-da05-4f36-94f5-5bf31cff82b8",
    total_days: 20,
    used_days: 5,
    remaining_days: 15,
    leave_type: {
      name: "Annual Leave",
    },
  },
  // Add more mock data as needed
]

export async function getLeaveRequests(filters?: {
  employee_id?: string
  status?: string
}): Promise<LeaveRequest[]> {
  await new Promise((resolve) => setTimeout(resolve, 1000))
  let filteredRequests = [...mockLeaveRequests]

  if (filters) {
    if (filters.employee_id) {
      filteredRequests = filteredRequests.filter((request) => request.employee_id === filters.employee_id)
    }
    if (filters.status) {
      filteredRequests = filteredRequests.filter((request) => request.status === filters.status)
    }
  }

  return filteredRequests
}

export async function getLeaveBalances(employee_id: string): Promise<LeaveBalance[]> {
  await new Promise((resolve) => setTimeout(resolve, 500))
  return mockLeaveBalances.filter((balance) => balance.employee_id === employee_id)
}

export async function createLeaveRequest(request: CreateLeaveRequestDto): Promise<LeaveRequest> {
  await new Promise((resolve) => setTimeout(resolve, 1000))

  const newRequest: LeaveRequest = {
    id: Math.random().toString(36).substr(2, 9),
    ...request,
    status: "pending",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    days: 5, // Calculate actual days in production
    employee: {
      first_name: "John",
      last_name: "Doe",
      avatar: "/placeholder.svg?height=40&width=40",
    },
  }

  return newRequest
}

export async function updateLeaveRequest(id: string, status: "approved" | "rejected"): Promise<LeaveRequest> {
  await new Promise((resolve) => setTimeout(resolve, 1000))

  const request = mockLeaveRequests.find((r) => r.id === id)
  if (!request) {
    throw new Error("Leave request not found")
  }

  const updatedRequest = {
    ...request,
    status,
    updated_at: new Date().toISOString(),
  }

  return updatedRequest
}

