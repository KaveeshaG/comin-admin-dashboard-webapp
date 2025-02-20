"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import type { Team, Department } from "@/types/organization"

const teamSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  department_id: z.string({
    required_error: "Please select a department",
  }),
  description: z.string().optional(),
})

type TeamFormValues = z.infer<typeof teamSchema>

interface TeamFormProps {
  team?: Team
  organizationId: string
  departments: Department[]
  onSubmit: (data: TeamFormValues & { organization_id: string }) => Promise<void>
}

export function TeamForm({ team, organizationId, departments, onSubmit }: TeamFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const form = useForm<TeamFormValues>({
    resolver: zodResolver(teamSchema),
    defaultValues: team || {
      name: "",
      department_id: "",
      description: "",
    },
  })

  async function handleSubmit(data: TeamFormValues) {
    setIsLoading(true)
    try {
      await onSubmit({ ...data, organization_id: organizationId })
      toast({
        title: "Success",
        description: `Team ${team ? "updated" : "created"} successfully`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${team ? "update" : "create"} team`,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Team Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter team name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="department_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Department</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a department" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {departments.map((department) => (
                    <SelectItem key={department.id} value={department.id}>
                      {department.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Enter team description" className="resize-none" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-4">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : team ? "Update Team" : "Create Team"}
          </Button>
        </div>
      </form>
    </Form>
  )
}

