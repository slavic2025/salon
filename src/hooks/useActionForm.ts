// src/hooks/useActionForm.ts
'use client'

import { useEffect, useRef, useActionState } from 'react'
import { toast } from 'sonner'
import { createLogger, Logger } from '@/lib/logger'

export interface BaseActionResponse<TData = unknown, TErrors = Record<string, string[]>> {
  success: boolean
  message?: string
  errors?: TErrors & { _form?: string[] }
  data?: TData
}

interface UseActionFormProps<S extends BaseActionResponse, P> {
  action: (prevState: S, payload: P) => Promise<S> | S
  initialState: S
  onSuccess?: (data?: S['data']) => void
  onError?: (message?: string, errors?: S['errors']) => void
  resetFormRef?: React.RefObject<HTMLFormElement | null>
  successToastMessage?: string
  errorToastMessage?: string
  validationErrorToastMessage?: string
  loggerInstance?: Logger
}

export function useActionForm<S extends BaseActionResponse, P>({
  action,
  initialState,
  onSuccess,
  onError,
  resetFormRef,
  successToastMessage = 'Operațiune realizată cu succes!',
  errorToastMessage = 'A apărut o eroare neașteptată.',
  validationErrorToastMessage = 'Eroare de validare. Verificați câmpurile introduse.',
  loggerInstance,
}: UseActionFormProps<S, P>) {
  const internalLogger = loggerInstance || createLogger('useActionForm')

  // **CORECTIA 1: Apelăm useActionState direct și explicit**
  // - Eliminăm `useCallback` pentru `wrappedAction`.
  // - Adăugăm un cast `as Awaited<S>` la `initialState` pentru a rezolva eroarea de tip.
  // - Renumim `dispatchFormAction` în `dispatch` pentru claritate.
  const [state, dispatch, isPending] = useActionState<S, P>(action, initialState as Awaited<S>)

  const previousIsPendingRef = useRef(isPending)

  useEffect(() => {
    if (previousIsPendingRef.current === true && isPending === false) {
      internalLogger.debug('Action has completed. Current state:', { state })

      if (state.success) {
        toast.success('Succes!', { description: state.message || successToastMessage })
        internalLogger.info('Action successful', { data: state.data, message: state.message })
        if (resetFormRef?.current) {
          resetFormRef.current.reset()
          internalLogger.debug('Form reset.')
        }
        if (onSuccess) {
          onSuccess(state.data)
        }
      } else {
        const fieldErrorsExist =
          state.errors && Object.keys(state.errors).some((key) => key !== '_form' && state.errors?.[key]?.length)
        const formError = state.errors?._form?.[0]
        let toastDescription = state.message || formError || errorToastMessage

        if (fieldErrorsExist && !formError && !state.message) {
          toastDescription = validationErrorToastMessage
        }

        toast.error('Eroare!', { description: toastDescription })
        internalLogger.warn('Action failed or had validation errors', {
          message: state.message,
          errors: state.errors,
        })

        if (onError) {
          onError(state.message, state.errors)
        }
      }
    }
    previousIsPendingRef.current = isPending
  }, [
    state,
    isPending,
    onSuccess,
    onError,
    resetFormRef,
    successToastMessage,
    errorToastMessage,
    validationErrorToastMessage,
    internalLogger,
  ])

  // **CORECTIA 2: Returnăm funcția de dispatch corectă**
  // `dispatch` este acum corect tipat de `useActionState` ca `(payload: P) => void`.
  return { state, formSubmit: dispatch, isPending }
}
