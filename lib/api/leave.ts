import { LeaveType } from "@/types/leave"
import type { LeaveRequest, LeaveBalance, CreateLeaveRequestDto } from "@/types/leave"
import { apiClient } from "../utils/api-client"
import { mockLeavetypes, mockLeaveRequests } from "../mock-data"

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

export async function getLeaveRequests(organizationId: string): Promise<LeaveRequest[]> {
  try {
    const path = organizationId ? `/leaves/organizations/${organizationId}/leave-requests` : `/organizations`
    return await apiClient<LeaveRequest[]>(path, {}, 'leaves')
  } catch (error) {
    console.error("Error retreving Leave Requests:", error)
    throw error
  }
}

export async function getLeaveBalances(employee_id: string): Promise<LeaveBalance[]> {
  await new Promise((resolve) => setTimeout(resolve, 500))
  return mockLeaveBalances.filter((balance) => balance.employee_id === employee_id)
}

export async function createLeaveRequest(organizationId: string, request: CreateLeaveRequestDto): Promise<LeaveRequest> {
  try {
    const path = organizationId ? `/leaves/organizations/${organizationId}/leave-requests` : `/organiaztions`
    return await apiClient<LeaveRequest>(path, {
      method: "POST",
      body: JSON.stringify(request),
    }, 'leaves')
  } catch (error) {
    console.error("Error creating Leave Request:", error)
    throw error
  }
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

export async function getLeaveTypes(organizationId: string): Promise<LeaveType[]> {
  try {
    organizationId = '0bd14f74-997d-4384-be62-bb634800c6f8'

    const path = organizationId
      ? `/leaves/organizations/${organizationId}/leave-types`
      : `/organizations`

    return await apiClient<LeaveType[]>(path, {}, 'leaves')
  } catch (error) {
    console.error("Error fetching departments:", error)
    return mockLeavetypes
  }
}
