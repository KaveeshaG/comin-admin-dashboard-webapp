import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock, Timer, Users, ClipboardCheck } from "lucide-react"
import type { TimesheetStats } from "@/types/timesheet"

interface TimesheetStatsProps {
  stats: TimesheetStats
}

export function TimesheetStats({ stats }: TimesheetStatsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Hours</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.total_hours.toFixed(1)}</div>
          <p className="text-xs text-muted-foreground">{stats.total_overtime.toFixed(1)} hrs overtime</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Average Hours/Day</CardTitle>
          <Timer className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.average_hours_per_day.toFixed(1)}</div>
          <p className="text-xs text-muted-foreground">{stats.late_entries} late entries</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.total_employees}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
          <ClipboardCheck className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.pending_approvals}</div>
        </CardContent>
      </Card>
    </div>
  )
}

