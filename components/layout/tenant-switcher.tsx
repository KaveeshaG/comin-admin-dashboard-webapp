"use client"

import * as React from "react"
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useTenantContext } from "@/providers/tenant-provider"
import { useToast } from "@/components/ui/use-toast"

type PopoverTriggerProps = React.ComponentPropsWithoutRef<typeof PopoverTrigger>

interface TenantSwitcherProps extends PopoverTriggerProps {}

export function TenantSwitcher({ className }: TenantSwitcherProps) {
  const [open, setOpen] = React.useState(false)
  const { currentTenant, availableTenants, setCurrentTenant } = useTenantContext()
  const { toast } = useToast()

  const handleTenantSwitch = async (tenant: { id: string; name: string }) => {
    try {
      setCurrentTenant(tenant)
      setOpen(false)
      toast({
        title: "Organization Switched",
        description: `Switched to ${tenant.name}`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to switch organization",
        variant: "destructive",
      })
    }
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          aria-label="Select organization"
          className={cn(
            "w-full justify-between border-border/10 bg-sidebar-accent text-sidebar-foreground hover:bg-sidebar-accent/90",
            className,
          )}
        >
          <span className="line-clamp-1 flex-1 text-left">{currentTenant?.name ?? "Select organization"}</span>
          <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search organization..." />
          <CommandList>
            <CommandEmpty>No organization found.</CommandEmpty>
            <CommandGroup>
              {availableTenants.map((tenant) => (
                <CommandItem key={tenant.id} onSelect={() => handleTenantSwitch(tenant)} className="text-sm">
                  {tenant.name}
                  <CheckIcon
                    className={cn("ml-auto h-4 w-4", currentTenant?.id === tenant.id ? "opacity-100" : "opacity-0")}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

