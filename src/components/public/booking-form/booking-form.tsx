// src/components/public/booking-form/booking-form.tsx
'use client'

import { Card, CardContent, CardHeader } from '@/components/ui/card'
import type { Service } from '@/core/domains/services/service.types'
import { StepIndicator } from './step-indicator'
import { ServiceStep } from './steps/service-step'
import { StylistStep } from './steps/stylist-step'
import { DateTimeStep } from './steps/datetime-step'
import { ConfirmStep } from './steps/confirm-step'
import { BookingComplete } from './booking-complete'
import { BOOKING_STEPS } from './types'
import { useBookingForm } from '@/hooks/use-booking-form'

interface BookingFormProps {
  services: Service[]
}

export function BookingForm({ services }: BookingFormProps) {
  const {
    currentStep,
    formData,
    bookingComplete,
    handleSelectService,
    handleSelectStylist,
    handleSelectDateTime,
    handleBack,
    handleSubmitBooking,
    resetForm,
  } = useBookingForm()

  if (bookingComplete) {
    return <BookingComplete onReset={resetForm} />
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
