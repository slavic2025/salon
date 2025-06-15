import { workScheduleRepository } from './work-schedule.repository'
import { WorkScheduleInput } from './work-schedule.types'

type WorkScheduleCreateData = WorkScheduleInput & { stylist_id: string }

export class WorkScheduleService {
  async getWorkSchedulesByStylistId(stylistId: string): Promise<WorkScheduleInput[]> {
    return workScheduleRepository.fetchByStylistId(stylistId)
  }

  async createWorkSchedule(data: WorkScheduleCreateData): Promise<void> {
    await workScheduleRepository.create(data)
  }

  async deleteWorkSchedule(id: string): Promise<void> {
    await workScheduleRepository.remove(id)
  }
}
