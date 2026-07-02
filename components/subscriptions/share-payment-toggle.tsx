'use client'

import { useOptimistic, useTransition } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { toggleSharePayment } from '@/lib/actions/subscriptions'
import type { ShareStatus } from '@/lib/types'
import { Check, Circle } from 'lucide-react'
import { cn } from '@/lib/utils'

export function SharePaymentToggle({
  paymentId,
  status,
}: {
  paymentId: string | null
  status: ShareStatus | null
}) {
  const [optimisticStatus, setOptimisticStatus] = useOptimistic(status ?? 'unpaid')
  const [, startTransition] = useTransition()

  if (!paymentId) {
    return <span className="text-xs text-muted-foreground">Generando...</span>
  }

  const handleToggle = () => {
    const next: ShareStatus = optimisticStatus === 'paid' ? 'unpaid' : 'paid'

    startTransition(async () => {
      setOptimisticStatus(next)
      const result = await toggleSharePayment(paymentId, next)
      if (result?.error) {
        toast.error(result.error)
      }
    })
  }

  const isPaid = optimisticStatus === 'paid'

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleToggle}
      className={cn(
        'gap-1.5',
        isPaid ? 'text-emerald-600 dark:text-emerald-400' : 'text-muted-foreground'
      )}
    >
      {isPaid ? <Check className="h-4 w-4" /> : <Circle className="h-4 w-4" />}
      {isPaid ? 'Pagó' : 'Debe'}
    </Button>
  )
}
