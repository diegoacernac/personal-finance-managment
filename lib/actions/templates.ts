'use server'

import { createClient } from '@/lib/supabase/server'
import { templateSchema } from '@/lib/validation/template.schema'
import { revalidatePath } from 'next/cache'

function parseTemplateForm(formData: FormData) {
  return templateSchema.safeParse({
    category_id: formData.get('category_id'),
    type: formData.get('type'),
    description: formData.get('description'),
    amount: formData.get('amount'),
    day_of_month: formData.get('day_of_month'),
    total_amount: formData.get('total_amount') || undefined,
    installments_total: formData.get('installments_total') || undefined,
  })
}

export async function createTemplate(formData: FormData) {
  const parsed = parseTemplateForm(formData)
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message }
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: 'No autenticado' }

  const { error } = await supabase.from('recurring_templates').insert({
    ...parsed.data,
    owner_id: user.id,
  })

  if (error) return { error: error.message }

  revalidatePath('/configuracion/plantillas')
  return { success: true }
}

export async function updateTemplate(id: string, formData: FormData) {
  const parsed = parseTemplateForm(formData)
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message }
  }

  const supabase = await createClient()
  const { error } = await supabase.from('recurring_templates').update(parsed.data).eq('id', id)

  if (error) return { error: error.message }

  revalidatePath('/configuracion/plantillas')
  return { success: true }
}

export async function toggleTemplateActive(id: string, isActive: boolean) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('recurring_templates')
    .update({ is_active: isActive })
    .eq('id', id)

  if (error) return { error: error.message }

  revalidatePath('/configuracion/plantillas')
  return { success: true }
}

export async function deleteTemplate(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('recurring_templates').delete().eq('id', id)

  if (error) return { error: error.message }

  revalidatePath('/configuracion/plantillas')
  return { success: true }
}
