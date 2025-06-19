// src/components/ui/heading.tsx

import { cn } from '@/lib/utils'

interface HeadingProps {
  title: string
  description: string
  center?: boolean // <-- AM ADĂUGAT PROPRIETATEA OPȚIONALĂ 'center'
}

export const Heading = ({ title, description, center }: HeadingProps) => {
  return (
    // Aplicam clasa 'text-center' doar daca proprietatea 'center' este adevarata
    <div className={cn('space-y-2', center ? 'text-center' : 'text-left')}>
      <h2 className="text-3xl font-bold tracking-tight">{title}</h2>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  )
}
