import { cache } from 'react'
import { createClient } from '@/lib/supabase/server'

// Memoized per request: transactions and subscriptions both need the period
// generated, but the RPCs should only run once per render.
export const ensurePeriodGenerated = cache(async (period: string) => {
  const supabase = await createClient()

  const [{ error: templatesError }, { error: subscriptionsError }] = await Promise.all([
    supabase.rpc('generate_transactions_for_period', { p_period: period }),
    supabase.rpc('generate_subscription_period', { p_period: period }),
  ])

  if (templatesError) throw new Error(templatesError.message)
  if (subscriptionsError) throw new Error(subscriptionsError.message)
})
