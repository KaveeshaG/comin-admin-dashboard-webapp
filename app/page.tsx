import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default async function Home() {
  const session = await getServerSession()

  if (session) {
    redirect("/dashboard")
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-8">HR Admin Dashboard</h1>
      <Button asChild>
        <Link href="/login">Login</Link>
      </Button>
    </main>
  )
}

