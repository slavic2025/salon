export const SERVICES_OFFERED_MESSAGES = {
  SUCCESS: {
    CREATED: 'Serviciul oferit a fost creat cu succes.',
    UPDATED: 'Serviciul oferit a fost actualizat cu succes.',
    DELETED: 'Serviciul oferit a fost șters cu succes.',
  },
  ERROR: {
    VALIDATION: {
      INVALID_ID: 'ID-ul serviciului oferit este invalid.',
      INVALID_SERVICE_ID: 'ID-ul serviciului este invalid.',
      INVALID_STYLIST_ID: 'ID-ul stilistului este invalid.',
      INVALID_PRICE: 'Prețul serviciului oferit este invalid.',
      INVALID_DURATION: 'Durata serviciului oferit este invalidă.',
      INVALID_DESCRIPTION: 'Descrierea serviciului oferit este invalidă.',
      INVALID_IS_ACTIVE: 'Statusul serviciului oferit este invalid.',
    },
    NOT_FOUND: 'Serviciul oferit nu a fost găsit.',
    DUPLICATE: 'Acest serviciu oferit există deja.',
    SERVER: 'A apărut o eroare la procesarea cererii.',
    UNAUTHORIZED: 'Nu aveți permisiunea de a efectua această acțiune.',
  },
} as const

export const SERVICES_OFFERED_PATHS = {
  revalidation: () => '/admin/services-offered',
  auth: {
    confirm: '/admin/services-offered/confirm',
    resetPassword: '/admin/services-offered/reset-password',
  },
} as const
