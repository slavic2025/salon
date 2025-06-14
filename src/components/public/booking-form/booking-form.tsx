// src/components/public/booking-form/booking-form.tsx
'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import type { Service } from '@/core/domains/services/service.types'
import { StepIndicator } from './step-indicator'
import { ServiceStep } from './steps/service-step'
import { StylistStep } from './steps/stylist-step'
import { DateTimeStep } from './steps/datetime-step'
import { ConfirmStep } from './steps/confirm-step'
import { BOOKING_STEPS, initialFormData, type BookingFormData } from './types'
import { createAppointmentAction } from '@/features/appointments/actions'
import { format } from 'date-fns'

interface BookingFormProps {
  services: Service[]
}

export function BookingForm({ services }: BookingFormProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState<BookingFormData>(initialFormData)
  const [bookingComplete, setBookingComplete] = useState(false)

  const handleSelectService = (service: Service) => {
    setFormData((prev) => ({ ...prev, service, stylist: null, date: null, time: null }))
    setCurrentStep(1)
  }

  const handleSelectStylist = (stylist: BookingFormData['stylist']) => {
    setFormData((prev) => ({ ...prev, stylist, date: null, time: null }))
    setCurrentStep(2)
  }

  const handleSelectDateTime = (date: Date, time: string) => {
    setFormData((prev) => ({ ...prev, date, time }))
    setCurrentStep(3)
  }

  const handleBack = () => setCurrentStep((prev) => Math.max(0, prev - 1))

  const handleSubmitBooking = async (contact: BookingFormData['contact']) => {
    // Pasul 1: Validăm că avem toate datele necesare din pașii anteriori.
    if (!formData.service || !formData.stylist || !formData.date || !formData.time) {
      toast.error('Date incomplete', {
        description: 'Se pare că un pas a fost omis. Te rugăm să reîncerci.',
      })
      return // Oprim execuția pentru a preveni erorile
    }

    try {
      // Pasul 2: Pregătim obiectul de date (payload) EXACT cum se așteaptă Server Action-ul.
      // Acest obiect trebuie să corespundă cu 'createAppointmentSchema' din 'appointment.types.ts'.
      const payload = {
        serviceId: formData.service.id,
        stylistId: formData.stylist.id,
        date: format(formData.date, 'yyyy-MM-dd'), // Formatăm data în formatul 'AAAA-LL-ZZ'
        time: formData.time,
        duration: formData.service.duration_minutes,
        clientName: contact.name,
        clientEmail: contact.email,
        clientPhone: contact.phone,
      }

      console.log('Se trimite cererea de programare:', payload)

      // Pasul 3: Apelăm Server Action-ul și așteptăm rezultatul.
      const result = await createAppointmentAction({ success: false }, payload)

      // Pasul 4: Verificăm rezultatul și afișăm notificarea corespunzătoare.
      if (result.success) {
        toast.success('Programarea ta a fost trimisă!', {
          description: result.message || 'Vei primi un email de confirmare în curând.',
        })
        setBookingComplete(true)
      } else {
        // Dacă acțiunea returnează o eroare, o afișăm utilizatorului.
        console.error('Eroare la validare:', result.errors)
        toast.error('A apărut o eroare', {
          description: result.message || 'Te rugăm să încerci din nou sau să contactezi suportul.',
        })
      }
    } catch (error) {
      // Prindem erorile neașteptate (ex: probleme de rețea, erori critice de server)
      console.error('Unexpected error during booking submission:', error)
      toast.error('Eroare neașteptată', {
        description: 'A apărut o problemă tehnică. Te rugăm să încerci din nou mai târziu.',
      })
    }
  }

  if (bookingComplete) {
    return (
      <div className="w-full max-w-4xl mx-auto p-8 text-center">
        <h2 className="text-2xl font-bold text-green-600">Mulțumim!</h2>
        <p className="mt-4 text-gray-600">
          Cererea ta de programare a fost înregistrată cu succes. Te rugăm să verifici emailul pentru confirmarea finală
          din partea salonului.
        </p>
        <Button
          onClick={() => {
            setBookingComplete(false)
            setCurrentStep(0)
            setFormData(initialFormData)
          }}
          className="mt-6"
        >
          Fă o altă programare
        </Button>
      </div>
    )
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <StepIndicator steps={BOOKING_STEPS} currentStep={currentStep} />
      </CardHeader>
      <CardContent className="mt-2 min-h-[400px]">
        {currentStep === 0 && <ServiceStep services={services} onSelect={handleSelectService} />}
        {currentStep === 1 && formData.service && (
          <StylistStep serviceId={formData.service.id} onSelect={handleSelectStylist} onBack={handleBack} />
        )}
        {currentStep === 2 && formData.stylist && (
          <DateTimeStep stylistId={formData.stylist.id} onSelect={handleSelectDateTime} onBack={handleBack} />
        )}
        {currentStep === 3 && <ConfirmStep data={formData} onBack={handleBack} onSubmit={handleSubmitBooking} />}
      </CardContent>
    </Card>
  )
}
