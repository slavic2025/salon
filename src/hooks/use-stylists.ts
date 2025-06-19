// import { useState, useEffect } from 'react'
// import type { Stylist } from '@/core/domains/stylists/stylist.types'
// import { getStylistsByServiceAction } from '@/features/stylists/actions'
// import { STYLIST_MESSAGES } from '@/lib/constants'

// interface UseStylistsResult {
//   stylists: Stylist[]
//   loading: boolean
//   error: string | null
// }

// export function useStylists(serviceId: string): UseStylistsResult {
//   const [state, setState] = useState<UseStylistsResult>({
//     stylists: [],
//     loading: true,
//     error: null,
//   })

//   useEffect(() => {
//     const fetchStylists = async () => {
//       try {
//         const result = await getStylistsByServiceAction(serviceId)
//         if (result.success) {
//           setState({
//             stylists: result.data as Stylist[],
//             loading: false,
//             error: null,
//           })
//         } else {
//           setState({
//             stylists: [],
//             loading: false,
//             error: result.message || STYLIST_MESSAGES.LOADING_ERROR,
//           })
//         }
//       } catch (error) {
//         setState({
//           stylists: [],
//           loading: false,
//           error: STYLIST_MESSAGES.UNEXPECTED_ERROR,
//         })
//       }
//     }

//     fetchStylists()
//   }, [serviceId])

//   return state
// }
