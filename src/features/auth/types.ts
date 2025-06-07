import { zEmailRequired, zPasswordRequired } from '@/config/validation/fields'
import { z } from 'zod'

// ================= LOGIN =================
export const loginSchema = z.object({
  email: zEmailRequired,
  password: zPasswordRequired,
})
