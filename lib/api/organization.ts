import type { Organization, CreateOrganizationDto } from "@/types/organization"
import { mockOrganizations } from "@/lib/mock-data"

const API_URL = process.env.AUTH_SERVICE_URL

export async function createOrganization(data: CreateOrganizationDto): Promise<Organization> {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1000))

  const newOrg: Organization = {
    id: Math.random().toString(36).substring(2, 9),
    slug: data.name.toLowerCase().replace(/\s+/g, "-"),
    name: data.name,
    domain: data.domain,
    description: data.description,
    industry: data.industry,
    size: data.size,
    status: "active",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    settings: {
      theme: data.settings.theme,
      allowed_domains: data.settings.allowed_domains,
      max_users: data.settings.max_users,
      features: data.settings.features,
      working_days: null,
      working_hours: {
        start: "",
        end: "",
      },
      timezone: "",
      leave_types: null,
    },
  }

  return newOrg
}

export async function listOrganizations(): Promise<Organization[]> {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // Return mock data
  return mockOrganizations
}

