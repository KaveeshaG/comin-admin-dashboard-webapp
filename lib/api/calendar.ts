import type { CalendarEvent } from "@/types/calendar"

export async function getCalendarEvents(month: Date, organizationId: string): Promise<CalendarEvent[]> {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 500))

  // In a real app, this would fetch events for the specific organization
  const mockEvents: CalendarEvent[] = [
    {
      id: "1",
      title: "New Year's Day",
      date: new Date(new Date().getFullYear(), 0, 1),
      type: "holiday",
      description: "Public Holiday",
      color: "#22c55e", // green-500
    },
    {
      id: "2",
      title: "Team Meeting",
      date: new Date(new Date().setDate(new Date().getDate() + 2)),
      type: "meeting",
      description: "Monthly team sync",
      participants: ["John Doe", "Jane Smith", "Mike Johnson"],
      color: "#3b82f6", // blue-500
    },
    {
      id: "3",
      title: "Sarah's Birthday",
      date: new Date(new Date().setDate(new Date().getDate() + 5)),
      type: "birthday",
      description: "Team celebration at 3 PM",
      color: "#f59e0b", // amber-500
    },
    // ... more events
  ]

  // Filter events for the selected month
  return mockEvents.filter(
    (event) => event.date.getMonth() === month.getMonth() && event.date.getFullYear() === month.getFullYear(),
  )
}

export async function getEventsByDate(date: Date, organizationId: string): Promise<CalendarEvent[]> {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 200))

  // In a real app, this would fetch events for the specific organization and date
  const events = await getCalendarEvents(date, organizationId)

  // Filter events for the selected date
  return events.filter(
    (event) =>
      event.date.getDate() === date.getDate() &&
      event.date.getMonth() === date.getMonth() &&
      event.date.getFullYear() === date.getFullYear(),
  )
}

