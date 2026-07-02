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

  return (
    <Button
      variant="ghost"
      size={compact ? 'icon-sm' : 'sm'}
      onClick={handleToggle}
      title={isCompleted ? 'Pagado — clic para marcar pendiente' : 'Pendiente — clic para marcar pagado'}
      className={cn(
        !compact && 'gap-1.5',
        isCompleted ? 'text-emerald-600 dark:text-emerald-400' : 'text-muted-foreground'
      )}
    >
      {isCompleted ? <Check className="h-4 w-4" /> : <Circle className="h-4 w-4" />}
      {!compact && (isCompleted ? 'Pagado' : 'Pendiente')}
    </Button>
  )
}
