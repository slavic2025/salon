// src/core/domains/services/service.constants.ts

/**
 * Definește categoriile interne posibile pentru un serviciu.
 */
const CATEGORIES = {
  HAIRCUT: 'Tuns',
  COLORING: 'Vopsit',
  STYLING: 'Coafat',
  TREATMENT: 'Tratament',
  OTHER: 'Altele',
} as const

/**
 * Definește statusurile interne posibile pentru un serviciu.
 */
const STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
} as const

/**
 * Centralizează toate mesajele afișate utilizatorului.
 */
const MESSAGES = {
  SUCCESS: {
    CREATED: 'Serviciul a fost creat cu succes.',
    UPDATED: 'Serviciul a fost actualizat cu succes.',
    DELETED: 'Serviciul a fost șters cu succes.',
  },
  ERROR: {
    // Erori de validare a datelor de intrare
    VALIDATION: {
      INVALID_ID: 'ID-ul serviciului este invalid.',
      INVALID_NAME: 'Numele serviciului este invalid.',
      INVALID_DESCRIPTION: 'Descrierea serviciului este invalidă.',
      INVALID_DURATION: 'Durata serviciului este invalidă (trebuie să fie mai mare decât 0).',
      INVALID_PRICE: 'Prețul serviciului este invalid (trebuie să fie mai mare decât 0).',
      INVALID_CATEGORY: 'Categoria serviciului este invalidă.',
      INVALID_IMAGE: 'Imaginea serviciului este invalidă.',
    },
    // Erori legate de reguli de business
    BUSINESS: {
      DUPLICATE_NAME: 'Există deja un serviciu cu acest nume.',
    },
    // Erori neașteptate de la server
    SERVER: {
      DEFAULT: 'A apărut o eroare la procesarea cererii.',
      CREATE: 'A apărut o eroare la crearea serviciului.',
      UPDATE: 'A apărut o eroare la actualizarea serviciului.',
      DELETE: 'A apărut o eroare la ștergerea serviciului.',
    },
    // Erori generice
    NOT_FOUND: 'Serviciul nu a fost găsit.',
    UNAUTHORIZED: 'Nu aveți permisiunea de a efectua această acțiune.',
  },
} as const

/**
 * Centralizează căile de navigație și revalidare.
 */
const PATHS = {
  revalidate: {
    list: () => '/admin/services',
    details: (id: string) => `/admin/services/${id}`,
  },
  pages: {
    list: '/admin/services',
    details: (id: string) => `/admin/services/${id}`,
  },
} as const

// Exportăm un singur obiect care conține toate constantele domeniului 'services'
export const SERVICE_CONSTANTS = {
  CATEGORIES,
  STATUS,
  MESSAGES,
  PATHS,
} as const
