import { getTransactionsForPeriod } from '@/lib/queries/transactions'
import { getCategories } from '@/lib/queries/categories'
import { getSubscriptionsWithShares } from '@/lib/queries/subscriptions'
import { currentPeriod } from '@/lib/period'
import { groupTransactions } from '@/lib/transactions-group'
import { MonthPicker } from '@/components/layout/month-picker'
import { TransactionFormDialog } from '@/components/transactions/transaction-form-dialog'
import { TransactionTypeSection } from '@/components/transactions/transaction-type-section'
import { PageHeader } from '@/components/layout/page-header'

export default async function TransaccionesPage({
  searchParams,
}: {
  searchParams: Promise<{ period?: string }>
}) {
  const params = await searchParams
  const period = params.period ?? currentPeriod()

  const [transactions, categories, subscriptions] = await Promise.all([
    getTransactionsForPeriod(period),
    getCategories(),
    getSubscriptionsWithShares(period),
  ])

  const groups = groupTransactions(transactions)
  const sharesBySubscriptionId = new Map(subscriptions.map((s) => [s.id, s.shares]))

  return (
    <div className="space-y-6">
      <PageHeader
        title="Transacciones"
        subtitle="Ingresos, gastos y cuotas del mes"
        actions={
          <>
            <MonthPicker period={period} basePath="/transacciones" />
            <TransactionFormDialog categories={categories} />
          </>
        }
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {groups.map((group) => (
          <TransactionTypeSection
            key={group.type}
            group={group}
            categories={categories}
            sharesBySubscriptionId={sharesBySubscriptionId}
          />
        ))}
      </div>
    </div>
  )
}
