export interface OrganizationSettings {
    theme: "light" | "dark"
    allowed_domains: string[]
    max_users: number
    features: string[]
    working_days: string[] | null
    working_hours: {
      start: string
      end: string
    }
    timezone: string
    leave_types: any | null
  }
  
  export interface Organization {
    id: string
    name: string
    slug: string
    domain: string
    description: string
    logo?: string
    industry: string
    size: string
    settings: OrganizationSettings
    status: "active" | "inactive"
    created_at: string
    updated_at: string
  }
  
  export interface Department {
    id: string
    name: string
    description: string
    organization_id: string
    parent_id: string | null
    manager_id: string | null
    status: "active" | "inactive"
    created_at: string
    updated_at: string
  }
  
  export interface Team {
    id: string
    name: string
    description: string
    organization_id: string
    department_id: string
    lead_id: string | null
    status: "active" | "inactive"
    created_at: string
    updated_at: string
  }
  
  export interface TeamMember {
    id: string
    team_id: string
    user_id: string
    role: "member" | "lead"
    joined_at: string
  }
  
  export interface CreateOrganizationDto {
    name: string
    domain: string
    description: string
    industry: string
    size: string
    settings: {
      theme: "light" | "dark"
      allowed_domains: string[]
      max_users: number
      features: string[]
    }
  }
  
  export interface CreateDepartmentDto {
    name: string
    description: string
    parent_id?: string | null
    manager_id?: string | null
  }
  
  export interface CreateTeamDto {
    name: string
    description: string
    department_id: string
    lead_id?: string | null
  }
  
  export interface CreateTeamMemberDto {
    user_id: string
    role: "member" | "lead"
  }
  
  