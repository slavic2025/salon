export const AUTH_MESSAGES = {
  /**
   * Mesaje pentru acțiuni finalizate cu succes.
   */
  SUCCESS: {
    SIGNED_IN: 'Autentificare reușită.',
    SIGNED_UP: 'Cont creat cu succes. Vă rugăm să verificați emailul pentru confirmare.',
    SIGNED_OUT: 'Deconectare reușită.',
    PASSWORD_RESET_SENT: 'Link-ul de resetare a parolei a fost trimis pe email.',
    PASSWORD_UPDATED: 'Parola a fost actualizată cu succes.',
    EMAIL_CONFIRMED: 'Email confirmat cu succes.',
  },

  /**
   * Mesaje pentru diverse tipuri de erori.
   */
  ERROR: {
    // Grupul pentru erori de validare a câmpurilor din formulare. Structura este bună.
    VALIDATION: {
      INVALID_EMAIL: 'Adresa de email este invalidă.',
      INVALID_PASSWORD: 'Parola este invalidă.',
      INVALID_CONFIRM_PASSWORD: 'Parolele nu coincid.',
      INVALID_NAME: 'Numele este invalid.',
      INVALID_PHONE: 'Numărul de telefon este invalid.',
      INVALID_ROLE: 'Rolul este invalid.',
    },

    // Grup nou pentru erori legate de procesarea token-urilor (ex: din email).
    TOKEN: {
      EXPIRED: 'Link-ul a expirat. Vă rugăm să generați unul nou.',
      INVALID: 'Link-ul este invalid sau a fost deja folosit.',
    },

    // Grup pentru erori specifice procesului de autentificare.
    CREDENTIALS: {
      INVALID: 'Email sau parolă incorectă.',
      EMAIL_NOT_CONFIRMED: 'Vă rugăm să confirmați adresa de email înainte de a vă autentifica.',
      DUPLICATE_EMAIL: 'Un cont cu acest email există deja.',
      INVALID_SESSION: 'Sesiunea este invalidă sau a expirat. Vă rugăm să vă autentificați din nou.',
    },

    // Grup pentru erori de permisiuni.
    AUTHORIZATION: {
      UNAUTHORIZED: 'Nu aveți permisiunea de a efectua această acțiune.',
    },

    // Erori generice.
    NOT_FOUND: 'Utilizatorul nu a fost găsit.',

    // Grup pentru erori neașteptate de la server. Structura este bună.
    SERVER: {
      DEFAULT: 'A apărut o eroare la procesarea cererii.',
      SIGN_IN: 'A apărut o eroare la autentificare.',
      SIGN_UP: 'A apărut o eroare la înregistrare.',
      SIGN_OUT: 'A apărut o eroare la deconectare.',
      RESET_PASSWORD: 'A apărut o eroare la resetarea parolei.',
      UPDATE_PASSWORD: 'A apărut o eroare la actualizarea parolei.',
      CONFIRM_EMAIL: 'A apărut o eroare la confirmarea emailului.',
      SET_PASSWORD: 'A apărut o eroare la setarea parolei.',
      SEND_RESET_EMAIL: 'A apărut o eroare la trimiterea email-ului de resetare.',
    },
  },
} as const

export const AUTH_PATHS = {
  /**
   * Căi către paginile de UI.
   */
  pages: {
    signIn: '/login',
    accountSetup: '/account-setup',
    updatePassword: '/update-password',
    confirm: '/auth/confirm',
  },

  /**
   * Căi folosite pentru redirectare după acțiuni.
   */
  redirect: {
    default: '/dashboard/schedule', // O cale generală după autentificare
    stylist: {
      schedule: '/stylist/schedule',
    },
    admin: {
      dashboard: '/admin',
    },
  },

  /**
   * Căi folosite pentru revalidatePath().
   */
  revalidate: {
    auth: () => '/auth',
    layout: () => '/', // Pentru a revalida întreaga aplicație (ex. la logout)
  },
} as const

// Obiect nou pentru evenimentele de autentificare
export const AUTH_EVENTS = {
  SIGNED_IN: 'SIGNED_IN',
  SIGNED_OUT: 'SIGNED_OUT',
  TOKEN_REFRESHED: 'TOKEN_REFRESHED',
  USER_UPDATED: 'USER_UPDATED',
  PASSWORD_RECOVERY: 'PASSWORD_RECOVERY',
} as const
