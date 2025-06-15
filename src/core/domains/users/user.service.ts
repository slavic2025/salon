import { userRepository } from './user.repository'
import { UserProfile, UpdateUserProfileInput } from './user.types'
import { USER_ERRORS } from './user.constants'

export class UserService {
  async getUserProfile(userId: string): Promise<UserProfile> {
    const profile = await userRepository.fetchProfileById(userId)
    if (!profile) {
      throw new Error('Profilul utilizatorului nu a fost găsit.')
    }
    return profile
  }

  async updateUserProfile(id: string, data: Omit<UpdateUserProfileInput, 'id'>): Promise<void> {
    await userRepository.update(id, data)
  }
}
