"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import type { Organization } from "@/types/organization"

const organizationSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  domain: z.string().url("Must be a valid URL").optional(),
  logo_url: z.string().url("Must be a valid URL").optional(),
  description: z.string().min(10, "Description must be at least 10 characters"),
  industry: z.string().min(2, "Industry is required"),
  size: z.string().min(1, "Size is required"),
  settings: z.object({
    theme: z.enum(["light", "dark"]).default("light"),
    allowed_domains: z.array(z.string()).default([]),
    max_users: z.number().min(1).default(50),
    features: z.array(z.string()).default(["basic"]),
  }),
})

type OrganizationFormValues = z.infer<typeof organizationSchema>

interface OrganizationFormProps {
  organization?: Organization
  onSubmit: (data: OrganizationFormValues) => Promise<void>
}

const INDUSTRY_OPTIONS = ["Technology", "Healthcare", "Finance", "Education", "Manufacturing", "Retail", "Other"]

const SIZE_OPTIONS = ["1-10", "11-50", "51-200", "201-500", "501-1000", "1000+"]

export function OrganizationForm({ organization, onSubmit }: OrganizationFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const form = useForm<OrganizationFormValues>({
    resolver: zodResolver(organizationSchema),
    defaultValues: organization || {
      name: "",
      domain: "",
      logo_url: "",
      description: "",
      industry: "",
      size: "",
      settings: {
        theme: "light",
        allowed_domains: [],
        max_users: 50,
        features: ["basic"],
      },
    },
  })

  async function handleSubmit(data: OrganizationFormValues) {
    setIsLoading(true)
    try {
      await onSubmit(data)
      toast({
        title: "Success",
        description: `Organization ${organization ? "updated" : "created"} successfully`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${organization ? "update" : "create"} organization`,
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
              <FormLabel>Organization Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter organization name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="domain"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Domain</FormLabel>
              <FormControl>
                <Input placeholder="https://example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="logo_url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Logo URL</FormLabel>
              <FormControl>
                <Input placeholder="https://example.com/logo.png" {...field} />
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
                <Textarea placeholder="Enter organization description" className="resize-none" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="industry"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Industry</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select industry" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {INDUSTRY_OPTIONS.map((industry) => (
                    <SelectItem key={industry} value={industry}>
                      {industry}
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
          name="size"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Organization Size</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select size" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {SIZE_OPTIONS.map((size) => (
                    <SelectItem key={size} value={size}>
                      {size}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-4">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : organization ? "Update Organization" : "Create Organization"}
          </Button>
        </div>
      </form>
    </Form>
  )
}

