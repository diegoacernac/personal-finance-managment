import { z } from "zod"

export const transactionSchema = z.object({
  category_id: z.string().uuid('Selecciona una categoría'),
  type: z.enum(['income', 'expense', 'installment']),
  description: z.string().trim().min(1, 'La descripción es obligatoria').max(120),
  amount: z.coerce.number().positive('El monto debe ser mayor a 0'),
  transaction_date: z.string().min(1, 'La fecha es obligatoria'), // YYYY-MM-DD
  notes: z.string().trim().max(500).optional().or(z.literal('')),
})

export type TransactionalType = z.infer<typeof transactionSchema>