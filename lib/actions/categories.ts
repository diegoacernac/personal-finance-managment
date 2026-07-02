'use server'

import { createClient } from '@/lib/supabase/server'
import { categorySchema } from '@/lib/validation/category.schema'
import { revalidatePath } from 'next/cache'

export async function createCategory(formData: FormData) {
  const parsed = categorySchema.safeParse({
    name: formData.get('name'),
    type: formData.get('type'),
    color: formData.get('color') || '#64748b',
  })

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message }
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: 'No autenticado' }

  const { error } = await supabase
    .from('categories')
    .insert({ ...parsed.data, owner_id: user.id })

  if (error) return { error: error.message }

  revalidatePath('/configuracion/categorias')
  return { success: true }
}

export async function updateCategory(id: string, formData: FormData) {
  const parsed = categorySchema.safeParse({
    name: formData.get('name'),
    type: formData.get('type'),
    color: formData.get('color') || '#64748b',
  })

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message }
  }

  const supabase = await createClient()
  const { error } = await supabase.from('categories').update(parsed.data).eq('id', id)

  if (error) return { error: error.message }

  revalidatePath('/configuracion/categorias')
  return { success: true }
}

export async function deleteCategory(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('categories').delete().eq('id', id)

  if (error) return { error: error.message }

  revalidatePath('/configuracion/categorias')
  return { success: true }
}
