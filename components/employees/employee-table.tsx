"use client"

import type React from "react"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenuItem } from "@/components/ui/dropdown-menu"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  MoreHorizontal,
  Pencil,
  Trash2,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Download,
  UserX,
  UserCheck,
} from "lucide-react"
import { format } from "date-fns"
import { Checkbox } from "@/components/ui/checkbox"
import type { Employee } from "@/types/employee"
import { DeleteEmployeeDialog } from "./delete-employee-dialog"

interface EmployeeTableProps {
  employees: Employee[]
  onEdit: (employee: Employee) => void
  onDelete: (employee: Employee) => void
  onDeleteMany: (employeeIds: string[]) => void
  onExportCsv: () => void
  onUpdateStatus: (employeeIds: string[], status: string) => void
  departments: { [key: string]: string }
  page: number
  pageSize: number
  totalItems: number
  onPageChange: (page: number) => void
  onSort: (field: keyof Employee) => void
  sortField?: keyof Employee
  sortDirection?: "asc" | "desc"
}

export function EmployeeTable({
  employees,
  onEdit,
  onDelete,
  onDeleteMany,
  onExportCsv,
  onUpdateStatus,
  departments,
  page,
  pageSize,
  totalItems,
  onPageChange,
  onSort,
  sortField,
  sortDirection,
}: EmployeeTableProps) {
  const [employeeToDelete, setEmployeeToDelete] = useState<Employee | null>(null)
  const [selectedEmployees, setSelectedEmployees] = useState<Set<string>>(new Set())

  const getWorkTypeColor = (workType: string) => {
    switch (workType) {
      case "Full-Time":
        return "bg-green-500"
      case "Part-Time":
        return "bg-yellow-500"
      case "Contract":
        return "bg-blue-500"
      default:
        return "bg-gray-500"
    }
  }

  const totalPages = Math.ceil(totalItems / pageSize)
  const startItem = (page - 1) * pageSize + 1
  const endItem = Math.min(page * pageSize, totalItems)

  const SortButton = ({ field, children }: { field: keyof Employee; children: React.ReactNode }) => (
    <Button variant="ghost" onClick={() => onSort(field)} className="hover:bg-transparent">
      {children}
      <ArrowUpDown className={`ml-2 h-4 w-4 ${sortField === field ? "opacity-100" : "opacity-40"}`} />
    </Button>
  )

  const toggleAll = () => {
    if (selectedEmployees.size === employees.length) {
      setSelectedEmployees(new Set())
    } else {
      setSelectedEmployees(new Set(employees.map((emp) => emp.id)))
    }
  }

  const toggleEmployee = (employeeId: string) => {
    const newSelected = new Set(selectedEmployees)
    if (newSelected.has(employeeId)) {
      newSelected.delete(employeeId)
    } else {
      newSelected.add(employeeId)
    }
    setSelectedEmployees(newSelected)
  }

  return (
    <>
      {selectedEmployees.size > 0 && (
        <div className="mb-4 flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => onExportCsv()}>
            <Download className="mr-2 h-4 w-4" />
            Export Selected
          </Button>
          <Button variant="outline" size="sm" onClick={() => onUpdateStatus(Array.from(selectedEmployees), "active")}>
            <UserCheck className="mr-2 h-4 w-4" />
            Set Active
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onUpdateStatus(Array.from(selectedEmployees), "terminated")}
          >
            <UserX className="mr-2 h-4 w-4" />
            Set Terminated
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => {
              if (confirm(`Delete ${selectedEmployees.size} selected employees?`)) {
                onDeleteMany(Array.from(selectedEmployees))
                setSelectedEmployees(new Set())
              }
            }}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete Selected
          </Button>
        </div>
      )}

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">
                <Checkbox
                  checked={selectedEmployees.size === employees.length}
                  onCheckedChange={toggleAll}
                  aria-label="Select all"
                />
              </TableHead>
              <TableHead>
                <SortButton field="first_name">Employee</SortButton>
              </TableHead>
              <TableHead>
                <SortButton field="department_id">Department</SortButton>
              </TableHead>
              <TableHead>
                <SortButton field="work_type">Work Type</SortButton>
              </TableHead>
              <TableHead>
                <SortButton field="employee_id">Employee ID</SortButton>
              </TableHead>
              <TableHead>
                <SortButton field="hire_date">Hire Date</SortButton>
              </TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {employees.map((employee) => (
              <TableRow key={employee.id}>
                <TableCell>
                  <Checkbox
                    checked={selectedEmployees.has(employee.id)}
                    onCheckedChange={() => toggleEmployee(employee.id)}
                    aria-label={`Select ${employee.first_name} ${employee.last_name}`}
                  />
                </TableCell>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={employee.avatar} alt={`${employee.first_name} ${employee.last_name}`} />
                      <AvatarFallback>
                        {employee.first_name[0]}
                        {employee.last_name[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">
                        {employee.first_name} {employee.last_name}
                      </div>
                      <div className="text-sm text-muted-foreground">{employee.email}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{departments[employee.department_id] || "Unknown Department"}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className={`h-2 w-2 rounded-full ${getWorkTypeColor(employee.work_type)}`} />
                    <span>{employee.work_type}</span>
                  </div>
                </TableCell>
                <TableCell>{employee.employee_id}</TableCell>
                <TableCell>{format(new Date(employee.hire_date), "MMM d, yyyy")}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => onEdit(employee)}>
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600" onClick={() => setEmployeeToDelete(employee)}>
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between px-2 py-4">
        <p className="text-sm text-muted-foreground">
          Showing {startItem} to {endItem} of {totalItems} entries
        </p>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={() => onPageChange(page - 1)} disabled={page <= 1}>
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>
          <Button variant="outline" size="sm" onClick={() => onPageChange(page + 1)} disabled={page >= totalPages}>
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <DeleteEmployeeDialog
        open={!!employeeToDelete}
        onOpenChange={(open) => !open && setEmployeeToDelete(null)}
        onConfirm={() => {
          if (employeeToDelete) {
            onDelete(employeeToDelete)
            setEmployeeToDelete(null)
          }
        }}
        employeeName={employeeToDelete ? `${employeeToDelete.first_name} ${employeeToDelete.last_name}` : ""}
      />
    </>
  )
}

