"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { EmployeeCombobox } from "@/components/employees/employee-combobox"
import type { Employee } from "@/types/employee"

const teamMemberSchema = z.object({
  user_id: z.string({
    required_error: "Please select an employee",
  }),
  role: z.enum(["member", "lead"], {
    required_error: "Please select a role",
  }),
})

type TeamMemberFormValues = z.infer<typeof teamMemberSchema>

interface TeamMemberFormProps {
  teamId: string
  employees: Employee[]
  departments: { [key: string]: string }
  existingMembers: string[] // Array of existing member IDs to exclude
  onSubmit: (data: TeamMemberFormValues) => Promise<void>
}

export function TeamMemberForm({ teamId, employees, departments, existingMembers, onSubmit }: TeamMemberFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const form = useForm<TeamMemberFormValues>({
    resolver: zodResolver(teamMemberSchema),
    defaultValues: {
      role: "member",
    },
  })

  const availableEmployees = employees.filter((emp) => !existingMembers.includes(emp.id))

  async function handleSubmit(data: TeamMemberFormValues) {
    setIsLoading(true)
    try {
      const response = await onSubmit(data);
      form.reset();
      toast({
        title: "Success",
        description: "Team member added successfully",
      });
    } catch (error) {
      console.error("Error details:", error);
      toast({
        title: "Error",
        description: "Failed to add team member",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="user_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Employee</FormLabel>
              <FormControl>
                <EmployeeCombobox
                  employees={availableEmployees}
                  value={field.value}
                  onValueChange={field.onChange}
                  departments={departments}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Role</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="member">Member</SelectItem>
                  <SelectItem value="lead">Team Lead</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Adding..." : "Add Member"}
        </Button>
      </form>
    </Form>
  )
}

