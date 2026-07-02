import { Card } from '@/components/ui/card'
import { formatPEN } from '@/lib/currency'
import type { MonthProjection } from '@/lib/types'
import { cn } from '@/lib/utils'
import { Sparkles } from 'lucide-react'

export function ProjectionWidget({ projection }: { projection: MonthProjection }) {
  const { income_received, income_pending, expense_paid, expense_pending, projected_balance } =
    projection

  const rows = [
    { label: 'Ingresos recibidos', value: income_received, tone: 'text-emerald-600 dark:text-emerald-400' },
    { label: 'Ingresos pendientes', value: income_pending, tone: 'text-emerald-600/60 dark:text-emerald-400/60' },
    { label: 'Gastos pagados', value: -expense_paid, tone: 'text-red-600 dark:text-red-400' },
    { label: 'Gastos pendientes', value: -expense_pending, tone: 'text-red-600/60 dark:text-red-400/60' },
  ]

  return (
    <Card className="animate-in fade-in slide-in-from-bottom-2 p-4 delay-300 duration-500">
      <div className="mb-4 flex items-center gap-2">
        <Sparkles className="h-4 w-4 text-primary" />
        <p className="text-sm font-medium text-muted-foreground">Proyección de fin de mes</p>
      </div>
      <div className="space-y-2">
        {rows.map((row) => (
          <div key={row.label} className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">{row.label}</span>
            <span className={row.tone}>
              {row.value >= 0 ? '+' : '−'} {formatPEN(Math.abs(row.value))}
            </span>
          </div>
        ))}
      </div>
      <div className="mt-4 border-t pt-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Balance proyectado</span>
          <span
            className={cn(
              'text-xl font-semibold',
              projected_balance >= 0
                ? 'text-primary'
                : 'text-red-600 dark:text-red-400'
            )}
          >
            {formatPEN(projected_balance)}
          </span>
        </div>
      </div>
    </Card>
  )
}
