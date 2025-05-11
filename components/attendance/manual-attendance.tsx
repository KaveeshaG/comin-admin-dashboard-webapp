"use client"
 
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AttendanceForm } from "./attendance-form"
import { checkIn, checkOut } from "@/lib/api/attendance"
import type { CheckInRequest, CheckOutRequest } from "@/types/attendance"
 
export function ManualAttendance() {
  const [activeTab, setActiveTab] = useState<"check_in" | "check_out">("check_in")
 
  const handleCheckIn = async (data: CheckInRequest) => {
    await checkIn(data)
  }
 
  const handleCheckOut = async (data: CheckOutRequest) => {
    await checkOut(data)
  }
 
  return (
    <Card>
      <CardHeader>
        <CardTitle>Manual Attendance</CardTitle>
        <CardDescription>Manually record attendance with QR code</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "check_in" | "check_out")}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="check_in">Check In</TabsTrigger>
            <TabsTrigger value="check_out">Check Out</TabsTrigger>
          </TabsList>
 
          <TabsContent value="check_in">
            <AttendanceForm type="check_in" onSubmit={handleCheckIn} />
          </TabsContent>
 
          <TabsContent value="check_out">
            <AttendanceForm type="check_out" onSubmit={handleCheckOut} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
 