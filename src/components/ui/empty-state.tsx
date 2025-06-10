// src/components/ui/empty-state.tsx

import { cn } from '@/lib/utils'
import { Heading } from './heading' // Vom folosi componenta Heading pentru un stil consistent

// Definim ce proprietati poate primi componenta
interface EmptyStateProps {
  title: string
  description: string
  className?: string // className este optional
}

export function EmptyState({ title, description, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center space-y-4 rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-12 text-center',
        className
      )}
    >
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-200">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-8 w-8 text-gray-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
          />
        </svg>
      </div>
      <Heading title={title} description={description} center />
    </div>
  )
}
