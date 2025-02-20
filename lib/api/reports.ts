import type { EmployeeMetrics, AttendanceMetrics, LeaveMetrics, CostMetrics } from "@/types/reports"

export async function getEmployeeMetrics(
  startDate?: Date,
  endDate?: Date,
  departmentId?: string,
): Promise<EmployeeMetrics> {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1000))

  return {
    total_employees: 150,
    active_employees: 142,
    departments: [
      { name: "Engineering", count: 45 },
      { name: "Sales", count: 30 },
      { name: "Marketing", count: 25 },
      { name: "HR", count: 15 },
      { name: "Operations", count: 35 },
    ],
    joining_trend: [
      { month: "Jan 2024", count: 5 },
      { month: "Feb 2024", count: 7 },
      { month: "Mar 2024", count: 3 },
      { month: "Apr 2024", count: 6 },
      { month: "May 2024", count: 4 },
    ],
    turnover_rate: 12.5,
    gender_distribution: [
      { gender: "Male", count: 85 },
      { gender: "Female", count: 65 },
    ],
    age_distribution: [
      { range: "20-25", count: 20 },
      { range: "26-30", count: 45 },
      { range: "31-35", count: 35 },
      { range: "36-40", count: 30 },
      { range: "40+", count: 20 },
    ],
  }
}

export async function getAttendanceMetrics(
  startDate?: Date,
  endDate?: Date,
  departmentId?: string,
): Promise<AttendanceMetrics> {
  await new Promise((resolve) => setTimeout(resolve, 1000))

  return {
    average_attendance: 92.5,
    attendance_trend: [
      { date: "2024-01", present: 140, absent: 8, late: 2 },
      { date: "2024-02", present: 138, absent: 10, late: 2 },
      { date: "2024-03", present: 142, absent: 6, late: 2 },
      { date: "2024-04", present: 141, absent: 7, late: 2 },
      { date: "2024-05", present: 139, absent: 9, late: 2 },
    ],
    department_attendance: [
      { department: "Engineering", attendance_rate: 94.5 },
      { department: "Sales", attendance_rate: 91.2 },
      { department: "Marketing", attendance_rate: 93.8 },
      { department: "HR", attendance_rate: 95.1 },
      { department: "Operations", attendance_rate: 90.9 },
    ],
    late_arrivals_trend: [
      { month: "Jan 2024", count: 15 },
      { month: "Feb 2024", count: 12 },
      { month: "Mar 2024", count: 18 },
      { month: "Apr 2024", count: 10 },
      { month: "May 2024", count: 14 },
    ],
  }
}

export async function getLeaveMetrics(startDate?: Date, endDate?: Date, departmentId?: string): Promise<LeaveMetrics> {
  await new Promise((resolve) => setTimeout(resolve, 1000))

  return {
    total_leaves: 450,
    leave_by_type: [
      { type: "Annual", count: 250 },
      { type: "Sick", count: 120 },
      { type: "Personal", count: 80 },
    ],
    leave_trend: [
      { month: "Jan 2024", count: 85 },
      { month: "Feb 2024", count: 92 },
      { month: "Mar 2024", count: 78 },
      { month: "Apr 2024", count: 95 },
      { month: "May 2024", count: 100 },
    ],
    department_leave_distribution: [
      { department: "Engineering", leaves: 150 },
      { department: "Sales", leaves: 85 },
      { department: "Marketing", leaves: 75 },
      { department: "HR", leaves: 45 },
      { department: "Operations", leaves: 95 },
    ],
    approval_rate: 92.5,
  }
}

export async function getCostMetrics(startDate?: Date, endDate?: Date, departmentId?: string): Promise<CostMetrics> {
  await new Promise((resolve) => setTimeout(resolve, 1000))

  return {
    total_salary: 750000,
    department_costs: [
      { department: "Engineering", cost: 300000 },
      { department: "Sales", cost: 150000 },
      { department: "Marketing", cost: 120000 },
      { department: "HR", cost: 80000 },
      { department: "Operations", cost: 100000 },
    ],
    cost_trend: [
      { month: "Jan 2024", amount: 145000 },
      { month: "Feb 2024", amount: 148000 },
      { month: "Mar 2024", amount: 152000 },
      { month: "Apr 2024", amount: 150000 },
      { month: "May 2024", amount: 155000 },
    ],
    cost_per_employee: 5000,
    overtime_costs: [
      { department: "Engineering", cost: 15000 },
      { department: "Sales", cost: 8000 },
      { department: "Marketing", cost: 5000 },
      { department: "HR", cost: 3000 },
      { department: "Operations", cost: 12000 },
    ],
  }
}

