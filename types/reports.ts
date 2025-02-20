export interface EmployeeMetrics {
    total_employees: number
    active_employees: number
    departments: {
      name: string
      count: number
    }[]
    joining_trend: {
      month: string
      count: number
    }[]
    turnover_rate: number
    gender_distribution: {
      gender: string
      count: number
    }[]
    age_distribution: {
      range: string
      count: number
    }[]
  }
  
  export interface AttendanceMetrics {
    average_attendance: number
    attendance_trend: {
      date: string
      present: number
      absent: number
      late: number
    }[]
    department_attendance: {
      department: string
      attendance_rate: number
    }[]
    late_arrivals_trend: {
      month: string
      count: number
    }[]
  }
  
  export interface LeaveMetrics {
    total_leaves: number
    leave_by_type: {
      type: string
      count: number
    }[]
    leave_trend: {
      month: string
      count: number
    }[]
    department_leave_distribution: {
      department: string
      leaves: number
    }[]
    approval_rate: number
  }
  
  export interface CostMetrics {
    total_salary: number
    department_costs: {
      department: string
      cost: number
    }[]
    cost_trend: {
      month: string
      amount: number
    }[]
    cost_per_employee: number
    overtime_costs: {
      department: string
      cost: number
    }[]
  }
  
  export interface ReportFilters {
    startDate?: Date
    endDate?: Date
    departmentId?: string
    reportType: "employees" | "attendance" | "leave" | "costs"
  }
  
  