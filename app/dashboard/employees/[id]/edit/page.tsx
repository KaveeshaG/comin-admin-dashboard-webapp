import { notFound } from "next/navigation"
import { EmployeeForm } from "@/components/employees/employee-form"
import { getEmployee } from "@/lib/api/employees"

export default async function EditEmployeePage({
  params,
}: {
  params: { id: string }
}) {
  const id = params.id;

  try {
    const employee = await getEmployee(id);
    
    if (!employee) {
      notFound();
    }

    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Edit Employee</h1>
        <p className="text-muted-foreground">Update employee information.</p>
        <EmployeeForm employee={employee} />
      </div>
    );
  } catch (error) {
    console.error("Error in EditEmployeePage:", error);
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Error Loading Employee</h1>
        <p className="text-red-500">There was an error loading this employee.</p>
      </div>
    );
  }
}