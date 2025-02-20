"use client"

import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DatePicker } from "@/components/ui/date-picker"
import type { ReportFilters } from "@/types/reports"

interface ReportFiltersProps {
  filters: ReportFilters
  onFilterChange: (filters: ReportFilters) => void
  departments: { [key: string]: string }
}

export function ReportFilters({ filters, onFilterChange, departments }: ReportFiltersProps) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-end">
      <div className="w-full md:w-[200px]">
        <Label>Report Type</Label>
        <Select
          value={filters.reportType}
          onValueChange={(value) => onFilterChange({ ...filters, reportType: value as ReportFilters["reportType"] })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select report type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="employees">Employee Analytics</SelectItem>
            <SelectItem value="attendance">Attendance Report</SelectItem>
            <SelectItem value="leave">Leave Analytics</SelectItem>
            <SelectItem value="costs">Cost Analysis</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="w-full md:w-[200px]">
        <Label>From Date</Label>
        <DatePicker date={filters.startDate} onDateChange={(date) => onFilterChange({ ...filters, startDate: date })} />
      </div>
      <div className="w-full md:w-[200px]">
        <Label>To Date</Label>
        <DatePicker date={filters.endDate} onDateChange={(date) => onFilterChange({ ...filters, endDate: date })} />
      </div>
      <div className="w-full md:w-[200px]">
        <Label>Department</Label>
        <Select
          value={filters.departmentId || ""}
          onValueChange={(value) => onFilterChange({ ...filters, departmentId: value === "all" ? undefined : value })}
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
    </div>
  )
}

