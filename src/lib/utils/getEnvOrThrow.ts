// utils/getEnvOrThrow.ts
export function getEnvOrThrow(key: string): string {
  const value = process.env[key]
  if (!value) {
    throw new Error(`Missing environment variable: ${key}`)
  }
  return value
}
