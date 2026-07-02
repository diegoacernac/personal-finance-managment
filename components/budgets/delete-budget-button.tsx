'use client'

import { useTransition } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { deleteBudget } from '@/lib/actions/budgets'
import { Trash2 } from 'lucide-react'

export function DeleteBudgetButton({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition()

  const handleDelete = () => {
    if (!confirm('¿Eliminar este presupuesto?')) return

    startTransition(async () => {
      const result = await deleteBudget(id)
      if (result?.error) {
        toast.error(result.error)
        return
      }
      toast.success('Presupuesto eliminado')
    })
  }

  return (
    <Button variant="ghost" size="sm" onClick={handleDelete} disabled={isPending}>
      <Trash2 className="h-4 w-4" />
    </Button>
  )
}
