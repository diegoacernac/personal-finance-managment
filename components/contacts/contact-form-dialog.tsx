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
import { createContact, updateContact } from '@/lib/actions/contacts'
import type { Contact } from '@/lib/types'
import { Plus } from 'lucide-react'

export function ContactFormDialog({ contact }: { contact?: Contact }) {
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const isEdit = Boolean(contact)

  const handleSubmit = (formData: FormData) => {
    startTransition(async () => {
      const result = isEdit
        ? await updateContact(contact!.id, formData)
        : await createContact(formData)

      if (result?.error) {
        toast.error(result.error)
        return
      }

      toast.success(isEdit ? 'Contacto actualizado' : 'Contacto creado')
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
              Nuevo contacto
            </Button>
          )
        }
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Editar contacto' : 'Nuevo contacto'}</DialogTitle>
        </DialogHeader>
        <form action={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nombre</Label>
            <Input id="name" name="name" defaultValue={contact?.name} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="notes">Notas (opcional)</Label>
            <Input id="notes" name="notes" defaultValue={contact?.notes ?? ''} />
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
