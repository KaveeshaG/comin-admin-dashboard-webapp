export interface Employee {
  id: string
  organization_id: string
  department_id: string
  first_name: string
  last_name: string
  email: string
  phone: string
  date_of_birth: string
  hire_date: string
  employee_id: string
  work_type: "Full-Time" | "Part-Time" | "Contract"
  leave_type_id: string
  leave_total_days: number
  qr_code?: string
}
 
export interface Department {
  id: string
  name: string
  organization_id: string
  description: string,
  status: string
}
 
export interface CreateEmployeeDto {
  organization_id: string
  department_id: string
  first_name: string
  last_name: string
  email: string
  phone: string
  date_of_birth: string
  hire_date: string
  employee_id: string
  work_type: "Full-Time" | "Part-Time" | "Contract"
  leave_type_id: string
  leave_total_days: number
}
 
export interface EmployeeFilters {
  department_id?: string
  work_type?: string
  search?: string
}
 
 