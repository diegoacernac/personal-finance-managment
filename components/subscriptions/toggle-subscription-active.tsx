'use client'

import { useTransition } from 'react'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'
import { toggleSubscriptionActive } from '@/lib/actions/subscriptions'

export function ToggleSubscriptionActive({ id, isActive }: { id: string; isActive: boolean }) {
  const [isPending, startTransition] = useTransition()

  const handleToggle = () => {
    startTransition(async () => {
      const result = await toggleSubscriptionActive(id, !isActive)
      if (result?.error) {
        toast.error(result.error)
        return
      }
      toast.success(isActive ? 'Suscripción pausada' : 'Suscripción activada')
    })
  }

  return (
    <button type="button" onClick={handleToggle} disabled={isPending}>
      <Badge variant={isActive ? 'default' : 'outline'} className="cursor-pointer">
        {isActive ? 'Activa' : 'Pausada'}
      </Badge>
    </button>
  )
}
