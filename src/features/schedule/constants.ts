export const SCHEDULE_MESSAGES = {
  SUCCESS: {
    ADDED: 'Intervalul a fost adăugat cu succes!',
    DELETED: 'Intervalul a fost șters.',
  },
  ERROR: {
    VALIDATION: 'Eroare de validare',
    INVALID_ID: 'ID invalid.',
    AUTH: {
      UNAUTHORIZED: 'Utilizator neautentificat.',
      NO_PROFILE: 'Profilul de stilist nu a fost găsit.',
    },
    SERVER: {
      ADD: 'A apărut o eroare la adăugarea intervalului.',
      DELETE: 'A apărut o eroare la ștergerea intervalului.',
    },
  },
} as const

export const SCHEDULE_PATHS = {
  revalidation: () => '/dashboard/schedule',
} as const
