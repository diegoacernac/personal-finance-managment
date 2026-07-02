import { createClient } from '@/lib/supabase/server'
import { ensurePeriodGenerated } from '@/lib/queries/generation'
import type { TransactionWithCategory } from '@/lib/types'

export async function getTransactionsForPeriod(period: string): Promise<TransactionWithCategory[]> {
  // Idempotent: backfills any missing recurring-template and subscription
  // instances for this month before reading, so viewing any period is always up to date.
  await ensurePeriodGenerated(period)

  const supabase = await createClient()
  const { data, error } = await supabase
    .from('transactions')
    .select('*, categories(id, name, color)')
    .eq('period', period)
    .order('transaction_date', { ascending: true })

  if (error) throw new Error(error.message)
  return data as TransactionWithCategory[]
}
