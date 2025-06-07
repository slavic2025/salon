// lib/db/service-core.ts
import { addServiceSchema, editServiceSchema, ServiceData } from '@/features/services/types'
import { createGenericCrudService } from '@/lib/db/generic-core'

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
