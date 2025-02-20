"use client"

import { useState, useEffect } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { LeaveRequestForm } from "@/components/leave/leave-request-form"
import { LeaveRequestTable } from "@/components/leave/leave-request-table"
import { LeaveRequestFilters } from "@/components/leave/leave-request-filters"
import { useToast } from "@/components/ui/use-toast"
import { getLeaveRequests, updateLeaveRequest } from "@/lib/api/leave"
import { getLeaveTypes } from "@/lib/api/leave-types"
import { getEmployees } from "@/lib/api/employees"
import { getDepartments } from "@/lib/api/departments"
import { useAuth } from "@/providers/auth-provider"
import type { LeaveRequest } from "@/types/leave"
import type { LeaveType } from "@/types/employee"
import type { Employee } from "@/types/employee"

interface LeaveRequestFilters {
  employee_id?: string
  status?: string
  date_from?: Date
  date_to?: Date
  search?: string
}

export default function LeavePage() {
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([])
  const [leaveTypes, setLeaveTypes] = useState<LeaveType[]>([])
  const [employees, setEmployees] = useState<Employee[]>([])
  const [filters, setFilters] = useState<LeaveRequestFilters>({})
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const { toast } = useToast()
  const { user } = useAuth()
  const [departments, setDepartments] = useState<{ [key: string]: string }>({})

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    if (!user?.organizationId) return

    try {
      const [requests, types, emps, depts] = await Promise.all([
        getLeaveRequests(),
        getLeaveTypes(user.organizationId),
        getEmployees(),
        getDepartments(user.organizationId),
      ])

      // Create departments map
      const deptsMap = depts.reduce(
        (acc, dept) => {
          acc[dept.id] = dept.name
          return acc
        },
        {} as { [key: string]: string },
      )

      // Apply filters
      let filteredRequests = [...requests]
      if (filters.employee_id) {
        filteredRequests = filteredRequests.filter((r) => r.employee_id === filters.employee_id)
      }
      if (filters.status) {
        filteredRequests = filteredRequests.filter((r) => r.status === filters.status)
      }
      if (filters.date_from) {
        filteredRequests = filteredRequests.filter((r) => new Date(r.start_date) >= filters.date_from!)
      }
      if (filters.date_to) {
        filteredRequests = filteredRequests.filter((r) => new Date(r.end_date) <= filters.date_to!)
      }
      if (filters.search) {
        const search = filters.search.toLowerCase()
        filteredRequests = filteredRequests.filter((r) => r.reason.toLowerCase().includes(search))
      }

      setLeaveRequests(filteredRequests)
      setLeaveTypes(types)
      setEmployees(emps)
      setDepartments(deptsMap)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load leave data",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleApprove = async (request: LeaveRequest) => {
    try {
      await updateLeaveRequest(request.id, "approved")
      toast({
        title: "Success",
        description: "Leave request approved",
      })
      loadData()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to approve leave request",
        variant: "destructive",
      })
    }
  }

  const handleReject = async (request: LeaveRequest) => {
    try {
      await updateLeaveRequest(request.id, "rejected")
      toast({
        title: "Success",
        description: "Leave request rejected",
      })
      loadData()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reject leave request",
        variant: "destructive",
      })
    }
  }

  const handleBulkApprove = async (requestIds: string[]) => {
    try {
      await Promise.all(requestIds.map((id) => updateLeaveRequest(id, "approved")))
      toast({
        title: "Success",
        description: `${requestIds.length} leave requests approved`,
      })
      loadData()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to approve some leave requests",
        variant: "destructive",
      })
    }
  }

  const handleBulkReject = async (requestIds: string[]) => {
    try {
      await Promise.all(requestIds.map((id) => updateLeaveRequest(id, "rejected")))
      toast({
        title: "Success",
        description: `${requestIds.length} leave requests rejected`,
      })
      loadData()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reject some leave requests",
        variant: "destructive",
      })
    }
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Leave Management</h1>
          <p className="text-muted-foreground">Manage employee leave requests</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Leave Request
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>New Leave Request</DialogTitle>
              <DialogDescription>Create a new leave request for an employee.</DialogDescription>
            </DialogHeader>
            <LeaveRequestForm
              leaveTypes={leaveTypes}
              onSuccess={() => {
                setIsDialogOpen(false)
                loadData()
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      <LeaveRequestFilters
        filters={filters}
        onFilterChange={setFilters}
        employees={employees}
        departments={departments}
      />

      <LeaveRequestTable
        requests={leaveRequests}
        onApprove={handleApprove}
        onReject={handleReject}
        onBulkApprove={handleBulkApprove}
        onBulkReject={handleBulkReject}
        isManager={true}
      />
    </div>
  )
}

