"use client"

import { useState, useEffect, useCallback } from "react"
import { TimesheetStats } from "@/components/timesheet/timesheet-stats"
import { TimesheetTable } from "@/components/timesheet/timesheet-table"
import { TimesheetFilters } from "@/components/timesheet/timesheet-filters"
import { useToast } from "@/components/ui/use-toast"
import { getTimeEntries, getTimesheetStats } from "@/lib/api/timesheet"
import { getEmployees } from "@/lib/api/employees"
import { listDepartments } from "@/lib/api/departments"
import { useAuth } from "@/providers/auth-provider"
import type { TimesheetFilters as Filters } from "@/types/timesheet"
import type { TimeEntry } from "@/types/timesheet"
import { ExportDropdown } from "@/components/timesheet/export-dropdown"
import { exportToCSV, exportToPDF } from "@/lib/utils/export-utils"

export default function TimesheetPage() {
  const [entries, setEntries] = useState<TimeEntry[]>([])
  const [stats, setStats] = useState(null)
  const [filters, setFilters] = useState<Filters>({})
  const [employees, setEmployees] = useState([])
  const [departments, setDepartments] = useState<{ [key: string]: string }>({})
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()
  const { user } = useAuth()

  const loadData = useCallback(async () => {
    if (!user?.organizationId) return

    try {
      const [entriesData, statsData, empsData, deptsData] = await Promise.all([
        getTimeEntries(filters),
        getTimesheetStats(filters.start_date, filters.end_date),
        getEmployees(),
        listDepartments(user.organizationId),
      ])

      // Create departments map
      const deptsMap = deptsData.reduce(
        (acc, dept) => {
          acc[dept.id] = dept.name
          return acc
        },
        {} as { [key: string]: string },
      )

      setEntries(entriesData)
      setStats(statsData)
      setEmployees(empsData)
      setDepartments(deptsMap)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load timesheet data",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }, [filters, user?.organizationId, toast])

  useEffect(() => {
    loadData()
  }, [loadData])

  const [isExporting, setIsExporting] = useState(false)

  const handleExportCSV = async () => {
    try {
      setIsExporting(true)
      const csvData = exportToCSV(entries)

      // Create and trigger download
      const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" })
      const link = document.createElement("a")
      const url = URL.createObjectURL(blob)
      link.setAttribute("href", url)
      link.setAttribute("download", `timesheet_export_${new Date().toISOString().split("T")[0]}.csv`)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      toast({
        title: "Success",
        description: "Timesheet data exported as CSV successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to export timesheet data",
        variant: "destructive",
      })
    } finally {
      setIsExporting(false)
    }
  }

  const handleExportPDF = async () => {
    try {
      setIsExporting(true)
      exportToPDF(entries, departments)
      toast({
        title: "Success",
        description: "Timesheet data exported as PDF successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to export timesheet data",
        variant: "destructive",
      })
    } finally {
      setIsExporting(false)
    }
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Timesheet Management</h1>
          <p className="text-muted-foreground">View and manage employee timesheets</p>
        </div>
        <ExportDropdown onExportCSV={handleExportCSV} onExportPDF={handleExportPDF} isExporting={isExporting} />
      </div>

      {stats && <TimesheetStats stats={stats} />}

      <TimesheetFilters filters={filters} onFilterChange={setFilters} employees={employees} departments={departments} />

      <TimesheetTable entries={entries} departments={departments} />
    </div>
  )
}

