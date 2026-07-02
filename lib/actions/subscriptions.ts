'use server'

import { createClient } from '@/lib/supabase/server'
import { subscriptionSchema, shareSchema } from '@/lib/validation/subscription.schema'
import { revalidatePath } from 'next/cache'

const PATH = '/configuracion/suscripciones'

export async function createSubscription(formData: FormData) {
  const parsed = subscriptionSchema.safeParse({
    category_id: formData.get('category_id'),
    platform: formData.get('platform'),
    billing_day: formData.get('billing_day'),
    total_plan_amount: formData.get('total_plan_amount'),
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
    .from('subscriptions')
    .insert({ ...parsed.data, owner_id: user.id })

  if (error) return { error: error.message }

  revalidatePath(PATH)
  return { success: true }
}

export async function updateSubscription(id: string, formData: FormData) {
  const parsed = subscriptionSchema.safeParse({
    category_id: formData.get('category_id'),
    platform: formData.get('platform'),
    billing_day: formData.get('billing_day'),
    total_plan_amount: formData.get('total_plan_amount'),
  })

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message }
  }

  const supabase = await createClient()
  const { error } = await supabase.from('subscriptions').update(parsed.data).eq('id', id)

  if (error) return { error: error.message }

  revalidatePath(PATH)
  return { success: true }
}

export async function toggleSubscriptionActive(id: string, isActive: boolean) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('subscriptions')
    .update({ is_active: isActive })
    .eq('id', id)

  if (error) return { error: error.message }

  revalidatePath(PATH)
  return { success: true }
}

export async function deleteSubscription(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('subscriptions').delete().eq('id', id)

  if (error) return { error: error.message }

  revalidatePath(PATH)
  return { success: true }
}

export async function addShare(subscriptionId: string, formData: FormData) {
  const parsed = shareSchema.safeParse({
    contact_id: formData.get('contact_id'),
    amount: formData.get('amount'),
  })

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message }
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: 'No autenticado' }

  const { error } = await supabase.from('subscription_shares').insert({
    ...parsed.data,
    subscription_id: subscriptionId,
    owner_id: user.id,
  })

  if (error) return { error: error.message }

  revalidatePath(PATH)
  return { success: true }
}

export async function removeShare(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('subscription_shares').delete().eq('id', id)

  if (error) return { error: error.message }

  revalidatePath(PATH)
  return { success: true }
}

export async function toggleSharePayment(paymentId: string, status: 'paid' | 'unpaid') {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: 'No autenticado' }

  const { error } = await supabase
    .from('subscription_share_payments')
    .update({ status, paid_at: status === 'paid' ? new Date().toISOString() : null })
    .eq('id', paymentId)

  if (error) return { error: error.message }

  if (status === 'unpaid') {
    // Reverse whatever income transaction was generated when this was marked paid.
    const { error: deleteError } = await supabase
      .from('transactions')
      .delete()
      .eq('subscription_share_payment_id', paymentId)

    if (deleteError) return { error: deleteError.message }
  } else {
    const { data: rawPayment, error: paymentError } = await supabase
      .from('subscription_share_payments')
      .select(
        'id, period, amount, subscription_shares(contacts(name), subscriptions(platform))'
      )
      .eq('id', paymentId)
      .single()

    if (paymentError) return { error: paymentError.message }

    const payment = rawPayment as unknown as {
      id: string
      period: string
      amount: number
      subscription_shares: { contacts: { name: string } | null; subscriptions: { platform: string } | null } | null
    }

    const contactName = payment.subscription_shares?.contacts?.name ?? 'Contacto'
    const platform = payment.subscription_shares?.subscriptions?.platform ?? 'Suscripción'

    let { data: incomeCategory } = await supabase
      .from('categories')
      .select('id')
      .eq('owner_id', user.id)
      .eq('type', 'income')
      .eq('name', 'Ingresos Variables')
      .maybeSingle()

    if (!incomeCategory) {
      const { data: fallback } = await supabase
        .from('categories')
        .select('id')
        .eq('owner_id', user.id)
        .eq('type', 'income')
        .order('sort_order', { ascending: true })
        .limit(1)
        .maybeSingle()
      incomeCategory = fallback
    }

    if (!incomeCategory) {
      return {
        error:
          'No tienes ninguna categoría de tipo Ingreso. Crea una en Configuración → Categorías para registrar estos cobros.',
      }
    }

    const { error: insertError } = await supabase.from('transactions').insert({
      owner_id: user.id,
      category_id: incomeCategory.id,
      subscription_share_payment_id: payment.id,
      type: 'income',
      description: `${contactName} — ${platform}`,
      amount: payment.amount,
      transaction_date: payment.period,
      period: payment.period,
      status: 'completed',
      completed_at: new Date().toISOString(),
    })

    // Unique index on subscription_share_payment_id makes this idempotent if the
    // page re-runs generation/re-submits before revalidation catches up.
    if (insertError && insertError.code !== '23505') {
      return { error: insertError.message }
    }
  }

  revalidatePath(PATH)
  revalidatePath('/transacciones')
  revalidatePath('/')
  return { success: true }
}
