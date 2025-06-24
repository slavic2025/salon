// src/core/domains/schedules/schedule.constants.ts

const WEEKDAYS = ['Duminică', 'Luni', 'Marți', 'Miercuri', 'Joi', 'Vineri', 'Sâmbătă'] as const

const MESSAGES = {
  SUCCESS: {
    CREATED: 'Intervalul de program a fost adăugat cu succes.',
    UPDATED: 'Programul de lucru a fost actualizat cu succes.',
    DELETED: 'Intervalul de program a fost șters cu succes.',
  },
  ERROR: {
    SERVER: {
      CREATE: 'A apărut o eroare la adăugarea intervalului.',
      UPDATE: 'A apărut o eroare la actualizarea programului.',
      DELETE: 'A apărut o eroare la ștergerea intervalului.',
    },
    BUSINESS: {
      OVERLAPPING: 'Acest interval se suprapune cu un altul existent.',
    },
  },
} as const

const PATHS = {
  revalidate: {
    schedule: (stylistId: string) => `/stylist/schedule?stylistId=${stylistId}`, // Exemplu
  },
} as const

export const SCHEDULE_CONSTANTS = {
  WEEKDAYS,
  MESSAGES,
  PATHS,
} as const
