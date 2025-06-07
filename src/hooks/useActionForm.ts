// lib/hooks/useActionForm.ts
'use client'

import { useEffect, useRef, useActionState as useReactActionStateDefault, useCallback } from 'react'
import { toast } from 'sonner'
import { createLogger, Logger } from '@/lib/logger' // Asigură-te că această cale este corectă

export interface BaseActionResponse<TData = unknown, TErrors = Record<string, string[]>> {
  success: boolean
  message?: string
  errors?: TErrors & { _form?: string[] }
  data?: TData
}

interface UseActionFormProps<
  S extends BaseActionResponse, // S va folosi tipurile default pentru TData/TErrors dacă nu sunt specificate la utilizare
  P
> {
  action: (prevState: S, payload: P) => Promise<S> | S
  initialState: S // Obligatoriu
  onSuccess?: (data?: S['data']) => void
  onError?: (message?: string, errors?: S['errors']) => void
  resetFormRef?: React.RefObject<HTMLFormElement>
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

  // `useCallback` pentru `wrappedAction` este o bună practică.
  const wrappedAction = useCallback(
    async (prevState: S, payload: P): Promise<S> => {
      internalLogger.debug('Wrapped action called.')
      // `action` poate fi sync sau async, `await` gestionează ambele.
      return await action(prevState, payload)
    },
    [action, internalLogger] // Adaugă internalLogger dacă este folosit în wrappedAction (nu e cazul aici)
  )

  const [state, dispatchFormAction, isPending] = useReactActionStateDefault(
    wrappedAction,
    initialState // Presupunem că `initialState as Awaited<S>` nu mai este necesar dacă `initialState` este corect tipat ca `S` și `S` nu e Promise.
    // Dacă eroarea TS revine fără cast, acesta ar putea fi necesar datorită subtilităților `useActionState`.
    // Codul furnizat de tine avea `initialState as Awaited<S>`. Dacă funcționează, e ok.
  )

  const previousIsPendingRef = useRef(isPending)

  useEffect(() => {
    // Rulează doar când acțiunea s-a încheiat (isPending a trecut de la true la false)
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
        // Eroare
        const fieldErrorsExist =
          state.errors && Object.keys(state.errors).some((key) => key !== '_form' && state.errors?.[key]?.length)
        const formError = state.errors?._form?.[0]
        let toastDescription = state.message || formError || errorToastMessage

        if (fieldErrorsExist && !formError && !state.message) {
          // Dacă sunt doar erori de câmp și niciun mesaj general
          toastDescription = validationErrorToastMessage
        }

        toast.error('Eroare!', { description: toastDescription })
        internalLogger.warn('Action failed or had validation errors', {
          message: state.message,
          errors: state.errors,
          data: state.data,
        })

        if (onError) {
          onError(state.message, state.errors)
        }
      }
    }
    // Actualizează valoarea anterioară a isPending pentru următoarea rulare
    previousIsPendingRef.current = isPending
  }, [
    state,
    isPending,
    // Nu mai este nevoie de initialState în array-ul de dependențe cu această logică
    onSuccess,
    onError,
    resetFormRef,
    successToastMessage,
    errorToastMessage,
    validationErrorToastMessage,
    internalLogger,
  ])

  const handleSubmit = useCallback(
    (payload: P) => {
      if (isPending) {
        internalLogger.warn('Attempted to submit form while action is pending.')
        return
      }
      internalLogger.debug('Dispatching form action with payload:', { payloadType: typeof payload })
      dispatchFormAction(payload)
    },
    [dispatchFormAction, isPending, internalLogger]
  )

  return { state, formSubmit: handleSubmit, isPending }
}
