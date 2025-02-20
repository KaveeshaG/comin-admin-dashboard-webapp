import type { LoginCredentials, AuthResponse } from "@/types/auth"

export async function login(credentials: LoginCredentials): Promise<AuthResponse> {
  try {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    })

    if (!response.ok) {
      // Try to get error message from response
      try {
        const errorData = await response.json()
        throw new Error(errorData.error || "Login failed")
      } catch (e) {
        throw new Error("Invalid email or password")
      }
    }

    const data = await response.json()
    return data
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message)
    }
    throw new Error("An unexpected error occurred")
  }
}

