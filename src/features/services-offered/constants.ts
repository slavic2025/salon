export const SERVICES_OFFERED_MESSAGES = {
  SUCCESS: {
    ADDED: 'Serviciul a fost adăugat cu succes stilistului!',
    UPDATED: 'Serviciul oferit a fost actualizat cu succes!',
    DELETED: 'Serviciul a fost eliminat cu succes de la stilist!',
  },
  ERROR: {
    INVALID_STYLIST_ID: 'ID-ul stilistului este invalid.',
    INVALID_DELETE_ID: 'ID-ul pentru ștergere este invalid.',
    INVALID_REVALIDATION: 'Contextul stilistului este invalid pentru revalidare.',
    VALIDATION: 'Eroare de validare.',
    DUPLICATE: 'Acest serviciu este deja oferit de stilist.',
    SERVER: {
      ADD: 'A apărut o eroare de server la adăugarea serviciului.',
      UPDATE: 'A apărut o eroare de server la actualizarea serviciului.',
      DELETE: 'A apărut o eroare de server la ștergerea serviciului.',
    },
  },
} as const

export const SERVICES_OFFERED_PATHS = {
  revalidation: (stylistId: string) => `/admin/stylists/${stylistId}/services`,
} as const
