import type { Organization, Department, Team } from "@/types/organization"

export const mockOrganizations: Organization[] = [
  {
    id: "0bd14f74-997d-4384-be62-bb634800c6f8",
    name: "Nimali Tea",
    slug: "nimali-tea",
    domain: "nimalitea.lk",
    description: "Description of Nimali Tea",
    industry: "Manufacturing",
    size: "1-50",
    settings: {
      theme: "light",
      allowed_domains: ["nimalitea.lk"],
      max_users: 50,
      features: ["basic"],
      working_days: null,
      working_hours: {
        start: "",
        end: "",
      },
      timezone: "",
      leave_types: null,
    },
    status: "active",
    created_at: "2025-01-09T21:52:01.954382+05:30",
    updated_at: "2025-01-09T23:10:26.718634+05:30",
  },
  {
    id: "2",
    name: "King Pharmacy",
    slug: "king-pharmacy",
    domain: "kingpharm.com",
    description: "Description for KING pharmacy",
    industry: "Pharmacy",
    size: "1-10",
    settings: {
      theme: "light",
      allowed_domains: ["kingpharm.com"],
      max_users: 50,
      features: ["basic"],
      working_days: null,
      working_hours: {
        start: "",
        end: "",
      },
      timezone: "",
      leave_types: null,
    },
    status: "active",
    created_at: "2025-01-09T21:52:01.954382+05:30",
    updated_at: "2025-01-09T23:10:26.718634+05:30",
  },
]

export const mockDepartments: Department[] = [
  {
    id: "00b8f868-690c-4497-8413-8123e4e92287",
    name: "HR",
    description: "HR Department",
    organization_id: "0bd14f74-997d-4384-be62-bb634800c6f8",
    parent_id: null,
    manager_id: null,
    status: "active",
    created_at: "2025-01-09T23:14:28.791381+05:30",
    updated_at: "2025-01-09T23:14:28.791381+05:30",
  },
  {
    id: "2",
    name: "Engineering",
    description: "Engineering Department",
    organization_id: "0bd14f74-997d-4384-be62-bb634800c6f8",
    parent_id: null,
    manager_id: null,
    status: "active",
    created_at: "2025-01-09T23:14:28.791381+05:30",
    updated_at: "2025-01-09T23:14:28.791381+05:30",
  },
]

export const mockTeams: Team[] = [
  {
    id: "6c3f0350-d843-4429-8e47-51053b5cc7e0",
    name: "Morning Team",
    description: "Day Shift Team",
    organization_id: "0bd14f74-997d-4384-be62-bb634800c6f8",
    department_id: "00b8f868-690c-4497-8413-8123e4e92287",
    lead_id: "1", // Matches a mock employee ID
    status: "active",
    created_at: "2025-01-09T23:23:58.291108+05:30",
    updated_at: "2025-01-09T23:23:58.291108+05:30",
  },
  {
    id: "2",
    name: "Evening Team",
    description: "Night Shift Team",
    organization_id: "0bd14f74-997d-4384-be62-bb634800c6f8",
    department_id: "00b8f868-690c-4497-8413-8123e4e92287",
    lead_id: "2", // Matches another mock employee ID
    status: "active",
    created_at: "2025-01-09T23:23:58.291108+05:30",
    updated_at: "2025-01-09T23:23:58.291108+05:30",
  },
  {
    id: "3",
    name: "Development Team",
    description: "Software Development Team",
    organization_id: "0bd14f74-997d-4384-be62-bb634800c6f8",
    department_id: "2", // Engineering department
    lead_id: null,
    status: "active",
    created_at: "2025-01-09T23:23:58.291108+05:30",
    updated_at: "2025-01-09T23:23:58.291108+05:30",
  },
]

