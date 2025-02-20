"use client"

import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form"
import { Switch } from "@/components/ui/switch"
import { getUserProfile } from "@/lib/api/profile"
import type { UpdateProfileDto } from "@/types/profile"

const notificationSchema = z.object({
  notification_preferences: z.object({
    email_notifications: z.boolean(),
    push_notifications: z.boolean(),
    monthly_report: z.boolean(),
    leave_requests: z.boolean(),
    attendance_reminders: z.boolean(),
  }),
})

interface NotificationPreferencesProps {
  onSubmit: (data: UpdateProfileDto) => Promise<void>
  isLoading: boolean
}

export function NotificationPreferences({ onSubmit, isLoading }: NotificationPreferencesProps) {
  const form = useForm<z.infer<typeof notificationSchema>>({
    resolver: zodResolver(notificationSchema),
    defaultValues: {
      notification_preferences: {
        email_notifications: true,
        push_notifications: true,
        monthly_report: true,
        leave_requests: true,
        attendance_reminders: true,
      },
    },
  })

  useEffect(() => {
    loadPreferences()
  }, [])

  const loadPreferences = async () => {
    try {
      const profile = await getUserProfile()
      form.reset({
        notification_preferences: profile.notification_preferences,
      })
    } catch (error) {
      console.error("Failed to load notification preferences:", error)
    }
  }

  const handleSubmit = async (data: z.infer<typeof notificationSchema>) => {
    await onSubmit({
      notification_preferences: {
        email_notifications: data.notification_preferences.email_notifications,
        push_notifications: data.notification_preferences.push_notifications,
        monthly_report: data.notification_preferences.monthly_report,
        leave_requests: data.notification_preferences.leave_requests,
        attendance_reminders: data.notification_preferences.attendance_reminders,
      },
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="notification_preferences.email_notifications"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Email Notifications</FormLabel>
                <FormDescription>Receive notifications via email.</FormDescription>
              </div>
              <FormControl>
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="notification_preferences.push_notifications"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Push Notifications</FormLabel>
                <FormDescription>Receive push notifications in your browser.</FormDescription>
              </div>
              <FormControl>
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="notification_preferences.monthly_report"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Monthly Report</FormLabel>
                <FormDescription>Receive monthly activity reports.</FormDescription>
              </div>
              <FormControl>
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="notification_preferences.leave_requests"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Leave Requests</FormLabel>
                <FormDescription>Get notified about leave request updates.</FormDescription>
              </div>
              <FormControl>
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="notification_preferences.attendance_reminders"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Attendance Reminders</FormLabel>
                <FormDescription>Receive daily attendance reminders.</FormDescription>
              </div>
              <FormControl>
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Saving..." : "Save Preferences"}
        </Button>
      </form>
    </Form>
  )
}

