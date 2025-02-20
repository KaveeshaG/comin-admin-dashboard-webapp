export interface UserProfile {
    id: string
    email: string
    first_name: string
    last_name: string
    avatar_url?: string
    phone?: string
    job_title?: string
    department_id?: string
    date_joined: string
    bio?: string
    timezone: string
    language: string
    theme_preference: "light" | "dark" | "system"
    notification_preferences: {
      email_notifications: boolean
      push_notifications: boolean
      monthly_report: boolean
      leave_requests: boolean
      attendance_reminders: boolean
    }
  }
  
  export interface UpdateProfileDto {
    first_name?: string
    last_name?: string
    avatar_url?: string
    phone?: string
    job_title?: string
    department_id?: string
    bio?: string
    timezone?: string
    language?: string
    theme_preference?: "light" | "dark" | "system"
    notification_preferences?: {
      email_notifications?: boolean
      push_notifications?: boolean
      monthly_report?: boolean
      leave_requests?: boolean
      attendance_reminders?: boolean
    }
  }
  
  export interface ChangePasswordDto {
    current_password: string
    new_password: string
    confirm_password: string
  }
  
  