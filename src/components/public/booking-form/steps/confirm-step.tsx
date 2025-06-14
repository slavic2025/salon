import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2, ArrowLeft } from 'lucide-react'
import { toast } from 'sonner'
import type { BookingFormData } from '../types'
import { DEFAULT_CURRENCY_SYMBOL } from '@/lib/constants'

interface ConfirmStepProps {
  data: BookingFormData
  onBack: () => void
  onSubmit: (contact: BookingFormData['contact']) => void
}

export function ConfirmStep({ data, onBack, onSubmit }: ConfirmStepProps) {
  const [contact, setContact] = useState(data.contact)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Validare simplă
      if (!contact.name || !contact.email || !contact.phone) {
        toast.error('Te rugăm să completezi toate câmpurile de contact.')
        return
      }

      await onSubmit(contact)
    } catch (error) {
      toast.error('A apărut o eroare la procesarea programării.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold leading-6 text-gray-900">Sumar și Confirmare</h3>
          <p className="mt-1 text-sm text-gray-500">Verifică detaliile și completează informațiile de contact</p>
        </div>
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Înapoi
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Detalii Programare</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Serviciu:</span>
              <span className="font-medium">{data.service?.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Stilist:</span>
              <span className="font-medium">{data.stylist?.full_name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Data:</span>
              <span className="font-medium">
                {data.date?.toLocaleDateString('ro-RO', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Ora:</span>
              <span className="font-medium">{data.time}</span>
            </div>
            <div className="flex justify-between border-t pt-4">
              <span className="font-semibold">Total:</span>
              <span className="font-semibold text-indigo-600">
                {data.service?.price} {DEFAULT_CURRENCY_SYMBOL}
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