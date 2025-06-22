'use client'

import { useEffect, useState } from 'react'
import { Loader2 } from 'lucide-react'
import { useBookingStore } from '@/stores/use-booking-store'
import { getActiveStylistsAction } from '@/features/stylists/actions'
import { type Stylist } from '@/core/domains/stylists/stylist.types'

export function StylistStep() {
  const { formData, selectStylist, prevStep } = useBookingStore()
  const [stylists, setStylists] = useState<Stylist[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchStylists = async () => {
      if (!formData.service) {
        setError('Nu a fost selectat niciun serviciu')
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        const result = await getActiveStylistsAction()

        if (result.success && result.data) {
          setStylists(result.data)
          setError(null)
        } else {
          setError(result.error || 'Eroare la încărcarea stiliștilor')
        }
      } catch (err) {
        setError('Eroare la încărcarea stiliștilor')
        console.error('Error fetching stylists:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchStylists()
  }, [formData.service])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-48">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center">
        <p className="text-red-600 mb-4">{error}</p>
        <button onClick={prevStep} className="text-indigo-600 hover:text-indigo-800">
          ← Înapoi la servicii
        </button>
      </div>
    )
  }

  if (stylists.length === 0) {
    return (
      <div className="text-center">
        <p className="text-gray-600 mb-4">Nu există stiliști disponibili pentru acest serviciu.</p>
        <button onClick={prevStep} className="text-indigo-600 hover:text-indigo-800">
          ← Înapoi la servicii
        </button>
      </div>
    )
  }

  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">Pasul 2: Alege un stilist</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {stylists.map((stylist) => (
          <button
            key={stylist.id}
            onClick={() => selectStylist(stylist)}
            className="p-4 border rounded-lg text-left hover:bg-gray-100"
          >
            <div className="font-medium">{stylist.full_name}</div>
            <div className="text-sm text-gray-600">{stylist.email}</div>
            {stylist.description && <div className="text-sm text-gray-500 mt-2">{stylist.description}</div>}
          </button>
        ))}
      </div>
    </div>
  )
}
