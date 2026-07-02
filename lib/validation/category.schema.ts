import { z } from 'zod'

export const categorySchema = z.object({
  name: z.string().trim().min(1, 'El nombre es obligatorio').max(60),
  type: z.enum(['income', 'expense', 'installment']),
  color: z.string().regex(/^#[0-9a-fA-F]{6}$/, 'Color inválido').default('#64748b'),
})

export type CategoryInput = z.infer<typeof categorySchema>
