'use client'

import { useTransition } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { deleteTemplate } from '@/lib/actions/templates'
import { Trash2 } from 'lucide-react'

export function DeleteTemplateButton({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition()

  const handleDelete = () => {
    if (!confirm('¿Eliminar esta plantilla? Los movimientos ya generados no se borran.')) return

    startTransition(async () => {
      const result = await deleteTemplate(id)
      if (result?.error) {
        toast.error(result.error)
        return
      }
      toast.success('Plantilla eliminada')
    })
  }

  return (
    <Button variant="ghost" size="sm" onClick={handleDelete} disabled={isPending}>
      <Trash2 className="h-4 w-4" />
    </Button>
  )
}
