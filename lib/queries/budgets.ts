import { createClient } from '@/lib/supabase/server'
import type { BudgetWithCategory, BudgetStatus } from '@/lib/types'

export async function getBudgets(): Promise<BudgetWithCategory[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('budgets')
    .select('*, categories(id, name, color)')
    .order('created_at', { ascending: true })

  if (error) throw new Error(error.message)
  return data as BudgetWithCategory[]
}

export async function getBudgetStatus(period: string): Promise<BudgetStatus[]> {
  const supabase = await createClient()
  const { data, error } = await supabase.rpc('get_budget_status', { p_period: period })

  if (error) throw new Error(error.message)
  return data as BudgetStatus[]
}
