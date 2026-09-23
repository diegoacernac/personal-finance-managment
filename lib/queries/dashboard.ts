import { createClient } from '@/lib/supabase/server'
import { ensurePeriodGenerated } from '@/lib/queries/generation'
import { shiftPeriod } from '@/lib/period'
import type { MonthlyTotal, MonthProjection } from '@/lib/types'

export async function getMonthlyTotals(months = 6): Promise<MonthlyTotal[]> {
  const supabase = await createClient()
  const { data, error } = await supabase.rpc('get_monthly_totals', { p_months: months })

  if (error) throw new Error(error.message)

  const byPeriod = new Map((data as MonthlyTotal[]).map((row) => [row.period, row]))

  // The RPC only returns months that have at least one transaction, so backfill
  // the rest of the range with zeros to keep the chart's month axis continuous.
  const now = new Date()
  const currentPeriod = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`

  const fullRange: MonthlyTotal[] = []
  for (let i = months; i >= 0; i--) {
    const period = shiftPeriod(currentPeriod, -i)
    fullRange.push(byPeriod.get(period) ?? { period, income_total: 0, expense_total: 0 })
  }

  return fullRange
}

export async function getMonthProjection(period: string): Promise<MonthProjection> {
  const [supabase] = await Promise.all([createClient(), ensurePeriodGenerated(period)])
  const { data, error } = await supabase
    .rpc('get_month_projection', { p_period: period })
    .single()

  if (error) throw new Error(error.message)
  return data as MonthProjection
}
