import { getTransactionsForPeriod } from '@/lib/queries/transactions'
import { getMonthlyTotals, getMonthProjection } from '@/lib/queries/dashboard'
import { getBudgets, getBudgetStatus } from '@/lib/queries/budgets'
import { currentPeriod } from '@/lib/period'
import { MonthPicker } from '@/components/layout/month-picker'
import { MonthlyBarChart } from '@/components/dashboard/monthly-bar-chart'
import { ProjectionWidget } from '@/components/dashboard/projection-widget'
import { BudgetSemaforo } from '@/components/budgets/budget-semaforo'
import { SummaryCards } from '@/components/dashboard/summary-cards'
import { PageHeader } from '@/components/layout/page-header'
import { formatPeriodLabel } from '@/lib/period'

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ period?: string }>
}) {
  const params = await searchParams
  const period = params.period ?? currentPeriod()

  const [transactions, monthlyTotals, projection, budgets, budgetStatuses] = await Promise.all([
    getTransactionsForPeriod(period),
    getMonthlyTotals(6),
    getMonthProjection(period),
    getBudgets(),
    getBudgetStatus(period),
  ])

  const income = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0)
  const expense = transactions
    .filter((t) => t.type === 'expense' || t.type === 'installment')
    .reduce((sum, t) => sum + t.amount, 0)
  const balance = income - expense

  return (
    <div className="space-y-6">
      <PageHeader
        title="Resumen del mes"
        subtitle={formatPeriodLabel(period)}
        actions={<MonthPicker period={period} basePath="/" />}
      />

      <SummaryCards income={income} expense={expense} balance={balance} />

      <BudgetSemaforo budgets={budgets} statuses={budgetStatuses} />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <MonthlyBarChart data={monthlyTotals} />
        </div>
        <ProjectionWidget projection={projection} />
      </div>
    </div>
  )
}
