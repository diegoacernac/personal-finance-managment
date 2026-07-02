'use client'

import { useTransition } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { deleteSubscription } from '@/lib/actions/subscriptions'
import { Trash2 } from 'lucide-react'

export function DeleteSubscriptionButton({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition()

  const handleDelete = () => {
    if (!confirm('¿Eliminar esta suscripción y todos sus deudores compartidos?')) return

    startTransition(async () => {
      const result = await deleteSubscription(id)
      if (result?.error) {
        toast.error(result.error)
        return
      }
      toast.success('Suscripción eliminada')
    })
  }

  return (
    <Button variant="ghost" size="sm" onClick={handleDelete} disabled={isPending}>
      <Trash2 className="h-4 w-4" />
    </Button>
  )
}
