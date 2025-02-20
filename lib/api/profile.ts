import type { UserProfile, UpdateProfileDto, ChangePasswordDto } from "@/types/profile"

// Mock user profile data
const mockProfile: UserProfile = {
  id: "1",
  email: "john.doe@example.com",
  first_name: "John",
  last_name: "Doe",
  avatar_url: "/placeholder.svg?height=100&width=100",
  phone: "+1234567890",
  job_title: "Software Engineer",
  department_id: "1",
  date_joined: "2023-01-15T00:00:00Z",
  bio: "Experienced software engineer with a passion for building great products.",
  timezone: "America/New_York",
  language: "en",
  theme_preference: "system",
  notification_preferences: {
    email_notifications: true,
    push_notifications: true,
    monthly_report: true,
    leave_requests: true,
    attendance_reminders: true,
  },
}

export async function getUserProfile(): Promise<UserProfile> {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1000))
  return mockProfile
}

export async function updateProfile(data: UpdateProfileDto): Promise<UserProfile> {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // In a real app, this would send the data to an API
  return {
    ...mockProfile,
    ...data,
  }
}

export async function changePassword(data: ChangePasswordDto): Promise<void> {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // Simulate password validation
  if (data.current_password === "wrong-password") {
    throw new Error("Current password is incorrect")
  }

  if (data.new_password !== data.confirm_password) {
    throw new Error("New passwords do not match")
  }
}

export async function uploadAvatar(file: File): Promise<{ url: string }> {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 2000))

  // In a real app, this would upload the file to storage
  // For now, return a placeholder URL
  return {
    url: "/placeholder.svg?height=100&width=100",
  }
}

