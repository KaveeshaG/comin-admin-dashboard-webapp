export interface LeaveRequest {
    id: string
    employee_id: string
    leave_type_id: string
    start_date: string
    end_date: string
    reason: string
    status: "pending" | "approved" | "rejected"
    created_at: string
    updated_at: string
    days: number
    employee: {
      first_name: string
      last_name: string
      avatar?: string
    }
  }
  
  export interface LeaveBalance {
    employee_id: string
    leave_type_id: string
    total_days: number
    used_days: number
    remaining_days: number
    leave_type: {
      name: string
    }
  }
  
  export interface CreateLeaveRequestDto {
    employee_id: string
    leave_type_id: string
    start_date: string
    end_date: string
    reason: string
  }
  
  