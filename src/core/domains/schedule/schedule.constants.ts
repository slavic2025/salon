export const SCHEDULE_MESSAGES = {
  SUCCESS: {
    CREATED: 'Programarea a fost creată cu succes.',
    UPDATED: 'Programarea a fost actualizată cu succes.',
    DELETED: 'Programarea a fost ștearsă cu succes.',
  },
  ERROR: {
    VALIDATION: {
      INVALID_ID: 'ID-ul programării este invalid.',
      INVALID_DATE: 'Data programării este invalidă.',
      INVALID_TIME: 'Ora programării este invalidă.',
      INVALID_DURATION: 'Durata programării este invalidă.',
      INVALID_STYLIST_ID: 'ID-ul stilistului este invalid.',
      INVALID_CLIENT_ID: 'ID-ul clientului este invalid.',
      INVALID_SERVICE_ID: 'ID-ul serviciului este invalid.',
      INVALID_STATUS: 'Statusul programării este invalid.',
      INVALID_NOTES: 'Notele programării sunt invalide.',
    },
    NOT_FOUND: 'Programarea nu a fost găsită.',
    DUPLICATE: 'Această programare există deja.',
    SERVER: 'A apărut o eroare la procesarea cererii.',
    UNAUTHORIZED: 'Nu aveți permisiunea de a efectua această acțiune.',
  },
} as const

export const SCHEDULE_PATHS = {
  revalidation: () => '/admin/schedule',
  auth: {
    confirm: '/admin/schedule/confirm',
    resetPassword: '/admin/schedule/reset-password',
  },
} as const
