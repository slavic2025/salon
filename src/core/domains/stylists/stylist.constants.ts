// src/core/domains/stylists/stylist.constants.ts
import { uuidField, dateField, timeField } from '@/config/validation/fields'

/**
 * Definește statusurile interne posibile pentru un stilist.
 */
const STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  ON_LEAVE: 'on_leave',
} as const

/**
 * Definește rolurile interne posibile pentru un stilist.
 */
const ROLES = {
  SENIOR: 'senior',
  JUNIOR: 'junior',
  TRAINEE: 'trainee',
} as const

/**
 * Centralizează toate mesajele afișate utilizatorului.
 */
const MESSAGES = {
  SUCCESS: {
    CREATED: 'Stilistul a fost creat cu succes!',
    UPDATED: 'Stilistul a fost actualizat cu succes!',
    DELETED: 'Stilistul a fost șters cu succes!',
    PASSWORD_RESET: 'Email-ul de resetare a parolei a fost trimis cu succes.',
  },
  ERROR: {
    // Erori de validare a datelor de intrare
    VALIDATION: {
      INVALID_ID: 'ID-ul stilistului este invalid.',
      INVALID_CONTEXT: 'Contextul stilistului este invalid pentru revalidare.',
      INVALID_NAME: 'Numele complet este obligatoriu și trebuie să fie valid.',
      INVALID_EMAIL: 'Adresa de email este invalidă.',
      INVALID_PHONE: 'Numărul de telefon este invalid.',
    },
    // Erori legate de reguli de business (ex: conflicte de date)
    BUSINESS: {
      DUPLICATE_NAME: 'Există deja un stilist cu acest nume.',
      DUPLICATE_EMAIL: 'Există deja un stilist cu această adresă de email.',
      DUPLICATE_PHONE: 'Există deja un stilist cu acest număr de telefon.',
    },
    // Erori specifice procesului de autentificare
    AUTH: {
      UNAUTHORIZED: 'Utilizator neautorizat.',
      PROFILE_NOT_FOUND: 'Profilul stilistului nu a fost găsit.',
      CREATE_USER_FAILED: 'Nu s-a putut crea utilizatorul în sistem.',
      DELETE_USER_FAILED: 'Nu s-a putut șterge utilizatorul din sistem.',
      UPDATE_USER_FAILED: 'Nu s-a putut actualiza utilizatorul în sistem.',
    },
    // Erori neașteptate de la server, per acțiune
    SERVER: {
      DEFAULT: 'A apărut o eroare de server la procesarea cererii.',
      CREATE: 'A apărut o eroare de server la crearea stilistului.',
      UPDATE: 'A apărut o eroare de server la actualizarea stilistului.',
      DELETE: 'A apărut o eroare de server la ștergerea stilistului.',
      RESET_PASSWORD: 'A apărut o eroare de server la resetarea parolei.',
      PASSWORD_RESET_FAILED: 'Nu s-a putut trimite email-ul de resetare a parolei.',
    },
    // Erori generice
    NOT_FOUND: 'Stilistul nu a fost găsit.',
    UNIQUENESS_CHECK_FAILED: 'Verificarea unicității a eșuat.',
  },
} as const

/**
 * Centralizează căile de navigație și revalidare.
 */
const PATHS = {
  revalidate: {
    list: () => '/admin/stylists',
    details: (id: string) => `/admin/stylists/${id}`,
  },
  pages: {
    list: '/admin/stylists',
    details: (id: string) => `/admin/stylists/${id}`,
    services: (id: string) => `/admin/stylists/${id}/services`,
  },
} as const

// Exportăm un singur obiect care conține toate constantele domeniului 'stylists'
export const STYLIST_CONSTANTS = {
  STATUS,
  ROLES,
  MESSAGES,
  PATHS,
} as const
