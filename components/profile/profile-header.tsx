"use client"
 
import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { getUserProfile } from "@/lib/api/profile"
import { Skeleton } from "@/components/ui/skeleton"
import { Camera, Mail, Phone, Calendar } from "lucide-react"
import { formatDate } from "@/lib/utils"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/providers/auth-provider"
 
export function ProfileHeader() {
  const [profile, setProfile] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()
  const { user } = useAuth()
 
  useEffect(() => {
    loadProfile()
  }, [])
 
  const loadProfile = async () => {
    try {
      setIsLoading(true)
      const data = await getUserProfile()
      setProfile(data)
    } catch (error) {
      console.error("Failed to load profile:", error)
      toast({
        title: "Error",
        description: "Failed to load profile information",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }
 
  return (
    <Card className="overflow-hidden border-border/40 shadow-sm">
      <div className="h-32 bg-gradient-to-r from-primary/20 via-primary/10 to-primary/5"></div>
      <CardContent className="relative p-6">
        <div className="absolute -top-12 left-6 rounded-full border-4 border-background">
          {isLoading ? (
            <Skeleton className="h-24 w-24 rounded-full" />
          ) : (
            <Avatar className="h-24 w-24">
              <AvatarImage src={profile?.avatar_url || "/placeholder.svg"} alt={profile?.first_name} />
              <AvatarFallback className="bg-primary/10 text-lg font-medium text-primary">
                {profile?.first_name?.[0]}
                {profile?.last_name?.[0]}
              </AvatarFallback>
            </Avatar>
          )}
          <Button size="icon" variant="secondary" className="absolute bottom-0 right-0 h-8 w-8 rounded-full shadow-md">
            <Camera className="h-4 w-4" />
            <span className="sr-only">Change avatar</span>
          </Button>
        </div>
 
        <div className="ml-32 flex flex-col justify-between gap-4 sm:flex-row">
          <div>
            {isLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-7 w-48" />
                <Skeleton className="h-5 w-32" />
              </div>
            ) : (
              <>
                <h2 className="text-2xl font-bold">
                  {profile?.first_name} {profile?.last_name}
                </h2>
                <p className="text-muted-foreground">{profile?.job_title}</p>
              </>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm">
              Edit Profile
            </Button>
            <Button variant="secondary" size="sm">
              View Public Profile
            </Button>
          </div>
        </div>
 
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {isLoading ? (
            <>
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-full" />
            </>
          ) : (
            <>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span>{profile?.email}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4" />
                <span>{profile?.phone || "Not provided"}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>Joined {profile?.date_joined ? formatDate(new Date(profile.date_joined)) : "Unknown"}</span>
              </div>
            </>
          )}
        </div>
 
        {user?.role && (
          <div className="mt-4">
            <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
              {user.role.toUpperCase()}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
 