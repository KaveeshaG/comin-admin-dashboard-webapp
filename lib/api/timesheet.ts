import type { TimeEntry, TimesheetStats } from "@/types/timesheet"

// Mock data for timesheet entries
const mockTimeEntries: TimeEntry[] = [
  {
    id: "1",
    employee_id: "1",
    date: "2024-02-20",
    check_in: "2024-02-20T09:00:00Z",
    check_out: "2024-02-20T17:30:00Z",
    break_start: "2024-02-20T13:00:00Z",
    break_end: "2024-02-20T14:00:00Z",
    total_hours: 7.5,
    overtime_hours: 0.5,
    status: "approved",
    created_at: "2024-02-20T09:00:00Z",
    updated_at: "2024-02-20T17:30:00Z",
    employee: {
      first_name: "John",
      last_name: "Doe",
      employee_id: "EMP001",
      department_id: "1",
      avatar: "/placeholder.svg?height=40&width=40",
    },
  },
  // Add more mock entries
]

export async function getTimeEntries(filters?: {
  start_date?: Date
  end_date?: Date
  department_id?: string
  employee_id?: string
  status?: string
}): Promise<TimeEntry[]> {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1000))

  let filteredEntries = [...mockTimeEntries]

  if (filters) {
    if (filters.start_date) {
      filteredEntries = filteredEntries.filter((entry) => new Date(entry.date) >= filters.start_date!)
    }
    if (filters.end_date) {
      filteredEntries = filteredEntries.filter((entry) => new Date(entry.date) <= filters.end_date!)
    }
    if (filters.department_id) {
      filteredEntries = filteredEntries.filter((entry) => entry.employee.department_id === filters.department_id)
    }
    if (filters.employee_id) {
      filteredEntries = filteredEntries.filter((entry) => entry.employee_id === filters.employee_id)
    }
    if (filters.status) {
      filteredEntries = filteredEntries.filter((entry) => entry.status === filters.status)
    }
  }

  return filteredEntries
}

export async function getTimesheetStats(start_date?: Date, end_date?: Date): Promise<TimesheetStats> {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1000))

  return {
    total_hours: 157.5,
    total_overtime: 12.5,
    average_hours_per_day: 7.8,
    total_employees: 25,
    pending_approvals: 5,
    late_entries: 3,
  }
}

export async function exportTimesheet(entries: TimeEntry[]): Promise<string> {
  // Convert entries to CSV format
  const headers = [
    "Date",
    "Employee ID",
    "Employee Name",
    "Check In",
    "Check Out",
    "Break Start",
    "Break End",
    "Total Hours",
    "Overtime Hours",
    "Status",
    "Notes",
  ]

  const rows = entries.map((entry) => [
    entry.date,
    entry.employee.employee_id,
    `${entry.employee.first_name} ${entry.employee.last_name}`,
    new Date(entry.check_in).toLocaleTimeString(),
    new Date(entry.check_out).toLocaleTimeString(),
    entry.break_start ? new Date(entry.break_start).toLocaleTimeString() : "-",
    entry.break_end ? new Date(entry.break_end).toLocaleTimeString() : "-",
    entry.total_hours.toFixed(2),
    entry.overtime_hours.toFixed(2),
    entry.status,
    entry.notes || "-",
  ])

  return [headers.join(","), ...rows.map((row) => row.join(","))].join("\n")
}

