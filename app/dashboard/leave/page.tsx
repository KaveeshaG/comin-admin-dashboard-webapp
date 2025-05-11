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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LeaveRequestForm } from "@/components/leave/leave-request-form"
import { LeaveRequestTable } from "@/components/leave/leave-request-table"
import { LeaveBalanceCard } from "@/components/leave/leave-balance-card"
import { LeaveRequestFilters } from "@/components/leave/leave-request-filters"
import { useToast } from "@/components/ui/use-toast"
import { getLeaveRequests, updateLeaveRequest, getLeaveTypes, getLeaveBalances } from "@/lib/api/leave"
import { getEmployees } from "@/lib/api/employees"
import { listDepartments } from "@/lib/api/departments"
import { useAuth } from "@/providers/auth-provider"
import type { LeaveRequest, LeaveBalance } from "@/types/leave"
import type { LeaveType } from "@/types/leave"
import type { Employee } from "@/types/employee"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, RefreshCcw } from "lucide-react"
 
interface Filters {
  employee_id?: string
  status?: string
  date_from?: Date
  date_to?: Date
  search?: string
}
 
export default function LeavePage() {
  const [activeTab, setActiveTab] = useState("all")
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([])
  const [filteredRequests, setFilteredRequests] = useState<LeaveRequest[]>([])
  const [leaveTypes, setLeaveTypes] = useState<LeaveType[]>([])
  const [employees, setEmployees] = useState<Employee[]>([])
  const [leaveBalance, setLeaveBalance] = useState<LeaveBalance | null>(null)
  const [filters, setFilters] = useState<Filters>({})
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingBalance, setIsLoadingBalance] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()
  const { user } = useAuth()
  const [departments, setDepartments] = useState<{ [key: string]: string }>({})
 
  useEffect(() => {
    loadData()
  }, [])
 
  useEffect(() => {
    applyFilters()
  }, [filters, leaveRequests, activeTab])
 
  useEffect(() => {
    // Load leave balance for the current user
    if (user?.id) {
      loadLeaveBalance(user.id)
    }
  }, [user])
 
  const loadLeaveBalance = async (employeeId: string) => {
    setIsLoadingBalance(true)
    try {
      const balances = await getLeaveBalances(employeeId)
      if (balances && balances.length > 0) {
        // Use the first balance for now, in a real app you might want to show all balances
        setLeaveBalance(balances[0])
      }
    } catch (error) {
      console.error("Error loading leave balance:", error)
    } finally {
      setIsLoadingBalance(false)
    }
  }
 
  const loadData = async () => {
    if (!user?.organizationId) {
      setError("User organization not found. Please log in again.")
      setIsLoading(false)
      return
    }
 
    setIsLoading(true)
    setError(null)
 
    try {
      // Load data in sequence to avoid overwhelming the API
      let requests: LeaveRequest[] = []
      let types: LeaveType[] = []
      let emps: Employee[] = []
      let depts: any[] = []
 
      try {
        requests = await getLeaveRequests(user.organizationId)
      } catch (e) {
        console.error("Error loading leave requests:", e)
        setError("Failed to load leave requests. Using cached data if available.")
      }
 
      try {
        types = await getLeaveTypes(user.organizationId)
      } catch (e) {
        console.error("Error loading leave types:", e)
      }
 
      try {
        emps = await getEmployees()
      } catch (e) {
        console.error("Error loading employees:", e)
      }
 
      try {
        depts = await listDepartments(user.organizationId)
      } catch (e) {
        console.error("Error loading departments:", e)
      }
 
      // Create departments map
      const deptsMap = depts.reduce(
        (acc, dept) => {
          acc[dept.id] = dept.name
          return acc
        },
        {} as { [key: string]: string },
      )
 
      setLeaveRequests(requests)
      setLeaveTypes(types)
      setEmployees(emps)
      setDepartments(deptsMap)
    } catch (error) {
      console.error("Error loading leave data:", error)
      setError("Failed to load leave data. Please try again.")
      toast({
        title: "Error",
        description: "Failed to load leave data. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }
 
  const applyFilters = () => {
    let filteredData = [...leaveRequests]
 
    // Filter by tab
    if (activeTab === "pending") {
      filteredData = filteredData.filter((r) => r.status === "pending")
    } else if (activeTab === "approved") {
      filteredData = filteredData.filter((r) => r.status === "approved")
    } else if (activeTab === "rejected") {
      filteredData = filteredData.filter((r) => r.status === "rejected")
    }
 
    // Apply additional filters
    if (filters.employee_id) {
      filteredData = filteredData.filter((r) => r.employee_id === filters.employee_id)
    }
 
    if (filters.status) {
      filteredData = filteredData.filter((r) => r.status === filters.status)
    }
 
    if (filters.date_from) {
      filteredData = filteredData.filter((r) => new Date(r.start_date) >= filters.date_from!)
    }
 
    if (filters.date_to) {
      filteredData = filteredData.filter((r) => new Date(r.end_date) <= filters.date_to!)
    }
 
    if (filters.search) {
      const search = filters.search.toLowerCase()
      filteredData = filteredData.filter(
        (r) =>
          r.reason?.toLowerCase().includes(search) ||
          employees
            .find((e) => e.id === r.employee_id)
            ?.first_name.toLowerCase()
            .includes(search) ||
          employees
            .find((e) => e.id === r.employee_id)
            ?.last_name.toLowerCase()
            .includes(search),
      )
    }
 
    setFilteredRequests(filteredData)
  }
 
  const handleApprove = async (request: LeaveRequest, comments?: string) => {
    setIsSubmitting(true)
    try {
      // Pass the comments parameter to the updateLeaveRequest function
      const updatedRequest = await updateLeaveRequest(request.id, "approved", comments || "Approved")
 
      // Update local state with optimistic update
      setLeaveRequests((prev) => prev.map((r) => (r.id === request.id ? { ...r, status: "approved" } : r)))
 
      toast({
        title: "Leave request approved",
        description: `You've approved the leave request for ${
          employees.find((e) => e.id === request.employee_id)?.first_name || "employee"
        }.`,
      })
    } catch (error) {
      console.error("Failed to approve leave request:", error)
      toast({
        title: "Error",
        description: "Failed to approve leave request. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }
 
  const handleReject = async (request: LeaveRequest, reason: string) => {
    setIsSubmitting(true)
    try {
      // Pass the reason as comments parameter
      const updatedRequest = await updateLeaveRequest(request.id, "rejected", reason)
 
      // Update local state with optimistic update
      setLeaveRequests((prev) => prev.map((r) => (r.id === request.id ? { ...r, status: "rejected" } : r)))
 
      toast({
        title: "Leave request rejected",
        description: `You've rejected the leave request for ${
          employees.find((e) => e.id === request.employee_id)?.first_name || "employee"
        }.`,
      })
    } catch (error) {
      console.error("Failed to reject leave request:", error)
      toast({
        title: "Error",
        description: "Failed to reject leave request. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }
 
  const handleBulkApprove = async (requestIds: string[]) => {
    setIsSubmitting(true)
    try {
      const results = await Promise.all(
        requestIds.map((id) => {
          const request = leaveRequests.find((r) => r.id === id)
          if (request) {
            return updateLeaveRequest(id, "approved", "Bulk approved")
          }
          return Promise.resolve(null)
        }),
      )
 
      // Update local state with optimistic update
      setLeaveRequests((prev) => prev.map((r) => (requestIds.includes(r.id) ? { ...r, status: "approved" } : r)))
 
      toast({
        title: "Success",
        description: `${requestIds.length} leave requests approved`,
      })
    } catch (error) {
      console.error("Failed to approve some leave requests:", error)
      toast({
        title: "Error",
        description: "Failed to approve some leave requests. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }
 
  const handleBulkReject = async (requestIds: string[], reason: string) => {
    setIsSubmitting(true)
    try {
      const results = await Promise.all(
        requestIds.map((id) => {
          const request = leaveRequests.find((r) => r.id === id)
          if (request) {
            // Pass the reason as comments parameter
            return updateLeaveRequest(id, "rejected", reason)
          }
          return Promise.resolve(null)
        }),
      )
 
      // Update local state with optimistic update
      setLeaveRequests((prev) => prev.map((r) => (requestIds.includes(r.id) ? { ...r, status: "rejected" } : r)))
 
      toast({
        title: "Success",
        description: `${requestIds.length} leave requests rejected`,
      })
    } catch (error) {
      console.error("Failed to reject some leave requests:", error)
      toast({
        title: "Error",
        description: "Failed to reject some leave requests. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }
 
  const handleLeaveRequestSuccess = () => {
    setIsDialogOpen(false)
    loadData()
    toast({
      title: "Leave request submitted",
      description: "Your leave request has been submitted for approval.",
    })
  }
 
  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Leave Management</h1>
            <p className="text-muted-foreground">Manage employee leave requests</p>
          </div>
        </div>
 
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
 
        <div className="flex justify-center">
          <Button onClick={loadData} variant="outline" className="gap-2">
            <RefreshCcw className="h-4 w-4" />
            Retry
          </Button>
        </div>
      </div>
    )
  }
 
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
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
            <LeaveRequestForm leaveTypes={leaveTypes} onSuccess={handleLeaveRequestSuccess} />
          </DialogContent>
        </Dialog>
      </div>
 
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <LeaveBalanceCard balance={leaveBalance || undefined} isLoading={isLoadingBalance} className="col-span-1" />
        <div className="md:col-span-2 space-y-6">
          <LeaveRequestFilters
            filters={filters}
            onFilterChange={setFilters}
            employees={employees}
            departments={departments}
          />
        </div>
      </div>
 
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="all">All Requests</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="approved">Approved</TabsTrigger>
          <TabsTrigger value="rejected">Rejected</TabsTrigger>
        </TabsList>
 
        <TabsContent value="all" className="space-y-4">
          <LeaveRequestTable
            requests={filteredRequests}
            onApprove={handleApprove}
            onReject={handleReject}
            onBulkApprove={handleBulkApprove}
            onBulkReject={handleBulkReject}
            isManager={true}
            isLoading={isLoading}
          />
        </TabsContent>
 
        <TabsContent value="pending" className="space-y-4">
          <LeaveRequestTable
            requests={filteredRequests}
            onApprove={handleApprove}
            onReject={handleReject}
            onBulkApprove={handleBulkApprove}
            onBulkReject={handleBulkReject}
            isManager={true}
            isLoading={isLoading}
          />
        </TabsContent>
 
        <TabsContent value="approved" className="space-y-4">
          <LeaveRequestTable
            requests={filteredRequests}
            onApprove={handleApprove}
            onReject={handleReject}
            onBulkApprove={handleBulkApprove}
            onBulkReject={handleBulkReject}
            isManager={true}
            isLoading={isLoading}
          />
        </TabsContent>
 
        <TabsContent value="rejected" className="space-y-4">
          <LeaveRequestTable
            requests={filteredRequests}
            onApprove={handleApprove}
            onReject={handleReject}
            onBulkApprove={handleBulkApprove}
            onBulkReject={handleBulkReject}
            isManager={true}
            isLoading={isLoading}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}