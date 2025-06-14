export const SERVICE_MESSAGES = {
  SUCCESS: {
    ADDED: 'Serviciul a fost adăugat cu succes!',
    UPDATED: 'Serviciul a fost actualizat cu succes!',
    DELETED: 'Serviciul a fost șters cu succes.',
  },
  ERROR: {
    VALIDATION: 'Eroare de validare',
    INVALID_ID: 'ID invalid pentru ștergere.',
    SERVER: {
      ADD: 'A apărut o eroare la adăugarea serviciului.',
      UPDATE: 'A apărut o eroare la actualizarea serviciului.',
      DELETE: 'A apărut o eroare la ștergerea serviciului.',
    },
  },
} as const

export const SERVICE_PATHS = {
  revalidation: () => '/admin/services',
} as const
