// lib/actions/types.ts (sau unde ai definit ActionResponse)
import { ZodError } from 'zod'

// Presupunem că formatZodErrors este o funcție helper pe care o ai deja
// export type FormattedZodErrors = Record<string, string[]>; // Sau tipul returnat de formatZodErrors
export type FormattedZodErrors = Record<string, string[]> & { _form?: string[] }

export interface ActionResponse<T = any> {
  success: boolean
  message?: string
  errors?: FormattedZodErrors
  data?: T // Opțional, pentru acțiuni care returnează date (ex: get, sau chiar create/update)
}

// lib/actions/generic-actions.ts
import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import { createLogger, Logger } from '@/lib/logger' // Logger-ul tău
import { formatZodErrors } from '@/lib/form' // Helper-ul tău

// Interfață pentru funcțiile de bază de date necesare
export interface GenericDbOperations<EntityType, CreateInputType, UpdateInputType> {
  insert: (data: CreateInputType) => Promise<EntityType>
  update: (id: string, data: UpdateInputType) => Promise<EntityType> // Presupunem ID string
  remove: (id: string) => Promise<void> // Presupunem ID string
  // fetchById?: (id: string) => Promise<EntityType | null>; // Opțional pentru acțiuni GET
  // fetchAll?: () => Promise<EntityType[]>; // Opțional pentru acțiuni GET
}

// Configurația pentru crearea acțiunilor generice
export interface GenericActionConfig<
  EntityType,
  CreateSchema extends z.ZodTypeAny,
  UpdateSchema extends z.ZodTypeAny,
  RawFormDataType = any // Tipul datelor după extragerea din FormData, înainte de validare
> {
  entityName: string // Pentru logging și mesaje, ex: "Serviciu", "Stilist"
  createSchema: CreateSchema
  updateSchema: UpdateSchema
  dbFunctions: GenericDbOperations<EntityType, z.infer<CreateSchema>, z.infer<UpdateSchema>>
  extractDataFromForm: (formData: FormData) => RawFormDataType
  revalidationPath: string // Calea de revalidat, ex: '/admin/services'
  idFormFieldName?: string // Numele câmpului ID din FormData, default 'id'
  logger?: Logger // Opțional, dacă vrei să pasezi un logger specific
}

// lib/actions/generic-actions.ts (continuare)

export function createGenericServerActions<
  EntityType,
  CreateSchema extends z.ZodTypeAny,
  UpdateSchema extends z.ZodTypeAny,
  RawFormDataType = any
>(config: GenericActionConfig<EntityType, CreateSchema, UpdateSchema, RawFormDataType>) {
  const entityNameLower = config.entityName.toLowerCase()
  const logger = config.logger || createLogger(`${config.entityName}Actions`)
  const idField = config.idFormFieldName || 'id'

  // ---------- CREATE Action ----------
  async function createAction(_prevState: ActionResponse, formData: FormData): Promise<ActionResponse<EntityType>> {
    logger.debug(`createAction invoked for ${config.entityName}: Attempting to add new ${entityNameLower}.`, {
      formDataEntries: Object.fromEntries(formData.entries()),
    })
    try {
      const rawData = config.extractDataFromForm(formData)
      const validatedData = config.createSchema.parse(rawData) // Aruncă ZodError la eșec

      const newItem = await config.dbFunctions.insert(validatedData)
      logger.info(`createAction: Successfully inserted new ${entityNameLower}.`, { data: validatedData })

      revalidatePath(config.revalidationPath)
      return {
        success: true,
        message: `${config.entityName} a fost adăugat cu succes!`,
        data: newItem,
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        logger.warn(`createAction: Validation failed during ${entityNameLower} addition.`, { errors: error.flatten() })
        return { success: false, message: 'Eroare de validare!', errors: formatZodErrors(error) }
      }
      logger.error(`createAction: Unexpected error during ${entityNameLower} addition.`, {
        message: (error as Error).message,
        originalError: error,
      })
      return { success: false, message: `A eșuat adăugarea: ${entityNameLower}. Vă rugăm să încercați din nou.` }
    }
  }

  // ---------- UPDATE Action ----------
  async function updateAction(_prevState: ActionResponse, formData: FormData): Promise<ActionResponse<EntityType>> {
    const idValue = formData.get(idField)

    if (typeof idValue !== 'string' || !idValue) {
      logger.warn(`updateAction: Invalid ${entityNameLower} ID for update.`, { id: idValue })
      return {
        success: false,
        message: `ID-ul (${entityNameLower}) pentru actualizare este invalid.`,
        errors: { _form: [`ID invalid pentru actualizare.`] },
      }
    }

    logger.debug(`updateAction invoked for ${config.entityName}: Attempting to update ${entityNameLower}.`, {
      id: idValue,
      formDataEntries: Object.fromEntries(formData.entries()),
    })
    try {
      const rawData = config.extractDataFromForm(formData)
      const validatedData = config.updateSchema.parse(rawData)

      const updatedItem = await config.dbFunctions.update(idValue, validatedData)
      logger.info(`updateAction: Successfully updated ${entityNameLower}.`, { id: idValue })

      revalidatePath(config.revalidationPath)
      return {
        success: true,
        message: `${config.entityName} a fost actualizat cu succes!`,
        data: updatedItem,
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        logger.warn(`updateAction: Validation failed during ${entityNameLower} update.`, {
          id: idValue,
          errors: error.flatten(),
        })
        return { success: false, message: 'Eroare de validare!', errors: formatZodErrors(error) }
      }
      logger.error(`updateAction: Unexpected error during ${entityNameLower} update.`, {
        id: idValue,
        message: (error as Error).message,
        originalError: error,
      })
      return { success: false, message: `A eșuat actualizarea: ${entityNameLower}. Vă rugăm să încercați din nou.` }
    }
  }

  // ---------- DELETE Action ----------
  async function deleteAction(_prevState: ActionResponse, formData: FormData): Promise<ActionResponse> {
    const idValue = formData.get(idField)

    if (typeof idValue !== 'string' || !idValue) {
      logger.warn(`deleteAction: Invalid ${entityNameLower} ID for deletion.`, { id: idValue })
      return {
        success: false,
        message: `ID-ul (${entityNameLower}) pentru ștergere este invalid.`,
        errors: { _form: [`ID invalid pentru ștergere.`] },
      }
    }

    logger.debug(`deleteAction invoked for ${config.entityName}: Attempting to delete ${entityNameLower}.`, {
      id: idValue,
    })
    try {
      await config.dbFunctions.remove(idValue)
      logger.info(`deleteAction: Successfully deleted ${entityNameLower}.`, { id: idValue })

      revalidatePath(config.revalidationPath)
      return { success: true, message: `${config.entityName} a fost șters cu succes!` }
    } catch (error) {
      logger.error(`deleteAction: Unexpected error during ${entityNameLower} deletion.`, {
        id: idValue,
        message: (error as Error).message,
        originalError: error,
      })
      return { success: false, message: `A eșuat ștergerea: ${entityNameLower}. Vă rugăm să încercați din nou.` }
    }
  }

  return {
    createAction,
    updateAction,
    deleteAction,
  }
}
