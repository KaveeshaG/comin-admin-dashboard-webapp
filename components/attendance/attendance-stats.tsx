import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, UserCheck, Clock, Percent, AlertTriangle } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import type { AttendanceStats } from "@/types/attendance"
 
interface AttendanceStatsProps {
  stats?: AttendanceStats
  loading?: boolean
}
 
export function AttendanceStats({ stats, loading = false }: AttendanceStatsProps) {
  if (loading || !stats) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                <Skeleton className="h-4 w-24" />
              </CardTitle>
              <Skeleton className="h-4 w-4 rounded-full" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-7 w-16 mb-1" />
              <Skeleton className="h-4 w-32" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }
 
  const attendanceRate = stats.attendance_rate
  const attendanceColor =
    attendanceRate >= 90 ? "text-green-500" : attendanceRate >= 75 ? "text-yellow-500" : "text-red-500"
 
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
          <Users className="h-4 w-4 text-blue-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.total_employees}</div>
          <div className="text-xs text-muted-foreground">{stats.present_today + stats.late_today} checked in today</div>
        </CardContent>
      </Card>
 
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Present Today</CardTitle>
          <UserCheck className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.present_today}</div>
          <div className="flex items-center justify-between w-full text-xs">
            {stats.late_today > 0 && (
              <span className="text-yellow-500 flex items-center">
                <AlertTriangle className="h-3 w-3 mr-1" />
                {stats.late_today} arrived late
              </span>
            )}
            {!stats.late_today && <span className="text-muted-foreground">On time</span>}
          </div>
        </CardContent>
      </Card>
 
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Average Check-in</CardTitle>
          <Clock className="h-4 w-4 text-blue-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.average_check_in_time}</div>
          <div className="text-xs text-muted-foreground">{stats.average_working_hours} hrs avg. working time</div>
        </CardContent>
      </Card>
 
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Attendance Rate</CardTitle>
          <Percent className="h-4 w-4 text-blue-500" />
        </CardHeader>
        <CardContent>
          <div className={cn("text-2xl font-bold", attendanceColor)}>{stats.attendance_rate}%</div>
          <div className="text-xs text-muted-foreground">{stats.absent_today} absent today</div>
        </CardContent>
      </Card>
    </div>
  )
}