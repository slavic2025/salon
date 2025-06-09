// src/features/stylists/actions.ts
'use server'

import { revalidatePath } from 'next/cache'
import { createLogger } from '@/lib/logger'
import { stylistRepository } from '@/core/domains/stylists/stylist.repository'
import {
  addStylistSchema,
  editStylistSchema,
  deleteStylistSchema,
  Stylist,
} from '@/core/domains/stylists/stylist.types'
import { ActionResponse } from '@/types/actions.types'
import { formatZodErrors } from '@/lib/form'
import { createAdminClient } from '@/lib/supabase-admin'
import { z } from 'zod'
import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'

const logger = createLogger('StylistActions')

// Funcție ajutătoare pentru a converti FormData într-un obiect curat pentru validare
function formDataToObject(formData: FormData): Record<string, unknown> {
  const object: Record<string, any> = {}
  formData.forEach((value, key) => {
    // Gestionează checkbox-ul care este 'on' când e bifat și absent când nu e.
    if (key === 'is_active') {
      object[key] = value === 'on'
    } else {
      object[key] = value
    }
  })
  // Asigură că 'is_active' este boolean chiar dacă checkbox-ul nu a fost în FormData
  if (object.is_active === undefined) {
    object.is_active = false
  }
  return object
}

/**
 * Acțiune pentru adăugarea unui nou stilist.
 */
export async function addStylistAction(prevState: ActionResponse, formData: FormData): Promise<ActionResponse> {
  const rawData = Object.fromEntries(formData.entries())

  // O schemă simplă doar pentru validarea datelor de invitație
  const inviteSchema = z.object({
    name: z.string().min(3, { message: 'Numele este obligatoriu.' }),
    email: z.string().email({ message: 'Adresa de email este invalidă.' }),
  })

  const validationResult = inviteSchema.safeParse(rawData)
  if (!validationResult.success) {
    // Nu folosim formatZodErrors aici pentru un mesaj mai simplu
    return { success: false, message: validationResult.error.errors[0].message }
  }

  const { name, email } = validationResult.data

  try {
    const supabaseAdmin = createAdminClient()

    // AICI ESTE MODIFICAREA:
    // Îi spunem lui Supabase unde să trimită user-ul după ce dă click pe link.
    const { data: inviteData, error: inviteError } = await supabaseAdmin.auth.admin.inviteUserByEmail(email, {
      data: { password_set: false },
      // AICI ESTE MODIFICAREA: Trimitem utilizatorul la o pagină de pe client.
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/confirm`,
    })

    if (inviteError) throw inviteError
    if (!inviteData.user) throw new Error('Nu s-a putut crea utilizatorul invitat.')

    const newUserId = inviteData.user.id

    // Creăm înregistrarea în tabela `profiles`
    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .insert({
        id: newUserId,
        email: email,
        name: name,
        role: 'stylist',
      })
      .select()
    if (profileError) throw profileError

    // Creăm înregistrarea în tabela `stylists`, legând-o de noul cont
    const { error: stylistError } = await supabaseAdmin
      .from('stylists')
      .insert({
        profile_id: newUserId,
        name: name,
        email: email,
      })
      .select()
    if (stylistError) throw stylistError

    revalidatePath('/admin/stylists')
    return { success: true, message: `Invitație trimisă cu succes la ${email}!` }
  } catch (error) {
    logger.error('Error in addStylistAction', { error })
    // Verificăm erorile comune de la Supabase
    if ((error as Error).message.includes('unique constraint')) {
      return { success: false, message: 'Un utilizator cu acest email există deja.' }
    }
    return { success: false, message: (error as Error).message }
  }
}

/**
 * Acțiune pentru editarea unui stilist existent.
 */
export async function editStylistAction(prevState: ActionResponse, formData: FormData): Promise<ActionResponse> {
  const rawData = formDataToObject(formData)
  logger.debug('editStylistAction invoked', { rawData })

  const validationResult = editStylistSchema.safeParse(rawData)

  if (!validationResult.success) {
    const errors = formatZodErrors(validationResult.error)
    logger.warn('Validation failed for editStylistAction', { errors })
    return { success: false, message: 'Eroare de validare.', errors }
  }

  const { id, ...dataToUpdate } = validationResult.data

  try {
    // Verifică unicitatea, excluzând ID-ul stilistului curent
    const uniquenessErrors = await stylistRepository.checkUniqueness(
      {
        email: dataToUpdate.email,
        name: dataToUpdate.name,
        phone: dataToUpdate.phone,
      },
      id
    )

    if (uniquenessErrors.length > 0) {
      const errors: Record<string, string[]> = {}
      uniquenessErrors.forEach((err) => {
        errors[err.field] = [err.message]
      })
      logger.warn('Uniqueness check failed on edit', { id, errors })
      return { success: false, message: 'Un alt stilist cu aceste date există deja.', errors }
    }

    await stylistRepository.update(id, dataToUpdate)
    logger.info('Stylist updated successfully', { id })

    revalidatePath('/admin/stylists')

    return { success: true, message: 'Stilistul a fost actualizat cu succes!' }
  } catch (error) {
    logger.error('Error in editStylistAction', { id, error })
    return { success: false, message: (error as Error).message }
  }
}

/**
 * Acțiune pentru ștergerea unui stilist.
 */
export async function deleteStylistAction(prevState: ActionResponse, formData: FormData): Promise<ActionResponse> {
  const id = formData.get('id')

  const validationResult = deleteStylistSchema.safeParse(id)

  if (!validationResult.success) {
    logger.warn('Validation failed for deleteStylistAction', { id })
    return { success: false, message: 'ID-ul stilistului este invalid.' }
  }

  const stylistId = validationResult.data

  try {
    await stylistRepository.remove(stylistId)
    logger.info('Stylist deleted successfully', { id: stylistId })

    revalidatePath('/admin/stylists')

    return { success: true, message: 'Stilistul a fost șters cu succes.' }
  } catch (error) {
    logger.error('Error in deleteStylistAction', { id: stylistId, error })
    return { success: false, message: (error as Error).message }
  }
}

/**
 * Acțiune pentru preluarea tuturor stiliștilor (nu pentru formulare).
 */
export async function getStylistsAction(): Promise<Stylist[]> {
  logger.debug('getStylistsAction invoked: Fetching all stylists.')
  try {
    const stylists = await stylistRepository.fetchAll()
    logger.info('getStylistsAction: Successfully retrieved stylists.', { count: stylists.length })
    return stylists
  } catch (error) {
    logger.error('getStylistsAction: Failed to fetch stylists.', {
      message: (error as Error).message,
    })
    return [] // Returnează un array gol în caz de eroare
  }
}

export async function setInitialPassword(password: string) {
  const supabase = await createClient()
  const { error } = await supabase.auth.updateUser({
    password,
    data: { password_set: true }, // Marcam că parola a fost setată
  })
  if (error) return { error: error.message }
  redirect('/dashboard/schedule') // Redirecționare după succes
}
