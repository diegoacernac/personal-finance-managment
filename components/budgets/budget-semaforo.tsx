import { Card } from '@/components/ui/card'
import { formatPEN } from '@/lib/currency'
import type { BudgetStatus, BudgetWithCategory, SemaforoStatus } from '@/lib/types'
import { cn } from '@/lib/utils'
import { CircleCheck, TriangleAlert, CircleAlert } from 'lucide-react'

const STATUS_STYLES: Record<SemaforoStatus, string> = {
  green: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-400',
  yellow: 'bg-amber-500/10 border-amber-500/30 text-amber-700 dark:text-amber-400',
  red: 'bg-red-500/10 border-red-500/30 text-red-700 dark:text-red-400',
}

const STATUS_ICONS: Record<SemaforoStatus, typeof CircleCheck> = {
  green: CircleCheck,
  yellow: TriangleAlert,
  red: CircleAlert,
}

export function BudgetSemaforo({
  budgets,
  statuses,
}: {
  budgets: BudgetWithCategory[]
  statuses: BudgetStatus[]
}) {
  const statusByBudget = new Map(statuses.map((s) => [s.budget_id, s]))

  const overallBudget = budgets.find((b) => b.category_id === null)
  const categoryBudgets = budgets.filter((b) => b.category_id !== null)

  if (budgets.length === 0) return null

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 space-y-3 delay-150 duration-500">
      {overallBudget &&
        (() => {
          const status = statusByBudget.get(overallBudget.id)
          if (!status) return null
          const Icon = STATUS_ICONS[status.semaforo_status]
          return (
            <Card className={cn('border p-4', STATUS_STYLES[status.semaforo_status])}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium opacity-80">Presupuesto general</p>
                  <p className="text-xl font-semibold">
                    {formatPEN(status.spent)} / {formatPEN(status.limit_amount)}
                  </p>
                </div>
                <Icon className="h-6 w-6" />
              </div>
            </Card>
          )
        })()}

      {categoryBudgets.length > 0 && (
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
          {categoryBudgets.map((budget) => {
            const status = statusByBudget.get(budget.id)
            if (!status) return null
            const Icon = STATUS_ICONS[status.semaforo_status]
            return (
              <div
                key={budget.id}
                className={cn(
                  'flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-transform hover:scale-[1.02]',
                  STATUS_STYLES[status.semaforo_status]
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <div className="min-w-0">
                  <p className="truncate font-medium">{budget.categories?.name ?? '—'}</p>
                  <p className="text-xs opacity-80">
                    {formatPEN(status.spent)} / {formatPEN(status.limit_amount)}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
