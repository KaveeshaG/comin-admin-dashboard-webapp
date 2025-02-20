"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Pencil, Trash2, Users } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { TeamMembersDialog } from "./team-members-dialog"
import type { Team, Department } from "@/types/organization"

interface TeamTableProps {
  teams: Team[]
  departments: Department[]
  onEdit: (id: string) => void
  onDelete: (id: string) => void
}

export function TeamTable({ teams, departments, onEdit, onDelete }: TeamTableProps) {
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null)

  const getDepartmentName = (departmentId: string) => {
    const department = departments.find((d) => d.id === departmentId)
    return department?.name || "Unknown Department"
  }

  const departmentsMap = departments.reduce(
    (acc, dept) => {
      acc[dept.id] = dept.name
      return acc
    },
    {} as { [key: string]: string },
  )

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {teams.map((team) => (
              <TableRow key={team.id}>
                <TableCell className="font-medium">{team.name}</TableCell>
                <TableCell>{getDepartmentName(team.department_id)}</TableCell>
                <TableCell>{team.description}</TableCell>
                <TableCell>
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      team.status === "active" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {team.status}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => onEdit(team.id)}>
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setSelectedTeam(team)}>
                        <Users className="mr-2 h-4 w-4" />
                        Manage Members
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600" onClick={() => onDelete(team.id)}>
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {selectedTeam && (
        <TeamMembersDialog
          open={!!selectedTeam}
          onOpenChange={(open) => !open && setSelectedTeam(null)}
          team={selectedTeam}
          departments={departmentsMap}
        />
      )}
    </>
  )
}

