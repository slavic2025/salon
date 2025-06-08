// src/core/domains/work-schedules/work-schedule.actions.ts
'use server'

import { revalidatePath } from 'next/cache'
import { createLogger } from '@/lib/logger'
import { ActionResponse } from '@/types/actions.types'
import { formatZodErrors } from '@/lib/form'

import { createClient } from '@/lib/supabase-server'
import { workScheduleSchema } from '@/core/domains/work-schedules/work-schedule.types'
import { workScheduleRepository } from '@/core/domains/work-schedules/work-schedule.repository'

const logger = createLogger('WorkScheduleActions')

// Funcție pentru a obține ID-ul stilistului curent logat
async function getCurrentStylistId() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error('Utilizator neautentificat.')

  const { data: stylist } = await supabase.from('stylists').select('id').eq('profile_id', user.id).single()
  if (!stylist) throw new Error('Profilul de stilist nu a fost găsit.')

  return stylist.id
}

export async function addWorkScheduleAction(prevState: ActionResponse, formData: FormData): Promise<ActionResponse> {
  try {
    const stylistId = await getCurrentStylistId()
    const rawData = Object.fromEntries(formData.entries())

    const validationResult = workScheduleSchema.safeParse(rawData)
    if (!validationResult.success) {
      return { success: false, message: 'Validation Error', errors: formatZodErrors(validationResult.error) }
    }

    await workScheduleRepository.create({ ...validationResult.data, stylist_id: stylistId })

    revalidatePath('/dashboard/schedule')
    return { success: true, message: 'Intervalul a fost adăugat cu succes!' }
  } catch (error) {
    logger.error('Error in addWorkScheduleAction', { error })
    return { success: false, message: (error as Error).message }
  }
}

export async function deleteWorkScheduleAction(prevState: ActionResponse, formData: FormData): Promise<ActionResponse> {
  const id = formData.get('id')
  if (typeof id !== 'string') return { success: false, message: 'ID invalid.' }

  try {
    await workScheduleRepository.remove(id)
    revalidatePath('/dashboard/schedule')
    return { success: true, message: 'Intervalul a fost șters.' }
  } catch (error) {
    logger.error('Error in deleteWorkScheduleAction', { error })
    return { success: false, message: (error as Error).message }
  }
}
