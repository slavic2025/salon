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
    try {
      const finalData = { ...formData, contact }
      console.log('Submitting booking data:', finalData)
      // TODO: Implementează apelul către server action
      // const result = await createBookingAction(finalData)
      
      toast.success('Programarea ta a fost trimisă!', {
        description: 'Vei primi un email de confirmare în curând.',
      })
      setBookingComplete(true)
    } catch (error) {
      toast.error('A apărut o eroare', {
        description: 'Te rugăm să încerci din nou sau să contactezi suportul.',
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
          <StylistStep
            serviceId={formData.service.id}
            onSelect={handleSelectStylist}
            onBack={handleBack}
          />
        )}
        {currentStep === 2 && formData.stylist && (
          <DateTimeStep
            stylistId={formData.stylist.id}
            onSelect={handleSelectDateTime}
            onBack={handleBack}
          />
        )}
        {currentStep === 3 && (
          <ConfirmStep
            data={formData}
            onBack={handleBack}
            onSubmit={handleSubmitBooking}
          />
        )}
      </CardContent>
    </Card>
  )
}
