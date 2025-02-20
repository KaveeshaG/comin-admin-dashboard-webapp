"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { format } from "date-fns"
import type { TimeEntry } from "@/types/timesheet"

interface TimesheetTableProps {
  entries: TimeEntry[]
  departments: { [key: string]: string }
}

export function TimesheetTable({ entries, departments }: TimesheetTableProps) {
  const getStatusBadge = (status: TimeEntry["status"]) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-500">Approved</Badge>
      case "rejected":
        return <Badge variant="destructive">Rejected</Badge>
      default:
        return <Badge variant="secondary">Pending</Badge>
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
            <TableHead>Break</TableHead>
            <TableHead>Total Hours</TableHead>
            <TableHead>Overtime</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {entries.map((entry) => (
            <TableRow key={entry.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={entry.employee.avatar}
                      alt={`${entry.employee.first_name} ${entry.employee.last_name}`}
                    />
                    <AvatarFallback>
                      {entry.employee.first_name[0]}
                      {entry.employee.last_name[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">
                      {entry.employee.first_name} {entry.employee.last_name}
                    </div>
                    <div className="text-sm text-muted-foreground">{entry.employee.employee_id}</div>
                  </div>
                </div>
              </TableCell>
              <TableCell>{departments[entry.employee.department_id] || "Unknown"}</TableCell>
              <TableCell>{format(new Date(entry.date), "MMM d, yyyy")}</TableCell>
              <TableCell>{formatTime(entry.check_in)}</TableCell>
              <TableCell>{formatTime(entry.check_out)}</TableCell>
              <TableCell>
                {entry.break_start && entry.break_end
                  ? `${formatTime(entry.break_start)} - ${formatTime(entry.break_end)}`
                  : "-"}
              </TableCell>
              <TableCell>{entry.total_hours.toFixed(1)} hrs</TableCell>
              <TableCell>{entry.overtime_hours.toFixed(1)} hrs</TableCell>
              <TableCell>{getStatusBadge(entry.status)}</TableCell>
            </TableRow>
          ))}
          {entries.length === 0 && (
            <TableRow>
              <TableCell colSpan={9} className="text-center text-muted-foreground">
                No timesheet entries found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}

