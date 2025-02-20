import type { Team, TeamMember, CreateTeamDto, CreateTeamMemberDto } from "@/types/organization"
import { mockTeams } from "@/lib/mock-data"

const API_URL = process.env.AUTH_SERVICE_URL

export async function createTeam(organizationId: string, data: CreateTeamDto): Promise<Team> {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1000))

  const newTeam: Team = {
    id: Math.random().toString(36).substring(2, 9),
    name: data.name,
    description: data.description,
    organization_id: organizationId,
    department_id: data.department_id,
    lead_id: data.lead_id ?? null,
    status: "active",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }

  return newTeam
}

export async function listTeams(organizationId: string): Promise<Team[]> {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // Return mock data filtered by organization
  return mockTeams.filter((team) => team.organization_id === organizationId)
}

export async function getTeamMembers(teamId: string): Promise<TeamMember[]> {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // Mock data - replace with actual API call
  return [
    {
      id: "1",
      team_id: teamId,
      user_id: "1", // This matches the mock employee ID
      role: "lead",
      joined_at: new Date().toISOString(),
    },
    {
      id: "2",
      team_id: teamId,
      user_id: "2", // This matches another mock employee ID
      role: "member",
      joined_at: new Date().toISOString(),
    },
  ]
}

export async function createTeamMember(teamId: string, data: CreateTeamMemberDto): Promise<TeamMember> {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1000))

  const newMember: TeamMember = {
    id: Math.random().toString(36).substring(2, 9),
    team_id: teamId,
    user_id: data.user_id,
    role: data.role,
    joined_at: new Date().toISOString(),
  }

  return newMember
}

export async function removeTeamMember(teamId: string, memberId: string): Promise<void> {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1000))
}

