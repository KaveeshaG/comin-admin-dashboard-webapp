"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { EmployeeFilters } from "@/types/employee"

interface EmployeeFiltersProps {
  filters: EmployeeFilters
  onFilterChange: (filters: EmployeeFilters) => void
  departments: { [key: string]: string }
}

export function EmployeeFilters({ filters, onFilterChange, departments }: EmployeeFiltersProps) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-end">
      <div className="flex-1">
        <Label htmlFor="search">Search</Label>
        <Input
          id="search"
          placeholder="Search by name, email, or employee ID..."
          value={filters.search || ""}
          onChange={(e) => onFilterChange({ ...filters, search: e.target.value })}
        />
      </div>
      <div className="w-full md:w-[200px]">
        <Label htmlFor="department">Department</Label>
        <Select
          value={filters.department_id || ""}
          onValueChange={(value) => onFilterChange({ ...filters, department_id: value })}
        >
          <SelectTrigger id="department">
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
        <Label htmlFor="work_type">Work Type</Label>
        <Select
          value={filters.work_type || ""}
          onValueChange={(value) => onFilterChange({ ...filters, work_type: value })}
        >
          <SelectTrigger id="work_type">
            <SelectValue placeholder="All Types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="Full-Time">Full Time</SelectItem>
            <SelectItem value="Part-Time">Part Time</SelectItem>
            <SelectItem value="Contract">Contract</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}

