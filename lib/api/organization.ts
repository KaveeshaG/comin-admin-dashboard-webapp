import type { Organization, CreateOrganizationDto } from "@/types/organization"
import { mockOrganizations } from "@/lib/mock-data"
import { apiClient } from "../utils/api-client"

const API_URL = process.env.AUTH_SERVICE_URL

export async function listOrganizations(): Promise<Organization[]> {
  try {
    const path = `/organizations/`

    return await apiClient<Organization[]>(path, {}, 'organizations')
  } catch (error) {
    console.error("Error fetching organizations: ", error)
    return mockOrganizations
  }
}

export async function createOrganization(organization: CreateOrganizationDto): Promise<Organization> {
  try {
    const path = `/organizations/`

    return await apiClient<Organization>(path, {
      method: "POST",
      body: JSON.stringify(organization),
    }, 'organizations')
  } catch (error) {
    console.error("Error creating Organization:", error)
    throw error
  }
}