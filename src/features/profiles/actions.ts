import { createClient } from '@/lib/supabase-server'
import { createProfileRepository } from '@/core/domains/profiles/profile.repository'
import { createProfileService } from '@/core/domains/profiles/profile.service'

/**
 * Funcție ajutătoare care asamblează serviciul pentru 'profiles'.
 */
async function getProfileService() {
  const supabase = await createClient()
  const repository = createProfileRepository(supabase)
  return createProfileService(repository)
}

// Exemplu într-o acțiune de actualizare
export async function updateProfileAction(prevState: ActionResponse, formData: FormData): Promise<ActionResponse> {
  const rawData = formDataToObject(formData)

  try {
    const profileService = await getProfileService()
    // Pasăm datele brute; serviciul este responsabil de validare.
    await profileService.updateProfile(rawData)

    // ... logica de revalidare și răspuns de succes
    return { success: true, message: PROFILE_CONSTANTS.MESSAGES.SUCCESS.UPDATED }
  } catch (error) {
    return handleError(error) // Folosește helper-ul general de erori
  }
}
