import type { NextResponse } from "next/server"

export function addCORSHeaders(response: NextResponse) {
  response.headers.set("Access-Control-Allow-Origin", process.env.NEXT_PUBLIC_FRONTEND_URL || "*")
  response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
  response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization, x-tenant-id")
  response.headers.set("Access-Control-Allow-Credentials", "true")
  response.headers.set("Access-Control-Max-Age", "86400")

  return response
}