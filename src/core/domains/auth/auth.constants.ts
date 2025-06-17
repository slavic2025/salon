// src/core/domains/auth/auth.constants.ts (Varianta finală, refactorizată)

/**
 * Centralizează toate mesajele afișate utilizatorului legate de autentificare.
 */
const MESSAGES = {
  SUCCESS: {
    SIGNED_IN: 'Autentificare reușită. Vei fi redirecționat...',
    SIGNED_UP: 'Cont creat cu succes. Vă rugăm să verificați emailul pentru confirmare.',
    SIGNED_OUT: 'Deconectare reușită.',
    PASSWORD_RESET_SENT: 'Link-ul de resetare a parolei a fost trimis pe email.',
    PASSWORD_UPDATED: 'Parola a fost actualizată cu succes.',
    EMAIL_CONFIRMED: 'Email confirmat cu succes.',
  },
  ERROR: {
    VALIDATION: {
      INVALID_EMAIL: 'Adresa de email este invalidă.',
      INVALID_PASSWORD: 'Parola este invalidă.',
      INVALID_CONFIRM_PASSWORD: 'Parolele nu coincid.',
    },
    TOKEN: {
      EXPIRED: 'Link-ul a expirat. Vă rugăm să generați unul nou.',
      INVALID: 'Link-ul este invalid sau a fost deja folosit.',
    },
    CREDENTIALS: {
      INVALID: 'Email sau parolă incorectă.',
      EMAIL_NOT_CONFIRMED: 'Vă rugăm să confirmați adresa de email înainte de a vă autentifica.',
      DUPLICATE_EMAIL: 'Un cont cu acest email există deja.',
      INVALID_SESSION: 'Sesiunea este invalidă sau a expirat. Vă rugăm să vă autentificați din nou.',
    },
    AUTHORIZATION: {
      UNAUTHORIZED: 'Nu aveți permisiunea de a efectua această acțiune.',
      PROFILE_NOT_FOUND: 'Profilul asociat utilizatorului nu a fost găsit.',
    },
    SERVER: {
      DEFAULT: 'A apărut o eroare la procesarea cererii.',
      SIGN_IN: 'A apărut o eroare la autentificare.',
      SIGN_UP: 'A apărut o eroare la înregistrare.',
      SIGN_OUT: 'A apărut o eroare la deconectare.',
      UPDATE_PASSWORD: 'A apărut o eroare la actualizarea parolei.',
      SEND_RESET_EMAIL: 'A apărut o eroare la trimiterea email-ului de resetare.',
    },
    GENERIC: {
      NOT_FOUND: 'Utilizatorul nu a fost găsit.',
    },
  },
} as const

/**
 * Centralizează căile de navigație și revalidare legate de autentificare.
 */
const PATHS = {
  pages: {
    signIn: '/login',
    accountSetup: '/account-setup',
    updatePassword: '/update-password',
  },
  redirect: {
    afterLogin: '/dashboard/schedule',
    afterLogout: '/',
    adminHome: '/admin', // Calea corectă pentru admin
    stylistHome: '/stylist/schedule',
  },
  revalidate: {
    layout: () => '/', // Pentru a revalida întreaga aplicație (ex. la login/logout)
  },
} as const

/**
 * Centralizează evenimentele de la Supabase Auth pentru a evita "magic strings".
 */
const EVENTS = {
  SIGNED_IN: 'SIGNED_IN',
  SIGNED_OUT: 'SIGNED_OUT',
  TOKEN_REFRESHED: 'TOKEN_REFRESHED',
  USER_UPDATED: 'USER_UPDATED',
  PASSWORD_RECOVERY: 'PASSWORD_RECOVERY',
} as const

// Exportăm un singur obiect care conține toate constantele domeniului 'auth'
export const AUTH_CONSTANTS = {
  MESSAGES,
  PATHS,
  EVENTS,
} as const
