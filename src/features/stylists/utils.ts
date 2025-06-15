import { createClient } from '@/lib/supabase-server'
import { STYLIST_MESSAGES } from './constants'

/**
 * Obține ID-ul stilistului curent logat
 */
export async function getCurrentStylistId(): Promise<string> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error(STYLIST_MESSAGES.ERROR.AUTH.UNAUTHORIZED)

  const { data: stylist } = await supabase.from('stylists').select('id').eq('profile_id', user.id).single()
  if (!stylist) throw new Error(STYLIST_MESSAGES.ERROR.AUTH.PROFILE_NOT_FOUND)

  return stylist.id
}
