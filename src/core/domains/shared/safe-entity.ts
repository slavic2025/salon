// src/core/domains/shared/safe-entity.ts

import { z } from 'zod'
import { DisplayItem } from '@/components/shared/display-card-types'

/**
 * Schema Zod care validează că un obiect respectă contractul minim
 * pentru a fi afișat într-o componentă generică (ex: are un ID valid).
 */
export const safeDisplayItemSchema = z
  .object({
    id: z.string().uuid().nonempty(), // Impunem ca 'id' să fie un string de tip UUID și să nu fie gol.
  })
  .passthrough() // .passthrough() permite obiectului să aibă și alte proprietăți nedefinite în schemă.

/**
 * Definim un tip "sigur" care este inferat direct din schema Zod.
 * Orice obiect de acest tip are garantat un 'id' de tip string.
 */
export type SafeDisplayItem = z.infer<typeof safeDisplayItemSchema>

/**
 * O funcție helper care primește o entitate "nesigură" (cu tipuri ce pot fi null)
 * și returnează o entitate "sigură" dacă trece de validare, sau null în caz contrar.
 * @param entity - Obiectul de validat (ex: StylistDetail).
 * @returns Entitatea validată (cu tipul îngustat) sau null.
 */
export function makeSafeDisplayItem<T extends Record<string, any>>(entity: T): (T & SafeDisplayItem) | null {
  // Încercăm să validăm obiectul folosind schema noastră.
  const validation = safeDisplayItemSchema.safeParse(entity)

  if (validation.success) {
    // Dacă validarea reușește, TypeScript știe acum că entitatea are un 'id' de tip string.
    // Returnăm entitatea originală, dar cu noul tip "sigur" aplicat.
    return entity as T & SafeDisplayItem
  }

  // Opțional, dar recomandat: logăm eroarea pentru debugging,
  // ca să știm de ce o entitate a fost considerată invalidă.
  if (entity) {
    console.warn(`Entity with id ${entity.id} failed validation:`, validation.error.format())
  }

  return null
}
