"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import type { Department } from "@/types/organization"

const departmentSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().optional(),
})

type DepartmentFormValues = z.infer<typeof departmentSchema>

interface DepartmentFormProps {
  department?: Department
  organizationId: string
  onSubmit: (data: DepartmentFormValues & { organization_id: string }) => Promise<void>
}

export function DepartmentForm({ department, organizationId, onSubmit }: DepartmentFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const form = useForm<DepartmentFormValues>({
    resolver: zodResolver(departmentSchema),
    defaultValues: department || {
      name: "",
      description: "",
    },
  })

  async function handleSubmit(data: DepartmentFormValues) {
    setIsLoading(true)
    try {
      await onSubmit({ ...data, organization_id: organizationId })
      toast({
        title: "Success",
        description: `Department ${department ? "updated" : "created"} successfully`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${department ? "update" : "create"} department`,
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
              <FormLabel>Department Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter department name" {...field} />
              </FormControl>
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
                <Textarea placeholder="Enter department description" className="resize-none" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-4">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : department ? "Update Department" : "Create Department"}
          </Button>
        </div>
      </form>
    </Form>
  )
}

