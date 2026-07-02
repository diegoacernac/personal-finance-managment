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
import { createTemplate, updateTemplate } from '@/lib/actions/templates'
import type { Category, RecurringTemplateWithCategory } from '@/lib/types'
import { Plus } from 'lucide-react'

const TYPE_LABELS: Record<Category['type'], string> = {
  income: 'Ingreso fijo',
  expense: 'Gasto fijo',
  installment: 'Cuota',
}

export function TemplateFormDialog({
  categories,
  template,
}: {
  categories: Category[]
  template?: RecurringTemplateWithCategory
}) {
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [type, setType] = useState<Category['type']>(template?.type ?? 'expense')
  const isEdit = Boolean(template)
  const isInstallment = type === 'installment'

  const filteredCategories = categories.filter((c) => c.type === type)
  const categoryItems = Object.fromEntries(filteredCategories.map((c) => [c.id, c.name]))

  const handleSubmit = (formData: FormData) => {
    startTransition(async () => {
      const result = isEdit
        ? await updateTemplate(template!.id, formData)
        : await createTemplate(formData)

      if (result?.error) {
        toast.error(result.error)
        return
      }

      toast.success(isEdit ? 'Plantilla actualizada' : 'Plantilla creada')
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
              Nueva plantilla
            </Button>
          )
        }
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Editar plantilla' : 'Nueva plantilla recurrente'}</DialogTitle>
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
              defaultValue={template?.category_id}
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
              defaultValue={template?.description}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount">
                {isInstallment ? 'Cuota mensual (S/.)' : 'Monto mensual (S/.)'}
              </Label>
              <Input
                id="amount"
                name="amount"
                type="number"
                step="0.01"
                min="0"
                defaultValue={template?.amount}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="day_of_month">Día del mes</Label>
              <Input
                id="day_of_month"
                name="day_of_month"
                type="number"
                min="1"
                max="31"
                defaultValue={template?.day_of_month}
                required
              />
            </div>
          </div>

          {isInstallment && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="total_amount">Deuda total (S/.)</Label>
                <Input
                  id="total_amount"
                  name="total_amount"
                  type="number"
                  step="0.01"
                  min="0"
                  defaultValue={template?.total_amount ?? undefined}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="installments_total">N° de cuotas</Label>
                <Input
                  id="installments_total"
                  name="installments_total"
                  type="number"
                  min="1"
                  defaultValue={template?.installments_total ?? undefined}
                  required
                />
              </div>
            </div>
          )}

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
