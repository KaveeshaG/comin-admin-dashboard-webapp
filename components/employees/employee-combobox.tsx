"use client"

import * as React from "react"
import { ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { Employee } from "@/types/employee"

interface EmployeeComboboxProps {
  employees: Employee[]
  value?: string
  onValueChange: (value: string) => void
  departments: { [key: string]: string }
}

export function EmployeeCombobox({ employees, value, onValueChange, departments }: EmployeeComboboxProps) {
  const [open, setOpen] = React.useState(false)
  const [searchQuery, setSearchQuery] = React.useState("")

  const groupedEmployees = React.useMemo(() => {
    return employees.reduce(
      (acc, employee) => {
        const deptName = departments[employee.department_id] || "Other"
        if (!acc[deptName]) {
          acc[deptName] = []
        }
        acc[deptName].push(employee)
        return acc
      },
      {} as Record<string, Employee[]>,
    )
  }, [employees, departments])

  const filterEmployees = (query: string) => {
    const searchTerms = query.toLowerCase().split(" ")
    return (employee: Employee) => {
      const searchString =
        `${employee.first_name} ${employee.last_name} ${employee.email} ${employee.employee_id}`.toLowerCase()
      return searchTerms.every((term) => searchString.includes(term))
    }
  }

  const selectedEmployee = employees.find((emp) => emp.id === value)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between">
          {selectedEmployee ? (
            <span>
              {selectedEmployee.first_name} {selectedEmployee.last_name} ({selectedEmployee.employee_id})
            </span>
          ) : (
            "Select employee..."
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0">
        <Command>
          <CommandInput placeholder="Search employees..." value={searchQuery} onValueChange={setSearchQuery} />
          <CommandList>
            <CommandEmpty>No employee found.</CommandEmpty>
            <ScrollArea className="h-[300px]">
              {Object.entries(groupedEmployees).map(([deptName, deptEmployees]) => {
                const filteredEmployees = deptEmployees.filter(filterEmployees(searchQuery))
                if (filteredEmployees.length === 0) return null

                return (
                  <CommandGroup key={deptName} heading={deptName}>
                    {filteredEmployees.map((employee) => (
                      <CommandItem
                        key={employee.id}
                        value={employee.id}
                        onSelect={(currentValue) => {
                          onValueChange(currentValue)
                          setOpen(false)
                        }}
                      >
                        <div className="options cursor-pointer">
                          <div className="flex flex-col">
                            <span>
                              {employee.first_name} {employee.last_name}
                            </span>
                            <span className="text-xs">
                              {employee.employee_id} • {employee.email}
                            </span>
                          </div>
                        </div>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                )
              })}
            </ScrollArea>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

