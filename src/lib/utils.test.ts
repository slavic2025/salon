// src/lib/utils.test.ts
import { expect, test } from 'vitest'
import { cn } from './utils'

test('cn function should merge classes correctly', () => {
  // Test simplu
  expect(cn('bg-red-500', 'text-white')).toBe('bg-red-500 text-white')

  // Test cu valori condiționale false
  expect(cn('bg-red-500', false && 'text-white')).toBe('bg-red-500')

  // Test de suprascriere (tailwind-merge)
  expect(cn('p-4', 'p-2')).toBe('p-2')
})
