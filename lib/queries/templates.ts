import { createClient } from '@/lib/supabase/server'
import type { RecurringTemplateWithCategory } from '@/lib/types'

export async function getTemplates(): Promise<RecurringTemplateWithCategory[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('recurring_templates')
    .select('*, categories(id, name, color)')
    .order('day_of_month', { ascending: true })

  if (error) throw new Error(error.message)
  return data as RecurringTemplateWithCategory[]
}
