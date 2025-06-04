// app/admin/stylists/actions.ts
'use server'

import { addStylistSchema, editStylistSchema } from '@/lib/zod/schemas'
import { insertStylist, updateStylist, deleteStylist, fetchAllStylists } from '@/lib/db/stylist-core'
import { extractStylistDataFromForm } from '@/lib/form'
import { createLogger } from '@/lib/logger'
import { createGenericServerActions } from '@/lib/actions/generic-actions'
import { StylistData } from './types'

const stylistActionsLogger = createLogger('StylistActions')

const stylistDbFunctions = {
  insert: insertStylist,
  update: updateStylist,
  remove: deleteStylist,
}

const genericStylistActions = createGenericServerActions<
  StylistData,
  typeof addStylistSchema,
  typeof editStylistSchema
>({
  entityName: 'Stilist',
  createSchema: addStylistSchema,
  updateSchema: editStylistSchema,
  dbFunctions: stylistDbFunctions,
  extractDataFromForm: extractStylistDataFromForm,
  revalidationPath: '/admin/stylists',
  logger: stylistActionsLogger,
})

export const addStylistAction = genericStylistActions.createAction
export const editStylistAction = genericStylistActions.updateAction
export const deleteStylistAction = genericStylistActions.deleteAction

export async function getStylistsAction(): Promise<StylistData[]> {
  stylistActionsLogger.debug('getStylistsAction invoked: Fetching all stylists.')
  try {
    const stylists = await fetchAllStylists()
    stylistActionsLogger.info('getStylistsAction: Successfully retrieved stylists.', { count: stylists.length })
    return stylists
  } catch (error) {
    stylistActionsLogger.error('getStylistsAction: Failed to fetch stylists.', {
      message: (error as Error).message,
      originalError: error,
    })
    return []
  }
}
