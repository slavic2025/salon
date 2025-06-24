// src/core/domains/work-schedules/work-schedule.service.ts
import { createLogger } from '@/lib/logger'
import { createWorkScheduleRepository } from './work-schedule.repository'
import { createWorkScheduleSchema, deleteWorkScheduleSchema } from './work-schedule.types'

type WorkScheduleRepository = ReturnType<typeof createWorkScheduleRepository>

export function createWorkScheduleService(repository: WorkScheduleRepository) {
  const logger = createLogger('WorkScheduleService')

  return {
    async findByStylistId(stylistId: string) {
      return repository.findByStylistId(stylistId)
    },

    async createWorkSchedule(input: Record<string, unknown>) {
      logger.debug('Creating work schedule...')
      const payload = createWorkScheduleSchema.parse(input)

      // Aici se poate adăuga logica de business, ex: verificarea suprapunerilor de intervale
      const existingSchedules = await repository.findByStylistId(payload.stylist_id as string)
      // ... logica de verificare ...
      // if (isOverlapping) {
      //   throw new AppError(WORK_SCHEDULE_CONSTANTS.MESSAGES.ERROR.BUSINESS.OVERLAPPING);
      // }

      return repository.create(payload)
    },

    async deleteWorkSchedule(input: Record<string, unknown>) {
      const { id } = deleteWorkScheduleSchema.parse(input)
      return repository.delete(id)
    },
    async findSchedulesForCurrentStylist() {
      // Serviciul deleagă apelul către repository.
      // Aici s-ar putea adăuga în viitor logică de business suplimentară.
      return repository.findForCurrentStylist()
    },
  }
}
