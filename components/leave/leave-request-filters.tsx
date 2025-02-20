"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DatePicker } from "@/components/ui/date-picker"
import type { Employee } from "@/types/employee"
import { EmployeeCombobox } from "@/components/employees/employee-combobox"

interface LeaveRequestFilters {
  employee_id?: string
  status?: string
  date_from?: Date
  date_to?: Date
  search?: string
}

interface LeaveRequestFiltersProps {
  filters: LeaveRequestFilters
  onFilterChange: (filters: LeaveRequestFilters) => void
  employees: Employee[]
  departments: { [key: string]: string }
}

export function LeaveRequestFilters({ filters, onFilterChange, employees, departments }: LeaveRequestFiltersProps) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-end">
      <div className="flex-1">
        <Label htmlFor="search">Search</Label>
        <Input
          id="search"
          placeholder="Search by reason..."
          value={filters.search || ""}
          onChange={(e) => onFilterChange({ ...filters, search: e.target.value })}
        />
      </div>
      <div className="w-full md:w-[400px]">
        <Label htmlFor="employee">Employee</Label>
        <EmployeeCombobox
          employees={employees}
          value={filters.employee_id}
          onValueChange={(value) =>
            onFilterChange({
              ...filters,
              employee_id: value === "all" ? undefined : value,
            })
          }
          departments={departments}
        />
      </div>
      <div className="w-full md:w-[200px]">
        <Label htmlFor="status">Status</Label>
        <Select
          value={filters.status || "all"}
          onValueChange={(value) => onFilterChange({ ...filters, status: value === "all" ? undefined : value })}
        >
          <SelectTrigger id="status">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="w-full md:w-[200px]">
        <Label>From Date</Label>
        <DatePicker date={filters.date_from} onDateChange={(date) => onFilterChange({ ...filters, date_from: date })} />
      </div>
      <div className="w-full md:w-[200px]">
        <Label>To Date</Label>
        <DatePicker date={filters.date_to} onDateChange={(date) => onFilterChange({ ...filters, date_to: date })} />
      </div>
    </div>
  )
}

