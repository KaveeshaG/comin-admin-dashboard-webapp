import { Badge } from "@/components/ui/badge"

interface StatusBadgeProps {
  status: string
  className?: string
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const getStatusConfig = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return {
          color: "bg-green-500/15 text-green-700 dark:text-green-400",
          label: "Active",
        }
      case "inactive":
        return {
          color: "bg-yellow-500/15 text-yellow-700 dark:text-yellow-400",
          label: "Inactive",
        }
      case "suspended":
        return {
          color: "bg-red-500/15 text-red-700 dark:text-red-400",
          label: "Suspended",
        }
      default:
        return {
          color: "bg-gray-500/15 text-gray-700 dark:text-gray-400",
          label: status,
        }
    }
  }

  const config = getStatusConfig(status)

  return (
    <Badge variant="secondary" className={`${config.color} ${className}`}>
      {config.label}
    </Badge>
  )
}

