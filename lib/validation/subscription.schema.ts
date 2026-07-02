import { z } from 'zod'

export const subscriptionSchema = z.object({
  category_id: z.string().uuid('Selecciona una categoría'),
  platform: z.string().trim().min(1, 'La plataforma es obligatoria').max(60),
  billing_day: z.coerce.number().int().min(1).max(31),
  total_plan_amount: z.coerce.number().positive('El monto debe ser mayor a 0'),
})

export type SubscriptionInput = z.infer<typeof subscriptionSchema>

export const shareSchema = z.object({
  contact_id: z.string().uuid('Selecciona un contacto'),
  amount: z.coerce.number().positive('El monto debe ser mayor a 0'),
})

export type ShareInput = z.infer<typeof shareSchema>
