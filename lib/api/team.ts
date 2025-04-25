import type { Team, TeamMember, CreateTeamDto, CreateTeamMemberDto } from "@/types/organization"
import { mockTeamMembers, mockTeams } from "@/lib/mock-data"
import { apiClient } from "../utils/api-client"

const API_URL = process.env.AUTH_SERVICE_URL

export async function listTeams(organizationId: string): Promise<Team[]> {
  try {
    organizationId = '0bd14f74-997d-4384-be62-bb634800c6f8'

    const path = organizationId
      ? `/organizations/${organizationId}/teams`
      : `/organizations`

    return await apiClient<Team[]>(path, {}, 'organizations')
  } catch (error) {
    console.error("Error fetching Teams:", error)
    return mockTeams
  }
}

export async function createTeam(organizationId: string, team: CreateTeamDto): Promise<Team> {
  try {
    organizationId = '0bd14f74-997d-4384-be62-bb634800c6f8'

    const path = organizationId
      ? `/organizations/${organizationId}/teams`
      : `/organizations`

    return await apiClient<Team>(path, {
      method: "POST",
      body: JSON.stringify(team),
    }, 'organizations')
  } catch (error) {
    console.error("Error creating Team:", error)
    throw error
  }
}

export async function getTeamMembers(organizationId: string, teamId: string): Promise<TeamMember[]> {
  try {
    const path = organizationId
      ? `/organizations/${organizationId}/teams/${teamId}/members`
      : `/organizations`

    return await apiClient<TeamMember[]>(path, {}, 'organizations')
  } catch (error) {
    console.error("Error fetching Team Members:", error)
    return mockTeamMembers
  }
}

export async function createTeamMember(organizationId: string, teamId: string, teamMember: CreateTeamMemberDto): Promise<TeamMember> {
  if (!organizationId || !teamId) {
    throw new Error("Organization ID and Team ID are required");
  }
  
  try {
    const path = `/organizations/${organizationId}/teams/${teamId}/members`;
    
    return await apiClient<TeamMember>(path, {
      method: "POST",
      body: JSON.stringify(teamMember),
      headers: {
        'Content-Type': 'application/json'
      }
    }, 'organizations');
  } catch (error) {
    console.error("Error creating Team member:", error);
    throw error;
  }
}

export async function removeTeamMember(teamId: string, memberId: string): Promise<void> {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1000))
}

