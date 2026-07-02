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
import { createSubscription, updateSubscription } from '@/lib/actions/subscriptions'
import type { Category, SubscriptionWithShares } from '@/lib/types'
import { Plus } from 'lucide-react'

export function SubscriptionFormDialog({
  categories,
  subscription,
}: {
  categories: Category[]
  subscription?: SubscriptionWithShares
}) {
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const isEdit = Boolean(subscription)

  const expenseCategories = categories.filter((c) => c.type === 'expense')
  const categoryItems = Object.fromEntries(expenseCategories.map((c) => [c.id, c.name]))

  const handleSubmit = (formData: FormData) => {
    startTransition(async () => {
      const result = isEdit
        ? await updateSubscription(subscription!.id, formData)
        : await createSubscription(formData)

      if (result?.error) {
        toast.error(result.error)
        return
      }

      toast.success(isEdit ? 'Suscripción actualizada' : 'Suscripción creada')
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
              Nueva suscripción
            </Button>
          )
        }
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Editar suscripción' : 'Nueva suscripción'}</DialogTitle>
        </DialogHeader>
        <form action={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="platform">Plataforma</Label>
            <Input
              id="platform"
              name="platform"
              placeholder="Netflix, Disney+..."
              defaultValue={subscription?.platform}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category_id">Categoría</Label>
            <Select
              name="category_id"
              defaultValue={subscription?.category_id}
              items={categoryItems}
            >
              <SelectTrigger id="category_id" className="w-full">
                <SelectValue placeholder="Selecciona una categoría" />
              </SelectTrigger>
              <SelectContent>
                {expenseCategories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="total_plan_amount">Costo del plan (S/.)</Label>
              <Input
                id="total_plan_amount"
                name="total_plan_amount"
                type="number"
                step="0.01"
                min="0"
                defaultValue={subscription?.total_plan_amount}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="billing_day">Día de cobro</Label>
              <Input
                id="billing_day"
                name="billing_day"
                type="number"
                min="1"
                max="31"
                defaultValue={subscription?.billing_day}
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
