import { formatPEN } from '@/lib/currency'
import type { TypeGroup } from '@/lib/transactions-group'
import { cn } from '@/lib/utils'

export function MonthSummary({ groups }: { groups: TypeGroup[] }) {
  const income = groups.find((g) => g.type === 'income')?.total ?? 0
  const outflow = groups
    .filter((g) => g.type !== 'income')
    .reduce((sum, g) => sum + g.total, 0)
  const pendingOutflow = groups
    .filter((g) => g.type !== 'income')
    .reduce((sum, g) => sum + g.pendingTotal, 0)
  const balance = income - outflow

  const stats = [
    { label: 'Ingresos', value: formatPEN(income), tone: 'text-emerald-600 dark:text-emerald-400' },
    {
      label: 'Egresos',
      value: formatPEN(outflow),
      hint: pendingOutflow > 0 ? `${formatPEN(pendingOutflow)} por pagar` : undefined,
      tone: 'text-red-600 dark:text-red-400',
    },
    {
      label: 'Balance',
      value: formatPEN(balance),
      tone: balance >= 0 ? 'text-primary' : 'text-red-600 dark:text-red-400',
    },
  ]

  return (
    <div className="grid grid-cols-3 divide-x rounded-xl bg-card shadow-sm ring-1 ring-foreground/10">
      {stats.map((stat) => (
        <div key={stat.label} className="min-w-0 px-3 py-3 sm:px-5 sm:py-4">
          <p className="text-xs font-medium text-muted-foreground">{stat.label}</p>
          <p className={cn('truncate text-base font-bold tabular-nums sm:text-xl', stat.tone)}>
            {stat.value}
          </p>
          {stat.hint && (
            <p className="hidden truncate text-xs text-muted-foreground sm:block">{stat.hint}</p>
          )}
        </div>
      ))}
    </div>
  )
}
