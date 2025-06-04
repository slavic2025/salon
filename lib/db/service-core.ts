// lib/db/service-core.ts
import { createGenericCrudService } from './generic-core'
import { ServiceData } from '@/app/admin/services/types'
import { addServiceSchema, editServiceSchema } from '../zod/schemas'

export const serviceCrud = createGenericCrudService<
  'services',
  ServiceData,
  typeof addServiceSchema,
  typeof editServiceSchema
>('services', addServiceSchema, editServiceSchema)

// Exportăm metodele CRUD ca funcții
export const fetchAllServices = serviceCrud.fetchAll
export const fetchServiceById = serviceCrud.fetchById
export const insertService = serviceCrud.insert
export const updateService = serviceCrud.update
export const deleteService = serviceCrud.remove
