import type {
  AttendanceRecord,
  AttendanceStats,
  CheckOutRequest,
  CheckInRequest,
  AttendanceCheck,
} from "@/types/attendance";
import { apiClient } from "@/lib/utils/api-client";
import { parseISO, differenceInHours } from "date-fns";

export async function getAttendanceStats(): Promise<AttendanceStats> {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return {
    total_employees: 150,
    present_today: 130,
    late_today: 10,
    absent_today: 10,
    average_check_in_time: "09:15",
    average_working_hours: 7.5,
    attendance_rate: 93.33,
  };
}

export async function checkIn(data: CheckInRequest): Promise<AttendanceRecord> {
  try {
    return await apiClient(
      "/time/attendance/check-in",
      {
        method: "POST",
        body: JSON.stringify(data),
      },
      "time"
    );
  } catch (error) {
    console.error("Error during check-in:", error);
    throw error;
  }
}

export async function checkOut(
  data: CheckOutRequest
): Promise<AttendanceRecord> {
  try {
    return await apiClient(
      "/time/attendance/check-out",
      {
        method: "POST",
        body: JSON.stringify(data),
      },
      "time"
    );
  } catch (error) {
    console.error("Error during check-out:", error);
    throw error;
  }
}

export async function listAttendance(
  organizationId = "0bd14f74-997d-4384-be62-bb634800c6f8"
): Promise<AttendanceRecord[]> {
  try {
    const path = `/time/organizations/${organizationId}/attendance`;
    return await apiClient<AttendanceRecord[]>(path, {}, "time");
  } catch (error) {
    console.error("Error fetching attendance records:", error);
    throw error;
  }
}

export async function getEmployeeAttendanceStatus(
  employeeId: string
): Promise<AttendanceCheck> {
  try {
    const response = await apiClient(
      `/time/attendance/status/${employeeId}`,
      {},
      "time"
    );
    return response;
  } catch (error) {
    console.error("Error fetching employee attendance status:", error);

    // If the API endpoint doesn't exist yet, return a mock response
    return {
      checkedIn: false,
      checkedOut: false,
    };
  }
}

export function calculateAttendanceSummary(records: AttendanceRecord[]) {
  // Group records by date
  const recordsByDate = records.reduce((acc, record) => {
    const date = record.date.split("T")[0];
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(record);
    return acc;
  }, {} as Record<string, AttendanceRecord[]>);

  // Calculate summary statistics
  const totalDays = Object.keys(recordsByDate).length;

  let totalWorkingHours = 0;
  let daysPresent = 0;
  let daysLate = 0;
  let daysAbsent = 0;
  let earliestCheckIn = Number.POSITIVE_INFINITY;
  let latestCheckOut = 0;

  Object.values(recordsByDate).forEach((dayRecords) => {
    // Check if any record for this day has status present
    const hasPresent = dayRecords.some((r) => r.status === "present");
    const hasLate = dayRecords.some((r) => r.status === "late");

    if (hasPresent) daysPresent++;
    else if (hasLate) daysLate++;
    else daysAbsent++;

    // Calculate working hours for this day
    dayRecords.forEach((record) => {
      if (record.check_in && record.check_out) {
        const checkInTime = parseISO(record.check_in);
        const checkOutTime = parseISO(record.check_out);

        // Calculate hours worked
        const hoursWorked = differenceInHours(checkOutTime, checkInTime);
        if (hoursWorked > 0) {
          totalWorkingHours += hoursWorked;
        }

        // Track earliest check-in and latest check-out
        const checkInHour =
          checkInTime.getHours() + checkInTime.getMinutes() / 60;
        const checkOutHour =
          checkOutTime.getHours() + checkOutTime.getMinutes() / 60;

        if (checkInHour < earliestCheckIn) earliestCheckIn = checkInHour;
        if (checkOutHour > latestCheckOut) latestCheckOut = checkOutHour;
      }
    });
  });

  // Format earliest check-in and latest check-out
  const formatTimeFromHours = (hours: number) => {
    if (hours === Number.POSITIVE_INFINITY || hours === 0) return "N/A";
    const h = Math.floor(hours);
    const m = Math.round((hours - h) * 60);
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
  };

  return {
    totalDays,
    daysPresent,
    daysLate,
    daysAbsent,
    attendanceRate:
      totalDays > 0
        ? (((daysPresent + daysLate) / totalDays) * 100).toFixed(1)
        : "0",
    averageWorkingHours:
      daysPresent > 0 ? (totalWorkingHours / daysPresent).toFixed(1) : "0",
    earliestCheckIn: formatTimeFromHours(earliestCheckIn),
    latestCheckOut: formatTimeFromHours(latestCheckOut),
  };
}
