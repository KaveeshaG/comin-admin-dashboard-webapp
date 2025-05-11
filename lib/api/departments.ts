import type { Department, CreateDepartmentDto } from "@/types/organization"
import { mockDepartments } from "@/lib/mock-data"
import { apiClient } from "../utils/api-client"

const API_URL = process.env.AUTH_SERVICE_URL

export async function listDepartments(organizationId: string): Promise<Department[]> {
  try {
    organizationId = '0bd14f74-997d-4384-be62-bb634800c6f8'

    const path = organizationId
      ? `/organizations/${organizationId}/departments`
      : `/organizations`

    return await apiClient<Department[]>(path, {}, 'organizations')
  } catch (error) {
    console.error("Error fetching departments:", error)
    return mockDepartments
  }
}

export async function createDepartment(organizationId: string, department: CreateDepartmentDto): Promise<Department> {
  try {
    organizationId = '0bd14f74-997d-4384-be62-bb634800c6f8'
    
    const path = organizationId
    ? `/organizations/${organizationId}/departments`
    : `/organizations`

    return await apiClient<Department>(path, {
      method: "POST",
      body: JSON.stringify(department),
    }, 'organizations')
  } catch (error) {
    console.error("Error creating Organization:", error)
    throw error
  }
}

