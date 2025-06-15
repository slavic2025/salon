export const USER_ERRORS = {
  PROFILE_NOT_FOUND: 'Profilul utilizatorului nu a fost găsit',
  INVALID_ROLE: 'Rolul utilizatorului este invalid',
  UNAUTHORIZED: 'Nu aveți permisiunea de a accesa această resursă',
} as const

export const USER_ROLES = {
  ADMIN: 'admin',
  STYLIST: 'stylist',
  CLIENT: 'client',
} as const

export const USER_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  SUSPENDED: 'suspended',
} as const

export const USER_MESSAGES = {
  SUCCESS: {
    CREATED: 'Utilizatorul a fost creat cu succes.',
    UPDATED: 'Utilizatorul a fost actualizat cu succes.',
    DELETED: 'Utilizatorul a fost șters cu succes.',
    PROFILE_UPDATED: 'Profilul utilizatorului a fost actualizat cu succes.',
  },
  ERROR: {
    VALIDATION: {
      INVALID_ID: 'ID-ul utilizatorului este invalid.',
      INVALID_EMAIL: 'Adresa de email este invalidă.',
      INVALID_NAME: 'Numele este invalid.',
      INVALID_PHONE: 'Numărul de telefon este invalid.',
      INVALID_ROLE: 'Rolul este invalid.',
      INVALID_PROFILE: 'Profilul utilizatorului este invalid.',
    },
    NOT_FOUND: 'Utilizatorul nu a fost găsit.',
    DUPLICATE: 'Acest utilizator există deja.',
    SERVER: 'A apărut o eroare la procesarea cererii.',
    UNAUTHORIZED: 'Nu aveți permisiunea de a efectua această acțiune.',
  },
} as const

export const USER_PATHS = {
  revalidation: () => '/admin/users',
  auth: {
    confirm: '/admin/users/confirm',
    resetPassword: '/admin/users/reset-password',
  },
} as const
