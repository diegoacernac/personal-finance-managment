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
import { createTransaction, updateTransaction } from '@/lib/actions/transactions'
import type { Category, TransactionWithCategory } from '@/lib/types'
import { Plus, Pencil } from 'lucide-react'

const TYPE_LABELS: Record<Category['type'], string> = {
  income: 'Ingreso',
  expense: 'Gasto',
  installment: 'Cuota',
}

export function TransactionFormDialog({
  categories,
  transaction,
  compact = false,
  open: controlledOpen,
  onOpenChange,
}: {
  categories: Category[]
  transaction?: TransactionWithCategory
  compact?: boolean
  // When controlled, the dialog renders without its own trigger button.
  open?: boolean
  onOpenChange?: (open: boolean) => void
}) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false)
  const isControlled = controlledOpen !== undefined
  const open = isControlled ? controlledOpen : uncontrolledOpen
  const setOpen = isControlled ? (onOpenChange ?? (() => {})) : setUncontrolledOpen
  const [isPending, startTransition] = useTransition()
  const [type, setType] = useState<Category['type']>(transaction?.type ?? 'expense')
  const isEdit = Boolean(transaction)

  const filteredCategories = categories.filter((c) => c.type === type)
  const categoryItems = Object.fromEntries(filteredCategories.map((c) => [c.id, c.name]))

  const handleSubmit = (formData: FormData) => {
    startTransition(async () => {
      const result = isEdit
        ? await updateTransaction(transaction!.id, formData)
        : await createTransaction(formData)

      if (result?.error) {
        toast.error(result.error)
        return
      }

      toast.success(isEdit ? 'Movimiento actualizado' : 'Movimiento creado')
      setOpen(false)
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {!isControlled && (
        <DialogTrigger
          render={
            isEdit ? (
              compact ? (
                <Button variant="ghost" size="icon-sm" title="Editar">
                  <Pencil className="h-3.5 w-3.5" />
                </Button>
              ) : (
                <Button variant="ghost" size="sm">
                  Editar
                </Button>
              )
            ) : (
              <Button size="sm">
                <Plus className="h-4 w-4" />
                Nuevo movimiento
              </Button>
            )
          }
        />
      )}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Editar movimiento' : 'Nuevo movimiento'}</DialogTitle>
        </DialogHeader>
        <form action={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="type">Tipo</Label>
            <Select
              name="type"
              value={type}
              onValueChange={(value) => setType(value as Category['type'])}
              items={TYPE_LABELS}
            >
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
            <Label htmlFor="category_id">Categoría</Label>
            <Select
              name="category_id"
              defaultValue={transaction?.category_id}
              items={categoryItems}
            >
              <SelectTrigger id="category_id" className="w-full">
                <SelectValue placeholder="Selecciona una categoría" />
              </SelectTrigger>
              <SelectContent>
                {filteredCategories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descripción</Label>
            <Input
              id="description"
              name="description"
              defaultValue={transaction?.description}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Monto (S/.)</Label>
              <Input
                id="amount"
                name="amount"
                type="number"
                step="0.01"
                min="0"
                defaultValue={transaction?.amount}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="transaction_date">Fecha</Label>
              <Input
                id="transaction_date"
                name="transaction_date"
                type="date"
                defaultValue={transaction?.transaction_date}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notas (opcional)</Label>
            <Input id="notes" name="notes" defaultValue={transaction?.notes ?? ''} />
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
