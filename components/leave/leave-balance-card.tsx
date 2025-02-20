import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import type { LeaveBalance } from "@/types/leave"

interface LeaveBalanceCardProps {
  balance: LeaveBalance
}

export function LeaveBalanceCard({ balance }: LeaveBalanceCardProps) {
  const percentageUsed = (balance.used_days / balance.total_days) * 100

  return (
    <Card>
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

