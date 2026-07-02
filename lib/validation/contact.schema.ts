import { z } from 'zod'

export const contactSchema = z.object({
  name: z.string().trim().min(1, 'El nombre es obligatorio').max(60),
  notes: z.string().trim().max(300).optional().or(z.literal('')),
})

export type ContactInput = z.infer<typeof contactSchema>
