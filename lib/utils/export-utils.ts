import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"
import type { TimeEntry } from "@/types/timesheet"
import type { EmployeeMetrics, AttendanceMetrics, LeaveMetrics, CostMetrics } from "@/types/reports"

type ReportData = EmployeeMetrics | AttendanceMetrics | LeaveMetrics | CostMetrics | TimeEntry[]

export function exportToCSV(data: ReportData, reportType: string): string {
  let headers: string[] = []
  let rows: any[][] = []

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
      rows.push(...(costData.cost_trend || []).map((trend) => ["", "", trend.month, formatCurrency(trend.amount), ""]))

      // Add overtime costs
      rows.push(...(costData.overtime_costs || []).map((ot) => [ot.department, "", "", "", formatCurrency(ot.cost)]))
      break

    default:
      // Handle timesheet entries (original functionality)
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
        rows = (data as TimeEntry[]).map((entry) => [
          entry.date,
          entry.employee.employee_id,
          `${entry.employee.first_name} ${entry.employee.last_name}`,
          new Date(entry.check_in).toLocaleTimeString(),
          new Date(entry.check_out).toLocaleTimeString(),
          entry.break_start ? new Date(entry.break_start).toLocaleTimeString() : "-",
          entry.break_end ? new Date(entry.break_end).toLocaleTimeString() : "-",
          entry.total_hours.toFixed(2),
          entry.overtime_hours.toFixed(2),
          entry.status,
          entry.notes || "-",
        ])
      }
  }

  return [headers.join(","), ...rows.map((row) => row.join(","))].join("\n")
}

export function exportToPDF(data: ReportData, reportType: string, departments?: { [key: string]: string }): void {
  const doc = new jsPDF()
  const title = `${reportType.charAt(0).toUpperCase() + reportType.slice(1)} Report`

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
      tableData = (attData.attendance_trend || []).map((trend) => [trend.date, trend.present, trend.absent, trend.late])
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

    default:
      // Handle timesheet entries (original functionality)
      if (Array.isArray(data)) {
        headers = ["Date", "Employee", "Hours", "Status"]
        tableData = (data as TimeEntry[]).map((entry) => [
          entry.date,
          `${entry.employee.first_name} ${entry.employee.last_name}`,
          entry.total_hours.toFixed(2),
          entry.status,
        ])
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
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value)
}

