import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Calendar, Clock, CheckCircle2, AlertTriangle, XCircle, Percent, AlarmClock, LogOut } from "lucide-react"
import { cn } from "@/lib/utils"
import type { AttendanceRecord } from "@/types/attendance"
 
interface AttendanceSummaryProps {
  records: AttendanceRecord[]
  loading?: boolean
  className?: string
  employeeName?: string
}
 
export function AttendanceSummary({ records, loading = false, className, employeeName }: AttendanceSummaryProps) {
  if (loading) {
    return (
      <div className={cn("grid gap-4 grid-cols-2 md:grid-cols-4", className)}>
        {Array.from({ length: 8 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                <Skeleton className="h-4 w-24" />
              </CardTitle>
              <Skeleton className="h-4 w-4 rounded-full" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-7 w-16 mb-1" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }
 
  // Group records by date
  const recordsByDate = records.reduce(
    (acc, record) => {
      const date = record.date.split("T")[0]
      if (!acc[date]) {
        acc[date] = []
      }
      acc[date].push(record)
      return acc
    },
    {} as Record<string, AttendanceRecord[]>,
  )
 
  // Calculate summary statistics
  const totalDays = Object.keys(recordsByDate).length
 
  let totalWorkingMinutes = 0
  let daysPresent = 0
  let daysLate = 0
  let daysAbsent = 0
  let earliestCheckIn = { hour: 23, minute: 59 }
  let latestCheckOut = { hour: 0, minute: 0 }
 
  Object.values(recordsByDate).forEach((dayRecords) => {
    // Check if any record for this day has status present or late
    const hasPresent = dayRecords.some((r) => r.status === "present")
    const hasLate = dayRecords.some((r) => r.status === "late")
 
    if (hasPresent) daysPresent++
    else if (hasLate) daysLate++
    else daysAbsent++
 
    // Calculate working hours for this day
    dayRecords.forEach((record) => {
      if (record.check_in && record.check_out) {
        try {
          const checkInTime = new Date(record.check_in)
          const checkOutTime = new Date(record.check_out)
 
          // Calculate minutes worked
          const minutesWorked = (checkOutTime.getTime() - checkInTime.getTime()) / (1000 * 60)
          if (minutesWorked > 0) {
            totalWorkingMinutes += minutesWorked
          }
 
          // Track earliest check-in
          if (
            checkInTime.getHours() < earliestCheckIn.hour ||
            (checkInTime.getHours() === earliestCheckIn.hour && checkInTime.getMinutes() < earliestCheckIn.minute)
          ) {
            earliestCheckIn = {
              hour: checkInTime.getHours(),
              minute: checkInTime.getMinutes(),
            }
          }
 
          // Track latest check-out
          if (
            checkOutTime.getHours() > latestCheckOut.hour ||
            (checkOutTime.getHours() === latestCheckOut.hour && checkOutTime.getMinutes() > latestCheckOut.minute)
          ) {
            latestCheckOut = {
              hour: checkOutTime.getHours(),
              minute: checkOutTime.getMinutes(),
            }
          }
        } catch (e) {
          console.error("Error parsing date:", e)
        }
      }
    })
  })
 
  // Format time objects
  const formatTime = (time: { hour: number; minute: number }) => {
    return `${time.hour.toString().padStart(2, "0")}:${time.minute.toString().padStart(2, "0")}`
  }
 
  // Calculate averages
  const attendanceRate = totalDays > 0 ? ((daysPresent + daysLate) / totalDays) * 100 : 0
  const averageWorkingHours = daysPresent + daysLate > 0 ? totalWorkingMinutes / ((daysPresent + daysLate) * 60) : 0
 
  // Format for display
  const formattedAttendanceRate = attendanceRate.toFixed(1)
  const formattedWorkingHours = averageWorkingHours.toFixed(1)
 
  // Determine color for attendance rate
  const attendanceColor =
    attendanceRate >= 90 ? "text-green-500" : attendanceRate >= 75 ? "text-yellow-500" : "text-red-500"
 
  const title = employeeName ? `${employeeName}'s Attendance Summary` : "Attendance Summary"
 
  return (
    <div className={className}>
      <h3 className="text-lg font-medium mb-4">{title}</h3>
      <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Days</CardTitle>
            <Calendar className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalDays}</div>
          </CardContent>
        </Card>
 
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Present Days</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{daysPresent}</div>
          </CardContent>
        </Card>
 
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Late Days</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{daysLate}</div>
          </CardContent>
        </Card>
 
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Absent Days</CardTitle>
            <XCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{daysAbsent}</div>
          </CardContent>
        </Card>
 
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Attendance Rate</CardTitle>
            <Percent className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className={cn("text-2xl font-bold", attendanceColor)}>{formattedAttendanceRate}%</div>
          </CardContent>
        </Card>
 
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Working Hours</CardTitle>
            <Clock className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formattedWorkingHours}</div>
          </CardContent>
        </Card>
 
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Earliest Check-in</CardTitle>
            <AlarmClock className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {earliestCheckIn.hour === 23 && earliestCheckIn.minute === 59 ? "N/A" : formatTime(earliestCheckIn)}
            </div>
          </CardContent>
        </Card>
 
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Latest Check-out</CardTitle>
            <LogOut className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {latestCheckOut.hour === 0 && latestCheckOut.minute === 0 ? "N/A" : formatTime(latestCheckOut)}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
