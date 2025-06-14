import { PATHS } from '@/lib/constants'

export const STYLIST_MESSAGES = {
  SUCCESS: {
    CREATED: 'Stilistul a fost creat cu succes!',
    UPDATED: 'Stilistul a fost actualizat cu succes!',
    DELETED: 'Stilistul a fost șters cu succes!',
    PASSWORD_RESET: 'Email-ul de resetare a parolei a fost trimis cu succes.',
  },
  ERROR: {
    VALIDATION: {
      INVALID_ID: 'ID-ul stilistului este invalid.',
      INVALID_CONTEXT: 'Contextul stilistului este invalid pentru revalidare.',
    },
    NOT_FOUND: 'Stilistul nu a fost găsit sau nu are un profil de autentificare asociat.',
    DUPLICATE: 'Un utilizator cu acest email sau telefon există deja.',
    SERVER: {
      CREATE: 'A apărut o eroare de server la crearea stilistului.',
      UPDATE: 'A apărut o eroare de server la actualizarea stilistului.',
      DELETE: 'A apărut o eroare de server la ștergerea stilistului.',
      RESET_PASSWORD: 'A apărut o eroare de server la resetarea parolei.',
    },
  },
} as const

export const STYLIST_PATHS = {
  revalidation: () => PATHS.ADMIN_STYLISTS,
  auth: {
    confirm: PATHS.AUTH_CONFIRM,
    resetPassword: PATHS.AUTH_RESET_PASSWORD,
  },
} as const
