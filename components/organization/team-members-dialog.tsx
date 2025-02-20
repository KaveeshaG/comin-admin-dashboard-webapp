"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { TeamMemberForm } from "./team-member-form"
import { TeamMemberTable } from "./team-member-table"
import { getEmployees } from "@/lib/api/employees"
import { getTeamMembers, createTeamMember, removeTeamMember } from "@/lib/api/team"
import type { Team, TeamMember } from "@/types/organization"
import type { Employee } from "@/types/employee"

interface TeamMembersDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  team: Team
  departments: { [key: string]: string }
}

export function TeamMembersDialog({ open, onOpenChange, team, departments }: TeamMembersDialogProps) {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [members, setMembers] = useState<(TeamMember & { employee: Employee })[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    if (open) {
      loadData()
    }
  }, [open])

  const loadData = async () => {
    try {
      const [empData, memberData] = await Promise.all([getEmployees(), getTeamMembers(team.id)])

      // Combine member data with employee details
      const membersWithDetails = memberData.map((member) => ({
        ...member,
        employee: empData.find((emp) => emp.id === member.user_id)!,
      }))

      setEmployees(empData)
      setMembers(membersWithDetails)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load team data",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddMember = async (data: { user_id: string; role: "member" | "lead" }) => {
    try {
      await createTeamMember(team.id, data)
      loadData()
    } catch (error) {
      throw error // Let the form handle the error
    }
  }

  const handleRemoveMember = async (memberId: string) => {
    try {
      await removeTeamMember(team.id, memberId)
      loadData()
      toast({
        title: "Success",
        description: "Team member removed successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove team member",
        variant: "destructive",
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Manage Team Members - {team.name}</DialogTitle>
          <DialogDescription>Add or remove team members and assign roles.</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="members" className="mt-4">
          <TabsList>
            <TabsTrigger value="members">Current Members</TabsTrigger>
            <TabsTrigger value="add">Add Member</TabsTrigger>
          </TabsList>

          <TabsContent value="members" className="mt-4">
            <TeamMemberTable members={members} onRemove={handleRemoveMember} />
          </TabsContent>

          <TabsContent value="add" className="mt-4">
            <TeamMemberForm
              teamId={team.id}
              employees={employees}
              departments={departments}
              existingMembers={members.map((m) => m.user_id)}
              onSubmit={handleAddMember}
            />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}

