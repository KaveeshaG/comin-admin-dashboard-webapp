import { notFound } from "next/navigation"
import { EmployeeForm } from "@/components/employees/employee-form"
import { getEmployee } from "@/lib/api/employees"

export default async function EditEmployeePage({
  params,
}: {
  params: { id: string }
}) {
  const employee = await getEmployee(params.id)

  if (!employee) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Edit Employee</h1>
        <p className="text-muted-foreground">Update employee information.</p>
      </div>
      <EmployeeForm employee={employee} />
    </div>
  )
}

