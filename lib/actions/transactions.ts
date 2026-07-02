'use server'

import { createClient } from '@/lib/supabase/server'
import { transactionSchema } from '@/lib/validation/transaction.schema'
import { revalidatePath } from 'next/cache'

function periodFromDate(dateStr: string) {
  return `${dateStr.slice(0, 7)}-01`
}

export async function createTransaction(formData: FormData) {
  const parsed = transactionSchema.safeParse({
    category_id: formData.get('category_id'),
    type: formData.get('type'),
    description: formData.get('description'),
    amount: formData.get('amount'),
    transaction_date: formData.get('transaction_date'),
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

  const { error } = await supabase.from('transactions').insert({
    ...rest,
    notes: notes || null,
    owner_id: user.id,
    period: periodFromDate(rest.transaction_date),
    status: 'pending',
  })

  if (error) return { error: error.message }

  revalidatePath('/transacciones')
  revalidatePath('/')
  return { success: true }
}

export async function updateTransaction(id: string, formData: FormData) {
  const parsed = transactionSchema.safeParse({
    category_id: formData.get('category_id'),
    type: formData.get('type'),
    description: formData.get('description'),
    amount: formData.get('amount'),
    transaction_date: formData.get('transaction_date'),
    notes: formData.get('notes'),
  })

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message }
  }

  const supabase = await createClient()
  const { notes, ...rest } = parsed.data

  const { error } = await supabase
    .from('transactions')
    .update({
      ...rest,
      notes: notes || null,
      period: periodFromDate(rest.transaction_date),
    })
    .eq('id', id)

  if (error) return { error: error.message }

  revalidatePath('/transacciones')
  revalidatePath('/')
  return { success: true }
}

export async function deleteTransaction(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('transactions').delete().eq('id', id)

  if (error) return { error: error.message }

  revalidatePath('/transacciones')
  revalidatePath('/')
  return { success: true }
}

export async function markTransactionStatus(id: string, status: 'pending' | 'completed') {
  const supabase = await createClient()

  const { data: current, error: fetchError } = await supabase
    .from('transactions')
    .select('status, template_id, type')
    .eq('id', id)
    .single()

  if (fetchError) return { error: fetchError.message }
  if (current.status === status) return { success: true }

  const { error } = await supabase
    .from('transactions')
    .update({
      status,
      completed_at: status === 'completed' ? new Date().toISOString() : null,
    })
    .eq('id', id)

  if (error) return { error: error.message }

  // Installment templates: keep the paid-cuota counter in sync and auto-deactivate
  // once fully paid off, so no further monthly instances are generated for it.
  if (current.template_id && current.type === 'installment') {
    const { data: template } = await supabase
      .from('recurring_templates')
      .select('installments_paid_count, installments_total')
      .eq('id', current.template_id)
      .single()

    if (template) {
      const delta = status === 'completed' ? 1 : -1
      const nextCount = Math.max(0, template.installments_paid_count + delta)
      const isDone =
        template.installments_total != null && nextCount >= template.installments_total

      await supabase
        .from('recurring_templates')
        .update({ installments_paid_count: nextCount, is_active: !isDone })
        .eq('id', current.template_id)
    }
  }

  revalidatePath('/transacciones')
  revalidatePath('/')
  revalidatePath('/configuracion/plantillas')
  return { success: true }
}
