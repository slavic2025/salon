// utils/supabase/server.ts
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { createLogger } from '@/lib/logger'
import { env } from './utils/env' // Asigură-te că această cale este corectă
import type { Database } from '@/types/database.types' // <<<--- ASIGURĂ-TE CĂ AI IMPORTAT TIPUL RĂDĂCINĂ 'Database' AICI

const logger = createLogger('SupabaseServerClient')

const SUPABASE_URL = env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_ANON_KEY = env.NEXT_PUBLIC_SUPABASE_ANON_KEY

/**
 * Creează un client Supabase pentru utilizare pe server (Server Components / Server Actions).
 * Returnează un client Supabase tipat cu schema bazei de date.
 */
export async function createClient() {
  const cookieStore = await cookies()

  // <<<--- AICI ESTE CORECȚIA PRINCIPALĂ: Specifică tipul 'Database' la createServerClient
  return createServerClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        const all = cookieStore.getAll()
        logger.debug(`Found ${all.length} cookies.`)
        return all
      },
      setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
        try {
          for (const { name, value, options } of cookiesToSet) {
            cookieStore.set(name, value, options)
            logger.debug(`Set cookie: ${name}`)
          }
        } catch (error) {
          logger.warn('Error setting cookies in server context.', {
            error: (error as Error).message,
            cookies: cookiesToSet.map((c) => c.name),
          })
        }
      },
    },
  })
}
