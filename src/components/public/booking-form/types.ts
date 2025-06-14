import type { Service } from '@/core/domains/services/service.types'
import type { Stylist } from '@/core/domains/stylists/stylist.types'

export interface BookingFormData {
  service: Service | null
  stylist: Stylist | null
  date: Date | null
  time: string | null
  contact: ContactData
}

export interface ContactData {
  name: string
  email: string
  phone: string
}

export const initialFormData: BookingFormData = {
  service: null,
  stylist: null,
  date: null,
  time: null,
  contact: { name: '', email: '', phone: '' },
}

export const BOOKING_STEPS = [
  { id: 'service', label: 'Serviciu' },
  { id: 'stylist', label: 'Stilist' },
  { id: 'datetime', label: 'Data și Ora' },
  { id: 'confirm', label: 'Confirmare' },
] as const

export const TIME_SLOTS = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
  '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
  '18:00', '18:30'
] as const 