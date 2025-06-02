// utils/env.ts
import { zEnvHost, zStringRequired } from '@/lib/zod/fields'
import { z } from 'zod'

// Definim schema pentru variabilele de mediu, folosind schema din zod.ts
const envSchema = z.object({
  HOST_ENV: zEnvHost,
  NEXT_PUBLIC_SUPABASE_URL: zStringRequired,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: zStringRequired,
  // alte variabile, eventual folosind zStringOptional sau zStringRequired
})

// Validare efectivă
const _env = envSchema.safeParse(process.env)

if (!_env.success) {
  console.error('❌ Environment variable validation error:', _env.error.format())
  throw new Error('Invalid environment variables.')
}

export const env = _env.data
