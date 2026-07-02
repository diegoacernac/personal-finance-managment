'use client'

import { useTransition } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { deleteTransaction } from '@/lib/actions/transactions'
import { Trash2 } from 'lucide-react'

export function DeleteTransactionButton({
  id,
  compact = false,
}: {
  id: string
  compact?: boolean
}) {
  const [isPending, startTransition] = useTransition()

  const handleDelete = () => {
    if (!confirm('¿Eliminar este movimiento?')) return

    startTransition(async () => {
      const result = await deleteTransaction(id)
      if (result?.error) {
        toast.error(result.error)
        return
      }
      toast.success('Movimiento eliminado')
    })
  }

  return (
    <Button
      variant="ghost"
      size={compact ? 'icon-sm' : 'sm'}
      onClick={handleDelete}
      disabled={isPending}
      title="Eliminar"
    >
      <Trash2 className="h-3.5 w-3.5" />
    </Button>
  )
}
