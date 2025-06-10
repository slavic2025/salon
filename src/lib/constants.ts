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
  LOGIN: '/login',
  ACCOUNT_SETUP: '/account-setup',
  ADMIN_HOME: '/admin',
  STYLIST_HOME: '/stylist/schedule',
  STYLIST_ROOT: '/stylist',
} as const
