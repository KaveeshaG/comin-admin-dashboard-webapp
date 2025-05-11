import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import type { LeaveBalance } from "@/types/leave"
import { Skeleton } from "@/components/ui/skeleton"
 
interface LeaveBalanceCardProps {
  balance?: LeaveBalance
  className?: string
  isLoading?: boolean
}
 
export function LeaveBalanceCard({ balance, className = "", isLoading = false }: LeaveBalanceCardProps) {
  // Show loading skeleton if loading
  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader className="pb-2">
          <Skeleton className="h-5 w-32" />
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <Skeleton className="h-8 w-12" />
            <Skeleton className="h-4 w-24" />
          </div>
          <Skeleton className="h-2 w-full mt-2" />
          <Skeleton className="h-4 w-20 mt-2" />
        </CardContent>
      </Card>
    )
  }
 
  // Show empty state if no balance data
  if (!balance) {
    return (
      <Card className={className}>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Leave Balance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-20 text-muted-foreground text-sm">
            No leave balance data available
          </div>
        </CardContent>
      </Card>
    )
  }
 
  // Calculate percentage used
  const percentageUsed = (balance.used_days / balance.total_days) * 100
 
  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">{balance.leave_type.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="text-2xl font-bold">{balance.remaining_days}</div>
          <div className="text-sm text-muted-foreground">of {balance.total_days} days</div>
        </div>
        <Progress value={percentageUsed} className="mt-2" />
        <p className="mt-2 text-xs text-muted-foreground">{balance.used_days} days used</p>
      </CardContent>
    </Card>
  )
}