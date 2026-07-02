'use client'

import { useTransition } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { deleteCategory } from '@/lib/actions/categories'
import { Trash2 } from 'lucide-react'

export function DeleteCategoryButton({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition()

  const handleDelete = () => {
    if (!confirm('¿Eliminar esta categoría?')) return

    startTransition(async () => {
      const result = await deleteCategory(id)
      if (result?.error) {
        toast.error(result.error)
        return
      }
      toast.success('Categoría eliminada')
    })
  }

  return (
    <Button variant="ghost" size="sm" onClick={handleDelete} disabled={isPending}>
      <Trash2 className="h-4 w-4" />
    </Button>
  )
}
