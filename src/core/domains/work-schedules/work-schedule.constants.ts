// src/core/domains/work-schedules/work-schedule.constants.ts

const WEEKDAYS_ENUM = {
  Luni: 'monday',
  Marti: 'tuesday',
  Miercuri: 'wednesday',
  Joi: 'thursday',
  Vineri: 'friday',
  Sambata: 'saturday',
  Duminica: 'sunday',
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
    schedule: (stylistId: string) => `/stylist/schedule?stylistId=${stylistId}`, // Exemplu
  },
} as const

export const WORK_SCHEDULE_CONSTANTS = {
  WEEKDAYS_ENUM,
  MESSAGES,
  PATHS,
} as const
