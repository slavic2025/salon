import { zEmailRequired, zPasswordRequired } from '@/lib/zod/fields'
import { z } from 'zod'

// ================= LOGIN =================
export const loginSchema = z.object({
  email: zEmailRequired,
  password: zPasswordRequired,
})
