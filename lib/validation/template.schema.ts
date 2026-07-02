import { z } from 'zod'

export const templateSchema = z
  .object({
    category_id: z.string().uuid('Selecciona una categoría'),
    type: z.enum(['income', 'expense', 'installment']),
    description: z.string().trim().min(1, 'La descripción es obligatoria').max(120),
    amount: z.coerce.number().positive('El monto debe ser mayor a 0'),
    day_of_month: z.coerce.number().int().min(1).max(31),
    total_amount: z.coerce.number().positive().optional(),
    installments_total: z.coerce.number().int().positive().optional(),
  })
  .refine(
    (data) => data.type !== 'installment' || (data.total_amount && data.installments_total),
    {
      message: 'Las cuotas requieren monto total y número de cuotas',
      path: ['total_amount'],
    }
  )

export type TemplateInput = z.infer<typeof templateSchema>
