"use client"

import { useState, useEffect, useCallback } from "react"
import { useToast } from "@/components/ui/use-toast"
import { ReportFilters } from "@/components/reports/report-filters"
import { EmployeeReport } from "@/components/reports/employee-report"
import { AttendanceReport } from "@/components/reports/attendance-report"
import { LeaveReport } from "@/components/reports/leave-report"
import { CostReport } from "@/components/reports/cost-report"
import { getEmployeeMetrics, getAttendanceMetrics, getLeaveMetrics, getCostMetrics } from "@/lib/api/reports"
import { getDepartments } from "@/lib/api/departments"
import { useAuth } from "@/providers/auth-provider"
import { exportToCSV, exportToPDF } from "@/lib/utils/export-utils"
import { ExportDropdown } from "@/components/timesheet/export-dropdown"
import type { ReportFilters as Filters } from "@/types/reports"

export default function ReportsPage() {
  const [filters, setFilters] = useState<Filters>({
    reportType: "employees",
  })
  const [departments, setDepartments] = useState<{ [key: string]: string }>({})
  const [reportData, setReportData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isExporting, setIsExporting] = useState(false)
  const { toast } = useToast()
  const { user } = useAuth()

  const loadData = useCallback(async () => {
    if (!user?.organizationId) return

    try {
      setIsLoading(true)
      const [deptsData, metricsData] = await Promise.all([getDepartments(user.organizationId), getReportData(filters)])

      // Create departments map
      const deptsMap = deptsData.reduce(
        (acc, dept) => {
          acc[dept.id] = dept.name
          return acc
        },
        {} as { [key: string]: string },
      )

      setDepartments(deptsMap)
      setReportData(metricsData)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load report data",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }, [filters, user?.organizationId, toast])

  useEffect(() => {
    loadData()
  }, [loadData])

  const getReportData = async (filters: Filters) => {
    switch (filters.reportType) {
      case "employees":
        return getEmployeeMetrics(filters.startDate, filters.endDate, filters.departmentId)
      case "attendance":
        return getAttendanceMetrics(filters.startDate, filters.endDate, filters.departmentId)
      case "leave":
        return getLeaveMetrics(filters.startDate, filters.endDate, filters.departmentId)
      case "costs":
        return getCostMetrics(filters.startDate, filters.endDate, filters.departmentId)
      default:
        return null
    }
  }

  const handleExportCSV = async () => {
    try {
      setIsExporting(true)
      const csvData = exportToCSV(reportData, filters.reportType)

      // Create and trigger download
      const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" })
      const link = document.createElement("a")
      const url = URL.createObjectURL(blob)
      link.setAttribute("href", url)
      link.setAttribute("download", `${filters.reportType}_report_${new Date().toISOString().split("T")[0]}.csv`)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      toast({
        title: "Success",
        description: "Report exported as CSV successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to export report",
        variant: "destructive",
      })
    } finally {
      setIsExporting(false)
    }
  }

  const handleExportPDF = async () => {
    try {
      setIsExporting(true)
      exportToPDF(reportData, filters.reportType, departments)
      toast({
        title: "Success",
        description: "Report exported as PDF successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to export report",
        variant: "destructive",
      })
    } finally {
      setIsExporting(false)
    }
  }

  const renderReport = () => {
    if (!reportData) return null

    switch (filters.reportType) {
      case "employees":
        return <EmployeeReport data={reportData} />
      case "attendance":
        return <AttendanceReport data={reportData} />
      case "leave":
        return <LeaveReport data={reportData} />
      case "costs":
        return <CostReport data={reportData} />
      default:
        return null
    }
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Reports & Analytics</h1>
          <p className="text-muted-foreground">View and analyze HR metrics and trends</p>
        </div>
        <ExportDropdown onExportCSV={handleExportCSV} onExportPDF={handleExportPDF} isExporting={isExporting} />
      </div>

      <ReportFilters filters={filters} onFilterChange={setFilters} departments={departments} />

      {renderReport()}
    </div>
  )
}

