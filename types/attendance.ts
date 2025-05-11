export type AttendanceStatus = "present" | "late" | "absent"
export type AttendanceType = "check_in" | "check_out"
export type WorkMode = "office" | "remote" | "hybrid"
 
export interface AttendanceRecord {
  id: string
  created_at: string
  updated_at: string
  organization_id: string
  employee_id: string
  check_in?: string
  check_out?: string
  date: string
  status: AttendanceStatus
  work_mode: WorkMode
  location: string
  device_info: string
  employee?: {
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
 
export interface CheckInRequest {
  qr_code: string
  location: string
  device_info: string
  work_mode: WorkMode
}
 
export interface CheckOutRequest {
  qr_code: string
  location: string
  device_info: string
}
 
export interface AttendanceFilters {
  start_date?: Date
  end_date?: Date
  department_id?: string
  status?: AttendanceStatus
  employee_id?: string
}
 
export interface AttendanceCheck {
  checkedIn: boolean
  checkedOut: boolean
  checkInTime?: string
  checkOutTime?: string
}
 
 