'use client'

import { useState, useTransition } from 'react'
import { toast } from 'sonner'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { createCategory, updateCategory } from '@/lib/actions/categories'
import type { Category } from '@/lib/types'
import { Plus } from 'lucide-react'

const TYPE_LABELS: Record<Category['type'], string> = {
  income: 'Ingreso',
  expense: 'Gasto',
  installment: 'Cuota',
}

export function CategoryFormDialog({ category }: { category?: Category }) {
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const isEdit = Boolean(category)

  const handleSubmit = (formData: FormData) => {
    startTransition(async () => {
      const result = isEdit
        ? await updateCategory(category!.id, formData)
        : await createCategory(formData)

      if (result?.error) {
        toast.error(result.error)
        return
      }

      toast.success(isEdit ? 'Categoría actualizada' : 'Categoría creada')
      setOpen(false)
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          isEdit ? (
            <Button variant="ghost" size="sm">
              Editar
            </Button>
          ) : (
            <Button size="sm">
              <Plus className="h-4 w-4" />
              Nueva categoría
            </Button>
          )
        }
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Editar categoría' : 'Nueva categoría'}</DialogTitle>
        </DialogHeader>
        <form action={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nombre</Label>
            <Input id="name" name="name" defaultValue={category?.name} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="type">Tipo</Label>
            <Select name="type" defaultValue={category?.type ?? 'expense'} items={TYPE_LABELS}>
              <SelectTrigger id="type" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(TYPE_LABELS).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="color">Color</Label>
            <Input
              id="color"
              name="color"
              type="color"
              defaultValue={category?.color ?? '#64748b'}
              className="h-10 w-16 p-1"
            />
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isPending}>
              {isPending ? 'Guardando...' : 'Guardar'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
