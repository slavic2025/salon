import { z } from 'zod'
import { Tables, TablesUpdate } from '@/types/database.types'
import { Service } from '../services/service.types'

// --- Tipuri de Bază Derivate din DB ---
/** Tipul unui serviciu oferit, așa cum există în baza de date. */
export type ServiceOffered = Tables<'services_offered'> & {
  services: Pick<Service, 'name' | 'duration_minutes' | 'price'> | null
}
/** Tipul datelor necesare pentru un UPDATE în tabela 'services_offered'. */
export type ServiceOfferedUpdateData = TablesUpdate<'services_offered'>

// --- Scheme de Validare Zod ---
/**
 * Schema de bază pentru validarea câmpurilor unui serviciu oferit unui stilist.
 * Câmpurile corespund cu cele din baza de date pentru a simplifica operațiunile.
 */
export const serviceOfferedSchema = z.object({
  stylist_id: z.string().uuid('ID-ul stilistului este invalid.'),
  service_id: z.string().uuid('ID-ul serviciului este invalid.'),
  custom_price: z.coerce.number().nonnegative().optional(),
  custom_duration: z.coerce.number().int().positive().optional(),
})

/** Schema pentru crearea unei legături serviciu-stilist. */
export const createServiceOfferedSchema = serviceOfferedSchema

/** Schema pentru actualizare: toate câmpurile devin opționale, dar id-ul este obligatoriu. */
export const updateServiceOfferedSchema = serviceOfferedSchema.partial().extend({
  id: z.string().uuid('ID-ul serviciului oferit este invalid.'),
})

/** Schema pentru ștergerea unei legături serviciu-stilist. */
export const deleteServiceOfferedSchema = z.object({
  id: z.string().uuid('ID-ul serviciului oferit este invalid.'),
  stylist_id: z.string().uuid('ID-ul stilistului este invalid.'),
})

// --- Tipuri Derivate din Schemele Zod ---
/** Tipul datelor de intrare din formularul de creare. */
export type CreateServiceOfferedInput = z.infer<typeof createServiceOfferedSchema>
/** Tipul datelor pentru payload-ul de creare trimis la repository. */
export type ServiceOfferedCreateData = CreateServiceOfferedInput
/** Tipul datelor de intrare din formularul de actualizare. */
export type UpdateServiceOfferedInput = z.infer<typeof updateServiceOfferedSchema>
/** Tipul datelor de intrare din formularul de ștergere. */
export type DeleteServiceOfferedInput = z.infer<typeof deleteServiceOfferedSchema>

/**
 * Definește payload-ul complet pentru metoda de update din repository.
 */
export type ServiceOfferedUpdatePayload = {
  id: string
  data: ServiceOfferedUpdateData
}
