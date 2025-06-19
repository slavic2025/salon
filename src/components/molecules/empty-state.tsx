'use client'

import { type ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { Card } from '@/components/atoms/card'
import { Heading } from '@/components/atoms/heading' // Importăm atomul existent
import { PackageOpen } from 'lucide-react'

interface EmptyStateProps {
  title: string
  description: string
  icon?: ReactNode
  className?: string
  actions?: ReactNode
}

/**
 * O moleculă reutilizabilă pentru a afișa o stare de "gol".
 * Este compusă din atomi: Card, Heading, Icon.
 */
export function EmptyState({
  title,
  description,
  icon = <PackageOpen className="h-12 w-12 text-gray-400" />,
  className,
  actions,
}: EmptyStateProps) {
  return (
    <Card className={cn('flex flex-col items-center justify-center p-8 text-center border-dashed', className)}>
      {icon && <div className="mb-4">{icon}</div>}

      {/* --- AICI ESTE MODIFICAREA --- */}
      {/* Acum apelăm componenta Heading corect, pasându-i proprietățile
          pe care le așteaptă: title și description. Adăugăm și prop-ul 'center'. */}
      <Heading title={title} description={description} center />

      {/* Randăm acțiuni (ex: un buton) dacă sunt furnizate */}
      {actions && <div className="mt-6">{actions}</div>}
    </Card>
  )
}
