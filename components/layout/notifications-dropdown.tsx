"use client"

import { Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Mock notifications - in a real app, these would come from an API
const notifications = [
  {
    id: "1",
    title: "New Leave Request",
    description: "John Doe requested annual leave",
    time: "2 min ago",
    unread: true,
  },
  {
    id: "2",
    title: "Attendance Alert",
    description: "3 employees are late today",
    time: "1 hour ago",
    unread: true,
  },
  {
    id: "3",
    title: "Monthly Report",
    description: "February 2024 report is ready",
    time: "5 hours ago",
    unread: false,
  },
]

export function NotificationsDropdown() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {notifications.some((n) => n.unread) && (
            <span className="absolute right-1 top-1 flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500"></span>
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">Notifications</p>
            <p className="text-xs leading-none text-muted-foreground">
              You have {notifications.filter((n) => n.unread).length} unread messages
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          {notifications.map((notification) => (
            <DropdownMenuItem key={notification.id} className="flex flex-col items-start gap-1 p-4">
              <div className="flex w-full items-start justify-between">
                <p className="text-sm font-medium leading-none">
                  {notification.title}
                  {notification.unread && <span className="ml-2 inline-flex h-2 w-2 rounded-full bg-blue-600"></span>}
                </p>
                <span className="text-xs text-muted-foreground">{notification.time}</span>
              </div>
              <p className="text-xs text-muted-foreground line-clamp-2">{notification.description}</p>
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="w-full text-center font-medium">View all notifications</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

