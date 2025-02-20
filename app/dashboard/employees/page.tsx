"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { EmployeeTable } from "@/components/employees/employee-table"
import { EmployeeFilters } from "@/components/employees/employee-filters"
import { getEmployees, deleteEmployee } from "@/lib/api/employees"
import { getDepartments } from "@/lib/api/departments"
import type { Employee, EmployeeFilters as Filters } from "@/types/employee"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/providers/auth-provider"
import { format } from "date-fns"

const PAGE_SIZE = 10

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [departments, setDepartments] = useState<{ [key: string]: string }>({})
  const [filters, setFilters] = useState<Filters>({})
  const [isLoading, setIsLoading] = useState(true)
  const [totalItems, setTotalItems] = useState(0)
  const [page, setPage] = useState(1)
  const [sortField, setSortField] = useState<keyof Employee>("hire_date")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")

  const router = useRouter()
  const { toast } = useToast()
  const { user } = useAuth()
  const searchParams = useSearchParams()

  useEffect(() => {
    // Get initial page and sort from URL
    const pageParam = searchParams.get("page")
    const sortParam = searchParams.get("sort")
    const directionParam = searchParams.get("direction")

    if (pageParam) setPage(Number.parseInt(pageParam))
    if (sortParam) setSortField(sortParam as keyof Employee)
    if (directionParam) setSortDirection(directionParam as "asc" | "desc")
  }, [searchParams])

  const loadDepartments = useCallback(async () => {
    if (!user?.organizationId) return
    try {
      const deptList = await getDepartments(user.organizationId)
      const deptMap = deptList.reduce(
        (acc, dept) => {
          acc[dept.id] = dept.name
          return acc
        },
        {} as { [key: string]: string },
      )
      setDepartments(deptMap)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load departments",
        variant: "destructive",
      })
    }
  }, [user?.organizationId, toast])

  const loadEmployees = useCallback(async () => {
    try {
      // In a real application, pass these parameters to your API
      const data = await getEmployees()

      // For demo purposes, we'll sort and paginate on the client
      let sortedData = [...data].sort((a, b) => {
        if (sortField === "hire_date") {
          return sortDirection === "asc"
            ? new Date(a.hire_date).getTime() - new Date(b.hire_date).getTime()
            : new Date(b.hire_date).getTime() - new Date(a.hire_date).getTime()
        }
        return sortDirection === "asc" ? (a[sortField] > b[sortField] ? 1 : -1) : a[sortField] < b[sortField] ? 1 : -1
      })

      // Apply filters
      if (filters.department_id && filters.department_id !== "all") {
        sortedData = sortedData.filter((emp) => emp.department_id === filters.department_id)
      }
      if (filters.work_type && filters.work_type !== "all") {
        sortedData = sortedData.filter((emp) => emp.work_type === filters.work_type)
      }
      if (filters.search) {
        const search = filters.search.toLowerCase()
        sortedData = sortedData.filter(
          (emp) =>
            `${emp.first_name} ${emp.last_name}`.toLowerCase().includes(search) ||
            emp.email.toLowerCase().includes(search) ||
            emp.employee_id.toLowerCase().includes(search),
        )
      }

      setTotalItems(sortedData.length)

      // Paginate
      const start = (page - 1) * PAGE_SIZE
      const paginatedData = sortedData.slice(start, start + PAGE_SIZE)

      setEmployees(paginatedData)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load employees",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }, [page, sortField, sortDirection, filters, toast])

  useEffect(() => {
    Promise.all([loadDepartments(), loadEmployees()])
  }, [loadDepartments, loadEmployees])

  const handlePageChange = (newPage: number) => {
    setPage(newPage)
    router.push(`/dashboard/employees?page=${newPage}&sort=${sortField}&direction=${sortDirection}`)
  }

  const handleSort = (field: keyof Employee) => {
    const direction = field === sortField && sortDirection === "asc" ? "desc" : "asc"
    setSortField(field)
    setSortDirection(direction)
    router.push(`/dashboard/employees?page=${page}&sort=${field}&direction=${direction}`)
  }

  const handleEdit = (employee: Employee) => {
    router.push(`/dashboard/employees/${employee.id}/edit`)
  }

  const handleDelete = async (employee: Employee) => {
    try {
      await deleteEmployee(employee.id)
      toast({
        title: "Success",
        description: "Employee deleted successfully",
      })
      loadEmployees()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete employee",
        variant: "destructive",
      })
    }
  }

  const handleExportCsv = () => {
    // Convert employees to CSV
    const headers = ["Employee ID", "First Name", "Last Name", "Email", "Department", "Work Type", "Hire Date", "Phone"]

    const csvData = employees.map((emp) => [
      emp.employee_id,
      emp.first_name,
      emp.last_name,
      emp.email,
      departments[emp.department_id] || "Unknown",
      emp.work_type,
      format(new Date(emp.hire_date), "yyyy-MM-dd"),
      emp.phone,
    ])

    const csvContent = [headers.join(","), ...csvData.map((row) => row.join(","))].join("\n")

    // Create and trigger download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", `employees_export_${format(new Date(), "yyyy-MM-dd")}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleDeleteMany = async (employeeIds: string[]) => {
    try {
      await Promise.all(employeeIds.map((id) => deleteEmployee(id)))
      toast({
        title: "Success",
        description: `Successfully deleted ${employeeIds.length} employees`,
      })
      loadEmployees()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete some employees",
        variant: "destructive",
      })
    }
  }

  const handleUpdateStatus = async (employeeIds: string[], status: string) => {
    try {
      // In a real app, you would call your API here
      toast({
        title: "Success",
        description: `Updated status for ${employeeIds.length} employees`,
      })
      loadEmployees()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update status",
        variant: "destructive",
      })
    }
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Employees</h1>
        <Button onClick={() => router.push("/dashboard/employees/new")}>
          <Plus className="mr-2 h-4 w-4" />
          Add Employee
        </Button>
      </div>

      <EmployeeFilters filters={filters} onFilterChange={setFilters} departments={departments} />

      <EmployeeTable
        employees={employees}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onDeleteMany={handleDeleteMany}
        onExportCsv={handleExportCsv}
        onUpdateStatus={handleUpdateStatus}
        departments={departments}
        page={page}
        pageSize={PAGE_SIZE}
        totalItems={totalItems}
        onPageChange={handlePageChange}
        onSort={handleSort}
        sortField={sortField}
        sortDirection={sortDirection}
      />
    </div>
  )
}

