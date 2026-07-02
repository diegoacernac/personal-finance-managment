export type TransactionType = 'income' | 'expense' | 'installment'
export type TransactionStatus = 'pending' | 'completed'

export type Category = {
  id: string
  owner_id: string
  name: string
  type: TransactionType
  color: string
  icon: string | null
  is_system: boolean
  sort_order: number
  created_at: string
}

export type Transaction = {
  id: string
  owner_id: string
  category_id: string
  template_id: string | null
  subscription_id: string | null
  subscription_share_payment_id: string | null
  type: TransactionType
  description: string
  amount: number
  transaction_date: string
  period: string
  status: TransactionStatus
  completed_at: string | null
  notes: string | null
  created_at: string
  updated_at: string
}

export type TransactionWithCategory = Transaction & {
  categories: Pick<Category, 'id' | 'name' | 'color'> | null
}

export type RecurringTemplate = {
  id: string
  owner_id: string
  category_id: string
  type: TransactionType
  description: string
  amount: number
  total_amount: number | null
  day_of_month: number
  frequency: 'monthly'
  is_active: boolean
  start_date: string
  end_date: string | null
  installments_total: number | null
  installments_paid_count: number
  created_at: string
  updated_at: string
}

export type RecurringTemplateWithCategory = RecurringTemplate & {
  categories: Pick<Category, 'id' | 'name' | 'color'> | null
}

export type MonthlyTotal = {
  period: string
  income_total: number | null
  expense_total: number | null
}

export type MonthProjection = {
  income_received: number
  income_pending: number
  expense_paid: number
  expense_pending: number
  projected_balance: number
}

export type Contact = {
  id: string
  owner_id: string
  name: string
  notes: string | null
  created_at: string
}

export type Subscription = {
  id: string
  owner_id: string
  category_id: string
  platform: string
  billing_day: number
  total_plan_amount: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export type ShareStatus = 'unpaid' | 'paid'

export type SubscriptionShareWithStatus = {
  id: string
  subscription_id: string
  contact_id: string
  amount: number
  contact_name: string
  payment_id: string | null
  payment_status: ShareStatus | null
}

export type SubscriptionWithShares = Subscription & {
  categories: Pick<Category, 'id' | 'name' | 'color'> | null
  shares: SubscriptionShareWithStatus[]
  net_cost: number
}

export type Budget = {
  id: string
  owner_id: string
  category_id: string | null
  limit_amount: number
  warning_threshold_pct: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export type BudgetWithCategory = Budget & {
  categories: Pick<Category, 'id' | 'name' | 'color'> | null
}

export type SemaforoStatus = 'green' | 'yellow' | 'red'

export type BudgetStatus = {
  budget_id: string
  category_id: string | null
  limit_amount: number
  warning_threshold_pct: number
  spent: number
  semaforo_status: SemaforoStatus
}
