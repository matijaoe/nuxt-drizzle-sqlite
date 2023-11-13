import { z } from 'zod'

const userInsertSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  age: z.number().int().min(1),
  sex: z.enum(['male', 'female', 'other']),
})

const userUpdateSchema = z.object({
  name: z.string().optional(),
  email: z.string().email().optional(),
  age: z.number().int().min(1).optional(),
  sex: z.enum(['male', 'female', 'other']).optional(),
}).refine((obj) => {
  return Object.values(obj).some(value => value !== undefined)
}, {
  message: 'At least one field must be defined',
})

export {
  userInsertSchema,
  userUpdateSchema
}
