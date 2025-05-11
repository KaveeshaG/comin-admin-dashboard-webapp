import type { LeaveType } from "@/types/leave"
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
  {
    employee_id: "d67fef11-e5e6-4407-b44c-f81b69681de1",
    leave_type_id: "acf38160-da05-4f36-94f5-5bf31cff82b8",
    total_days: 25,
    used_days: 8,
    remaining_days: 17,
    leave_type: {
      name: "Annual Leave",
    },
  },
  {
    employee_id: "9100ea58-6fb1-472c-a958-31f76b3c2371",
    leave_type_id: "acf38160-da05-4f36-94f5-5bf31cff82b8",
    total_days: 22,
    used_days: 3,
    remaining_days: 19,
    leave_type: {
      name: "Annual Leave",
    },
  },
]
 
export async function getLeaveRequests(organizationId: string): Promise<LeaveRequest[]> {
  try {
    const path = organizationId ? `/leaves/organizations/${organizationId}/leave-requests` : `/organizations`
    return await apiClient<LeaveRequest[]>(path, {}, "leaves")
  } catch (error) {
    console.error("Error retrieving Leave Requests:", error)
    // Return mock data as fallback
    return mockLeaveRequests
  }
}
 
export async function getLeaveBalances(employee_id: string): Promise<LeaveBalance[]> {
  try {
    // In a real implementation, this would call the API
    // For now, return mock data
    await new Promise((resolve) => setTimeout(resolve, 500))
    const balances = mockLeaveBalances.filter((balance) => balance.employee_id === employee_id)
 
    // If no balances found for this employee, return a default one
    if (balances.length === 0) {
      return [
        {
          employee_id,
          leave_type_id: "acf38160-da05-4f36-94f5-5bf31cff82b8",
          total_days: 20,
          used_days: 0,
          remaining_days: 20,
          leave_type: {
            name: "Annual Leave",
          },
        },
      ]
    }
 
    return balances
  } catch (error) {
    console.error("Error retrieving Leave Balances:", error)
    // Return a default balance as fallback
    return [
      {
        employee_id,
        leave_type_id: "acf38160-da05-4f36-94f5-5bf31cff82b8",
        total_days: 20,
        used_days: 0,
        remaining_days: 20,
        leave_type: {
          name: "Annual Leave",
        },
      },
    ]
  }
}
 
export async function createLeaveRequest(
  organizationId: string,
  request: CreateLeaveRequestDto,
): Promise<LeaveRequest> {
  try {
    const path = organizationId ? `/leaves/organizations/${organizationId}/leave-requests` : `/organizations`
    return await apiClient<LeaveRequest>(
      path,
      {
        method: "POST",
        body: JSON.stringify(request),
      },
      "leaves",
    )
  } catch (error) {
    console.error("Error creating Leave Request:", error)
    throw error
  }
}
 
export async function updateLeaveRequest(
  id: string,
  status: "approved" | "rejected",
  comments?: string,
): Promise<LeaveRequest> {
  try {
    // Find the leave request in our mock data or fetch it from the API
    let request: LeaveRequest | undefined
 
    try {
      // Try to find the request in our mock data first
      request = mockLeaveRequests.find((r) => r.id === id)
 
      // If not found in mock data, we could try to fetch it from the API
      // This is commented out for now as we don't have a getLeaveRequest function
      // if (!request) {
      //   request = await getLeaveRequest(id)
      // }
    } catch (error) {
      console.error("Error finding leave request:", error)
    }
 
    // If we still don't have the request, create a minimal one with the ID
    if (!request) {
      console.warn(`Leave request with ID ${id} not found, creating minimal request object`)
      request = {
        id,
        status: "pending",
        employee_id: "",
        leave_type_id: "",
        organization_id: "0bd14f74-997d-4384-be62-bb634800c6f8",
        start_date: new Date().toISOString(),
        end_date: new Date().toISOString(),
        reason: "",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        total_days: 1,
      }
    }
 
    // Get organization ID from the request or use default
    const organizationId = request.organization_id || "0bd14f74-997d-4384-be62-bb634800c6f8"
 
    // Construct the path for the API call
    const path = `/leaves/organizations/${organizationId}/leave-requests/${id}`
 
    // Prepare the update data
    const updateData = {
      id: id,
      organization_id: organizationId,
      employee_id: request.employee_id,
      leave_type_id: request.leave_type_id,
      days: request.days || request.total_days || 1, // Handle both property names with fallback
      status: status,
      reason: request.reason || "",
      comments: comments || "", // Use provided comments or empty string
    }
 
    console.log("Updating leave request with data:", updateData)
 
    // Make the API call
    try {
      return await apiClient<LeaveRequest>(
        path,
        {
          method: "PUT",
          body: JSON.stringify(updateData),
        },
        "leaves",
      )
    } catch (apiError) {
      console.error("API error updating leave request:", apiError)
 
      // For demo purposes, return a mock updated request
      const updatedRequest = {
        ...request,
        status,
        updated_at: new Date().toISOString(),
        comments: comments,
      }
 
      console.log("Returning mock updated request:", updatedRequest)
      return updatedRequest as LeaveRequest
    }
  } catch (error) {
    console.error("Error in updateLeaveRequest:", error)
    throw error
  }
}
 
export async function getLeaveTypes(organizationId: string): Promise<LeaveType[]> {
  try {
    organizationId = "0bd14f74-997d-4384-be62-bb634800c6f8"
 
    const path = organizationId ? `/leaves/organizations/${organizationId}/leave-types` : `/organizations`
 
    return await apiClient<LeaveType[]>(path, {}, "leaves")
  } catch (error) {
    console.error("Error fetching leave types:", error)
    return mockLeavetypes
  }
}