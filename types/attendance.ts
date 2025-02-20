export type AttendanceStatus = "present" | "late" | "absent"
export type AttendanceType = "check_in" | "check_out"

export interface AttendanceRecord {
  id: string
  employee_id: string
  date: string
  check_in?: string
  check_out?: string
  status: AttendanceStatus
  notes?: string
  created_at: string
  updated_at: string
  employee: {
    first_name: string
    last_name: string
    employee_id: string
    avatar?: string
    department_id: string
  }
}

export interface AttendanceStats {
  total_employees: number
  present_today: number
  late_today: number
  absent_today: number
  average_check_in_time: string
  average_working_hours: number
  attendance_rate: number
}

export interface MarkAttendanceDto {
  employee_id: string
  type: AttendanceType
  time: string
  notes?: string
}

export interface AttendanceFilters {
  start_date?: Date
  end_date?: Date
  department_id?: string
  status?: AttendanceStatus
  employee_id?: string
}

