"use client"

import { Bell, Settings, User, Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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
import { NotificationsDropdown } from "./notifications-dropdown"
import { getUserProfile } from "@/lib/api/profile"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useAuth } from "@/providers/auth-provider"
import type { UserProfile } from "@/types/profile"

export function TopNav() {
  const { setTheme, theme } = useTheme()
  const router = useRouter()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const { logout } = useAuth()

  useEffect(() => {
    loadProfile()
  }, [])

  const loadProfile = async () => {
    try {
      const data = await getUserProfile()
      setProfile(data)
    } catch (error) {
      console.error("Failed to load profile:", error)
    }
  }

  const handleLogout = async () => {
    try {
      await logout()
      router.push("/login")
    } catch (error) {
      console.error("Failed to logout:", error)
    }
  }

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center gap-4 px-4">
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold text-primary">ComIn</span>
          <span className="text-sm text-muted-foreground">HR Admin</span>
        </div>

        <div className="ml-auto flex items-center gap-4">
          <NotificationsDropdown />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                {theme === "dark" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                <span className="sr-only">Toggle theme</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setTheme("light")}>
                <Sun className="mr-2 h-4 w-4" />
                Light
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("dark")}>
                <Moon className="mr-2 h-4 w-4" />
                Dark
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("system")}>
                <Settings className="mr-2 h-4 w-4" />
                System
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8 transition-transform hover:scale-105">
                  <AvatarImage src={profile?.avatar_url} alt={profile?.first_name} />
                  <AvatarFallback className="bg-primary/10">
                    {profile?.first_name?.[0]}
                    {profile?.last_name?.[0]}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {profile?.first_name} {profile?.last_name}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">{profile?.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem onClick={() => router.push("/dashboard/profile")}>
                  <User className="mr-2 h-4 w-4" />
                  Profile
                  <span className="ml-auto text-xs text-muted-foreground">⇧⌘P</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push("/dashboard/profile?tab=notifications")}>
                  <Bell className="mr-2 h-4 w-4" />
                  Notifications
                  <span className="ml-auto text-xs text-muted-foreground">⌘N</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push("/dashboard/profile?tab=security")}>
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                  <span className="ml-auto text-xs text-muted-foreground">⌘S</span>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleLogout}
                className="text-destructive hover:bg-destructive/10 focus:bg-destructive/10"
              >
                Log out
                <span className="ml-auto text-xs text-muted-foreground">⇧⌘Q</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}

