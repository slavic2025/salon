import { type Service } from '@/core/domains/services/service.types'
import { BookingForm, BookingFormStep } from '@/components/organisms/booking/BookingForm'
import { ServiceStep } from '@/components/public/booking-form/steps/service-step'
import { StylistStep } from '@/components/public/booking-form/steps/stylist-step'
import { DateTimeStep } from '@/components/public/booking-form/steps/datetime-step'
import { ConfirmStep } from '@/components/public/booking-form/steps/confirm-step'

interface BookingSectionProps {
  services: Service[]
}

export function BookingSection({ services }: BookingSectionProps) {
  return (
    <section id="programare" className="w-full py-16 lg:py-24">
      <div className="container px-4 md:px-6">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Programează-te Online</h2>
          <p className="mt-4 text-lg text-muted-foreground">Rapid, simplu și convenabil.</p>
        </div>
        <BookingForm>
          <BookingFormStep stepIndex={1}>
            <ServiceStep services={services} />
          </BookingFormStep>
          <BookingFormStep stepIndex={2}>
            <StylistStep />
          </BookingFormStep>
          <BookingFormStep stepIndex={3}>
            <DateTimeStep />
          </BookingFormStep>
          <BookingFormStep stepIndex={4}>
            <ConfirmStep />
          </BookingFormStep>
        </BookingForm>
      </div>
    </section>
  )
}
