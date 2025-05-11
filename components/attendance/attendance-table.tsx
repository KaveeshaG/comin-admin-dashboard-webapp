"use client"
 
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { format, parseISO } from "date-fns"
import { Skeleton } from "@/components/ui/skeleton"
import type { AttendanceRecord } from "@/types/attendance"
import type { Employee } from "@/types/employee"
 
interface AttendanceTableProps {
  records: AttendanceRecord[]
  departments: { [key: string]: string }
  employeeMap?: Record<string, Employee>
  loading?: boolean
}
 
export function AttendanceTable({ records, departments, employeeMap = {}, loading = false }: AttendanceTableProps) {
  const getStatusBadge = (status: AttendanceRecord["status"]) => {
    switch (status) {
      case "present":
        return <Badge className="bg-green-500">Present</Badge>
      case "late":
        return <Badge variant="warning">Late</Badge>
      case "absent":
        return <Badge variant="destructive">Absent</Badge>
      default:
        return null
    }
  }
 
  const formatTime = (time?: string) => {
    if (!time) return "-"
    try {
      return format(parseISO(time), "hh:mm a")
    } catch (err) {
      console.error("Error formatting time:", err)
      return time
    }
  }
 
  const formatDate = (date: string) => {
    try {
      return format(parseISO(date), "MMM d, yyyy")
    } catch (err) {
      console.error("Error formatting date:", err)
      return date
    }
  }
 
  const getWorkModeBadge = (workMode: string) => {
    switch (workMode) {
      case "office":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            Office
          </Badge>
        )
      case "remote":
        return (
          <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
            Remote
          </Badge>
        )
      case "hybrid":
        return (
          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
            Hybrid
          </Badge>
        )
      default:
        return <Badge variant="outline">{workMode}</Badge>
    }
  }
 
  // Calculate working hours
  const calculateWorkingHours = (checkIn?: string, checkOut?: string) => {
    if (!checkIn || !checkOut) return "-"
 
    try {
      const checkInTime = parseISO(checkIn)
      const checkOutTime = parseISO(checkOut)
 
      // Calculate difference in hours
      const diffInMs = checkOutTime.getTime() - checkInTime.getTime()
      const diffInHours = diffInMs / (1000 * 60 * 60)
 
      return diffInHours.toFixed(1) + " hrs"
    } catch (err) {
      console.error("Error calculating working hours:", err)
      return "-"
    }
  }
 
  if (loading) {
    return (
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Employee</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Check In</TableHead>
              <TableHead>Check Out</TableHead>
              <TableHead>Hours</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Work Mode</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array(5)
              .fill(0)
              .map((_, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-8 w-8 rounded-full" />
                      <div className="space-y-1">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-3 w-16" />
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-20" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-24" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-16" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-16" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-12" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-6 w-16 rounded-full" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-6 w-16 rounded-full" />
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>
    )
  }
 
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Employee</TableHead>
            <TableHead>Department</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Check In</TableHead>
            <TableHead>Check Out</TableHead>
            <TableHead>Hours</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Work Mode</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {records.map((record) => {
            // Try to get employee from record.employee first, then from employeeMap
            let employee = record.employee
 
            if (!employee && employeeMap[record.employee_id]) {
              const emp = employeeMap[record.employee_id]
              employee = {
                first_name: emp.first_name,
                last_name: emp.last_name,
                employee_id: emp.employee_id,
                department_id: emp.department_id,
                avatar: emp.avatar,
              }
            }
 
            // Fallback if still no employee data
            if (!employee) {
              employee = {
                first_name: "Unknown",
                last_name: "Employee",
                employee_id: record.employee_id,
                department_id: "",
              }
            }
 
            // Get department name
            const departmentName = employee.department_id ? departments[employee.department_id] : "Unknown"
 
            return (
              <TableRow key={record.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={employee.avatar || "/placeholder.svg"}
                        alt={`${employee.first_name} ${employee.last_name}`}
                      />
                      <AvatarFallback>
                        {employee.first_name?.[0]}
                        {employee.last_name?.[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">
                        {employee.first_name} {employee.last_name}
                      </div>
                      <div className="text-sm text-muted-foreground">{employee.employee_id || record.employee_id}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{departmentName}</TableCell>
                <TableCell>{formatDate(record.date)}</TableCell>
                <TableCell>{formatTime(record.check_in)}</TableCell>
                <TableCell>{formatTime(record.check_out)}</TableCell>
                <TableCell>{calculateWorkingHours(record.check_in, record.check_out)}</TableCell>
                <TableCell>{getStatusBadge(record.status)}</TableCell>
                <TableCell>{getWorkModeBadge(record.work_mode)}</TableCell>
              </TableRow>
            )
          })}
          {records.length === 0 && (
            <TableRow>
              <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                No attendance records found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}