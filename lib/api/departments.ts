import type { Department } from "@/types/employee"

// Mock data - replace with actual API calls later
const mockDepartments: Department[] = [
  {
    id: "00b8f868-690c-4497-8413-8123e4e92287",
    name: "Engineering",
    organization_id: "0bd14f74-997d-4384-be62-bb634800c6f8",
  },
  {
    id: "2",
    name: "Human Resources",
    organization_id: "0bd14f74-997d-4384-be62-bb634800c6f8",
  },
  {
    id: "3",
    name: "Marketing",
    organization_id: "0bd14f74-997d-4384-be62-bb634800c6f8",
  },
  {
    id: "4",
    name: "Sales",
    organization_id: "0bd14f74-997d-4384-be62-bb634800c6f8",
  },
]

export async function getDepartments(organizationId: string): Promise<Department[]> {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 500))
  return mockDepartments.filter((dept) => dept.organization_id === organizationId)
}

