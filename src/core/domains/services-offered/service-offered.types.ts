import { z } from 'zod'
import { Tables, TablesInsert, TablesUpdate } from '@/types/database.types'
import { type Service } from '../services/service.types'
import { uuidField } from '@/config/validation/fields'

// --- Tipuri de Bază Derivate din DB ---

/**
 * Tipul care reprezintă legătura dintre un serviciu și un stilist,
 * incluzând și detaliile serviciului (obținute printr-un JOIN).
 */
export type ServiceOffered = Tables<'services_offered'> & {
  services: Pick<Service, 'name' | 'duration_minutes' | 'price'> | null
}

/** Tipul datelor necesare pentru a crea un rând nou în `services_offered`. */
export type ServiceOfferedCreateData = TablesInsert<'services_offered'>

/** Tipul datelor necesare pentru un UPDATE în tabela `services_offered`. */
export type ServiceOfferedUpdateData = TablesUpdate<'services_offered'>

// --- Scheme de Validare Zod (cu responsabilități clare) ---

/**
 * Schema pentru validarea datelor din formularul de adăugare a unui serviciu la un stilist.
 * Aceasta validează doar ce completează utilizatorul în UI.
 */
export const addServiceToStylistFormSchema = z.object({
  service_id: uuidField('Te rugăm să selectezi un serviciu valid.'),
  // Câmpuri opționale pentru a suprascrie prețul/durata standard
  custom_price: z.coerce.number().nonnegative().optional(),
  custom_duration: z.coerce.number().int().positive().optional(),
})

/**
 * Schema pentru payload-ul complet al acțiunii de pe server.
 * Extinde schema de formular pentru a include și `stylist_id`,
 * care vine din context, nu din formularul propriu-zis.
 */
export const addServiceToStylistSchema = addServiceToStylistFormSchema.extend({
  stylist_id: uuidField('ID-ul stilistului este invalid.'),
})

/**
 * Schema pentru ștergerea unei legături dintre un serviciu și un stilist.
 */
export const removeServiceFromStylistSchema = z.object({
  // ID-ul rândului din tabela `services_offered`
  id: uuidField('ID-ul legăturii este invalid.'),
  // ID-ul stilistului este necesar pentru a revalida calea corectă
  stylist_id: uuidField('ID-ul stilistului este necesar.'),
})

// --- Tipuri Derivate din Schemele Zod ---

/** Tipul datelor de intrare din formularul de adăugare. */
export type AddServiceToStylistInput = z.infer<typeof addServiceToStylistFormSchema>

/** Tipul datelor de intrare din formularul de ștergere. */
export type RemoveServiceFromStylistInput = z.infer<typeof removeServiceFromStylistSchema>

/** Definește payload-ul complet pentru metoda de update din repository. */
export type ServiceOfferedUpdatePayload = {
  id: string
  data: ServiceOfferedUpdateData
}

export type ServiceToStylistCreateData = AddServiceToStylistInput
