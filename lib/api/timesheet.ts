import type { TimeEntry, TimesheetStats, TimesheetFilters } from "@/types/timesheet"
import { listAttendance } from "@/lib/api/attendance"
import { differenceInMinutes, parseISO, format, startOfMonth, endOfMonth } from "date-fns"
import { getEmployees } from "@/lib/api/employees"
import { listDepartments } from "@/lib/api/departments"
 
// Transform attendance records to timesheet entries
export async function getTimeEntries(filters?: TimesheetFilters): Promise<TimeEntry[]> {
  try {
    // Get organization ID from user context or use default
    const organizationId = "0bd14f74-997d-4384-be62-bb634800c6f8"
 
    // Fetch attendance records
    const attendanceRecords = await listAttendance(organizationId)
 
    // Fetch employees for mapping
    const employees = await getEmployees()
    const employeeMap = employees.reduce(
      (map, emp) => {
        map[emp.id] = emp
        return map
      },
      {} as Record<string, any>,
    )
 
    // Fetch departments for mapping
    const departments = await listDepartments(organizationId)
    const departmentMap = departments.reduce(
      (map, dept) => {
        map[dept.id] = dept
        return map
      },
      {} as Record<string, any>,
    )
 
    // Transform attendance records to timesheet entries
    const timeEntries: TimeEntry[] = attendanceRecords.map((record) => {
      // Get employee data
      const employee = employeeMap[record.employee_id] || {
        first_name: "Unknown",
        last_name: "Employee",
        employee_id: record.employee_id,
        department_id: "unknown",
      }
 
      // Calculate total hours
      let totalHours = 0
      let overtimeHours = 0
 
      if (record.check_in && record.check_out) {
        const checkInTime = parseISO(record.check_in)
        const checkOutTime = parseISO(record.check_out)
 
        // Calculate total minutes worked
        const totalMinutes = differenceInMinutes(checkOutTime, checkInTime)
 
        // Convert to hours
        totalHours = Number.parseFloat((totalMinutes / 60).toFixed(1))
 
        // Calculate overtime (anything over 8 hours)
        overtimeHours = totalHours > 8 ? Number.parseFloat((totalHours - 8).toFixed(1)) : 0
      }
 
      // Map to TimeEntry format
      return {
        id: record.id,
        employee_id: record.employee_id,
        date: record.date,
        check_in: record.check_in,
        check_out: record.check_out || "",
        break_start: record.break_start || "",
        break_end: record.break_end || "",
        total_hours: totalHours,
        overtime_hours: overtimeHours,
        status: record.status === "present" ? "approved" : record.status === "late" ? "pending" : "rejected",
        notes: record.notes || "",
        created_at: record.created_at,
        updated_at: record.updated_at,
        employee: {
          first_name: employee.first_name,
          last_name: employee.last_name,
          employee_id: employee.employee_id || employee.id,
          avatar: employee.avatar,
          department_id: employee.department_id,
        },
      }
    })
 
    // Apply filters if provided
    let filteredEntries = [...timeEntries]
 
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
  } catch (error) {
    console.error("Error fetching timesheet entries:", error)
    throw error
  }
}
 
export async function getTimesheetStats(start_date?: Date, end_date?: Date): Promise<TimesheetStats> {
  try {
    // Set default date range if not provided
    const now = new Date()
    const effectiveStartDate = start_date || startOfMonth(now)
    const effectiveEndDate = end_date || endOfMonth(now)
 
    // Get timesheet entries for the period
    const entries = await getTimeEntries({
      start_date: effectiveStartDate,
      end_date: effectiveEndDate,
    })
 
    // Calculate stats
    const totalHours = entries.reduce((sum, entry) => sum + entry.total_hours, 0)
    const totalOvertime = entries.reduce((sum, entry) => sum + entry.overtime_hours, 0)
 
    // Get unique employees
    const uniqueEmployeeIds = new Set(entries.map((entry) => entry.employee_id))
    const totalEmployees = uniqueEmployeeIds.size
 
    // Count pending approvals
    const pendingApprovals = entries.filter((entry) => entry.status === "pending").length
 
    // Count late entries (check-in after 9:30 AM)
    const lateEntries = entries.filter((entry) => {
      if (!entry.check_in) return false
      const checkInTime = parseISO(entry.check_in)
      const hour = checkInTime.getHours()
      const minute = checkInTime.getMinutes()
      return hour > 9 || (hour === 9 && minute > 30)
    }).length
 
    // Calculate average hours per day
    const uniqueDays = new Set(entries.map((entry) => entry.date.split("T")[0])).size
    const averageHoursPerDay = uniqueDays > 0 ? Number.parseFloat((totalHours / uniqueDays).toFixed(1)) : 0
 
    return {
      total_hours: totalHours,
      total_overtime: totalOvertime,
      average_hours_per_day: averageHoursPerDay,
      total_employees: totalEmployees,
      pending_approvals: pendingApprovals,
      late_entries: lateEntries,
    }
  } catch (error) {
    console.error("Error calculating timesheet stats:", error)
    throw error
  }
}
 
export async function exportTimesheet(entries: TimeEntry[]): Promise<string> {
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
    entry.date.split("T")[0],
    entry.employee.employee_id,
    `${entry.employee.first_name} ${entry.employee.last_name}`,
    entry.check_in ? format(new Date(entry.check_in), "hh:mm a") : "-",
    entry.check_out ? format(new Date(entry.check_out), "hh:mm a") : "-",
    entry.break_start ? format(new Date(entry.break_start), "hh:mm a") : "-",
    entry.break_end ? format(new Date(entry.break_end), "hh:mm a") : "-",
    entry.total_hours.toFixed(2),
    entry.overtime_hours.toFixed(2),
    entry.status,
    entry.notes || "-",
  ])
 
  return [headers.join(","), ...rows.map((row) => row.join(","))].join("\n")
}