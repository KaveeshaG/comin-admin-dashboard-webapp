"use client"
 
import { useState } from "react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"
import type { WorkMode } from "@/types/attendance"
 
const checkInSchema = z.object({
  qr_code: z.string().min(1, "QR code is required"),
  location: z.string().min(1, "Location is required"),
  device_info: z.string().min(1, "Device info is required"),
  work_mode: z.enum(["office", "remote", "hybrid"]),
})
 
const checkOutSchema = z.object({
  qr_code: z.string().min(1, "QR code is required"),
  location: z.string().min(1, "Location is required"),
  device_info: z.string().min(1, "Device info is required"),
})
 
type CheckInFormValues = z.infer<typeof checkInSchema>
type CheckOutFormValues = z.infer<typeof checkOutSchema>
 
interface AttendanceFormProps {
  type: "check_in" | "check_out"
  onSubmit: (data: CheckInFormValues | CheckOutFormValues) => Promise<void>
  qrCode?: string
}
 
export function AttendanceForm({ type, onSubmit, qrCode }: AttendanceFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()
 
  const schema = type === "check_in" ? checkInSchema : checkOutSchema
 
  const form = useForm<CheckInFormValues | CheckOutFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      qr_code: qrCode || "",
      location: "",
      device_info: navigator.userAgent || "Unknown device",
      ...(type === "check_in" && { work_mode: "office" as WorkMode }),
    },
  })
 
  const handleSubmit = async (data: CheckInFormValues | CheckOutFormValues) => {
    setIsSubmitting(true)
    try {
      await onSubmit(data)
      form.reset()
      toast({
        title: "Success",
        description: `${type === "check_in" ? "Check-in" : "Check-out"} recorded successfully`,
      })
    } catch (error) {
      console.error(`Error during ${type}:`, error)
      toast({
        title: "Error",
        description: `Failed to record ${type === "check_in" ? "check-in" : "check-out"}`,
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }
 
  return (
    <Card>
      <CardHeader>
        <CardTitle>{type === "check_in" ? "Check In" : "Check Out"}</CardTitle>
        <CardDescription>
          {type === "check_in" ? "Record employee arrival at work" : "Record employee departure from work"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="qr_code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>QR Code</FormLabel>
                  <FormControl>
                    <Input {...field} readOnly={!!qrCode} />
                  </FormControl>
                  <FormDescription>The QR code from the employee badge or profile</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
 
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Office Building A" />
                  </FormControl>
                  <FormDescription>Where the employee is checking in/out from</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
 
            <FormField
              control={form.control}
              name="device_info"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Device Info</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription>Device used for attendance</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
 
            {type === "check_in" && (
              <FormField
                control={form.control}
                name="work_mode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Work Mode</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select work mode" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="office">Office</SelectItem>
                        <SelectItem value="remote">Remote</SelectItem>
                        <SelectItem value="hybrid">Hybrid</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>How the employee will be working today</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
 
            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {type === "check_in" ? "Check In" : "Check Out"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}