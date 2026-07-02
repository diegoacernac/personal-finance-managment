'use client'

import { useTransition } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { deleteContact } from '@/lib/actions/contacts'
import { Trash2 } from 'lucide-react'

export function DeleteContactButton({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition()

  const handleDelete = () => {
    if (!confirm('¿Eliminar este contacto? No se puede borrar si tiene suscripciones compartidas.')) return

    startTransition(async () => {
      const result = await deleteContact(id)
      if (result?.error) {
        toast.error(result.error)
        return
      }
      toast.success('Contacto eliminado')
    })
  }

  return (
    <Button variant="ghost" size="sm" onClick={handleDelete} disabled={isPending}>
      <Trash2 className="h-4 w-4" />
    </Button>
  )
}
