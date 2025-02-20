"use client"

import { useState } from "react"
import { format } from "date-fns"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { CheckCircle2, XCircle } from "lucide-react"
import type { LeaveRequest } from "@/types/leave"

interface LeaveRequestTableProps {
  requests: LeaveRequest[]
  onApprove: (request: LeaveRequest) => void
  onReject: (request: LeaveRequest) => void
  onBulkApprove: (requestIds: string[]) => void
  onBulkReject: (requestIds: string[]) => void
  isManager?: boolean
}

export function LeaveRequestTable({
  requests,
  onApprove,
  onReject,
  onBulkApprove,
  onBulkReject,
  isManager = false,
}: LeaveRequestTableProps) {
  const [loading, setLoading] = useState<string | null>(null)
  const [selectedRequests, setSelectedRequests] = useState<Set<string>>(new Set())

  const getStatusBadge = (status: LeaveRequest["status"]) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-500">Approved</Badge>
      case "rejected":
        return <Badge variant="destructive">Rejected</Badge>
      default:
        return <Badge variant="secondary">Pending</Badge>
    }
  }

  const handleAction = async (request: LeaveRequest, action: "approve" | "reject") => {
    setLoading(request.id)
    try {
      if (action === "approve") {
        await onApprove(request)
      } else {
        await onReject(request)
      }
    } finally {
      setLoading(null)
    }
  }

  const toggleAll = () => {
    const pendingRequests = requests.filter((r) => r.status === "pending")
    if (selectedRequests.size === pendingRequests.length) {
      setSelectedRequests(new Set())
    } else {
      setSelectedRequests(new Set(pendingRequests.map((r) => r.id)))
    }
  }

  const toggleRequest = (requestId: string) => {
    const newSelected = new Set(selectedRequests)
    if (newSelected.has(requestId)) {
      newSelected.delete(requestId)
    } else {
      newSelected.add(requestId)
    }
    setSelectedRequests(newSelected)
  }

  const pendingRequests = requests.filter((r) => r.status === "pending")
  const showBulkActions = selectedRequests.size > 0

  return (
    <>
      {showBulkActions && (
        <div className="mb-4 flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => onBulkApprove(Array.from(selectedRequests))}>
            <CheckCircle2 className="mr-2 h-4 w-4" />
            Approve Selected ({selectedRequests.size})
          </Button>
          <Button variant="outline" size="sm" onClick={() => onBulkReject(Array.from(selectedRequests))}>
            <XCircle className="mr-2 h-4 w-4" />
            Reject Selected ({selectedRequests.size})
          </Button>
        </div>
      )}

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {isManager && (
                <TableHead className="w-[50px]">
                  <Checkbox
                    checked={selectedRequests.size === pendingRequests.length && pendingRequests.length > 0}
                    onCheckedChange={toggleAll}
                    aria-label="Select all pending requests"
                  />
                </TableHead>
              )}
              <TableHead>Employee</TableHead>
              <TableHead>Leave Type</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Days</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Reason</TableHead>
              {isManager && <TableHead className="text-right">Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {requests.map((request) => (
              <TableRow key={request.id}>
                {isManager && (
                  <TableCell>
                    {request.status === "pending" && (
                      <Checkbox
                        checked={selectedRequests.has(request.id)}
                        onCheckedChange={() => toggleRequest(request.id)}
                        aria-label={`Select request from ${request.employee.first_name}`}
                      />
                    )}
                  </TableCell>
                )}
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={request.employee.avatar}
                        alt={`${request.employee.first_name} ${request.employee.last_name}`}
                      />
                      <AvatarFallback>
                        {request.employee.first_name[0]}
                        {request.employee.last_name[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">
                        {request.employee.first_name} {request.employee.last_name}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>Annual Leave</TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div className="text-sm">{format(new Date(request.start_date), "MMM d, yyyy")}</div>
                    <div className="text-sm text-muted-foreground">
                      to {format(new Date(request.end_date), "MMM d, yyyy")}
                    </div>
                  </div>
                </TableCell>
                <TableCell>{request.days}</TableCell>
                <TableCell>{getStatusBadge(request.status)}</TableCell>
                <TableCell>{request.reason}</TableCell>
                {isManager && (
                  <TableCell className="text-right">
                    {request.status === "pending" && (
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-green-600"
                          onClick={() => handleAction(request, "approve")}
                          disabled={loading === request.id}
                        >
                          <CheckCircle2 className="mr-2 h-4 w-4" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-red-600"
                          onClick={() => handleAction(request, "reject")}
                          disabled={loading === request.id}
                        >
                          <XCircle className="mr-2 h-4 w-4" />
                          Reject
                        </Button>
                      </div>
                    )}
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  )
}

