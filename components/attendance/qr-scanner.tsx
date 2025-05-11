"use client"
 
import { useState, useEffect, useCallback, useRef } from "react"
import { Html5Qrcode } from "html5-qrcode"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Scan, AlertCircle } from "lucide-react"
import { AttendanceForm } from "./attendance-form"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { checkIn, checkOut } from "@/lib/api/attendance"
import { useToast } from "@/components/ui/use-toast"
import type { CheckInRequest, CheckOutRequest } from "@/types/attendance"
 
export function QRScanner() {
  const [isScanning, setIsScanning] = useState(false)
  const [lastError, setLastError] = useState<string>("")
  const [scannedQRCode, setScannedQRCode] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<"check_in" | "check_out">("check_in")
  const scannerRef = useRef<Html5Qrcode | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()
 
  const stopScanner = useCallback(async () => {
    if (scannerRef.current?.isScanning) {
      await scannerRef.current.stop()
      scannerRef.current = null
    }
    setIsScanning(false)
  }, [])
 
  useEffect(() => {
    // Cleanup on unmount
    return () => {
      stopScanner()
    }
  }, [stopScanner])
 
  const startScanning = async () => {
    try {
      setLastError("")
      setIsScanning(true)
      setScannedQRCode(null)
 
      // Wait for next tick to ensure DOM is ready
      await new Promise((resolve) => setTimeout(resolve, 0))
 
      const container = document.getElementById("qr-scanner-container")
      if (!container) {
        throw new Error("Scanner container not found")
      }
 
      scannerRef.current = new Html5Qrcode("qr-scanner-container")
 
      await scannerRef.current.start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1,
        },
        (decodedText) => {
          setScannedQRCode(decodedText)
          stopScanner()
        },
        (errorMessage) => {
          if (errorMessage.includes("No QR code found")) {
            return
          }
          console.warn("Scanner warning:", errorMessage)
        },
      )
    } catch (error) {
      console.error("Scanner error:", error)
      setLastError(error instanceof Error ? error.message : "Failed to start scanner")
      setIsScanning(false)
      toast({
        title: "Scan Error",
        description: error instanceof Error ? error.message : "Failed to start scanner",
        variant: "destructive",
      })
    }
  }
 
  const handleCheckIn = async (data: CheckInRequest) => {
    try {
      await checkIn(data)
      toast({
        title: "Success",
        description: "Check-in recorded successfully",
      })
      setScannedQRCode(null)
    } catch (error) {
      console.error("Error during check-in:", error)
      toast({
        title: "Error",
        description: "Failed to record check-in",
        variant: "destructive",
      })
      throw error
    }
  }
 
  const handleCheckOut = async (data: CheckOutRequest) => {
    try {
      await checkOut(data)
      toast({
        title: "Success",
        description: "Check-out recorded successfully",
      })
      setScannedQRCode(null)
    } catch (error) {
      console.error("Error during check-out:", error)
      toast({
        title: "Error",
        description: "Failed to record check-out",
        variant: "destructive",
      })
      throw error
    }
  }
 
  return (
    <Card>
      <CardHeader>
        <CardTitle>QR Code Scanner</CardTitle>
        <CardDescription>Scan employee QR code to mark attendance</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {scannedQRCode ? (
          <div className="space-y-4">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>QR Code Scanned</AlertTitle>
              <AlertDescription>QR code scanned successfully. Please complete the form below.</AlertDescription>
            </Alert>
 
            <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "check_in" | "check_out")}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="check_in">Check In</TabsTrigger>
                <TabsTrigger value="check_out">Check Out</TabsTrigger>
              </TabsList>
 
              <TabsContent value="check_in">
                <AttendanceForm type="check_in" onSubmit={handleCheckIn} qrCode={scannedQRCode} />
              </TabsContent>
 
              <TabsContent value="check_out">
                <AttendanceForm type="check_out" onSubmit={handleCheckOut} qrCode={scannedQRCode} />
              </TabsContent>
            </Tabs>
 
            <Button variant="outline" onClick={() => setScannedQRCode(null)} className="w-full">
              Scan Another QR Code
            </Button>
          </div>
        ) : !isScanning ? (
          <Button onClick={startScanning} className="w-full">
            <Scan className="mr-2 h-4 w-4" />
            Start Scanning
          </Button>
        ) : (
          <div className="space-y-4">
            <div className="relative aspect-square max-w-sm mx-auto overflow-hidden rounded-lg bg-black">
              {/* Scanner container */}
              <div
                id="qr-scanner-container"
                ref={containerRef}
                className="w-full h-full relative"
                style={{ minHeight: "300px" }}
              />
 
              {/* Scanning overlay */}
              <div className="absolute inset-0 z-10 pointer-events-none">
                <div className="absolute inset-0 border-2 border-primary opacity-50" />
                <div className="absolute top-1/2 left-1/2 w-48 h-48 -translate-x-1/2 -translate-y-1/2 border-2 border-primary">
                  <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-primary" />
                  <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-primary" />
                  <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-primary" />
                  <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-primary" />
                </div>
              </div>
            </div>
 
            {/* Scanning feedback */}
            <Alert variant={lastError ? "destructive" : "default"}>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>{lastError ? "Scanning Error" : "Scanning in progress"}</AlertTitle>
              <AlertDescription>{lastError || "Position the QR code within the frame to scan"}</AlertDescription>
            </Alert>
 
            {/* Debug info in development */}
            {process.env.NODE_ENV === "development" && lastError && (
              <Alert variant="default" className="text-xs">
                <AlertTitle>Debug Info</AlertTitle>
                <AlertDescription className="font-mono break-all">{lastError}</AlertDescription>
              </Alert>
            )}
 
            <Button variant="outline" onClick={stopScanner} className="w-full">
              Cancel Scanning
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
 