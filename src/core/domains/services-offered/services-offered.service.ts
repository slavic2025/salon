import { servicesOfferedRepository } from './services-offered.repository'
import { AddOfferedServiceInput, EditOfferedServiceInput } from './services-offered.types'

export class ServicesOfferedService {
  async addServiceToStylist(stylistId: string, data: AddOfferedServiceInput): Promise<void> {
    const isDuplicate = await servicesOfferedRepository.checkUniqueness(stylistId, data.service_id)
    if (isDuplicate) {
      throw new Error('Acest serviciu există deja pentru stilistul selectat.')
    }
    await servicesOfferedRepository.create({ ...data, stylist_id: stylistId })
  }

  async updateOfferedService(id: string, data: Omit<EditOfferedServiceInput, 'id' | 'stylist_id'>): Promise<void> {
    await servicesOfferedRepository.update(id, data)
  }

  async deleteOfferedService(id: string): Promise<void> {
    await servicesOfferedRepository.remove(id)
  }
}
