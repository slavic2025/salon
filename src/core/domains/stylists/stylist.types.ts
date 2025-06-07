// src/core/domains/stylists/stylist.types.ts
import { Tables, TablesInsert, TablesUpdate } from '@/types/database.types' // Calea corectă după refactorizare

// Tipul de bază pentru datele unui stilist, așa cum vin din DB
export type Stylist = Tables<'stylists'>

// Tipul pentru datele primite de la un formular de creare.
// Omit câmpurile auto-generate de DB.
export type StylistCreateData = Omit<
  TablesInsert<'stylists'>,
  'id' | 'created_at' | 'updated_at' | 'profile_id' | 'profile_picture'
>

// Tipul pentru datele primite de la un formular de actualizare.
// Toate câmpurile sunt opționale.
export type StylistUpdateData = TablesUpdate<'stylists'>
