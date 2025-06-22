import { create } from 'zustand'
import type { Service } from '@/core/domains/services/service.types'
import type { Stylist } from '@/core/domains/stylists/stylist.types'

// Tipul pentru datele din formular
interface BookingFormData {
  service: Service | null
  stylist: Stylist | null
  date: Date | null
  time: string | null
}

// Tipul pentru starea și acțiunile store-ului
interface BookingStoreState {
  currentStep: number
  formData: BookingFormData
  selectService: (service: Service) => void
  selectStylist: (stylist: Stylist) => void
  selectDateTime: (date: Date, time: string) => void
  nextStep: () => void
  prevStep: () => void
  resetBooking: () => void
}

const initialData: BookingFormData = {
  service: null,
  stylist: null,
  date: null,
  time: null,
}

export const useBookingStore = create<BookingStoreState>((set, get) => ({
  currentStep: 1,
  formData: initialData,

  // Acțiuni care modifică starea
  selectService: (service) => {
    set({ formData: { ...get().formData, service, stylist: null, date: null, time: null }, currentStep: 2 })
  },
  selectStylist: (stylist) => {
    set({ formData: { ...get().formData, stylist, date: null, time: null }, currentStep: 3 })
  },
  selectDateTime: (date, time) => {
    set({ formData: { ...get().formData, date, time }, currentStep: 4 })
  },
  nextStep: () => {
    set((state) => ({ currentStep: state.currentStep + 1 }))
  },
  prevStep: () => {
    set((state) => ({ currentStep: Math.max(1, state.currentStep - 1) }))
  },
  resetBooking: () => {
    set({ formData: initialData, currentStep: 1 })
  },
}))
