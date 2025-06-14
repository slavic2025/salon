// lib/constants/index.ts (sau currency.ts)

/**
 * Simbolul valutei implicite utilizat în aplicație.
 * Folosim `as const` pentru a asigura că tipul este literal ('RON'), nu doar `string`.
 */
export const DEFAULT_CURRENCY_SYMBOL = 'MDL' as const

/**
 * Numele complet al valutei implicite.
 */
export const DEFAULT_CURRENCY_NAME = 'Lei Moldovenești' as const

export const ROLES = {
  ADMIN: 'admin',
  STYLIST: 'stylist',
} as const

export const PATHS = {
  // Autentificare și setup
  LOGIN: '/login',
  ACCOUNT_SETUP: '/account-setup',

  // Admin paths
  ADMIN_HOME: '/admin',
  ADMIN_STYLISTS: '/admin/stylists',
  ADMIN_SERVICES: '/admin/services',
  ADMIN_APPOINTMENTS: '/admin/appointments',

  // Stylist paths
  STYLIST_HOME: '/stylist/schedule',
  STYLIST_ROOT: '/stylist',
  STYLIST_PROFILE: '/stylist/profile',
  STYLIST_APPOINTMENTS: '/stylist/appointments',

  // Public paths
  PUBLIC_HOME: '/',
  PUBLIC_BOOKING: '/booking',
  PUBLIC_SERVICES: '/services',
  PUBLIC_STYLISTS: '/stylists',

  // Auth redirects
  AUTH_CONFIRM: '/auth/confirm',
  AUTH_RESET_PASSWORD: '/auth/reset-password',

  // Dashboard redirects
  DASHBOARD_SCHEDULE: '/dashboard/schedule',
  DASHBOARD_PROFILE: '/dashboard/profile',
} as const

// Constante pentru rute API
export const API_ROUTES = {
  STYLISTS: '/api/stylists',
  SERVICES: '/api/services',
  APPOINTMENTS: '/api/appointments',
  AUTH: '/api/auth',
} as const

// Constante pentru mesaje de eroare
export const ERROR_MESSAGES = {
  UNAUTHORIZED: 'Nu sunteți autorizat să accesați această resursă.',
  NOT_FOUND: 'Resursa solicitată nu a fost găsită.',
  SERVER_ERROR: 'A apărut o eroare pe server. Vă rugăm să încercați din nou.',
  VALIDATION_ERROR: 'Datele introduse sunt invalide.',
  NETWORK_ERROR: 'Eroare de rețea. Vă rugăm să verificați conexiunea.',
} as const

// Constante pentru mesaje de succes
export const SUCCESS_MESSAGES = {
  CREATED: 'Înregistrarea a fost creată cu succes!',
  UPDATED: 'Înregistrarea a fost actualizată cu succes!',
  DELETED: 'Înregistrarea a fost ștearsă cu succes!',
  SAVED: 'Modificările au fost salvate cu succes!',
} as const

export const STYLIST_MESSAGES = {
  LOADING_ERROR: 'A apărut o eroare la încărcarea stilistilor.',
  UNEXPECTED_ERROR: 'A apărut o eroare neașteptată.',
  NO_STYLISTS: {
    TITLE: 'Niciun stilist disponibil momentan',
    DESCRIPTION: 'Îmi pare rău, dar momentan nu avem stilisti disponibili pentru acest serviciu. Poți:',
    OPTIONS: [
      'Alege un alt serviciu din lista noastră',
      'Contactează-ne telefonic pentru a verifica disponibilitatea',
      'Încearcă mai târziu, când ar putea fi disponibili stilisti',
    ],
  },
} as const
