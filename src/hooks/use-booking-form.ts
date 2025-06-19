// import { useState } from 'react'
// import { toast } from 'sonner'
// import { format } from 'date-fns'
// import type { Service } from '@/core/domains/services/service.types'
// import type { Stylist } from '@/core/domains/stylists/stylist.types'
// import { createAppointmentAction } from '@/features/appointments/actions'
// import { initialFormData, type BookingFormData } from '@/components/public/booking-form/types'

// interface UseBookingFormResult {
//   currentStep: number
//   formData: BookingFormData
//   bookingComplete: boolean
//   handleSelectService: (service: Service) => void
//   handleSelectStylist: (stylist: Stylist) => void
//   handleSelectDateTime: (date: Date, time: string) => void
//   handleBack: () => void
//   handleSubmitBooking: (contact: BookingFormData['contact']) => Promise<void>
//   resetForm: () => void
// }

// export function useBookingForm(): UseBookingFormResult {
//   const [currentStep, setCurrentStep] = useState(0)
//   const [formData, setFormData] = useState<BookingFormData>(initialFormData)
//   const [bookingComplete, setBookingComplete] = useState(false)

//   const handleSelectService = (service: Service) => {
//     setFormData((prev) => ({ ...prev, service, stylist: null, date: null, time: null }))
//     setCurrentStep(1)
//   }

//   const handleSelectStylist = (stylist: Stylist) => {
//     setFormData((prev) => ({ ...prev, stylist, date: null, time: null }))
//     setCurrentStep(2)
//   }

//   const handleSelectDateTime = (date: Date, time: string) => {
//     setFormData((prev) => ({ ...prev, date, time }))
//     setCurrentStep(3)
//   }

//   const handleBack = () => setCurrentStep((prev) => Math.max(0, prev - 1))

//   const resetForm = () => {
//     setBookingComplete(false)
//     setCurrentStep(0)
//     setFormData(initialFormData)
//   }

//   const validateFormData = (): boolean => {
//     if (!formData.service || !formData.stylist || !formData.date || !formData.time) {
//       toast.error('Date incomplete', {
//         description: 'Se pare că un pas a fost omis. Te rugăm să reîncerci.',
//       })
//       return false
//     }
//     return true
//   }

//   const preparePayload = (contact: BookingFormData['contact']) => {
//     return {
//       serviceId: formData.service!.id,
//       stylistId: formData.stylist!.id,
//       date: format(formData.date!, 'yyyy-MM-dd'),
//       time: formData.time!,
//       duration: formData.service!.duration_minutes,
//       clientName: contact.name,
//       clientEmail: contact.email,
//       clientPhone: contact.phone,
//     }
//   }

//   const handleSubmitBooking = async (contact: BookingFormData['contact']) => {
//     if (!validateFormData()) return

//     try {
//       const payload = preparePayload(contact)
//       console.log('Se trimite cererea de programare:', payload)

//       const result = await createAppointmentAction({ success: false }, payload)

//       if (result.success) {
//         toast.success('Programarea ta a fost trimisă!', {
//           description: result.message || 'Vei primi un email de confirmare în curând.',
//         })
//         setBookingComplete(true)
//       } else {
//         console.error('Eroare la validare:', result.errors)
//         toast.error('A apărut o eroare', {
//           description: result.message || 'Te rugăm să încerci din nou sau să contactezi suportul.',
//         })
//       }
//     } catch (error) {
//       console.error('Unexpected error during booking submission:', error)
//       toast.error('Eroare neașteptată', {
//         description: 'A apărut o problemă tehnică. Te rugăm să încerci din nou mai târziu.',
//       })
//     }
//   }

//   return {
//     currentStep,
//     formData,
//     bookingComplete,
//     handleSelectService,
//     handleSelectStylist,
//     handleSelectDateTime,
//     handleBack,
//     handleSubmitBooking,
//     resetForm,
//   }
// }
