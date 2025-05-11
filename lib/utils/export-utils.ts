import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"
import type { TimeEntry } from "@/types/timesheet"
import type { EmployeeMetrics, AttendanceMetrics, LeaveMetrics, CostMetrics } from "@/types/reports"
import { format } from "date-fns"
 
type ReportData = EmployeeMetrics | AttendanceMetrics | LeaveMetrics | CostMetrics | TimeEntry[]
 
export function exportToCSV(data: ReportData, reportType = "timesheet"): string {
  let headers: string[] = []
  let rows: any[][] = []
 
  try {
    switch (reportType) {
      case "employees":
        const empData = data as EmployeeMetrics
        headers = ["Department", "Count", "Gender Distribution", "Age Range", "Count"]
 
        // Department data
        rows.push(...(empData.departments || []).map((dept) => [dept.name, dept.count, "", "", ""]))
 
        // Add a blank row
        rows.push(["", "", "", "", ""])
 
        // Gender distribution
        rows.push(...(empData.gender_distribution || []).map((gender) => ["", "", gender.gender, "", gender.count]))
 
        // Age distribution
        rows.push(...(empData.age_distribution || []).map((age) => ["", "", "", age.range, age.count]))
        break
 
      case "attendance":
        const attData = data as AttendanceMetrics
        headers = ["Date", "Present", "Absent", "Late", "Department", "Attendance Rate"]
        rows = (attData.attendance_trend || []).map((trend) => [
          trend.date,
          trend.present,
          trend.absent,
          trend.late,
          "",
          "",
        ])
 
        // Add department attendance
        rows.push(
          ...(attData.department_attendance || []).map((dept) => [
            "",
            "",
            "",
            "",
            dept.department,
            `${dept.attendance_rate}%`,
          ]),
        )
        break
 
      case "leave":
        const leaveData = data as LeaveMetrics
        headers = ["Leave Type", "Count", "Department", "Leaves", "Month", "Leave Count"]
        rows = (leaveData.leave_by_type || []).map((leave) => [leave.type, leave.count, "", "", "", ""])
 
        // Add department distribution
        rows.push(
          ...(leaveData.department_leave_distribution || []).map((dept) => [
            "",
            "",
            dept.department,
            dept.leaves,
            "",
            "",
          ]),
        )
 
        // Add monthly trend
        rows.push(...(leaveData.leave_trend || []).map((trend) => ["", "", "", "", trend.month, trend.count]))
        break
 
      case "costs":
        const costData = data as CostMetrics
        headers = ["Department", "Cost", "Month", "Amount", "Overtime Cost"]
        rows = (costData.department_costs || []).map((dept) => [dept.department, formatCurrency(dept.cost), "", "", ""])
 
        // Add cost trend
        rows.push(
          ...(costData.cost_trend || []).map((trend) => ["", "", trend.month, formatCurrency(trend.amount), ""]),
        )
 
        // Add overtime costs
        rows.push(...(costData.overtime_costs || []).map((ot) => [ot.department, "", "", "", formatCurrency(ot.cost)]))
        break
 
      case "timesheet":
      default:
        // Handle timesheet entries
        if (Array.isArray(data)) {
          headers = [
            "Date",
            "Employee ID",
            "Employee Name",
            "Check In",
            "Check Out",
            "Break Start",
            "Break End",
            "Total Hours",
            "Overtime Hours",
            "Status",
            "Notes",
          ]
 
          rows = (data as TimeEntry[]).map((entry) => {
            // Format date
            const formattedDate = entry.date
              ? typeof entry.date === "string"
                ? entry.date.split("T")[0]
                : format(entry.date, "yyyy-MM-dd")
              : "-"
 
            // Format times safely
            const formatTime = (timeStr: string | null | undefined) => {
              if (!timeStr) return "-"
              try {
                return format(new Date(timeStr), "hh:mm a")
              } catch (e) {
                return "-"
              }
            }
 
            // Get employee name safely
            const employeeName = entry.employee
              ? `${entry.employee.first_name || ""} ${entry.employee.last_name || ""}`.trim()
              : "Unknown Employee"
 
            // Get employee ID safely
            const employeeId =
              entry.employee && entry.employee.employee_id ? entry.employee.employee_id : entry.employee_id || "Unknown"
 
            return [
              formattedDate,
              employeeId,
              employeeName,
              formatTime(entry.check_in),
              formatTime(entry.check_out),
              formatTime(entry.break_start),
              formatTime(entry.break_end),
              (entry.total_hours || 0).toFixed(2),
              (entry.overtime_hours || 0).toFixed(2),
              entry.status || "-",
              entry.notes || "-",
            ]
          })
        }
    }
 
    return [headers.join(","), ...rows.map((row) => row.join(","))].join("\n")
  } catch (error) {
    console.error("Error generating CSV:", error)
    throw new Error("Failed to generate CSV export")
  }
}
 
export function exportToPDF(data: ReportData, reportType = "timesheet"): void {
  try {
    const doc = new jsPDF()
    const title =
      reportType === "timesheet"
        ? "Timesheet Report"
        : `${reportType.charAt(0).toUpperCase() + reportType.slice(1)} Report`
 
    // Add title
    doc.setFontSize(16)
    doc.text(title, 14, 15)
 
    // Add report info
    doc.setFontSize(10)
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 25)
 
    let tableData: any[][] = []
    let headers: string[] = []
 
    switch (reportType) {
      case "employees":
        const empData = data as EmployeeMetrics
        headers = ["Category", "Metric", "Value"]
        tableData = [
          ["Overview", "Total Employees", empData.total_employees],
          ["", "Active Employees", empData.active_employees],
          ["", "Turnover Rate", `${empData.turnover_rate}%`],
          ["Departments", "", ""],
          ...(empData.departments || []).map((dept) => ["", dept.name, dept.count]),
          ["Gender Distribution", "", ""],
          ...(empData.gender_distribution || []).map((gender) => ["", gender.gender, gender.count]),
          ["Age Distribution", "", ""],
          ...(empData.age_distribution || []).map((age) => ["", age.range, age.count]),
        ]
        break
 
      case "attendance":
        const attData = data as AttendanceMetrics
        headers = ["Date", "Present", "Absent", "Late"]
        tableData = (attData.attendance_trend || []).map((trend) => [
          trend.date,
          trend.present,
          trend.absent,
          trend.late,
        ])
        break
 
      case "leave":
        const leaveData = data as LeaveMetrics
        headers = ["Category", "Type", "Count"]
        tableData = [
          ["Leave Types", "", ""],
          ...(leaveData.leave_by_type || []).map((leave) => ["", leave.type, leave.count]),
          ["Department Distribution", "", ""],
          ...(leaveData.department_leave_distribution || []).map((dept) => ["", dept.department, dept.leaves]),
        ]
        break
 
      case "costs":
        const costData = data as CostMetrics
        headers = ["Category", "Item", "Amount"]
        tableData = [
          ["Overview", "Total Salary", formatCurrency(costData.total_salary)],
          ["", "Cost per Employee", formatCurrency(costData.cost_per_employee)],
          ["Department Costs", "", ""],
          ...(costData.department_costs || []).map((dept) => ["", dept.department, formatCurrency(dept.cost)]),
          ["Overtime Costs", "", ""],
          ...(costData.overtime_costs || []).map((ot) => ["", ot.department, formatCurrency(ot.cost)]),
        ]
        break
 
      case "timesheet":
      default:
        // Handle timesheet entries
        if (Array.isArray(data)) {
          headers = ["Date", "Employee", "Check In", "Check Out", "Hours", "Status"]
 
          tableData = (data as TimeEntry[]).map((entry) => {
            // Format date
            const formattedDate = entry.date
              ? typeof entry.date === "string"
                ? entry.date.split("T")[0]
                : format(entry.date, "yyyy-MM-dd")
              : "-"
 
            // Format times safely
            const formatTime = (timeStr: string | null | undefined) => {
              if (!timeStr) return "-"
              try {
                return format(new Date(timeStr), "hh:mm a")
              } catch (e) {
                return "-"
              }
            }
 
            // Get employee name safely
            const employeeName = entry.employee
              ? `${entry.employee.first_name || ""} ${entry.employee.last_name || ""}`.trim()
              : "Unknown Employee"
 
            return [
              formattedDate,
              employeeName,
              formatTime(entry.check_in),
              formatTime(entry.check_out),
              (entry.total_hours || 0).toFixed(2),
              entry.status || "-",
            ]
          })
        }
    }
 
    // Add table
    autoTable(doc, {
      head: [headers],
      body: tableData,
      startY: 35,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [51, 51, 51] },
      alternateRowStyles: { fillColor: [245, 245, 245] },
    })
 
    // Save PDF
    doc.save(`${reportType}_report_${new Date().toISOString().split("T")[0]}.pdf`)
  } catch (error) {
    console.error("Error generating PDF:", error)
    throw new Error("Failed to generate PDF export")
  }
}
 
function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "LKR",
  }).format(value)
}
 