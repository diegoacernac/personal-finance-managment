import { createClient } from '@/lib/supabase/server'
import { ensurePeriodGenerated } from '@/lib/queries/generation'
import type { Category, SubscriptionWithShares, ShareStatus } from '@/lib/types'

type RawShare = {
  id: string
  subscription_id: string
  contact_id: string
  amount: number
  contacts: { id: string; name: string } | null
}

type RawSubscription = {
  id: string
  owner_id: string
  category_id: string
  platform: string
  billing_day: number
  total_plan_amount: number
  is_active: boolean
  created_at: string
  updated_at: string
  categories: Pick<Category, 'id' | 'name' | 'color'> | null
  subscription_shares: RawShare[]
}

export async function getSubscriptionsWithShares(period: string): Promise<SubscriptionWithShares[]> {
  const supabase = await createClient()

  const [{ data: subscriptions, error: subError }, { data: netCosts, error: netError }, { data: payments, error: payError }] =
    await Promise.all([
      supabase
        .from('subscriptions')
        .select(
          '*, categories(id, name, color), subscription_shares(id, subscription_id, contact_id, amount, contacts(id, name))'
        )
        .order('billing_day', { ascending: true }),
      supabase.from('subscription_net_cost').select('subscription_id, diego_net_cost'),
      // Share-payment rows for this period are backfilled by the generation RPC,
      // so only this query has to wait for it.
      ensurePeriodGenerated(period).then(() =>
        supabase
          .from('subscription_share_payments')
          .select('id, subscription_share_id, status')
          .eq('period', period)
      ),
    ])

  if (subError) throw new Error(subError.message)
  if (netError) throw new Error(netError.message)
  if (payError) throw new Error(payError.message)

  const netCostBySubscription = new Map(
    (netCosts ?? []).map((n) => [n.subscription_id as string, n.diego_net_cost as number])
  )
  const paymentByShare = new Map(
    (payments ?? []).map((p) => [p.subscription_share_id as string, p])
  )

  return ((subscriptions ?? []) as RawSubscription[]).map((sub) => ({
    id: sub.id,
    owner_id: sub.owner_id,
    category_id: sub.category_id,
    platform: sub.platform,
    billing_day: sub.billing_day,
    total_plan_amount: sub.total_plan_amount,
    is_active: sub.is_active,
    created_at: sub.created_at,
    updated_at: sub.updated_at,
    categories: sub.categories,
    net_cost: netCostBySubscription.get(sub.id) ?? sub.total_plan_amount,
    shares: sub.subscription_shares.map((share) => {
      const payment = paymentByShare.get(share.id)
      return {
        id: share.id,
        subscription_id: share.subscription_id,
        contact_id: share.contact_id,
        amount: share.amount,
        contact_name: share.contacts?.name ?? '—',
        payment_id: payment?.id ?? null,
        payment_status: (payment?.status as ShareStatus | undefined) ?? null,
      }
    }),
  }))
}
