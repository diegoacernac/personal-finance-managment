import { getBudgets, getBudgetStatus } from '@/lib/queries/budgets'
import { getCategories } from '@/lib/queries/categories'
import { currentPeriod } from '@/lib/period'
import { formatPEN } from '@/lib/currency'
import { BudgetFormDialog } from '@/components/budgets/budget-form-dialog'
import { DeleteBudgetButton } from '@/components/budgets/delete-budget-button'
import { Badge } from '@/components/ui/badge'
import { PageHeader } from '@/components/layout/page-header'

const STATUS_LABELS = {
  green: 'Bien',
  yellow: 'Cerca del límite',
  red: 'Excedido',
} as const

export default async function PresupuestosPage() {
  const period = currentPeriod()
  const [budgets, statuses, categories] = await Promise.all([
    getBudgets(),
    getBudgetStatus(period),
    getCategories(),
  ])

  const statusByBudget = new Map(statuses.map((s) => [s.budget_id, s]))

  return (
    <div className="space-y-6">
      <PageHeader
        title="Presupuestos"
        subtitle="Límites mensuales con alerta visual"
        actions={<BudgetFormDialog categories={categories} />}
      />

      <div className="divide-y rounded-lg border">
        {budgets.map((budget) => {
          const status = statusByBudget.get(budget.id)
          return (
            <div key={budget.id} className="flex items-center justify-between px-4 py-3">
              <div className="flex items-center gap-3">
                {budget.category_id ? (
                  <span
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: budget.categories?.color ?? '#64748b' }}
                  />
                ) : (
                  <span className="h-3 w-3 rounded-full bg-foreground" />
                )}
                <div>
                  <p className="font-medium">{budget.categories?.name ?? 'General'}</p>
                  <p className="text-sm text-muted-foreground">
                    Límite {formatPEN(budget.limit_amount)} · alerta al{' '}
                    {budget.warning_threshold_pct}%
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {status && (
                  <Badge
                    variant={
                      status.semaforo_status === 'red'
                        ? 'destructive'
                        : status.semaforo_status === 'yellow'
                          ? 'secondary'
                          : 'default'
                    }
                  >
                    {STATUS_LABELS[status.semaforo_status]}
                  </Badge>
                )}
                <BudgetFormDialog categories={categories} budget={budget} />
                <DeleteBudgetButton id={budget.id} />
              </div>
            </div>
          )
        })}
        {budgets.length === 0 && (
          <p className="px-4 py-8 text-center text-sm text-muted-foreground">
            No tienes presupuestos todavía.
          </p>
        )}
      </div>
    </div>
  )
}
