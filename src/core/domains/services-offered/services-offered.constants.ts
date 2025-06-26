const MESSAGES = {
  SUCCESS: {
    ADDED: 'Serviciul a fost adăugat cu succes stilistului.',
    UPDATED: 'Detaliile serviciului oferit au fost actualizate.',
    DELETED: 'Serviciul a fost eliminat de la acest stilist.',
  },
  ERROR: {
    BUSINESS: {
      DUPLICATE: 'Acest serviciu este deja atribuit stilistului.',
    },
    SERVER: {
      ADD: 'A apărut o eroare la adăugarea serviciului.',
      UPDATE: 'A apărut o eroare la actualizarea serviciului.',
      DELETE: 'A apărut o eroare la ștergerea serviciului.',
      FIND_BY_STYLIST: 'A apărut o eroare la căutarea serviciilor pentru stilist.',
    },
  },
} as const

const PATHS = {
  revalidate: {
    // Calea de revalidare va fi pagina unde sunt listate serviciile stilistului
    stylistServices: (stylistId: string) => `/admin/stylists/${stylistId}/services`,
  },
} as const

export const SERVICES_OFFERED_CONSTANTS = {
  MESSAGES,
  PATHS,
} as const
