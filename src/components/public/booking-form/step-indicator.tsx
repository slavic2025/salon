// src/components/public/booking-form/step-indicator.tsx
import { cn } from '@/lib/utils'

interface StepIndicatorProps {
  steps: string[]
  currentStep: number
}

export function StepIndicator({ steps, currentStep }: StepIndicatorProps) {
  return (
    <nav aria-label="Progress">
      <ol role="list" className="space-y-4 md:flex md:space-x-8 md:space-y-0">
        {steps.map((step, index) => (
          <li key={step} className="md:flex-1">
            {index < currentStep ? (
              // Completed Step
              <div className="group flex flex-col border-l-4 border-indigo-600 py-2 pl-4 md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4">
                <span className="text-sm font-medium text-indigo-600">{`Pasul ${index + 1}`}</span>
                <span className="text-sm font-medium">{step}</span>
              </div>
            ) : index === currentStep ? (
              // Current Step
              <div
                className="flex flex-col border-l-4 border-indigo-600 py-2 pl-4 md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4"
                aria-current="step"
              >
                <span className="text-sm font-medium text-indigo-600">{`Pasul ${index + 1}`}</span>
                <span className="text-sm font-medium">{step}</span>
              </div>
            ) : (
              // Upcoming Step
              <div className="group flex flex-col border-l-4 border-gray-200 py-2 pl-4 md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4">
                <span className="text-sm font-medium text-gray-500">{`Pasul ${index + 1}`}</span>
                <span className="text-sm font-medium">{step}</span>
              </div>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}
