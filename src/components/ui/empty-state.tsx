// src/components/ui/empty-state.tsx

import { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { Heading } from './heading' // Vom folosi componenta Heading pentru un stil consistent

export interface EmptyStateProps {
  title?: string
  description?: string
  message?: string
  icon?: ReactNode
  className?: string
}

export function EmptyState({ title, description, message, icon, className }: EmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center p-8 text-center', className)}>
      {icon && <div className="mb-4">{icon}</div>}
      {title && <h3 className="text-lg font-semibold text-gray-900">{title}</h3>}
      {(description || message) && <p className="mt-2 text-sm text-gray-500">{description || message}</p>}
    </div>
  )
}
