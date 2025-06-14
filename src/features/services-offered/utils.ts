import { ActionResponse } from '@/types/actions.types'
import { SERVICES_OFFERED_MESSAGES } from './constants'
import { validateId, isDuplicateError } from '../common/utils'
import { z } from 'zod'
import { createClient } from '@/lib/supabase-server'

/**
 * Validează ID-ul stilistului
 */
export function validateStylistId(stylistId: string): ActionResponse | null {
  return validateId(stylistId, SERVICES_OFFERED_MESSAGES.ERROR.INVALID_STYLIST_ID)
}

/**
 * Validează ID-ul pentru ștergere și contextul de revalidare
 */
export function validateDeleteContext(
  id: unknown,
  stylistId: unknown
): ActionResponse | { id: string; stylistId: string } {
  const idValidation = validateId(id, SERVICES_OFFERED_MESSAGES.ERROR.INVALID_DELETE_ID)
  if (idValidation) return idValidation

  const stylistIdValidation = validateId(stylistId, SERVICES_OFFERED_MESSAGES.ERROR.INVALID_REVALIDATION)
  if (stylistIdValidation) return stylistIdValidation

  return { id: id as string, stylistId: stylistId as string }
}

/**
 * Gestionează eroarea de tip duplicat
 */
export function handleDuplicateError(): ActionResponse {
  return {
    success: false,
    message: SERVICES_OFFERED_MESSAGES.ERROR.DUPLICATE,
  }
}

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
