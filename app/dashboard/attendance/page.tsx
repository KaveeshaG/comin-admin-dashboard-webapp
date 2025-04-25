"use client"

import { useState, useEffect, useCallback } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { QRScanner } from "@/components/attendance/qr-scanner"
import { AttendanceStats } from "@/components/attendance/attendance-stats"
import { AttendanceTable } from "@/components/attendance/attendance-table"
import { AttendanceFilters } from "@/components/attendance/attendance-filters"
import { getAttendanceStats, getAttendanceRecords, markAttendance } from "@/lib/api/attendance"
import { getEmployees } from "@/lib/api/employees"
import { useAuth } from "@/providers/auth-provider"
import type { AttendanceFilters as Filters } from "@/types/attendance"
import { listDepartments } from "@/lib/api/departments"

export default function AttendancePage() {
  const [stats, setStats] = useState(null)
  const [records, setRecords] = useState([])
  const [employees, setEmployees] = useState([])
  const [departments, setDepartments] = useState({})
  const [filters, setFilters] = useState<Filters>({})
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()
  const { user } = useAuth()

  const loadData = useCallback(async () => {
    if (!user?.organizationId) return

    setIsLoading(true)

    try {
      const [statsData, recordsData, empsData, deptsData] = await Promise.all([
        getAttendanceStats(),
        getAttendanceRecords(filters),
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

      setStats(statsData)
      setRecords(recordsData)
      setEmployees(empsData)
      setDepartments(deptsMap)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load attendance data",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }, [filters, user?.organizationId, toast])

  useEffect(() => {
    loadData()
  }, [loadData])

  const handleScan = async (data: string) => {
    try {
      // In a real application, the QR code would contain employee information
      // Here we're simulating with a simple employee ID
      const employeeId = data

      await markAttendance({
        employee_id: employeeId,
        type: "check_in", // You might want to determine this based on time or previous records
        time: new Date().toISOString(),
      })

      toast({
        title: "Success",
        description: "Attendance marked successfully",
      })

      // Reload data to show updated records
      loadData()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to mark attendance",
        variant: "destructive",
      })
    }
  }

  const handleScanError = (error: Error) => {
    toast({
      title: "Scan Error",
      description: error.message,
      variant: "destructive",
    })
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Attendance Management</h1>
        <p className="text-muted-foreground">Track and manage employee attendance</p>
      </div>

      {stats && <AttendanceStats stats={stats} />}

      <Tabs defaultValue="scanner">
        <TabsList>
          <TabsTrigger value="scanner">QR Scanner</TabsTrigger>
          <TabsTrigger value="records">Attendance Records</TabsTrigger>
        </TabsList>

        <TabsContent value="scanner" className="space-y-4">
          <QRScanner onScan={handleScan} onError={handleScanError} />
        </TabsContent>

        <TabsContent value="records" className="space-y-4">
          <AttendanceFilters
            filters={filters}
            onFilterChange={setFilters}
            employees={employees}
            departments={departments}
          />
          <AttendanceTable records={records} departments={departments} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

