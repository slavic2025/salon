import { createClient } from '@/lib/supabase-server'

/**
 * Obține ID-ul stilistului curent logat
 */
export async function getCurrentStylistId(): Promise<string> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error('Utilizator neautorizat')

  const { data: stylist } = await supabase.from('stylists').select('id').eq('profile_id', user.id).single()
  if (!stylist) throw new Error('Profil stilist negăsit')

  return stylist.id
}
