// src/core/domains/schedules/schedule.service.ts
import { createLogger } from '@/lib/logger'
import { createScheduleRepository } from './schedule.repository'
import { createSchedulePayloadSchema, deleteScheduleSchema } from './schedule.types'

type ScheduleRepository = ReturnType<typeof createScheduleRepository>

export function createScheduleService(repository: ScheduleRepository) {
  const logger = createLogger('ScheduleService')

  return {
    async findByStylistId(stylistId: string) {
      return repository.findByStylistId(stylistId)
    },

    async createSchedule(input: Record<string, unknown>) {
      logger.debug('Creating schedule...')
      const payload = createSchedulePayloadSchema.parse(input)

      // Aici se poate adăuga logica de business, ex: verificarea suprapunerilor de intervale
      const existingSchedules = await repository.findByStylistId(payload.stylist_id as string)
      // ... logica de verificare ...
      // if (isOverlapping) {
      //   throw new AppError(SCHEDULE_CONSTANTS.MESSAGES.ERROR.BUSINESS.OVERLAPPING);
      // }

      return repository.create(payload)
    },

    async deleteSchedule(input: Record<string, unknown>) {
      const { id } = deleteScheduleSchema.parse(input)
      return repository.delete(id)
    },
    async findSchedulesForCurrentStylist() {
      // Serviciul deleagă apelul către repository.
      // Aici s-ar putea adăuga în viitor logică de business suplimentară.
      return repository.findForCurrentStylist()
    },
  }
}
