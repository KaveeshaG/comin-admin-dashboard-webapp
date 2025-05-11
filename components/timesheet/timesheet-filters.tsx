"use client"
 
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DatePicker } from "@/components/ui/date-picker"
import { EmployeeCombobox } from "@/components/employees/employee-combobox"
import type { TimesheetFilters } from "@/types/timesheet"
import type { Employee } from "@/types/employee"
 
interface TimesheetFiltersProps {
  filters: TimesheetFilters
  onFilterChange: (filters: TimesheetFilters) => void
  employees: Employee[]
  departments: { [key: string]: string }
}
 
export function TimesheetFilters({ filters, onFilterChange, employees, departments }: TimesheetFiltersProps) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-end">
      <div className="w-full md:w-[200px]">
        <Label>From Date</Label>
        <DatePicker
          date={filters.start_date}
          onDateChange={(date) => onFilterChange({ ...filters, start_date: date })}
        />
      </div>
      <div className="w-full md:w-[200px]">
        <Label>To Date</Label>
        <DatePicker date={filters.end_date} onDateChange={(date) => onFilterChange({ ...filters, end_date: date })} />
      </div>
      <div className="w-full md:w-[200px]">
        <Label>Department</Label>
        <Select
          value={filters.department_id || ""}
          onValueChange={(value) =>
            onFilterChange({
              ...filters,
              department_id: value === "all" ? undefined : value,
            })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="All Departments" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Departments</SelectItem>
            {Object.entries(departments).map(([id, name]) => (
              <SelectItem key={id} value={id}>
                {name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="w-full md:w-[200px]">
        <Label>Status</Label>
        <Select
          value={filters.status || ""}
          onValueChange={(value) =>
            onFilterChange({
              ...filters,
              status: value === "all" ? undefined : value,
            })
          }
        >
          <SelectTrigger>
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
      <div className="w-full md:w-[300px]">
        <Label>Employee</Label>
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
    </div>
  )
}