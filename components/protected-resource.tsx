import type React from "react"
import { useRBAC } from "@/hooks/use-rbac"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface ProtectedResourceProps {
  children: React.ReactNode
  action: string
  subject: string
  fallback?: React.ReactNode
}

export function ProtectedResource({ children, action, subject, fallback }: ProtectedResourceProps) {
  const { can } = useRBAC()

  if (!can(action, subject)) {
    if (fallback) {
      return fallback
    }

    return (
      <Alert variant="destructive">
        <AlertDescription>
          You don't have permission to {action} {subject}
        </AlertDescription>
      </Alert>
    )
  }

  return children
}

