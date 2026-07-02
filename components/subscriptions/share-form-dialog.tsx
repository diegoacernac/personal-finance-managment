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
import { addShare } from '@/lib/actions/subscriptions'
import type { Contact } from '@/lib/types'
import { UserPlus } from 'lucide-react'

export function ShareFormDialog({
  subscriptionId,
  contacts,
}: {
  subscriptionId: string
  contacts: Contact[]
}) {
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const contactItems = Object.fromEntries(contacts.map((c) => [c.id, c.name]))

  const handleSubmit = (formData: FormData) => {
    startTransition(async () => {
      const result = await addShare(subscriptionId, formData)

      if (result?.error) {
        toast.error(result.error)
        return
      }

      toast.success('Persona agregada')
      setOpen(false)
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button variant="outline" size="sm">
            <UserPlus className="h-4 w-4" />
            Agregar persona
          </Button>
        }
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Agregar persona a la suscripción</DialogTitle>
        </DialogHeader>
        <form action={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="contact_id">Contacto</Label>
            <Select name="contact_id" items={contactItems}>
              <SelectTrigger id="contact_id" className="w-full">
                <SelectValue placeholder="Selecciona un contacto" />
              </SelectTrigger>
              <SelectContent>
                {contacts.map((contact) => (
                  <SelectItem key={contact.id} value={contact.id}>
                    {contact.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {contacts.length === 0 && (
              <p className="text-xs text-muted-foreground">
                Crea contactos primero en Configuración → Contactos.
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="amount">Monto que le corresponde (S/.)</Label>
            <Input id="amount" name="amount" type="number" step="0.01" min="0" required />
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isPending || contacts.length === 0}>
              {isPending ? 'Guardando...' : 'Agregar'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
