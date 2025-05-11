"use client"
 
import { Bell, LogOut, Settings, User, Moon, Sun, HelpCircle } from "lucide-react"
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
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/components/ui/use-toast"
 
export function TopNav() {
  const { setTheme, theme } = useTheme()
  const router = useRouter()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { logout, user } = useAuth()
  const { toast } = useToast()
 
  useEffect(() => {
    loadProfile()
  }, [])
 
  const loadProfile = async () => {
    setIsLoading(true)
    try {
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
 
  const handleLogout = async () => {
    try {
      await logout()
      router.push("/login")
      toast({
        title: "Logged out",
        description: "You have been successfully logged out",
      })
    } catch (error) {
      console.error("Failed to logout:", error)
      toast({
        title: "Error",
        description: "Failed to log out. Please try again.",
        variant: "destructive",
      })
    }
  }
 
  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center gap-4 px-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10">
            <span className="text-sm font-bold text-primary">CI</span>
          </div>
          <span className="text-xl font-bold text-primary">ComIn</span>
          <span className="hidden text-sm text-muted-foreground sm:inline-block">HR Admin</span>
        </div>
 
        <div className="ml-auto flex items-center gap-4">
          <NotificationsDropdown />
 
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="h-8 w-8 rounded-full">
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
                {isLoading ? (
                  <Skeleton className="h-8 w-8 rounded-full" />
                ) : (
                  <Avatar className="h-8 w-8 transition-transform hover:scale-105">
                    <AvatarImage src={profile?.avatar_url || "/placeholder.svg"} alt={profile?.first_name} />
                    <AvatarFallback className="bg-primary/10 text-xs font-medium text-primary">
                      {profile?.first_name?.[0]}
                      {profile?.last_name?.[0]}
                    </AvatarFallback>
                  </Avatar>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              {isLoading ? (
                <div className="p-2">
                  <Skeleton className="h-5 w-32 rounded-md" />
                  <Skeleton className="mt-2 h-4 w-24 rounded-md" />
                </div>
              ) : (
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {profile?.first_name} {profile?.last_name}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">{profile?.email}</p>
                    {user?.role && <p className="mt-1 text-xs font-medium text-primary">{user.role.toUpperCase()}</p>}
                  </div>
                </DropdownMenuLabel>
              )}
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
                <DropdownMenuItem>
                  <HelpCircle className="mr-2 h-4 w-4" />
                  Help & Support
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleLogout}
                className="text-destructive hover:bg-destructive/10 focus:bg-destructive/10"
              >
                <LogOut className="mr-2 h-4 w-4" />
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