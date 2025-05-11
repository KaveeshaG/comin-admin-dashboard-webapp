"use client"
 
import type React from "react"
 
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getUserProfile } from "@/lib/api/profile"
import type { UpdateProfileDto, UserProfile } from "@/types/profile"
import { Skeleton } from "@/components/ui/skeleton"
import { LoadingSpinner } from "@/components/loading-spinner"
 
interface ProfileFormProps {
  onSubmit: (data: UpdateProfileDto) => Promise<void>
  isLoading: boolean
}
 
export function ProfileForm({ onSubmit, isLoading }: ProfileFormProps) {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [isLoadingProfile, setIsLoadingProfile] = useState(true)
  const [formData, setFormData] = useState<UpdateProfileDto>({
    first_name: "",
    last_name: "",
    phone: "",
    job_title: "",
    bio: "",
    timezone: "",
    language: "",
  })
 
  useEffect(() => {
    loadProfile()
  }, [])
 
  const loadProfile = async () => {
    try {
      setIsLoadingProfile(true)
      const data = await getUserProfile()
      setProfile(data)
      setFormData({
        first_name: data.first_name || "",
        last_name: data.last_name || "",
        phone: data.phone || "",
        job_title: data.job_title || "",
        bio: data.bio || "",
        timezone: data.timezone || "",
        language: data.language || "",
      })
    } catch (error) {
      console.error("Failed to load profile:", error)
    } finally {
      setIsLoadingProfile(false)
    }
  }
 
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }
 
  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }
 
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await onSubmit(formData)
  }
 
  if (isLoadingProfile) {
    return (
      <div className="space-y-4">
        <div className="space-y-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-20 w-full" />
        </div>
        <Skeleton className="h-10 w-24" />
      </div>
    )
  }
 
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="first_name">First Name</Label>
          <Input
            id="first_name"
            name="first_name"
            value={formData.first_name}
            onChange={handleChange}
            disabled={isLoading}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="last_name">Last Name</Label>
          <Input
            id="last_name"
            name="last_name"
            value={formData.last_name}
            onChange={handleChange}
            disabled={isLoading}
          />
        </div>
      </div>
 
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" value={profile?.email || ""} disabled className="bg-muted/50" />
          <p className="text-xs text-muted-foreground">Your email cannot be changed</p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            disabled={isLoading}
            placeholder="+1 (555) 123-4567"
          />
        </div>
      </div>
 
      <div className="space-y-2">
        <Label htmlFor="job_title">Job Title</Label>
        <Input
          id="job_title"
          name="job_title"
          value={formData.job_title}
          onChange={handleChange}
          disabled={isLoading}
          placeholder="e.g. Software Engineer"
        />
      </div>
 
      <div className="space-y-2">
        <Label htmlFor="bio">Bio</Label>
        <Textarea
          id="bio"
          name="bio"
          value={formData.bio}
          onChange={handleChange}
          disabled={isLoading}
          placeholder="Tell us about yourself"
          className="min-h-[100px]"
        />
      </div>
 
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="timezone">Timezone</Label>
          <Select
            value={formData.timezone}
            onValueChange={(value) => handleSelectChange("timezone", value)}
            disabled={isLoading}
          >
            <SelectTrigger id="timezone">
              <SelectValue placeholder="Select timezone" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
              <SelectItem value="America/Chicago">Central Time (CT)</SelectItem>
              <SelectItem value="America/Denver">Mountain Time (MT)</SelectItem>
              <SelectItem value="America/Los_Angeles">Pacific Time (PT)</SelectItem>
              <SelectItem value="Asia/Kolkata">India Standard Time (IST)</SelectItem>
              <SelectItem value="Europe/London">Greenwich Mean Time (GMT)</SelectItem>
              <SelectItem value="Asia/Tokyo">Japan Standard Time (JST)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="language">Language</Label>
          <Select
            value={formData.language}
            onValueChange={(value) => handleSelectChange("language", value)}
            disabled={isLoading}
          >
            <SelectTrigger id="language">
              <SelectValue placeholder="Select language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="es">Spanish</SelectItem>
              <SelectItem value="fr">French</SelectItem>
              <SelectItem value="de">German</SelectItem>
              <SelectItem value="zh">Chinese</SelectItem>
              <SelectItem value="ja">Japanese</SelectItem>
              <SelectItem value="hi">Hindi</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
 
      <Button type="submit" disabled={isLoading}>
        {isLoading ? (
          <>
            <LoadingSpinner className="mr-2" size="sm" /> Saving Changes...
          </>
        ) : (
          "Save Changes"
        )}
      </Button>
    </form>
  )
}