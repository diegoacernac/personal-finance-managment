import { z } from 'zod'

export const budgetSchema = z.object({
  category_id: z.string().uuid().optional().or(z.literal('')),
  limit_amount: z.coerce.number().positive('El límite debe ser mayor a 0'),
  warning_threshold_pct: z.coerce.number().int().min(1).max(100).default(80),
})

export type BudgetInput = z.infer<typeof budgetSchema>
