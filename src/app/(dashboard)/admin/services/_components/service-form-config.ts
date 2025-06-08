// src/app/(dashboard)/admin/services/_components/service-form-config.ts
import { FormFieldConfig } from '@/components/shared/form-fields-types'
import { Service } from '@/core/domains/services/service.types'
import { DEFAULT_CURRENCY_SYMBOL } from '@/lib/constants'

/**
 * Generează configurația de câmpuri pentru formularul de servicii.
 * Folosirea unei funcții permite o mai mare flexibilitate în viitor.
 */
export function getServiceFormConfig(): FormFieldConfig<Partial<Service>>[] {
  return [
    {
      id: 'name',
      label: 'Nume',
      type: 'text',
      required: true,
      placeholder: 'Ex: Tuns, Coafat',
    },
    {
      id: 'description',
      label: 'Descriere',
      type: 'textarea',
      placeholder: 'O scurtă descriere a serviciului.',
    },
    {
      id: 'duration_minutes',
      label: 'Durata (min)',
      type: 'number',
      required: true,
      placeholder: 'Ex: 60',
    },
    {
      id: 'price',
      label: `Preț (${DEFAULT_CURRENCY_SYMBOL})`,
      type: 'number',
      step: '1',
      required: true,
      placeholder: 'Ex: 50.00',
    },
    {
      id: 'category',
      label: 'Categorie',
      type: 'text',
      placeholder: 'Ex: Păr, Unghii, Masaj',
    },
    {
      id: 'is_active',
      label: 'Activ',
      type: 'checkbox',
    },
  ]
}
