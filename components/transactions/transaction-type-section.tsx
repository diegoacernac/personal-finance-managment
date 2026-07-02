import { Card } from '@/components/ui/card'
import { formatPEN } from '@/lib/currency'
import type { TypeGroup } from '@/lib/transactions-group'
import type { Category, SubscriptionShareWithStatus } from '@/lib/types'
import { MarkStatusToggle } from '@/components/transactions/mark-status-toggle'
import { TransactionFormDialog } from '@/components/transactions/transaction-form-dialog'
import { DeleteTransactionButton } from '@/components/transactions/delete-transaction-button'
import { SubscriptionSharesDisclosure } from '@/components/transactions/subscription-shares-disclosure'
import { cn } from '@/lib/utils'
import { TrendingUp, TrendingDown, Landmark } from 'lucide-react'

const TYPE_ICONS = {
  income: TrendingUp,
  expense: TrendingDown,
  installment: Landmark,
} as const

const TYPE_TONES = {
  income: 'text-emerald-600 dark:text-emerald-400',
  expense: 'text-red-600 dark:text-red-400',
  installment: 'text-amber-600 dark:text-amber-400',
} as const

function formatDay(dateStr: string) {
  const [, month, day] = dateStr.split('-')
  return `${day}/${month}`
}

export function TransactionTypeSection({
  group,
  categories,
  sharesBySubscriptionId,
}: {
  group: TypeGroup
  categories: Category[]
  sharesBySubscriptionId: Map<string, SubscriptionShareWithStatus[]>
}) {
  const Icon = TYPE_ICONS[group.type]
  const tone = TYPE_TONES[group.type]

  return (
    <Card className="animate-in fade-in slide-in-from-bottom-2 flex flex-col p-4 duration-500">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={cn('flex h-7 w-7 items-center justify-center rounded-full bg-current/10', tone)}>
            <Icon className={cn('h-4 w-4', tone)} />
          </div>
          <p className="text-sm font-semibold">{group.label}</p>
        </div>
        <span className={cn('text-lg font-semibold', tone)}>{formatPEN(group.total)}</span>
      </div>

      {group.pendingTotal > 0 && (
        <p className="mb-3 text-xs text-muted-foreground">
          {formatPEN(group.pendingTotal)} pendiente
        </p>
      )}

      <div className="space-y-4">
        {group.categories.map((cat) => (
          <div key={cat.categoryId}>
            <div className="mb-1 flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: cat.categoryColor }}
                />
                {cat.categoryName}
              </span>
              <span className="text-xs font-medium text-muted-foreground">
                {formatPEN(cat.subtotal)}
              </span>
            </div>
            <div className="divide-y rounded-md border">
              {cat.items.map((t) => {
                const shares = t.subscription_id
                  ? sharesBySubscriptionId.get(t.subscription_id)
                  : undefined

                return (
                  <div key={t.id}>
                    <div className="group/row flex items-center justify-between gap-2 px-2 py-1.5">
                      <div className="min-w-0">
                        <p className="truncate text-sm">{t.description}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatDay(t.transaction_date)}
                        </p>
                      </div>
                      <div className="flex shrink-0 items-center gap-0.5">
                        <span className="mr-1 text-sm font-medium">{formatPEN(t.amount)}</span>
                        <MarkStatusToggle id={t.id} status={t.status} compact />
                        <TransactionFormDialog categories={categories} transaction={t} compact />
                        <DeleteTransactionButton id={t.id} compact />
                      </div>
                    </div>
                    {shares && <SubscriptionSharesDisclosure shares={shares} />}
                  </div>
                )
              })}
            </div>
          </div>
        ))}

        {group.categories.length === 0 && (
          <p className="py-6 text-center text-sm text-muted-foreground">
            Sin movimientos este mes.
          </p>
        )}
      </div>
    </Card>
  )
}
