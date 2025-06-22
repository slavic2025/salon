'use client'

import { useBookingStore } from '@/stores/use-booking-store'
import React from 'react'

// --- Componenta principală (Container/Wrapper) ---
interface BookingFormProps {
  children: React.ReactNode
}

// Acesta este wrapper-ul principal pe care îl vom folosi.
export function BookingForm({ children }: BookingFormProps) {
  return (
    <div className="w-full max-w-4xl mx-auto p-4 md:p-6 bg-white rounded-lg shadow-lg">
      <div className="relative">{children}</div>
    </div>
  )
}

// --- Componenta pentru un pas (Step) ---
interface BookingFormStepProps {
  stepIndex: number
  children: React.ReactNode
}

// Exportăm și componenta pentru pas separat.
export function BookingFormStep({ stepIndex, children }: BookingFormStepProps) {
  const currentStep = useBookingStore((state) => state.currentStep)
  // Logica de afișare condiționată rămâne aici.
  return currentStep === stepIndex ? <>{children}</> : null
}
