// src/lib/supabase-admin.ts
import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/database.types'

// Acest client va fi folosit DOAR pe server și are puteri depline
export const createAdminClient = () => {
  return createClient<Database>(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
}
