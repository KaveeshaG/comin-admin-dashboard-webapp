"use client"
 
import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
import QRCode from "qrcode"
 
interface EmployeeQRModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  employeeName: string
  employeeId: string
  qrCodeData?: string
}
 
export function EmployeeQRModal({ open, onOpenChange, employeeName, employeeId, qrCodeData }: EmployeeQRModalProps) {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("")
  const [isGenerating, setIsGenerating] = useState(false)
 
  // Use the provided qrCodeData if available, otherwise use the employee ID
  const qrContent = qrCodeData || employeeId
 
  useEffect(() => {
    if (open && qrContent) {
      setIsGenerating(true)
 
      // Generate QR code with just the ID or qrCodeData, not a URL
      QRCode.toDataURL(qrContent, {
        width: 300,
        margin: 2,
        color: {
          dark: "#000000",
          light: "#ffffff",
        },
      })
        .then((url) => {
          setQrCodeUrl(url)
          setIsGenerating(false)
        })
        .catch((err) => {
          console.error("Error generating QR code:", err)
          setIsGenerating(false)
        })
    }
  }, [open, qrContent])
 
  const handleDownload = () => {
    if (qrCodeUrl) {
      const link = document.createElement("a")
      link.href = qrCodeUrl
      link.download = `${employeeName.replace(/\s+/g, "_")}_qr_code.png`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }
 
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>QR Code for {employeeName}</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center justify-center space-y-4 p-4">
          <div className="rounded-lg border bg-white p-2 shadow-sm">
            {isGenerating ? (
              <div className="flex h-[300px] w-[300px] items-center justify-center">
                <p className="text-muted-foreground">Generating QR code...</p>
              </div>
            ) : qrCodeUrl ? (
              <img
                src={qrCodeUrl || "/placeholder.svg"}
                alt={`QR Code for ${employeeName}`}
                className="h-[300px] w-[300px]"
              />
            ) : (
              <div className="flex h-[300px] w-[300px] items-center justify-center">
                <p className="text-muted-foreground">Failed to generate QR code</p>
              </div>
            )}
          </div>
 
          <div className="text-center w-full">
            <p className="text-sm text-muted-foreground mb-2">QR Code contains employee ID: {qrContent}</p>
            <p className="text-xs text-muted-foreground">Use this QR code for attendance check-in and check-out</p>
          </div>
 
          <Button onClick={handleDownload} className="w-full" disabled={!qrCodeUrl || isGenerating}>
            <Download className="mr-2 h-4 w-4" />
            Download QR Code
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
 