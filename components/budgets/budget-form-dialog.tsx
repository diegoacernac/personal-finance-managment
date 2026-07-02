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
import { createBudget, updateBudget } from '@/lib/actions/budgets'
import type { BudgetWithCategory, Category } from '@/lib/types'
import { Plus } from 'lucide-react'

const OVERALL_VALUE = '__overall__'

export function BudgetFormDialog({
  categories,
  budget,
}: {
  categories: Category[]
  budget?: BudgetWithCategory
}) {
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const isEdit = Boolean(budget)

  const spendCategories = categories.filter((c) => c.type === 'expense' || c.type === 'installment')
  const categoryItems = {
    [OVERALL_VALUE]: 'General (todos los gastos)',
    ...Object.fromEntries(spendCategories.map((c) => [c.id, c.name])),
  }

  const handleSubmit = (formData: FormData) => {
    const rawCategory = formData.get('category_id')
    if (rawCategory === OVERALL_VALUE) {
      formData.set('category_id', '')
    }

    startTransition(async () => {
      const result = isEdit
        ? await updateBudget(budget!.id, formData)
        : await createBudget(formData)

      if (result?.error) {
        toast.error(result.error)
        return
      }

      toast.success(isEdit ? 'Presupuesto actualizado' : 'Presupuesto creado')
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
              Nuevo presupuesto
            </Button>
          )
        }
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Editar presupuesto' : 'Nuevo presupuesto'}</DialogTitle>
        </DialogHeader>
        <form action={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="category_id">Categoría</Label>
            <Select
              name="category_id"
              defaultValue={budget?.category_id ?? OVERALL_VALUE}
              items={categoryItems}
            >
              <SelectTrigger id="category_id" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={OVERALL_VALUE}>General (todos los gastos)</SelectItem>
                {spendCategories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="limit_amount">Límite mensual (S/.)</Label>
              <Input
                id="limit_amount"
                name="limit_amount"
                type="number"
                step="0.01"
                min="0"
                defaultValue={budget?.limit_amount}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="warning_threshold_pct">Alerta amarilla (%)</Label>
              <Input
                id="warning_threshold_pct"
                name="warning_threshold_pct"
                type="number"
                min="1"
                max="100"
                defaultValue={budget?.warning_threshold_pct ?? 80}
                required
              />
            </div>
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
