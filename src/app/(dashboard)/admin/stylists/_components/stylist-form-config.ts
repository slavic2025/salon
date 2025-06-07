// src/app/(dashboard)/admin/stylists/_components/stylist-form-config.ts

import { FormFieldConfig } from '@/components/shared/form-fields-types'
import { Stylist } from '@/core/domains/stylists/stylist.types'

/**
 * Generează și returnează configurația de câmpuri pentru formularul de stilist.
 * Folosirea unei funcții permite o mai mare flexibilitate pentru a adăuga
 * logică condițională în viitor, dacă va fi necesar.
 * @returns {FormFieldConfig<Partial<Stylist>>[]} Un array cu obiecte de configurare.
 */
export function getStylistFormConfig(): FormFieldConfig<Partial<Stylist>>[] {
  return [
    {
      id: 'name',
      label: 'Nume',
      type: 'text',
      required: true,
      placeholder: 'Numele complet al stilistului',
    },
    {
      id: 'email',
      label: 'Email',
      type: 'email',
      required: true,
      placeholder: 'adresa.email@exemplu.com',
    },
    {
      id: 'phone',
      label: 'Telefon',
      type: 'tel',
      required: true, // Am actualizat la required, conform schemei Zod
      placeholder: '+373 12 345 678',
    },
    {
      id: 'description',
      label: 'Descriere',
      type: 'textarea',
      required: false,
      placeholder: 'Câteva cuvinte despre stilist, specializări, etc.',
    },
    {
      id: 'is_active',
      label: 'Activ',
      type: 'checkbox',
      required: false,
    },
  ]
}
