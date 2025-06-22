// Importăm ambele componente exportate explicit
import { BookingForm, BookingFormStep } from '@/components/organisms/booking/BookingForm'
import { ServiceStep } from '@/components/public/booking-form/steps/service-step'
import { StylistStep } from '@/components/public/booking-form/steps/stylist-step'
import { DateTimeStep } from '@/components/public/booking-form/steps/datetime-step'
import { ConfirmStep } from '@/components/public/booking-form/steps/confirm-step'
import { getServiceService } from '@/features/services/actions'
// ... alte importuri

export default async function HomePage() {
  const serviceService = await getServiceService()
  const services = await serviceService.findAllServices()

  return (
    <main>
      {/* ... HeroSection ... */}
      <section id="programare">
        {/* Folosim componenta principală ca un container */}
        <BookingForm>
          {/* Și folosim componenta de pas pentru fiecare etapă */}
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
      </section>
      {/* ... ServiceList ... */}
    </main>
  )
}
