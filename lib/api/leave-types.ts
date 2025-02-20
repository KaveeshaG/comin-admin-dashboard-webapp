import type { LeaveType } from "@/types/employee"

// Mock data - replace with actual API calls later
const mockLeaveTypes: LeaveType[] = [
  {
    id: "acf38160-da05-4f36-94f5-5bf31cff82b8",
    name: "Standard Leave",
    organization_id: "0bd14f74-997d-4384-be62-bb634800c6f8",
    default_days: 20,
  },
  {
    id: "2",
    name: "Extended Leave",
    organization_id: "0bd14f74-997d-4384-be62-bb634800c6f8",
    default_days: 25,
  },
]

export async function getLeaveTypes(organizationId: string): Promise<LeaveType[]> {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 500))
  return mockLeaveTypes.filter((type) => type.organization_id === organizationId)
}

