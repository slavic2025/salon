// src/lib/errors.ts (Varianta refactorizată)

/**
 * O clasă de bază pentru erorile customizate din aplicație.
 * Permite împachetarea erorii originale pentru un context de debugging mai bun.
 */
export class AppError extends Error {
  public readonly originalError?: unknown

  constructor(message: string, originalError?: unknown) {
    super(message)
    this.name = this.constructor.name
    this.originalError = originalError
  }
}

/**
 * O eroare specifică pentru problemele cu baza de date. Extinde AppError.
 */
export class DatabaseError extends AppError {
  constructor(message: string, originalError: unknown) {
    super(message, originalError)
    this.name = 'DatabaseError' // Specificăm numele pentru claritate
  }
}

export class UniquenessError extends AppError {
  public readonly fields: { field: string; message: string }[]

  constructor(message: string, fields: { field: string; message: string }[]) {
    super(message)
    this.name = 'UniquenessError'
    this.fields = fields
  }
}
