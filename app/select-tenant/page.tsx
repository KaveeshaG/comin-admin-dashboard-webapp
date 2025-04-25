"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Building2, Loader2, Plus, Users, Briefcase } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/components/ui/use-toast"
import { useTenantContext } from "@/providers/tenant-provider"
import { LoadingSpinner } from "@/components/loading-spinner"
import { StatusBadge } from "@/components/organization/status-badge"
import type { Organization } from "@/types/organization"
import { mockOrganizations, mockDepartments, mockTeams } from "@/lib/mock-data"

interface OrganizationWithCounts extends Organization {
  departmentCount: number
  teamCount: number
}

export default function SelectTenantPage() {
  const [organizations, setOrganizations] = useState<OrganizationWithCounts[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSelecting, setIsSelecting] = useState<string | null>(null)
  const router = useRouter()
  const { setCurrentTenant } = useTenantContext()
  const { toast } = useToast()

  useEffect(() => {
    loadOrganizations()
  }, [])

  const loadOrganizations = async () => {
    try {
      // Simulate API call with mock data
      const orgsWithCounts = mockOrganizations.map((org) => ({
        ...org,
        departmentCount: mockDepartments.filter((d) => d.organization_id === org.id).length,
        teamCount: mockTeams.filter((t) => t.organization_id === org.id).length,
      }))
      setOrganizations(orgsWithCounts)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load organizations",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSelectTenant = async (organization: Organization) => {
    setIsSelecting(organization.id)
    try {
      // Set the tenant in context and cookies
      await setCurrentTenant(organization)
      // Show success message
      toast({
        title: "Organization Selected",
        description: `Switched to ${organization.name}`,
      })
      // Redirect to dashboard
      router.push("/dashboard")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to select organization",
        variant: "destructive",
      })
      setIsSelecting(null)
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <div className="container mx-auto flex min-h-screen max-w-6xl flex-col items-center justify-center py-10">
      <div className="mx-auto flex w-full flex-col items-center space-y-6">
        <div className="flex flex-col items-center space-y-2 text-center">
          <Building2 className="h-12 w-12" />
          <h1 className="text-2xl font-bold">Select Organization</h1>
          <p className="text-muted-foreground">Choose an organization to continue to the dashboard</p>
        </div>

        {organizations.length === 0 ? (
          <Card className="w-full">
            <CardHeader>
              <CardTitle>No Organizations Found</CardTitle>
              <CardDescription>You don't have access to any organizations yet.</CardDescription>
            </CardHeader>
            <CardFooter>
              <Button className="w-full" variant="outline">
                <Plus className="mr-2 h-4 w-4" />
                Create Organization
              </Button>
            </CardFooter>
          </Card>
        ) : (
          <div className="grid w-full gap-4 md:grid-cols-2">
            {organizations.map((org) => (
              <Card key={org.id} className="w-full">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle>{org.name}</CardTitle>
                      <CardDescription>{org.domain}</CardDescription>
                    </div>
                    <StatusBadge status={org.status} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4 text-sm">
                      <Briefcase className="h-4 w-4 text-muted-foreground" />
                      <span>{org.industry}</span>
                      <Separator orientation="vertical" className="h-4" />
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span>{org.size}</span>
                    </div>
                    <Separator />
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <p className="text-sm font-medium">Departments</p>
                        <p className="text-2xl font-bold">{org.departmentCount}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium">Teams</p>
                        <p className="text-2xl font-bold">{org.teamCount}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" onClick={() => handleSelectTenant(org)} disabled={isSelecting === org.id}>
                    {isSelecting === org.id && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Select Organization
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

