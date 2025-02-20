import type { Employee, CreateEmployeeDto } from "@/types/employee"

// Mock data - replace with actual API calls later
const mockEmployees: Employee[] = [
  {
    id: "1",
    organization_id: "0bd14f74-997d-4384-be62-bb634800c6f8",
    department_id: "00b8f868-690c-4497-8413-8123e4e92287",
    first_name: "John",
    last_name: "Doe",
    email: "john.doe@example.com",
    phone: "+1234567890",
    date_of_birth: "1990-01-15T00:00:00Z",
    hire_date: "2024-02-01T00:00:00Z",
    employee_id: "EMP-00001",
    work_type: "Full-Time",
    leave_type_id: "acf38160-da05-4f36-94f5-5bf31cff82b8",
    leave_total_days: 20.0,
  },
  // Add more mock data as needed
]

export async function getEmployees() {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1000))
  return mockEmployees
}

export async function getEmployee(id: string): Promise<Employee | null> {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 500))
  const employee = mockEmployees.find((emp) => emp.id === id)
  return employee || null
}

export async function createEmployee(employee: CreateEmployeeDto): Promise<Employee> {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1000))

  const newEmployee = {
    ...employee,
    id: Math.random().toString(36).substr(2, 9),
  }

  return newEmployee as Employee
}

export async function updateEmployee(id: string, employee: Partial<CreateEmployeeDto>): Promise<Employee> {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1000))

  const existingEmployee = await getEmployee(id)
  if (!existingEmployee) {
    throw new Error("Employee not found")
  }

  const updatedEmployee = {
    ...existingEmployee,
    ...employee,
  }

  return updatedEmployee
}

export async function deleteEmployee(id: string): Promise<void> {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1000))

  const employee = await getEmployee(id)
  if (!employee) {
    throw new Error("Employee not found")
  }
}

