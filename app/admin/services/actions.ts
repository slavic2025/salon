// lib/actions/service-actions.ts
'use server'

import { addServiceSchema, editServiceSchema } from '@/lib/zod/schemas' // Schemele tale Zod
import {
  insertService,
  updateService,
  deleteService,
  fetchAllServices, // Vezi mai jos pentru getServicesAction
} from '@/lib/db/service-core' // Funcțiile tale de DB
import { extractServiceDataFromForm } from '@/lib/form' // Funcția ta specifică de extragere
import { createLogger } from '@/lib/logger' // Logger-ul tău
import { createGenericServerActions } from '@/lib/actions/generic-actions'
import { ServiceData } from './types'

// Specific pentru service-actions, poți avea un logger dedicat
const serviceActionsLogger = createLogger('ServiceActions')

const serviceDbFunctions = {
  insert: insertService,
  update: updateService,
  remove: deleteService,
}

const genericServiceActions = createGenericServerActions<
  ServiceData,
  typeof addServiceSchema,
  typeof editServiceSchema
>({
  entityName: 'Serviciu',
  createSchema: addServiceSchema,
  updateSchema: editServiceSchema,
  dbFunctions: serviceDbFunctions,
  extractDataFromForm: extractServiceDataFromForm, // Aceasta este cheia pentru flexibilitate
  revalidationPath: '/admin/services',
  logger: serviceActionsLogger, // Pasezi logger-ul specific
})

export const addServiceAction = genericServiceActions.createAction
export const editServiceAction = genericServiceActions.updateAction
export const deleteServiceAction = genericServiceActions.deleteAction

// Pentru getServicesAction, deoarece nu implică FormData sau _prevState în același mod,
// și are o structură de eroare puțin diferită, s-ar putea să-l păstrezi separat
// sau să creezi o altă funcție generică pentru acțiuni de tip "get" dacă modelul se repetă.

export async function getServicesAction(): Promise<ServiceData[]> {
  serviceActionsLogger.debug('getServicesAction invoked: Fetching all services.')
  try {
    const services = await fetchAllServices() // Direct din service-core
    serviceActionsLogger.info('getServicesAction: Successfully retrieved services.', { count: services.length })
    return services
  } catch (error) {
    serviceActionsLogger.error('getServicesAction: Failed to fetch services.', {
      message: (error as Error).message,
      originalError: error,
    })
    // Decizia de a returna [] sau a arunca eroarea depinde de cum vrei să gestionezi în UI
    return []
  }
}
