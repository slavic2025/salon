// src/core/domains/appointments/appointment.constants.ts

/**
 * Definește statusurile interne posibile pentru o programare.
 * Acestea nu sunt mesaje pentru utilizator, ci valori constante.
 */
const STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  CANCELLED: 'cancelled',
  COMPLETED: 'completed',
} as const

/**
 * Definește tipurile de notificări interne.
 */
const NOTIFICATION_TYPES = {
  CONFIRMATION: 'confirmation',
  REMINDER: 'reminder',
  CANCELLATION: 'cancellation',
} as const

/**
 * Centralizează toate mesajele afișate utilizatorului.
 */
const MESSAGES = {
  SUCCESS: {
    CREATED: 'Programarea a fost creată cu succes.',
    UPDATED: 'Programarea a fost actualizată cu succes.',
    DELETED: 'Programarea a fost ștearsă cu succes.',
    CANCELLED: 'Programarea a fost anulată cu succes.',
  },
  ERROR: {
    // Erori de validare a datelor de intrare
    VALIDATION: {
      INVALID_ID: 'ID-ul programării este invalid.',
      INVALID_DATE: 'Data programării este invalidă.',
      INVALID_TIME: 'Ora programării este invalidă.',
      INVALID_DURATION: 'Durata programării este invalidă.',
      INVALID_SERVICE: 'Serviciul selectat este invalid.',
      INVALID_STYLIST: 'Stilistul selectat este invalid.',
      INVALID_CLIENT: 'Clientul selectat este invalid.',
      INVALID_STATUS: 'Statusul programării este invalid.',
    },
    // Erori legate de reguli de business
    BUSINESS: {
      OVERLAPPING: 'Există deja o programare care se suprapune cu această perioadă.',
      // Aici pot fi adăugate alte reguli, ex: programare în afara orelor de program
    },
    // Erori neașteptate de la server
    SERVER: {
      DEFAULT: 'A apărut o eroare la procesarea cererii.',
      CREATE: 'A apărut o eroare la crearea programării.',
      UPDATE: 'A apărut o eroare la actualizarea programării.',
      DELETE: 'A apărut o eroare la ștergerea programării.',
    },
    // Erori generice
    NOT_FOUND: 'Programarea nu a fost găsită.',
    UNAUTHORIZED: 'Nu aveți permisiunea de a efectua această acțiune.',
  },
} as const

/**
 * Centralizează căile de navigație și revalidare.
 */
const PATHS = {
  revalidate: {
    list: () => '/dashboard/schedule',
    details: (id: string) => `/dashboard/appointments/${id}`,
  },
  pages: {
    list: '/dashboard/schedule',
    details: (id: string) => `/dashboard/appointments/${id}`,
  },
} as const

// Exportăm un singur obiect care conține toate constantele
export const APPOINTMENT_CONSTANTS = {
  STATUS,
  NOTIFICATION_TYPES,
  MESSAGES,
  PATHS,
} as const
