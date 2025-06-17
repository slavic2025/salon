const MESSAGES = {
  SUCCESS: {
    UPDATED: 'Profilul a fost actualizat cu succes.',
  },
  ERROR: {
    NOT_FOUND: 'Profilul nu a fost găsit.',
    SERVER: {
      UPDATE: 'A apărut o eroare la actualizarea profilului.',
    },
  },
} as const

const PATHS = {
  revalidate: {
    profile: (id: string) => `/admin/profiles/${id}`, // Exemplu
  },
} as const

export const PROFILE_CONSTANTS = {
  MESSAGES,
  PATHS,
} as const
