"use client"

import { useState, useEffect } from "react"
import { Plus } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useToast } from "@/components/ui/use-toast"
import { OrganizationForm } from "@/components/organization/organization-form"
import { DepartmentForm } from "@/components/organization/department-form"
import { TeamForm } from "@/components/organization/team-form"
import { OrganizationTable } from "@/components/organization/organization-table"
import { DepartmentTable } from "@/components/organization/department-table"
import { TeamTable } from "@/components/organization/team-table"
import { useAuth } from "@/providers/auth-provider"
import { listOrganizations, createOrganization } from "@/lib/api/organization"
import { listDepartments, createDepartment } from "@/lib/api/department"
import { listTeams, createTeam } from "@/lib/api/team"
import type {
  Organization,
  Department,
  Team,
  CreateOrganizationDto,
  CreateDepartmentDto,
  CreateTeamDto,
} from "@/types/organization"

export default function OrganizationPage() {
  const [organizations, setOrganizations] = useState<Organization[]>([])
  const [departments, setDepartments] = useState<Department[]>([])
  const [teams, setTeams] = useState<Team[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("organizations")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const { toast } = useToast()
  const { user } = useAuth()

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    if (!user?.organizationId) return

    try {
      const [orgs, deps, tms] = await Promise.all([
        listOrganizations(),
        listDepartments(user.organizationId),
        listTeams(user.organizationId),
      ])

      setOrganizations(orgs)
      setDepartments(deps)
      setTeams(tms)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load organization data",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateOrganization = async (data: CreateOrganizationDto) => {
    try {
      await createOrganization(data)
      setIsDialogOpen(false)
      loadData()
      toast({
        title: "Success",
        description: "Organization created successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create organization",
        variant: "destructive",
      })
    }
  }

  const handleCreateDepartment = async (data: CreateDepartmentDto) => {
    if (!user?.organizationId) return

    try {
      await createDepartment(user.organizationId, data)
      setIsDialogOpen(false)
      loadData()
      toast({
        title: "Success",
        description: "Department created successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create department",
        variant: "destructive",
      })
    }
  }

  const handleCreateTeam = async (data: CreateTeamDto) => {
    if (!user?.organizationId) return

    try {
      await createTeam(user.organizationId, data)
      setIsDialogOpen(false)
      loadData()
      toast({
        title: "Success",
        description: "Team created successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create team",
        variant: "destructive",
      })
    }
  }

  const handleDelete = async (type: string, id: string) => {
    // Implement delete functionality
    toast({
      title: "Not Implemented",
      description: `Delete ${type} functionality is not yet implemented`,
    })
  }

  const handleEdit = async (type: string, id: string) => {
    // Implement edit functionality
    toast({
      title: "Not Implemented",
      description: `Edit ${type} functionality is not yet implemented`,
    })
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Organization Management</h1>
          <p className="text-muted-foreground">Manage your organizations, departments, and teams</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="organizations">Organizations</TabsTrigger>
            <TabsTrigger value="departments">Departments</TabsTrigger>
            <TabsTrigger value="teams">Teams</TabsTrigger>
          </TabsList>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create {activeTab.slice(0, -1)}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>New {activeTab.slice(0, -1)}</DialogTitle>
                <DialogDescription>
                  Create a new {activeTab.slice(0, -1).toLowerCase()} in your organization.
                </DialogDescription>
              </DialogHeader>
              {activeTab === "organizations" && <OrganizationForm onSubmit={handleCreateOrganization} />}
              {activeTab === "departments" && user?.organizationId && (
                <DepartmentForm organizationId={user.organizationId} onSubmit={handleCreateDepartment} />
              )}
              {activeTab === "teams" && user?.organizationId && (
                <TeamForm organizationId={user.organizationId} departments={departments} onSubmit={handleCreateTeam} />
              )}
            </DialogContent>
          </Dialog>
        </div>

        <TabsContent value="organizations" className="mt-4">
          <OrganizationTable
            organizations={organizations}
            onEdit={(id) => handleEdit("organization", id)}
            onDelete={(id) => handleDelete("organization", id)}
          />
        </TabsContent>

        <TabsContent value="departments" className="mt-4">
          <DepartmentTable
            departments={departments}
            onEdit={(id) => handleEdit("department", id)}
            onDelete={(id) => handleDelete("department", id)}
          />
        </TabsContent>

        <TabsContent value="teams" className="mt-4">
          <TeamTable
            teams={teams}
            departments={departments}
            onEdit={(id) => handleEdit("team", id)}
            onDelete={(id) => handleDelete("team", id)}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}

