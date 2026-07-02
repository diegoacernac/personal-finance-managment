import { Card } from '@/components/ui/card'
import { formatPEN } from '@/lib/currency'
import { cn } from '@/lib/utils'
import { TrendingUp, TrendingDown, Wallet } from 'lucide-react'

export function SummaryCards({
  income,
  expense,
  balance,
}: {
  income: number
  expense: number
  balance: number
}) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <Card className="animate-in fade-in slide-in-from-bottom-2 p-5 duration-500 transition-all hover:-translate-y-0.5 hover:shadow-md">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-muted-foreground">Ingresos</p>
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <TrendingUp className="h-5 w-5" />
          </div>
        </div>
        <p className="mt-2 text-3xl font-bold tabular-nums text-emerald-600 dark:text-emerald-400">
          {formatPEN(income)}
        </p>
      </Card>

      <Card className="animate-in fade-in slide-in-from-bottom-2 p-5 delay-100 duration-500 transition-all hover:-translate-y-0.5 hover:shadow-md">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-muted-foreground">Gastos</p>
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-red-500/10 text-red-600 dark:text-red-400">
            <TrendingDown className="h-5 w-5" />
          </div>
        </div>
        <p className="mt-2 text-3xl font-bold tabular-nums text-red-600 dark:text-red-400">
          {formatPEN(expense)}
        </p>
      </Card>

      <Card
        className={cn(
          'animate-in fade-in slide-in-from-bottom-2 border-0 p-5 text-white delay-200 duration-500 transition-all hover:-translate-y-0.5',
          balance >= 0
            ? 'bg-gradient-to-br from-primary to-primary/70 shadow-lg shadow-primary/25 hover:shadow-primary/40'
            : 'bg-gradient-to-br from-red-600 to-red-500/80 shadow-lg shadow-red-500/25 hover:shadow-red-500/40'
        )}
      >
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-white/80">Balance</p>
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15 text-white">
            <Wallet className="h-5 w-5" />
          </div>
        </div>
        <p className="mt-2 text-3xl font-bold tabular-nums">{formatPEN(balance)}</p>
      </Card>
    </div>
  )
}
