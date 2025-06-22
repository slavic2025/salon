'use client'

import { useState } from 'react'
import { Button } from '@/components/atoms/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/atoms/card'
import { Input } from '@/components/atoms/input'
import { Label } from '@/components/atoms/label'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { useBookingStore } from '@/stores/use-booking-store'
import { addAppointmentAction } from '@/features/appointments/actions'
import { DEFAULT_CURRENCY_SYMBOL } from '@/lib/constants'

interface ContactInfo {
  name: string
  email: string
  phone: string
}

export function ConfirmStep() {
  const { formData, prevStep, resetBooking } = useBookingStore()
  const [contact, setContact] = useState<ContactInfo>({
    name: '',
    email: '',
    phone: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Verificăm dacă avem toate datele necesare
  if (!formData.service || !formData.stylist || !formData.date || !formData.time) {
    return (
      <div className="text-center">
        <p className="text-red-600 mb-4">Date incomplete pentru programare</p>
        <button onClick={prevStep} className="text-indigo-600 hover:text-indigo-800">
          ← Înapoi
        </button>
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Validare
      if (!contact.name || !contact.email || !contact.phone) {
        toast.error('Te rugăm să completezi toate câmpurile de contact.')
        return
      }

      const payload = {
        serviceId: formData.service!.id,
        stylistId: formData.stylist!.id,
        date: formData.date!.toISOString().split('T')[0], // YYYY-MM-DD format
        time: formData.time!,
        duration: formData.service!.duration_minutes,
        clientName: contact.name,
        clientEmail: contact.email,
        clientPhone: contact.phone,
      }

      // Convertim payload-ul în FormData
      const formDataToSend = new FormData()
      Object.entries(payload).forEach(([key, value]) => {
        formDataToSend.append(key, String(value))
      })

      const result = await addAppointmentAction({ success: false }, formDataToSend)

      if (result.success) {
        toast.success('Programarea ta a fost trimisă!', {
          description: result.message || 'Vei primi un email de confirmare în curând.',
        })
        resetBooking()
      } else {
        toast.error('A apărut o eroare', {
          description: result.message || 'Te rugăm să încerci din nou.',
        })
      }
    } catch (error) {
      console.error('Error submitting booking:', error)
      toast.error('Eroare neașteptată', {
        description: 'A apărut o problemă tehnică. Te rugăm să încerci din nou mai târziu.',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">Pasul 4: Confirmă programarea</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Detalii Programare</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Serviciu:</span>
              <span className="font-medium">{formData.service.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Stilist:</span>
              <span className="font-medium">{formData.stylist.full_name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Data:</span>
              <span className="font-medium">
                {formData.date.toLocaleDateString('ro-RO', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Ora:</span>
              <span className="font-medium">{formData.time}</span>
            </div>
            <div className="flex justify-between border-t pt-4">
              <span className="font-semibold">Total:</span>
              <span className="font-semibold text-indigo-600">
                {formData.service.price} {DEFAULT_CURRENCY_SYMBOL}
              </span>
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
              placeholder="Introdu numele complet"
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
              placeholder="Introdu adresa de email"
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
              placeholder="Introdu numărul de telefon"
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
