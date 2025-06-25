// src/core/domains/schedules/schedule.constants.ts

// Definim array-ul de nume explicit. Aceasta devine sursa de adevăr pentru UI.
const WEEKDAY_NAMES = ['Luni', 'Marți', 'Miercuri', 'Joi', 'Vineri', 'Sâmbătă', 'Duminică'] as const // `as const` este important pentru a păstra tipurile literale.

// Definim maparea către valorile numerice din DB.
const WEEKDAY_MAP = {
  Duminică: 0,
  Luni: 1,
  Marți: 2,
  Miercuri: 3,
  Joi: 4,
  Vineri: 5,
  Sâmbătă: 6,
} as const

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
    schedule: (stylistId: string) => `/stylist/schedules?stylistId=${stylistId}`, // Exemplu
  },
} as const

export const SCHEDULE_CONSTANTS = {
  MESSAGES,
  PATHS,
  WEEKDAY_NAMES,
  WEEKDAY_MAP,
} as const
