'use client'

import { useOptimistic, useTransition } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { markTransactionStatus } from '@/lib/actions/transactions'
import type { TransactionStatus } from '@/lib/types'
import { Check, Circle } from 'lucide-react'
import { cn } from '@/lib/utils'

export function MarkStatusToggle({
  id,
  status,
  compact = false,
}: {
  id: string
  status: TransactionStatus
  compact?: boolean
}) {
  const [optimisticStatus, setOptimisticStatus] = useOptimistic(status)
  const [, startTransition] = useTransition()

  const handleToggle = () => {
    const next: TransactionStatus = optimisticStatus === 'completed' ? 'pending' : 'completed'

    startTransition(async () => {
      setOptimisticStatus(next)
      const result = await markTransactionStatus(id, next)
      if (result?.error) {
        toast.error(result.error)
      }
    })
  }

  const isCompleted = optimisticStatus === 'completed'
  const title = isCompleted
    ? 'Completado — clic para marcar pendiente'
    : 'Pendiente — clic para marcar completado'

  if (compact) {
    return (
      <button
        type="button"
        onClick={handleToggle}
        title={title}
        aria-pressed={isCompleted}
        className="flex size-8 shrink-0 items-center justify-center rounded-md outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
      >
        <span
          className={cn(
            'flex size-5 items-center justify-center rounded-full border-2 transition-all duration-200',
            isCompleted
              ? 'border-emerald-500 bg-emerald-500 text-white'
              : 'border-muted-foreground/40 hover:border-emerald-500'
          )}
        >
          <Check className={cn('size-3 stroke-[3] transition-transform', isCompleted ? 'scale-100' : 'scale-0')} />
        </span>
      </button>
    )
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleToggle}
      title={title}
      className={cn(
        'gap-1.5',
        isCompleted ? 'text-emerald-600 dark:text-emerald-400' : 'text-muted-foreground'
      )}
    >
      {isCompleted ? <Check className="h-4 w-4" /> : <Circle className="h-4 w-4" />}
      {isCompleted ? 'Pagado' : 'Pendiente'}
    </Button>
  )
}
