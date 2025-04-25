import type { Employee, CreateEmployeeDto } from "@/types/employee"
import { apiClient } from "@/lib/utils/api-client"

const mockEmployees: Employee[] = []

export async function getEmployees(organizationId?: string): Promise<Employee[]> {
  try {
    organizationId = '0bd14f74-997d-4384-be62-bb634800c6f8'

    const path = organizationId
      ? `/organizations/${organizationId}/employees`
      : `/employees`

    return await apiClient<Employee[]>(path, {}, 'employees')
  } catch (error) {
    console.error("Error fetching employees:", error)
    return mockEmployees
  }
}

export async function getEmployee(id: string): Promise<Employee | null> {
  try {
    const path = `/employees/${id}`
    return apiClient<Employee>(path, {}, 'employees');

  } catch (error) {
    console.error("Error fetching employee:", error);
    const employee = mockEmployees.find((emp) => emp.id === id);
    return employee || null;
  }
}

export async function createEmployee(employee: CreateEmployeeDto): Promise<Employee> {
  try {
    return await apiClient<Employee>("/employees", {
      method: "POST",
      body: JSON.stringify(employee),
    }, 'employees')
  } catch (error) {
    console.error("Error creating employee:", error)
    throw error
  }
}

export async function updateEmployee(id: string, employee: Partial<CreateEmployeeDto>): Promise<Employee> {
  try {
    return await apiClient<Employee>(`/employees/${id}`, {
      method: "PUT",
      body: JSON.stringify(employee),
    }, 'employees')
  } catch (error) {
    console.error("Error updating employee:", error)
    throw error
  }
}

export async function deleteEmployee(id: string): Promise<void> {
  try {
    const path = id ? `/employees/${id}` : "/api/v1/employees"
    return await apiClient(path, {method: "DELETE",}, 'employees')
  } catch (error) {
    console.error("Error deleting employee:", error)
    throw error
  }
}

