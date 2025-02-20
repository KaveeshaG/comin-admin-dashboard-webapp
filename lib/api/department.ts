import type { Department, CreateDepartmentDto } from "@/types/organization"
import { mockDepartments } from "@/lib/mock-data"

const API_URL = process.env.AUTH_SERVICE_URL

export async function createDepartment(organizationId: string, data: CreateDepartmentDto): Promise<Department> {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1000))

  const newDept: Department = {
    id: Math.random().toString(36).substring(2, 9),
    name: data.name,
    description: data.description,
    organization_id: organizationId,
    parent_id: data.parent_id ?? null,
    manager_id: data.manager_id ?? null,
    status: "active",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }

  return newDept
}

export async function listDepartments(organizationId: string): Promise<Department[]> {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // Return mock data filtered by organization
  return mockDepartments.filter((dept) => dept.organization_id === organizationId)
}

