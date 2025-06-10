// src/components/public/booking-form/booking-form.tsx
'use client'

import { useEffect, useState } from 'react'
import { StepIndicator } from './step-indicator'
import { Button } from '@/components/ui/button'
import { EmptyState } from '@/components/ui/empty-state'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Calendar } from '@/components/ui/calendar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2, ArrowLeft } from 'lucide-react'
import { toast } from 'sonner'
import type { Service } from '@/core/domains/services/service.types'
import type { Stylist } from '@/core/domains/stylists/stylist.types'
import { getStylistsByServiceAction } from '@/features/stylists/actions'

// Presupunem că aceste acțiuni vor fi create
// import { getAvailabilityAction } from '@/features/schedule/actions'
// import { createBookingAction } from '@/features/bookings/actions'

// --- Tipuri de date pentru starea formularului ---
interface FormData {
  service: Service | null
  stylist: Stylist | null
  date: Date | null
  time: string | null
  contact: { name: string; email: string; phone: string }
}

const initialFormData: FormData = {
  service: null,
  stylist: null,
  date: null,
  time: null,
  contact: { name: '', email: '', phone: '' },
}

// =================================================================
// PASUL 1: SELECȚIA SERVICIULUI
// =================================================================
function SelectServiceStep({ services, onSelect }: { services: Service[]; onSelect: (service: Service) => void }) {
  if (!services || services.length === 0) {
    return (
      <EmptyState
        title="Niciun serviciu disponibil"
        description="Momentan nu avem servicii active pentru programări online."
      />
    )
  }
  return (
    <div>
      <h3 className="text-lg font-semibold leading-6 text-gray-900">Alege un serviciu</h3>
      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((service) => (
          <button
            key={service.id}
            onClick={() => onSelect(service)}
            className="rounded-lg border border-gray-300 bg-white p-4 text-left shadow-sm transition hover:border-indigo-500 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <p className="font-semibold text-gray-900">{service.name}</p>
            <p className="mt-1 text-sm text-gray-500">{service.description}</p>
            <div className="mt-4 flex justify-between text-sm font-medium text-gray-700">
              <span>{service.price} RON</span>
              <span className="text-gray-500">{service.duration_minutes} min</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

// =================================================================
// PASUL 2: SELECȚIA STILISTULUI
// =================================================================
function SelectStylistStep({
  serviceId,
  onSelect,
  onBack,
}: {
  serviceId: string
  onSelect: (stylist: Stylist) => void
  onBack: () => void
}) {
  const [state, setState] = useState<{ stylists: Stylist[]; loading: boolean; error: string | null }>({
    stylists: [],
    loading: true,
    error: null,
  })

  useEffect(() => {
    getStylistsByServiceAction(serviceId).then((result) => {
      if (result.success) {
        // CORECȚIA 1: Folosim `|| []` pentru a oferi un array gol ca alternativă
        setState({ stylists: result.data || [], loading: false, error: null })
      } else {
        // CORECȚIA 2: Folosim `|| '...'` pentru a oferi un mesaj de eroare implicit
        setState({ stylists: [], loading: false, error: result.error || 'A apărut o eroare necunoscută.' })
      }
    })
  }, [serviceId])

  if (state.loading)
    return (
      <div className="flex justify-center items-center h-48">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    )
  if (state.error) return <EmptyState title="Eroare" description={state.error} />
  if (state.stylists.length === 0)
    return (
      <EmptyState title="Niciun stilist disponibil" description="Momentan, niciun stilist nu oferă acest serviciu." />
    )

  return (
    <div>
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Alege un stilist</h3>
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Înapoi
        </Button>
      </div>
      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {state.stylists.map((stylist) => (
          <button
            key={stylist.id}
            onClick={() => onSelect(stylist)}
            className="flex items-center gap-4 rounded-lg border border-gray-300 bg-white p-4 text-left shadow-sm transition hover:border-indigo-500 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <Avatar className="h-12 w-12">
              <AvatarImage src={stylist.profile_picture || undefined} alt={stylist.name} />
              <AvatarFallback>{stylist.name?.charAt(0)}</AvatarFallback>
            </Avatar>
            <p className="font-semibold text-gray-900">{stylist.name}</p>
          </button>
        ))}
      </div>
    </div>
  )
}

// =================================================================
// PASUL 3: SELECȚIA DATEI ȘI OREI
// =================================================================
function SelectDateTimeStep({
  stylistId,
  onSelect,
  onBack,
}: {
  stylistId: string
  onSelect: (date: Date, time: string) => void
  onBack: () => void
}) {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [availableTimes, setAvailableTimes] = useState<string[]>([])
  const [loadingTimes, setLoadingTimes] = useState(false)

  // Acest useEffect va apela o acțiune (pe care o vom crea) pentru a prelua orele disponibile
  useEffect(() => {
    if (date) {
      setLoadingTimes(true)
      // Simulam un apel API
      setTimeout(() => {
        setAvailableTimes(['09:00', '10:00', '11:30', '14:00', '15:00', '16:30'])
        setLoadingTimes(false)
      }, 500)
      // În implementarea reală, am apela:
      // getAvailabilityAction(stylistId, date).then(times => setAvailableTimes(times));
    }
  }, [date, stylistId])

  return (
    <div>
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Alege data și ora</h3>
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Înapoi
        </Button>
      </div>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-8">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          className="rounded-md border justify-center"
          disabled={{ before: new Date() }}
        />
        <div className="max-h-60 overflow-y-auto">
          {loadingTimes ? (
            <div className="flex justify-center items-center h-full">
              <Loader2 className="h-6 w-6 animate-spin text-indigo-600" />
            </div>
          ) : availableTimes.length > 0 ? (
            <div className="grid grid-cols-3 gap-2">
              {availableTimes.map((time) => (
                <Button key={time} variant="outline" onClick={() => onSelect(date!, time)}>
                  {time}
                </Button>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 text-center">Niciun interval disponibil în ziua selectată.</p>
          )}
        </div>
      </div>
    </div>
  )
}

// =================================================================
// PASUL 4: DETALII DE CONTACT ȘI CONFIRMARE
// =================================================================
function ContactAndSummaryStep({
  data,
  onBack,
  onSubmit,
}: {
  data: FormData
  onBack: () => void
  onSubmit: (contact: FormData['contact']) => void
}) {
  const [contact, setContact] = useState(data.contact)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    // Validare simplă
    if (!contact.name || !contact.email || !contact.phone) {
      toast.error('Te rugăm să completezi toate câmpurile de contact.')
      setIsSubmitting(false)
      return
    }
    await onSubmit(contact)
    setIsSubmitting(false)
  }

  return (
    <div>
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Sumar și Confirmare</h3>
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Înapoi
        </Button>
      </div>
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Detalii Programare</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Serviciu:</span> <span className="font-medium">{data.service?.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Stilist:</span> <span className="font-medium">{data.stylist?.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Data:</span>{' '}
              <span className="font-medium">{data.date?.toLocaleDateString('ro-RO')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Ora:</span> <span className="font-medium">{data.time}</span>
            </div>
            <div className="flex justify-between border-t pt-4">
              <span className="font-semibold">Total:</span>{' '}
              <span className="font-semibold">{data.service?.price} RON</span>
            </div>
          </CardContent>
        </Card>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Nume complet</Label>
            <Input
              id="name"
              value={contact.name}
              onChange={(e) => setContact((c) => ({ ...c, name: e.target.value }))}
              required
            />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={contact.email}
              onChange={(e) => setContact((c) => ({ ...c, email: e.target.value }))}
              required
            />
          </div>
          <div>
            <Label htmlFor="phone">Telefon</Label>
            <Input
              id="phone"
              type="tel"
              value={contact.phone}
              onChange={(e) => setContact((c) => ({ ...c, phone: e.target.value }))}
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Confirmă Programarea
          </Button>
        </form>
      </div>
    </div>
  )
}

// =================================================================
// COMPONENTA PRINCIPALĂ
// =================================================================
export function BookingForm({ services }: { services: Service[] }) {
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState<FormData>(initialFormData)
  const [bookingComplete, setBookingComplete] = useState(false)

  const steps = ['Serviciu', 'Stilist', 'Data și Ora', 'Confirmare']

  const handleSelectService = (service: Service) => {
    setFormData((p) => ({ ...p, service, stylist: null, date: null, time: null }))
    setCurrentStep(1)
  }
  const handleSelectStylist = (stylist: Stylist) => {
    setFormData((p) => ({ ...p, stylist, date: null, time: null }))
    setCurrentStep(2)
  }
  const handleSelectDateTime = (date: Date, time: string) => {
    setFormData((p) => ({ ...p, date, time }))
    setCurrentStep(3)
  }
  const handleBack = () => setCurrentStep((p) => Math.max(0, p - 1))

  const handleSubmitBooking = async (contact: FormData['contact']) => {
    const finalData = { ...formData, contact }
    console.log('Submitting booking data:', finalData)
    // Aici vom apela Server Action-ul real
    // const result = await createBookingAction(finalData);
    // if (result.success) {
    toast.success('Programarea ta a fost trimisă!', { description: 'Vei primi un email de confirmare în curând.' })
    setBookingComplete(true)
    // } else {
    //   toast.error('A apărut o eroare', { description: result.error })
    // }
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
        <StepIndicator steps={steps} currentStep={currentStep} />
      </CardHeader>
      <CardContent className="mt-2 min-h-[300px]">
        {currentStep === 0 && <SelectServiceStep services={services} onSelect={handleSelectService} />}
        {currentStep === 1 && formData.service && (
          <SelectStylistStep serviceId={formData.service.id} onSelect={handleSelectStylist} onBack={handleBack} />
        )}
        {currentStep === 2 && formData.stylist && (
          <SelectDateTimeStep stylistId={formData.stylist.id} onSelect={handleSelectDateTime} onBack={handleBack} />
        )}
        {currentStep === 3 && (
          <ContactAndSummaryStep data={formData} onBack={handleBack} onSubmit={handleSubmitBooking} />
        )}
      </CardContent>
    </Card>
  )
}
