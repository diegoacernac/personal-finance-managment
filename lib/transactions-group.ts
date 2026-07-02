import type { TransactionType, TransactionWithCategory } from '@/lib/types'

export type CategoryGroup = {
  categoryId: string
  categoryName: string
  categoryColor: string
  subtotal: number
  items: TransactionWithCategory[]
}

export type TypeGroup = {
  type: TransactionType
  label: string
  total: number
  pendingTotal: number
  categories: CategoryGroup[]
}

const TYPE_ORDER: TransactionType[] = ['income', 'expense', 'installment']
const TYPE_LABELS: Record<TransactionType, string> = {
  income: 'Ingresos',
  expense: 'Gastos',
  installment: 'Cuotas',
}

export function groupTransactions(transactions: TransactionWithCategory[]): TypeGroup[] {
  return TYPE_ORDER.map((type) => {
    const items = transactions.filter((t) => t.type === type)

    const byCategory = new Map<string, CategoryGroup>()
    for (const t of items) {
      const key = t.category_id
      if (!byCategory.has(key)) {
        byCategory.set(key, {
          categoryId: key,
          categoryName: t.categories?.name ?? 'Sin categoría',
          categoryColor: t.categories?.color ?? '#64748b',
          subtotal: 0,
          items: [],
        })
      }
      const group = byCategory.get(key)!
      group.items.push(t)
      group.subtotal += t.amount
    }

    for (const group of byCategory.values()) {
      group.items.sort((a, b) => a.transaction_date.localeCompare(b.transaction_date))
    }

    const categories = Array.from(byCategory.values()).sort((a, b) =>
      a.categoryName.localeCompare(b.categoryName)
    )

    return {
      type,
      label: TYPE_LABELS[type],
      total: items.reduce((sum, t) => sum + t.amount, 0),
      pendingTotal: items
        .filter((t) => t.status === 'pending')
        .reduce((sum, t) => sum + t.amount, 0),
      categories,
    }
  })
}
