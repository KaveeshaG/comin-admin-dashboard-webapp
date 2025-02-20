import type { AttendanceRecord, AttendanceStats, MarkAttendanceDto, AttendanceFilters } from "@/types/attendance"

// Mock data for attendance records
const mockAttendanceRecords: AttendanceRecord[] = [
  {
    id: "1",
    employee_id: "1",
    date: "2024-02-20",
    check_in: "2024-02-20T09:00:00Z",
    check_out: "2024-02-20T17:00:00Z",
    status: "present",
    created_at: "2024-02-20T09:00:00Z",
    updated_at: "2024-02-20T17:00:00Z",
    employee: {
      first_name: "John",
      last_name: "Doe",
      employee_id: "EMP001",
      department_id: "1",
      avatar: "/placeholder.svg?height=40&width=40",
    },
  },
  // Add more mock records as needed
]

export async function getAttendanceRecords(filters?: AttendanceFilters): Promise<AttendanceRecord[]> {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1000))

  let filteredRecords = [...mockAttendanceRecords]

  if (filters) {
    if (filters.start_date) {
      filteredRecords = filteredRecords.filter((record) => new Date(record.date) >= filters.start_date!)
    }
    if (filters.end_date) {
      filteredRecords = filteredRecords.filter((record) => new Date(record.date) <= filters.end_date!)
    }
    if (filters.department_id) {
      filteredRecords = filteredRecords.filter((record) => record.employee.department_id === filters.department_id)
    }
    if (filters.status) {
      filteredRecords = filteredRecords.filter((record) => record.status === filters.status)
    }
    if (filters.employee_id) {
      filteredRecords = filteredRecords.filter((record) => record.employee_id === filters.employee_id)
    }
  }

  return filteredRecords
}

export async function getAttendanceStats(): Promise<AttendanceStats> {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1000))

  return {
    total_employees: 150,
    present_today: 130,
    late_today: 10,
    absent_today: 10,
    average_check_in_time: "09:15",
    average_working_hours: 7.5,
    attendance_rate: 93.33,
  }
}

export async function markAttendance(data: MarkAttendanceDto): Promise<AttendanceRecord> {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // In a real application, this would create or update an attendance record
  const newRecord: AttendanceRecord = {
    id: Math.random().toString(36).substring(7),
    employee_id: data.employee_id,
    date: new Date().toISOString().split("T")[0],
    status: "present",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    employee: {
      first_name: "John",
      last_name: "Doe",
      employee_id: "EMP001",
      department_id: "1",
    },
    ...(data.type === "check_in" ? { check_in: data.time } : { check_out: data.time }),
    ...(data.notes && { notes: data.notes }),
  }

  return newRecord
}

