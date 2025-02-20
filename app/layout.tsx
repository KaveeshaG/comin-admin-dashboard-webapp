import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Toaster } from "@/components/ui/toaster"
import { ThemeProvider } from "@/providers/theme-provider"
import { TenantProvider } from "@/providers/tenant-provider"
import { AuthProvider } from "@/providers/auth-provider"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "HR Admin Dashboard",
  description: "Multi-tenant HR administration dashboard",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <AuthProvider>
            <TenantProvider>
              {children}
              <Toaster />
            </TenantProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

