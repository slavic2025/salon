import { Database } from '@/types/database.types'
import { z } from 'zod'
import { createLogger } from '../logger'
import { createClient } from '../supabase'
import { SupabaseClient } from '@supabase/supabase-js'

type ValidTable = keyof Database['public']['Tables']

interface BaseEntity {
  id: string
  createdAt?: string
  updatedAt?: string
}

interface GenericCrudOperations<
  T extends BaseEntity,
  CreateSchema extends z.ZodTypeAny,
  UpdateSchema extends z.ZodTypeAny
> {
  fetchAll(orderBy?: { column: keyof T; ascending?: boolean }): Promise<T[]>
  fetchById(id: T['id']): Promise<T | null>
  insert(data: z.infer<CreateSchema>): Promise<T>
  update(id: T['id'], data: z.infer<UpdateSchema>): Promise<T>
  remove(id: T['id']): Promise<void>
}

export function createGenericCrudService<
  Table extends ValidTable,
  Row extends BaseEntity,
  CreateSchema extends z.ZodTypeAny,
  UpdateSchema extends z.ZodTypeAny
>(
  table: Table,
  createSchema?: CreateSchema,
  updateSchema?: UpdateSchema
): GenericCrudOperations<Row, CreateSchema, UpdateSchema> {
  const logger = createLogger(`DB_${table.toUpperCase()}Crud`)

  const getClient = async (): Promise<SupabaseClient> => createClient()

  const fetchAll = async (orderBy?: { column: keyof Row; ascending?: boolean }) => {
    const supabase = await getClient()
    let query = supabase.from(table).select('*')

    if (orderBy) {
      query = query.order(orderBy.column as string, { ascending: orderBy.ascending ?? true })
    }

    const { data, error } = await query
    if (error) {
      logger.error(`Error fetching all from "${table}":`, {
        message: error.message,
        details: error.details,
      })
      throw new Error(`Error fetching from ${table}`)
    }

    return data as Row[]
  }

  const fetchById = async (id: Row['id']) => {
    const supabase = await getClient()
    const { data, error } = await supabase.from(table).select('*').eq('id', id).single()

    if (error && error.code !== 'PGRST116') {
      logger.error(`Error fetching ${id} from "${table}":`, {
        message: error.message,
        details: error.details,
        itemId: id,
      })
      throw new Error(`Error fetching from ${table}`)
    }

    return data as Row | null
  }

  const insert = async (raw: z.infer<CreateSchema>) => {
    if (createSchema) {
      const parsed = createSchema.safeParse(raw)
      if (!parsed.success) {
        logger.error(`Validation failed on insert into "${table}":`, parsed.error.flatten())
        throw new Error('Invalid data for create')
      }
      raw = parsed.data
    }

    const supabase = await getClient()
    const { data, error } = await supabase.from(table).insert(raw).select().single()

    if (error) {
      logger.error(`Error inserting into "${table}":`, { message: error.message, details: error.details, raw })
      throw new Error(`Failed to insert into ${table}`)
    }

    return data as Row
  }

  const update = async (id: Row['id'], raw: z.infer<UpdateSchema>) => {
    if (updateSchema) {
      const parsed = updateSchema.safeParse(raw)
      if (!parsed.success) {
        logger.error(`Validation failed on update in "${table}":`, parsed.error.flatten())
        throw new Error('Invalid data for update')
      }
      raw = parsed.data
    }

    const supabase = await getClient()
    const { data, error } = await supabase.from(table).update(raw).eq('id', id).select().single()

    if (error) {
      logger.error(`Error updating in "${table}":`, { message: error.message, details: error.details, itemId: id, raw })
      throw new Error(`Failed to update ${id} in ${table}`)
    }

    return data as Row
  }

  const remove = async (id: Row['id']) => {
    const supabase = await getClient()
    const { error } = await supabase.from(table).delete().eq('id', id)

    if (error) {
      logger.error(`Error deleting ${id} from "${table}":`, {
        message: error.message,
        details: error.details,
        itemId: id,
      })
      throw new Error(`Failed to delete from ${table}`)
    }
  }

  return { fetchAll, fetchById, insert, update, remove }
}
