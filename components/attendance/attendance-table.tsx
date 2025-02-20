"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { format } from "date-fns"
import type { AttendanceRecord } from "@/types/attendance"

interface AttendanceTableProps {
  records: AttendanceRecord[]
  departments: { [key: string]: string }
}

export function AttendanceTable({ records, departments }: AttendanceTableProps) {
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
    return format(new Date(time), "hh:mm a")
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
            <TableHead>Status</TableHead>
            <TableHead>Notes</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {records.map((record) => (
            <TableRow key={record.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={record.employee.avatar}
                      alt={`${record.employee.first_name} ${record.employee.last_name}`}
                    />
                    <AvatarFallback>
                      {record.employee.first_name[0]}
                      {record.employee.last_name[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">
                      {record.employee.first_name} {record.employee.last_name}
                    </div>
                    <div className="text-sm text-muted-foreground">{record.employee.employee_id}</div>
                  </div>
                </div>
              </TableCell>
              <TableCell>{departments[record.employee.department_id] || "Unknown"}</TableCell>
              <TableCell>{format(new Date(record.date), "MMM d, yyyy")}</TableCell>
              <TableCell>{formatTime(record.check_in)}</TableCell>
              <TableCell>{formatTime(record.check_out)}</TableCell>
              <TableCell>{getStatusBadge(record.status)}</TableCell>
              <TableCell>{record.notes || "-"}</TableCell>
            </TableRow>
          ))}
          {records.length === 0 && (
            <TableRow>
              <TableCell colSpan={7} className="text-center text-muted-foreground">
                No attendance records found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}

