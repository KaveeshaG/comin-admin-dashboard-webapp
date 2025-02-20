import { NextResponse } from "next/server"

export async function GET() {
  // This is a mock implementation. Replace with actual tenant fetching logic.
  const tenants = [
    { id: "1", name: "Acme Corp", domain: "acme.example.com" },
    { id: "2", name: "Startup Inc", domain: "startup.example.com" },
    { id: "3", name: "Tech Giants", domain: "techgiants.example.com" },
  ]

  return NextResponse.json(tenants)
}

