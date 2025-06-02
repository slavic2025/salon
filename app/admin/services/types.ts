import { Service } from '@/lib/db/service-core'

export type ServiceData = Service

export interface ActionResponse {
  success: boolean
  message?: string
  errors?: Partial<Record<keyof ServiceData, string[]>> & {
    _form?: string[] // Eroare generală la nivel de formular
  }
}
