export interface TimeEntry {
    id: string
    employee_id: string
    date: string
    check_in: string
    check_out: string
    break_start?: string
    break_end?: string
    total_hours: number
    overtime_hours: number
    status: "pending" | "approved" | "rejected"
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
  
  export interface TimesheetStats {
    total_hours: number
    total_overtime: number
    average_hours_per_day: number
    total_employees: number
    pending_approvals: number
    late_entries: number
  }
  
  export interface TimesheetFilters {
    start_date?: Date
    end_date?: Date
    department_id?: string
    employee_id?: string
    status?: string
  }
  
  