'use server'

import { createClient } from '@/lib/supabase/server'
import { contactSchema } from '@/lib/validation/contact.schema'
import { revalidatePath } from 'next/cache'

export async function createContact(formData: FormData) {
  const parsed = contactSchema.safeParse({
    name: formData.get('name'),
    notes: formData.get('notes'),
  })

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message }
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: 'No autenticado' }

  const { notes, ...rest } = parsed.data

  const { error } = await supabase
    .from('contacts')
    .insert({ ...rest, notes: notes || null, owner_id: user.id })

  if (error) return { error: error.message }

  revalidatePath('/configuracion/contactos')
  return { success: true }
}

export async function updateContact(id: string, formData: FormData) {
  const parsed = contactSchema.safeParse({
    name: formData.get('name'),
    notes: formData.get('notes'),
  })

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message }
  }

  const supabase = await createClient()
  const { notes, ...rest } = parsed.data

  const { error } = await supabase
    .from('contacts')
    .update({ ...rest, notes: notes || null })
    .eq('id', id)

  if (error) return { error: error.message }

  revalidatePath('/configuracion/contactos')
  return { success: true }
}

export async function deleteContact(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('contacts').delete().eq('id', id)

  if (error) return { error: error.message }

  revalidatePath('/configuracion/contactos')
  return { success: true }
}
