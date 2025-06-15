export const UNAVAILABILITY_MESSAGES = {
  SUCCESS: {
    CREATED: 'Perioada de indisponibilitate a fost creată cu succes.',
    UPDATED: 'Perioada de indisponibilitate a fost actualizată cu succes.',
    DELETED: 'Perioada de indisponibilitate a fost ștearsă cu succes.',
  },
  ERROR: {
    VALIDATION: {
      INVALID_ID: 'ID-ul perioadei de indisponibilitate este invalid.',
      INVALID_STYLIST_ID: 'ID-ul stilistului este invalid.',
      INVALID_START_DATE: 'Data de început este invalidă.',
      INVALID_END_DATE: 'Data de sfârșit este invalidă.',
      INVALID_REASON: 'Motivul indisponibilității este invalid.',
      INVALID_IS_ALL_DAY: 'Statusul de zi completă este invalid.',
      INVALID_TYPE: 'Tipul de indisponibilitate este invalid.',
    },
    NOT_FOUND: 'Perioada de indisponibilitate nu a fost găsită.',
    DUPLICATE: 'Această perioadă de indisponibilitate există deja.',
    SERVER: 'A apărut o eroare la procesarea cererii.',
    UNAUTHORIZED: 'Nu aveți permisiunea de a efectua această acțiune.',
  },
} as const

export const UNAVAILABILITY_PATHS = {
  revalidation: () => '/admin/unavailability',
  auth: {
    confirm: '/admin/unavailability/confirm',
    resetPassword: '/admin/unavailability/reset-password',
  },
} as const
