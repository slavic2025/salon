import { Button } from '@/components/atoms/button'

interface BookingCompleteProps {
  onReset: () => void
}

export function BookingComplete({ onReset }: BookingCompleteProps) {
  return (
    <div className="w-full max-w-4xl mx-auto p-8 text-center">
      <h2 className="text-2xl font-bold text-green-600">Mulțumim!</h2>
      <p className="mt-4 text-gray-600">
        Cererea ta de programare a fost înregistrată cu succes. Te rugăm să verifici emailul pentru confirmarea finală
        din partea salonului.
      </p>
      <Button onClick={onReset} className="mt-6">
        Fă o altă programare
      </Button>
    </div>
  )
}
