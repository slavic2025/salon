import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Loader2, ArrowLeft } from 'lucide-react'

interface DateTimeStepProps {
  stylistId: string
  onSelect: (date: Date, time: string) => void
  onBack: () => void
}

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
] as string[]

export function DateTimeStep({ stylistId, onSelect, onBack }: DateTimeStepProps) {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [availableTimes, setAvailableTimes] = useState<string[]>([])
  const [loadingTimes, setLoadingTimes] = useState(false)

  useEffect(() => {
    if (date) {
      setLoadingTimes(true)
      // TODO: Înlocuiește cu apelul real către API
      setTimeout(() => {
        // Simulăm că toate sloturile sunt disponibile pentru demo
        setAvailableTimes([...TIME_SLOTS])
        setLoadingTimes(false)
      }, 500)
    }
  }, [date, stylistId])

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold leading-6 text-gray-900">Alege data și ora</h3>
          <p className="mt-1 text-sm text-gray-500">Selectează data și ora dorită pentru programare</p>
        </div>
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Înapoi
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-md border"
            disabled={{ before: new Date() }}
          />
        </div>

        <div className="space-y-4">
          <h4 className="font-medium text-gray-900">Ore disponibile</h4>
          {loadingTimes ? (
            <div className="flex justify-center items-center h-48">
              <Loader2 className="h-6 w-6 animate-spin text-indigo-600" />
            </div>
          ) : availableTimes.length > 0 ? (
            <div className="grid grid-cols-3 gap-2 max-h-[300px] overflow-y-auto p-1">
              {availableTimes.map((time) => (
                <Button
                  key={time}
                  variant="outline"
                  onClick={() => date && onSelect(date, time)}
                  className="justify-center"
                >
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
