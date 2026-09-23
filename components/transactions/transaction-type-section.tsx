import { Card } from '@/components/ui/card'
import { formatPEN } from '@/lib/currency'
import type { TypeGroup } from '@/lib/transactions-group'
import type { Category, SubscriptionShareWithStatus } from '@/lib/types'
import { MarkStatusToggle } from '@/components/transactions/mark-status-toggle'
import { TransactionRowActions } from '@/components/transactions/transaction-row-actions'
import { SubscriptionSharesDisclosure } from '@/components/transactions/subscription-shares-disclosure'
import { cn } from '@/lib/utils'
import { TrendingUp, TrendingDown, Landmark } from 'lucide-react'

const TYPE_ICONS = {
  income: TrendingUp,
  expense: TrendingDown,
  installment: Landmark,
} as const

const TYPE_TONES = {
  income: { text: 'text-emerald-600 dark:text-emerald-400', bar: 'bg-emerald-500' },
  expense: { text: 'text-red-600 dark:text-red-400', bar: 'bg-red-500' },
  installment: { text: 'text-amber-600 dark:text-amber-400', bar: 'bg-amber-500' },
} as const

const DONE_LABELS = {
  income: 'recibido',
  expense: 'pagado',
  installment: 'pagado',
} as const

const MONTHS = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'set', 'oct', 'nov', 'dic']

function formatDay(dateStr: string) {
  const [, month, day] = dateStr.split('-')
  return `${day} ${MONTHS[Number(month) - 1]}`
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
  const donePct = group.total > 0 ? ((group.total - group.pendingTotal) / group.total) * 100 : 0

  return (
    <Card className="flex flex-col gap-0 p-4">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className={cn('flex h-8 w-8 items-center justify-center rounded-lg bg-current/10', tone.text)}>
            <Icon className="h-4 w-4" />
          </div>
          <p className="font-semibold">{group.label}</p>
        </div>
        <span className={cn('text-lg font-semibold tabular-nums', tone.text)}>
          {formatPEN(group.total)}
        </span>
      </div>

      {group.total > 0 && (
        <div className="mt-3 space-y-1.5">
          <div className="h-1.5 overflow-hidden rounded-full bg-muted">
            <div className={cn('h-full rounded-full', tone.bar)} style={{ width: `${donePct}%` }} />
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>
              {Math.round(donePct)}% {DONE_LABELS[group.type]}
            </span>
            {group.pendingTotal > 0 && (
              <span className="tabular-nums">{formatPEN(group.pendingTotal)} pendiente</span>
            )}
          </div>
        </div>
      )}

      <div className="mt-4 space-y-4">
        {group.categories.map((cat) => (
          <section key={cat.categoryId}>
            <div className="mb-1.5 flex items-center justify-between px-1">
              <span className="flex items-center gap-1.5 text-xs font-medium tracking-wide text-muted-foreground uppercase">
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: cat.categoryColor }}
                />
                {cat.categoryName}
              </span>
              <span className="text-xs font-medium text-muted-foreground tabular-nums">
                {formatPEN(cat.subtotal)}
              </span>
            </div>
            <div className="divide-y divide-border/60 overflow-hidden rounded-lg bg-muted/40">
              {cat.items.map((t) => {
                const shares = t.subscription_id
                  ? sharesBySubscriptionId.get(t.subscription_id)
                  : undefined
                const isPending = t.status === 'pending'

                return (
                  <div key={t.id}>
                    <div className="group/row flex items-center gap-2 py-1.5 pr-1 pl-1.5 transition-colors hover:bg-muted/60">
                      <MarkStatusToggle id={t.id} status={t.status} compact />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">{t.description}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatDay(t.transaction_date)}
                          {isPending && (
                            <span className="text-amber-600 dark:text-amber-400"> · Pendiente</span>
                          )}
                        </p>
                      </div>
                      <span
                        className={cn(
                          'shrink-0 text-sm font-semibold tabular-nums',
                          isPending && 'text-muted-foreground'
                        )}
                      >
                        {formatPEN(t.amount)}
                      </span>
                      <TransactionRowActions transaction={t} categories={categories} />
                    </div>
                    {shares && <SubscriptionSharesDisclosure shares={shares} />}
                  </div>
                )
              })}
            </div>
          </section>
        ))}

        {group.categories.length === 0 && (
          <p className="rounded-lg border border-dashed py-8 text-center text-sm text-muted-foreground">
            Sin movimientos este mes.
          </p>
        )}
      </div>
    </Card>
  )
}
