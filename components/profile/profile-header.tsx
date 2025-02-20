"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { getUserProfile, uploadAvatar, updateProfile } from "@/lib/api/profile"
import type { UserProfile } from "@/types/profile"

export function ProfileHeader() {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    loadProfile()
  }, [])

  const loadProfile = async () => {
    try {
      const data = await getUserProfile()
      setProfile(data)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load profile",
        variant: "destructive",
      })
    }
  }

  const handleAvatarChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    try {
      const { url } = await uploadAvatar(file)
      await updateProfile({ avatar_url: url })
      await loadProfile()
      toast({
        title: "Success",
        description: "Avatar updated successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update avatar",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  if (!profile) {
    return null
  }

  return (
    <Card>
      <CardContent className="flex flex-col items-center gap-6 p-6 sm:flex-row sm:items-start">
        <div className="relative">
          <Avatar className="h-24 w-24">
            <AvatarImage src={profile.avatar_url} alt={`${profile.first_name} ${profile.last_name}`} />
            <AvatarFallback>
              {profile.first_name[0]}
              {profile.last_name[0]}
            </AvatarFallback>
          </Avatar>
          <div className="absolute -bottom-2 left-0 w-full text-center">
            <Label
              htmlFor="avatar-upload"
              className="inline-flex cursor-pointer items-center rounded-md bg-primary px-2 py-1 text-xs text-primary-foreground hover:bg-primary/90"
            >
              Change
              <Input
                id="avatar-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarChange}
                disabled={isUploading}
              />
            </Label>
          </div>
        </div>

        <div className="text-center sm:text-left">
          <h2 className="text-2xl font-bold">
            {profile.first_name} {profile.last_name}
          </h2>
          <p className="text-sm text-muted-foreground">{profile.email}</p>
          <div className="mt-2 space-y-1">
            <p className="text-sm">{profile.job_title}</p>
            <p className="text-sm text-muted-foreground">Member since {new Date(profile.date_joined).getFullYear()}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

