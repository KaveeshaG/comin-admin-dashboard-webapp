"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { CalendarIcon } from "lucide-react"
import { format, differenceInBusinessDays, addDays } from "date-fns"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useToast } from "@/components/ui/use-toast"
import { createLeaveRequest } from "@/lib/api/leave"
import { getEmployees } from "@/lib/api/employees"
import type { LeaveType } from "@/types/employee"
import type { Employee } from "@/types/employee"
import { EmployeeCombobox } from "@/components/employees/employee-combobox"

const leaveRequestSchema = z.object({
  employee_id: z.string({
    required_error: "Please select an employee",
  }),
  leave_type_id: z.string({
    required_error: "Please select a leave type",
  }),
  start_date: z.date({
    required_error: "Start date is required",
  }),
  end_date: z.date({
    required_error: "End date is required",
  }),
  reason: z.string().min(10, "Reason must be at least 10 characters"),
})

interface LeaveRequestFormProps {
  leaveTypes: LeaveType[]
  onSuccess: () => void
}

export function LeaveRequestForm({ leaveTypes, onSuccess }: LeaveRequestFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [employees, setEmployees] = useState<Employee[]>([])
  const { toast } = useToast()

  const form = useForm<z.infer<typeof leaveRequestSchema>>({
    resolver: zodResolver(leaveRequestSchema),
  })

  const { watch } = form
  const startDate = watch("start_date")
  const endDate = watch("end_date")

  useEffect(() => {
    const loadEmployees = async () => {
      try {
        const data = await getEmployees()
        setEmployees(data)
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load employees",
          variant: "destructive",
        })
      }
    }
    loadEmployees()
  }, [toast])

  const calculateDays = () => {
    if (startDate && endDate) {
      return differenceInBusinessDays(addDays(endDate, 1), startDate)
    }
    return 0
  }

  async function onSubmit(data: z.infer<typeof leaveRequestSchema>) {
    setIsLoading(true)
    try {
      await createLeaveRequest({
        employee_id: data.employee_id,
        leave_type_id: data.leave_type_id,
        start_date: data.start_date.toISOString(),
        end_date: data.end_date.toISOString(),
        reason: data.reason,
      })
      toast({
        title: "Success",
        description: "Leave request submitted successfully",
      })
      onSuccess()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit leave request",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const departments = [
    { id: "1", name: "HR" },
    { id: "2", name: "Engineering" },
  ]

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="employee_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Employee</FormLabel>
              <FormControl>
                <EmployeeCombobox
                  employees={employees}
                  value={field.value}
                  onValueChange={field.onChange}
                  departments={departments.reduce(
                    (acc, dept) => {
                      acc[dept.id] = dept.name
                      return acc
                    },
                    {} as Record<string, string>,
                  )}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="leave_type_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Leave Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select leave type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {leaveTypes.map((type) => (
                    <SelectItem key={type.id} value={type.id}>
                      {type.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="start_date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Start Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                      >
                        {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="end_date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>End Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                      >
                        {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) => (startDate ? date < startDate : false)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {startDate && endDate && <FormDescription>Number of working days: {calculateDays()}</FormDescription>}

        <FormField
          control={form.control}
          name="reason"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Reason</FormLabel>
              <FormControl>
                <Textarea placeholder="Please provide a reason for the leave request" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-4">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Submitting..." : "Submit Request"}
          </Button>
        </div>
      </form>
    </Form>
  )
}

