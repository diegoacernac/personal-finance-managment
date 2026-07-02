import { createClient } from '@/lib/supabase/server'

export async function ensurePeriodGenerated(period: string) {
  const supabase = await createClient()

  const [{ error: templatesError }, { error: subscriptionsError }] = await Promise.all([
    supabase.rpc('generate_transactions_for_period', { p_period: period }),
    supabase.rpc('generate_subscription_period', { p_period: period }),
  ])

  if (templatesError) throw new Error(templatesError.message)
  if (subscriptionsError) throw new Error(subscriptionsError.message)
}
