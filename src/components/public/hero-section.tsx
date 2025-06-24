import { Button } from '@/components/atoms/button'
import Link from 'next/link'

export function HeroSection() {
  return (
    <section className="w-full h-[60vh] md:h-[70vh] flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="container px-4 md:px-6 text-center">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl text-gray-900 dark:text-gray-50">
            Stil și Eleganță, Redefinite
          </h1>
          <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
            Descoperă o experiență premium de îngrijire personală. Calitate, profesionalism și relaxare.
          </p>
        </div>
        <div className="mt-6">
          <Link href="#programare">
            <Button size="lg">Programează-te Acum</Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
