import { LeaveRequest, LeaveType } from "@/types/leave"
import type { Organization, Department, Team, TeamMember } from "@/types/organization"

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
    department_id: "2",
    lead_id: null,
    status: "active",
    created_at: "2025-01-09T23:23:58.291108+05:30",
    updated_at: "2025-01-09T23:23:58.291108+05:30",
  },
]

export const mockTeamMembers: TeamMember[] = [
  {
    id: "1",
    team_id: "1",
    user_id: "1",
    role: "lead",
    joined_at: new Date().toISOString(),
  },
  {
    id: "2",
    team_id: "2",
    user_id: "2",
    role: "member",
    joined_at: new Date().toISOString(),
  },
]

export const mockLeavetypes: LeaveType[] = [
  {
    id: "acf38160-da05-4f36-94f5-5bf31cff82b8",
    name: "Standard Leave",
    organization_id: "0bd14f74-997d-4384-be62-bb634800c6f8",
    default_days: 20,
    is_paid: true,
    requires_approval: true,
    min_days_notice: 7,
    max_days_per_request: 15
  },
  {
    id: "2",
    name: "Extended Leave",
    organization_id: "0bd14f74-997d-4384-be62-bb634800c6f8",
    default_days: 25,
    is_paid: true,
    requires_approval: true,
    min_days_notice: 7,
    max_days_per_request: 5
  },
]

export const mockLeaveRequests: LeaveRequest[] = [
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
    total_days: 5,
  }
]

