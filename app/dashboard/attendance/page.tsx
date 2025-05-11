"use client";

import { useState, useEffect, useCallback } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { QRScanner } from "@/components/attendance/qr-scanner";
import { AttendanceTable } from "@/components/attendance/attendance-table";
import { AttendanceStats } from "@/components/attendance/attendance-stats";
import { AttendanceSummary } from "@/components/attendance/attendance-summary";
import { AttendanceFilters } from "@/components/attendance/attendance-filters";
import { AttendanceForm } from "@/components/attendance/attendance-form";
import {
  checkIn,
  checkOut,
  getAttendanceStats,
  listAttendance,
} from "@/lib/api/attendance";
import { getEmployees } from "@/lib/api/employees";
import { listDepartments } from "@/lib/api/departments";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/providers/auth-provider";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import type {
  CheckInRequest,
  CheckOutRequest,
  AttendanceFilters as Filters,
  AttendanceRecord,
  AttendanceStats as Stats,
} from "@/types/attendance";
import type { Employee } from "@/types/employee";

export default function AttendancePage() {
  const [activeTab, setActiveTab] = useState("scanner");
  const [manualEntryType, setManualEntryType] = useState<
    "check-in" | "check-out"
  >("check-in");
  const [filters, setFilters] = useState<Filters>({});
  const [stats, setStats] = useState<Stats | null>(null);
  const [attendanceRecords, setAttendanceRecords] = useState<
    AttendanceRecord[]
  >([]);
  const [filteredRecords, setFilteredRecords] = useState<AttendanceRecord[]>(
    []
  );
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [employeeMap, setEmployeeMap] = useState<Record<string, Employee>>({});
  const [departments, setDepartments] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  const loadData = useCallback(async () => {
    if (!user?.organizationId) return;

    setIsLoading(true);
    setError(null);

    try {
      // Load employees and departments first
      const [empsData, deptsData] = await Promise.all([
        getEmployees(),
        listDepartments(user.organizationId),
      ]);

      // Create departments map
      const deptsMap = deptsData.reduce((acc, dept) => {
        acc[dept.id] = dept.name;
        return acc;
      }, {} as { [key: string]: string });

      // Create employee map for quick lookup
      const empMap = empsData.reduce((acc, emp) => {
        acc[emp.id] = emp;
        return acc;
      }, {} as Record<string, Employee>);

      setEmployees(empsData);
      setEmployeeMap(empMap);
      setDepartments(deptsMap);

      // Load attendance stats
      const statsData = await getAttendanceStats();
      setStats(statsData);

      // Load attendance records
      const recordsData = await listAttendance(user.organizationId);

      // Enhance records with employee data
      const enhancedRecords = recordsData.map((record) => {
        const employee = empMap[record.employee_id];
        if (employee) {
          return {
            ...record,
            employee: {
              first_name: employee.first_name,
              last_name: employee.last_name,
              employee_id: employee.employee_id,
              department_id: employee.department_id,
              avatar: employee.avatar,
            },
          };
        }
        return record;
      });

      setAttendanceRecords(enhancedRecords);
      setFilteredRecords(enhancedRecords);
    } catch (error) {
      console.error("Error loading attendance data:", error);
      setError("Failed to load attendance data. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [user?.organizationId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Apply filters client-side
  useEffect(() => {
    if (!attendanceRecords.length) return;

    let result = [...attendanceRecords];

    if (filters.start_date) {
      result = result.filter((record) => {
        const recordDate = new Date(record.date);
        return recordDate >= filters.start_date!;
      });
    }

    if (filters.end_date) {
      result = result.filter((record) => {
        const recordDate = new Date(record.date);
        // Add one day to end_date to include the end date in the range
        const endDatePlusOne = new Date(filters.end_date!);
        endDatePlusOne.setDate(endDatePlusOne.getDate() + 1);
        return recordDate < endDatePlusOne;
      });
    }

    if (filters.department_id) {
      result = result.filter((record) => {
        const employee = employeeMap[record.employee_id];
        return employee?.department_id === filters.department_id;
      });
    }

    if (filters.status) {
      result = result.filter((record) => record.status === filters.status);
    }

    if (filters.employee_id) {
      result = result.filter(
        (record) => record.employee_id === filters.employee_id
      );
    }

    setFilteredRecords(result);
  }, [filters, attendanceRecords, employeeMap]);

  const handleManualCheckIn = async (data: CheckInRequest) => {
    try {
      await checkIn(data);
      toast({
        title: "Success",
        description: "Check-in recorded successfully",
      });

      // Refresh data after successful check-in
      loadData();
    } catch (error: any) {
      console.error("Error during manual check-in:", error);

      // Extract error message from API response if available
      let errorMsg = "Failed to record check-in";

      if (error.response?.data?.error) {
        errorMsg = error.response.data.error;
      } else if (error.message) {
        errorMsg = error.message;
      }

      toast({
        title: "Error",
        description: errorMsg,
        variant: "destructive",
      });
    }
  };

  const handleManualCheckOut = async (data: CheckOutRequest) => {
    try {
      await checkOut(data);
      toast({
        title: "Success",
        description: "Check-out recorded successfully",
      });

      // Refresh data after successful check-out
      loadData();
    } catch (error: any) {
      console.error("Error during manual check-out:", error);

      // Extract error message from API response if available
      let errorMsg = "Failed to record check-out";

      if (error.response?.data?.error) {
        errorMsg = error.response.data.error;
      } else if (error.message) {
        errorMsg = error.message;
      }

      toast({
        title: "Error",
        description: errorMsg,
        variant: "destructive",
      });
    }
  };

  const handleFilterChange = (newFilters: Filters) => {
    setFilters(newFilters);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Attendance</h1>
          <p className="text-muted-foreground">
            Track and manage employee attendance records
          </p>
        </div>

        <AttendanceStats loading={true} />

        <Card>
          <CardHeader>
            <CardTitle>Loading attendance data...</CardTitle>
            <CardDescription>
              Please wait while we fetch the attendance records
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center py-8">
            <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Attendance</h1>
          <p className="text-muted-foreground">
            Track and manage employee attendance records
          </p>
        </div>

        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>

        <div className="flex justify-center">
          <Button onClick={loadData} className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4" />
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Attendance</h1>
        <p className="text-muted-foreground">
          Track and manage employee attendance records
        </p>
      </div>

      {stats && <AttendanceStats stats={stats} />}

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-4"
      >
        <TabsList className="grid grid-cols-3 w-full md:w-auto">
          <TabsTrigger value="scanner">QR Scanner</TabsTrigger>
          <TabsTrigger value="manual">Manual Entry</TabsTrigger>
          {/* <TabsTrigger value="records">Records</TabsTrigger> */}
          <TabsTrigger value="summary">Summary</TabsTrigger>
        </TabsList>

        <TabsContent value="scanner" className="space-y-4">
          <QRScanner />
        </TabsContent>

        <TabsContent value="manual" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Manual Attendance Entry</CardTitle>
              <CardDescription>
                Manually record attendance when QR scanning is not available
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs
                value={manualEntryType}
                onValueChange={(value) =>
                  setManualEntryType(value as "check-in" | "check-out")
                }
              >
                <TabsList className="grid w-full grid-cols-2 mb-4">
                  <TabsTrigger value="check-in">Check In</TabsTrigger>
                  <TabsTrigger value="check-out">Check Out</TabsTrigger>
                </TabsList>

                <TabsContent value="check-in">
                  <AttendanceForm
                    type="check-in"
                    onSubmit={handleManualCheckIn}
                  />
                </TabsContent>

                <TabsContent value="check-out">
                  <AttendanceForm
                    type="check-out"
                    onSubmit={handleManualCheckOut}
                  />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </TabsContent>

        {/* <TabsContent value="records" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Attendance Records</CardTitle>
              <CardDescription>View and filter employee attendance records</CardDescription>
            </CardHeader>
            <CardContent>
              <AttendanceFilters onFilterChange={handleFilterChange} employees={employees} departments={departments} />
              <div className="mt-6">
                <AttendanceTable records={filteredRecords} departments={departments} employeeMap={employeeMap} />
              </div>
            </CardContent>
          </Card>
        </TabsContent> */}

        <TabsContent value="summary" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Attendance Summary</CardTitle>
              <CardDescription>
                View attendance statistics and trends
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AttendanceSummary records={attendanceRecords} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
