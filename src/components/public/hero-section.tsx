// src/components/public/hero-section.tsx

import { Button } from '@/components/atoms/button'
import Link from 'next/link'

export function HeroSection() {
  return (
    <div className="relative w-full bg-gray-900">
      <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:flex lg:items-center lg:gap-x-10 lg:px-8">
        <div className="mx-auto max-w-2xl text-center lg:mx-0 lg:flex-auto">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">Eleganță și Stil, Redefinite.</h1>
          <p className="mt-6 text-lg leading-8 text-gray-300">
            La salonul nostru, fiecare detaliu este gândit pentru a-ți oferi o experiență excepțională și rezultate pe
            măsura așteptărilor.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Button asChild size="lg">
              <Link href="/programare">Programează-te Acum</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
