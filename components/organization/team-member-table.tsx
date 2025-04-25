"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Trash2 } from "lucide-react"
import type { TeamMember } from "@/types/organization"
import type { Employee } from "@/types/employee"

interface TeamMemberTableProps {
  members: (TeamMember & { employee: Employee })[]
  onRemove: (memberId: string) => Promise<void>
}

export function TeamMemberTable({ members, onRemove }: TeamMemberTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Employee</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Department</TableHead>
            <TableHead>Joined</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {members.map((member) => (
            <TableRow key={member.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={member.employee?.avatar}
                      alt={`${member.employee?.first_name} ${member.employee?.last_name}`}
                    />
                    <AvatarFallback>
                      {member.employee?.first_name?.[0]}
                      {member.employee?.last_name?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">
                      {member.employee?.first_name} {member.employee?.last_name}
                    </div>
                    <div className="text-sm text-muted-foreground">{member.employee?.email}</div>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant={member.role === "lead" ? "default" : "secondary"}>
                  {member.role === "lead" ? "Team Lead" : "Member"}
                </Badge>
              </TableCell>
              <TableCell>{member.employee.department_id || "No Department"}</TableCell>
              <TableCell>{new Date(member.joined_at).toLocaleDateString()}</TableCell>
              <TableCell className="text-right">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  onClick={() => onRemove(member.id)}
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">Remove member</span>
                </Button>
              </TableCell>
            </TableRow>
          ))}
          {members.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="text-center text-muted-foreground">
                No team members found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}

