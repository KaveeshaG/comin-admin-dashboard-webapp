import { EmployeeForm } from "@/components/employees/employee-form"

export default function NewEmployeePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Add New Employee</h1>
        <p className="text-muted-foreground">Add a new employee to your organization.</p>
      </div>
      <EmployeeForm />
    </div>
  )
}

