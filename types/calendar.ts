export type EventType = "holiday" | "leave" | "meeting" | "birthday" | "review"

export interface CalendarEvent {
  id: string
  title: string
  date: Date
  type: EventType
  description?: string
  participants?: string[]
  status?: "pending" | "approved" | "rejected"
  color?: string
}

export interface EventSummary {
  date: Date
  events: CalendarEvent[]
}

