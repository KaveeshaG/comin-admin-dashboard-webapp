"use client"
 
import { useState } from "react"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DatePicker } from "@/components/ui/date-picker"
import { Button } from "@/components/ui/button"
import { EmployeeCombobox } from "@/components/employees/employee-combobox"
import { Filter, X } from "lucide-react"
import type { AttendanceFilters } from "@/types/attendance"
import type { Employee } from "@/types/employee"
 
interface AttendanceFiltersProps {
  onFilterChange: (filters: AttendanceFilters) => void
  employees?: Employee[]
  departments?: { [key: string]: string }
}
 
export function AttendanceFilters({ onFilterChange, employees = [], departments = {} }: AttendanceFiltersProps) {
  const [filters, setFilters] = useState<AttendanceFilters>({})
  const [isFiltersVisible, setIsFiltersVisible] = useState(false)
 
  const handleFilterChange = (key: keyof AttendanceFilters, value: any) => {
    const newFilters = { ...filters }
 
    if (value === "" || value === undefined || value === "all") {
      delete newFilters[key]
    } else {
      newFilters[key] = value
    }
 
    setFilters(newFilters)
 
    // Apply filters immediately
    onFilterChange(newFilters)
  }
 
  const resetFilters = () => {
    setFilters({})
    onFilterChange({})
  }
 
  const toggleFilters = () => {
    setIsFiltersVisible(!isFiltersVisible)
  }
 
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between gap-2">
        <Button variant="outline" className="w-full sm:w-auto" onClick={toggleFilters}>
          <Filter className="mr-2 h-4 w-4" />
          {isFiltersVisible ? "Hide Filters" : "Show Filters"}
        </Button>
 
        {Object.keys(filters).length > 0 && (
          <Button variant="outline" className="w-full sm:w-auto" onClick={resetFilters}>
            <X className="mr-2 h-4 w-4" />
            Clear Filters
          </Button>
        )}
      </div>
 
      {isFiltersVisible && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 border rounded-md bg-muted/10">
          <div>
            <Label>From Date</Label>
            <DatePicker date={filters.start_date} onDateChange={(date) => handleFilterChange("start_date", date)} />
          </div>
 
          <div>
            <Label>To Date</Label>
            <DatePicker date={filters.end_date} onDateChange={(date) => handleFilterChange("end_date", date)} />
          </div>
 
          <div>
            <Label>Department</Label>
            <Select
              value={filters.department_id || "all"}
              onValueChange={(value) => handleFilterChange("department_id", value === "all" ? undefined : value)}
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
 
          <div>
            <Label>Status</Label>
            <Select
              value={filters.status || "all"}
              onValueChange={(value) => handleFilterChange("status", value === "all" ? undefined : value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="present">Present</SelectItem>
                <SelectItem value="late">Late</SelectItem>
                <SelectItem value="absent">Absent</SelectItem>
              </SelectContent>
            </Select>
          </div>
 
          <div>
            <Label>Employee</Label>
            <EmployeeCombobox
              employees={employees}
              value={filters.employee_id}
              onValueChange={(value) => handleFilterChange("employee_id", value === "all" ? undefined : value)}
              departments={departments}
            />
          </div>
        </div>
      )}
    </div>
  )
}