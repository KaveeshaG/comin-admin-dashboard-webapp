import type { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      accessToken: string
      organizationId: string
      role: string
    } & DefaultSession["user"]
  }

  interface User {
    accessToken: string
    refreshToken: string
    expiresIn: number
    id: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken: string
    refreshToken: string
    expiresIn: number
    id: string
  }
}

