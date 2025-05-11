export interface LoginCredentials {
    email: string
    password: string
  }
  
  export interface AuthResponse {
    access_token: string
    refresh_token: string
    token_type: string
    expires_in: number
    organization_id: string
    role: string
  }
  
  export interface AuthUser {
    accessToken: string
    organizationId: string
    role: string
    isAuthenticated: boolean
  }
  
  