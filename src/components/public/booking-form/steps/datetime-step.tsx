'use client'

import { useState } from 'react'
import { Calendar } from '@/components/atoms/calendar'
import { useBookingStore } from '@/stores/use-booking-store'

const TIME_SLOTS = [
  '09:00',
  '09:30',
  '10:00',
  '10:30',
  '11:00',
  '11:30',
  '12:00',
  '12:30',
  '13:00',
  '13:30',
  '14:00',
  '14:30',
  '15:00',
  '15:30',
  '16:00',
  '16:30',
  '17:00',
  '17:30',
  '18:00',
  '18:30',
] as const

export function DateTimeStep() {
  const { formData, selectDateTime, prevStep } = useBookingStore()
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())

  // Verificăm dacă avem stilistul selectat
  if (!formData.stylist) {
    return (
      <div className="text-center">
        <p className="text-red-600 mb-4">Nu a fost selectat niciun stilist</p>
        <button onClick={prevStep} className="text-indigo-600 hover:text-indigo-800">
          ← Înapoi la stiliști
        </button>
      </div>
    )
  }

  const handleTimeSelect = (time: string) => {
    if (selectedDate) {
      selectDateTime(selectedDate, time)
    }
  }

  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">Pasul 3: Alege data și ora</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <h4 className="font-medium">Selectează data</h4>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            className="rounded-md border"
            disabled={{ before: new Date() }}
          />
        </div>

        <div className="space-y-4">
          <h4 className="font-medium">Selectează ora</h4>
          <div className="grid grid-cols-3 gap-2 max-h-[300px] overflow-y-auto">
            {TIME_SLOTS.map((time) => (
              <button
                key={time}
                onClick={() => handleTimeSelect(time)}
                className="p-3 border rounded-lg text-center hover:bg-gray-100"
              >
                {time}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
