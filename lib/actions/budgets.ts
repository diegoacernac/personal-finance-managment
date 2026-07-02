'use server'

import { createClient } from '@/lib/supabase/server'
import { budgetSchema } from '@/lib/validation/budget.schema'
import { revalidatePath } from 'next/cache'

const PATH = '/presupuestos'

function normalizeCategoryId(categoryId: string | undefined) {
  return categoryId ? categoryId : null
}

export async function createBudget(formData: FormData) {
  const parsed = budgetSchema.safeParse({
    category_id: formData.get('category_id') ?? '',
    limit_amount: formData.get('limit_amount'),
    warning_threshold_pct: formData.get('warning_threshold_pct') || 80,
  })

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message }
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: 'No autenticado' }

  const category_id = normalizeCategoryId(parsed.data.category_id)

  // NULL category_id (overall budget) isn't covered by the unique(owner_id, category_id)
  // constraint, since SQL treats every NULL as distinct — so enforce "only one overall
  // budget" here instead.
  if (category_id === null) {
    const { data: existing } = await supabase
      .from('budgets')
      .select('id')
      .eq('owner_id', user.id)
      .is('category_id', null)
      .maybeSingle()

    if (existing) {
      return { error: 'Ya tienes un presupuesto general. Edítalo en vez de crear otro.' }
    }
  }

  const { error } = await supabase.from('budgets').insert({
    category_id,
    limit_amount: parsed.data.limit_amount,
    warning_threshold_pct: parsed.data.warning_threshold_pct,
    owner_id: user.id,
  })

  if (error) return { error: error.message }

  revalidatePath(PATH)
  revalidatePath('/')
  return { success: true }
}

export async function updateBudget(id: string, formData: FormData) {
  const parsed = budgetSchema.safeParse({
    category_id: formData.get('category_id') ?? '',
    limit_amount: formData.get('limit_amount'),
    warning_threshold_pct: formData.get('warning_threshold_pct') || 80,
  })

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message }
  }

  const supabase = await createClient()
  const { error } = await supabase
    .from('budgets')
    .update({
      category_id: normalizeCategoryId(parsed.data.category_id),
      limit_amount: parsed.data.limit_amount,
      warning_threshold_pct: parsed.data.warning_threshold_pct,
    })
    .eq('id', id)

  if (error) return { error: error.message }

  revalidatePath(PATH)
  revalidatePath('/')
  return { success: true }
}

export async function deleteBudget(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('budgets').delete().eq('id', id)

  if (error) return { error: error.message }

  revalidatePath(PATH)
  revalidatePath('/')
  return { success: true }
}
