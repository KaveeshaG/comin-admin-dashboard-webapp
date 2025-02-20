"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight, CalendarIcon } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { cn } from "@/lib/utils"
import { format, addMonths, subMonths, isSameDay } from "date-fns"
import { getCalendarEvents } from "@/lib/api/calendar"
import { useToast } from "@/components/ui/use-toast"
import type { CalendarEvent } from "@/types/calendar"

interface CalendarWidgetProps {
  organizationId?: string
}

export function CalendarWidget({ organizationId }: CalendarWidgetProps) {
  const [currentMonth, setCurrentMonth] = React.useState(new Date())
  const [events, setEvents] = React.useState<CalendarEvent[]>([])
  const [isLoading, setIsLoading] = React.useState(false)
  const { toast } = useToast()

  React.useEffect(() => {
    if (organizationId) {
      loadEvents()
    }
  }, [organizationId])

  const loadEvents = async () => {
    if (!organizationId) return

    setIsLoading(true)
    try {
      const monthEvents = await getCalendarEvents(currentMonth, organizationId)
      setEvents(monthEvents)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load calendar events",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1))
  const previousMonth = () => setCurrentMonth(subMonths(currentMonth, 1))

  const getEventsForDate = (date: Date) => {
    return events.filter((event) => isSameDay(new Date(event.date), date))
  }

  const getEventIndicatorColor = (event: CalendarEvent) => {
    switch (event.type) {
      case "holiday":
        return "bg-green-500"
      case "leave":
        return "bg-red-500"
      case "meeting":
        return "bg-blue-500"
      case "birthday":
        return "bg-amber-500"
      case "review":
        return "bg-violet-500"
      default:
        return "bg-gray-500"
    }
  }

  const getDaysInMonth = () => {
    const start = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1)
    const end = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0)

    const days = []
    const startDay = start.getDay()

    // Add days from previous month
    const prevMonthEnd = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 0).getDate()
    for (let i = startDay - 1; i >= 0; i--) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, prevMonthEnd - i)
      days.push({ date, isCurrentMonth: false })
    }

    // Add days from current month
    for (let i = 1; i <= end.getDate(); i++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), i)
      days.push({ date, isCurrentMonth: true })
    }

    // Add days from next month
    const remainingDays = 42 - days.length // 6 rows * 7 days
    for (let i = 1; i <= remainingDays; i++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, i)
      days.push({ date, isCurrentMonth: false })
    }

    return days
  }

  const weekDays = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"]

  return (
    <Card className={cn("h-full", isLoading && "opacity-50")}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          <CalendarIcon className="mr-2 inline-block h-4 w-4" />
          Calendar
        </CardTitle>
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={previousMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="min-w-[100px] text-center text-sm font-medium">{format(currentMonth, "MMMM yyyy")}</div>
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={nextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="flex-1 p-0 pt-4">
        <div className="grid h-full grid-cols-7 gap-1 p-2 text-center">
          {weekDays.map((day) => (
            <div key={day} className="text-xs font-medium text-muted-foreground">
              {day}
            </div>
          ))}
          {getDaysInMonth().map((day, index) => {
            const dayEvents = getEventsForDate(day.date)
            const isToday = isSameDay(day.date, new Date())
            const hasEvents = dayEvents.length > 0

            return (
              <HoverCard key={index} openDelay={200}>
                <HoverCardTrigger asChild>
                  <Button
                    variant="ghost"
                    className={cn(
                      "h-9 p-0",
                      !day.isCurrentMonth && "text-muted-foreground/50",
                      isToday && "bg-primary/10 font-bold text-primary",
                      hasEvents && day.isCurrentMonth && "font-medium",
                    )}
                  >
                    <div className="relative flex h-full w-full flex-col items-center justify-center">
                      <span className="text-xs">{format(day.date, "d")}</span>
                      {hasEvents && (
                        <div className="absolute bottom-1 flex gap-0.5">
                          {dayEvents.map((event, i) => (
                            <div key={event.id} className={cn("h-1 w-1 rounded-full", getEventIndicatorColor(event))} />
                          ))}
                        </div>
                      )}
                    </div>
                  </Button>
                </HoverCardTrigger>
                {hasEvents && (
                  <HoverCardContent side="right" align="start" className="w-64">
                    <div className="space-y-2">
                      {dayEvents.map((event) => (
                        <div key={event.id} className="flex items-center gap-2">
                          <div className={cn("h-2 w-2 rounded-full", getEventIndicatorColor(event))} />
                          <div>
                            <div className="font-medium">{event.title}</div>
                            {event.description && (
                              <div className="text-sm text-muted-foreground">{event.description}</div>
                            )}
                            {event.participants && event.participants.length > 0 && (
                              <div className="text-xs text-muted-foreground">{event.participants.join(", ")}</div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </HoverCardContent>
                )}
              </HoverCard>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

