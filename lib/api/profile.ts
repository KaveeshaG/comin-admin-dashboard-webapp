import type { UserProfile, UpdateProfileDto, ChangePasswordDto } from "@/types/profile"
import { apiClient } from "@/lib/utils/api-client"
 
// Mock user profile data
const mockProfile: UserProfile = {
  id: "1",
  email: "john.doe@example.com",
  first_name: "John",
  last_name: "Doe",
  avatar_url: "/diverse-group.png",
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
  try {
    // Try to get the profile from the API
    return await apiClient<UserProfile>("/profile", {}, "auth")
  } catch (error) {
    console.log("Error fetching profile, using mock data:", error)
    // Fall back to mock data if the API call fails
    return mockProfile
  }
}
 
export async function updateProfile(data: UpdateProfileDto): Promise<UserProfile> {
  try {
    // Try to update the profile via the API
    return await apiClient<UserProfile>(
      "/profile",
      {
        method: "PUT",
        body: JSON.stringify(data),
      },
      "auth",
    )
  } catch (error) {
    console.log("Error updating profile, using mock data:", error)
    // In a real app, this would send the data to an API
    // For now, return mock data with the updates
    return {
      ...mockProfile,
      ...data,
    }
  }
}
 
export async function changePassword(data: ChangePasswordDto): Promise<void> {
  try {
    // Try to change the password via the API
    await apiClient(
      "/profile/password",
      {
        method: "PUT",
        body: JSON.stringify(data),
      },
      "auth",
    )
  } catch (error) {
    console.log("Error changing password, using mock validation:", error)
 
    // Simulate password validation
    if (data.current_password === "wrong-password") {
      throw new Error("Current password is incorrect")
    }
 
    if (data.new_password !== data.confirm_password) {
      throw new Error("New passwords do not match")
    }
 
    if (data.new_password.length < 8) {
      throw new Error("Password must be at least 8 characters long")
    }
  }
}
 
export async function uploadAvatar(file: File): Promise<{ url: string }> {
  try {
    // Create a FormData object to send the file
    const formData = new FormData()
    formData.append("avatar", file)
 
    // Try to upload the avatar via the API
    return await apiClient<{ url: string }>(
      "/profile/avatar",
      {
        method: "POST",
        body: formData,
        // Don't set Content-Type header when sending FormData
        // The browser will set it automatically with the boundary
      },
      "auth",
    )
  } catch (error) {
    console.log("Error uploading avatar, using mock URL:", error)
    // In a real app, this would upload the file to storage
    // For now, return a placeholder URL
    return {
      url: "/diverse-group.png",
    }
  }
}
 
 