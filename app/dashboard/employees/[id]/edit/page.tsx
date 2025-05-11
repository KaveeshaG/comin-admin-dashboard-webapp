"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { notFound } from "next/navigation";
import { EmployeeForm } from "@/components/employees/employee-form";
import { getEmployee } from "@/lib/api/employees";
import type { Employee } from "@/types/employee";
import { useToast } from "@/components/ui/use-toast";

export default function EditEmployeePage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const { toast } = useToast();
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch employee data using the ID from the URL
  useEffect(() => {
    async function fetchEmployeeData() {
      try {
        // Try to get from sessionStorage first
        const storedEmployee = sessionStorage.getItem("editEmployee");

        if (storedEmployee) {
          const parsedEmployee = JSON.parse(storedEmployee);
          // Verify this is the correct employee by checking ID
          if (parsedEmployee.id === params.id) {
            console.log(
              "Retrieved employee from sessionStorage:",
              parsedEmployee
            );
            setEmployee(parsedEmployee);
            setLoading(false);
            return;
          }
        }

        // If not in sessionStorage or ID doesn't match, fetch from API
        console.log("Fetching employee from API with ID:", params.id);
        const fetchedEmployee = await getEmployee(params.id);

        if (fetchedEmployee) {
          console.log("Retrieved employee from API:", fetchedEmployee);
          setEmployee(fetchedEmployee);
        } else {
          console.error("Employee not found");
          toast({
            title: "Error",
            description: "Employee not found",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Error fetching employee:", error);
        toast({
          title: "Error",
          description: "Failed to load employee data",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }

    fetchEmployeeData();
  }, [params.id, toast]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-xl">Loading employee data...</div>
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Employee Not Found</h1>
        <p className="text-red-500">
          The requested employee could not be found.
        </p>
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded"
          onClick={() => router.push("/dashboard/employees")}
        >
          Back to Employees
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Edit Employee</h1>
      <p className="text-muted-foreground">
        Update employee information for {employee.first_name}{" "}
        {employee.last_name}.
      </p>
      <EmployeeForm employee={employee} />
    </div>
  );
}
