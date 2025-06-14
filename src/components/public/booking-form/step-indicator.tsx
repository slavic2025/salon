// src/components/public/booking-form/step-indicator.tsx
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Step {
  id: string
  label: string
}

interface StepIndicatorProps {
  steps: readonly Step[]
  currentStep: number
}

export function StepIndicator({ steps, currentStep }: StepIndicatorProps) {
  return (
    <nav aria-label="Progress">
      <ol role="list" className="flex items-center">
        {steps.map((step, stepIdx) => (
          <li
            key={step.id}
            className={cn(
              stepIdx !== steps.length - 1 ? 'pr-8 sm:pr-20' : '',
              'relative'
            )}
          >
            {stepIdx < currentStep ? (
              // Pașii completați
              <>
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                  <div className="h-0.5 w-full bg-indigo-600" />
                </div>
                <div className="relative flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 hover:bg-indigo-900">
                  <Check className="h-5 w-5 text-white" aria-hidden="true" />
                  <span className="sr-only">{step.label}</span>
                </div>
              </>
            ) : stepIdx === currentStep ? (
              // Pasul curent
              <>
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                  <div className="h-0.5 w-full bg-gray-200" />
                </div>
                <div
                  className="relative flex h-8 w-8 items-center justify-center rounded-full border-2 border-indigo-600 bg-white"
                  aria-current="step"
                >
                  <span className="h-2.5 w-2.5 rounded-full bg-indigo-600" aria-hidden="true" />
                  <span className="sr-only">{step.label}</span>
                </div>
              </>
            ) : (
              // Pașii viitori
              <>
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                  <div className="h-0.5 w-full bg-gray-200" />
                </div>
                <div className="relative flex h-8 w-8 items-center justify-center rounded-full border-2 border-gray-300 bg-white hover:border-gray-400">
                  <span className="h-2.5 w-2.5 rounded-full bg-transparent" aria-hidden="true" />
                  <span className="sr-only">{step.label}</span>
                </div>
              </>
            )}
            <div className="absolute left-0 top-10 -ml-1 mt-0.5 hidden w-32 text-center text-xs font-medium text-gray-500 sm:block">
              {step.label}
            </div>
          </li>
        ))}
      </ol>
    </nav>
  )
}
