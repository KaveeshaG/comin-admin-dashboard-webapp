import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Clock, UserPlus, FileCheck } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { RecentActivity } from "@/types/dashboard"

interface ActivityListProps {
  activities: RecentActivity[]
}

export function ActivityList({ activities }: ActivityListProps) {
  const getIcon = (type: RecentActivity["type"]) => {
    switch (type) {
      case "leave":
        return <Calendar className="h-4 w-4 text-blue-500" />
      case "attendance":
        return <Clock className="h-4 w-4 text-green-500" />
      case "onboarding":
        return <UserPlus className="h-4 w-4 text-amber-500" />
      case "review":
        return <FileCheck className="h-4 w-4 text-violet-500" />
    }
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-4">
            {activities.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-4">
                <Avatar className="h-9 w-9">
                  <AvatarImage src={activity.user.avatar} alt={activity.user.name} />
                  <AvatarFallback>
                    {activity.user.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">{activity.user.name}</p>
                  <p className="text-sm text-muted-foreground">{activity.description}</p>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  {getIcon(activity.type)}
                  <span>{activity.timestamp}</span>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}

