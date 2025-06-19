// src/components/shared/generic-form-fields.tsx
'use client'

import { Input } from '@/components/atoms/input'
import { Label } from '@/components/atoms/label'
import { Checkbox } from '@/components/atoms/checkbox'
import { Textarea } from '@/components/atoms/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/atoms/select'
import { FormFieldConfig } from './form-fields-types'
import { ActionResponse } from '@/types/actions.types'
import React, { useState, useEffect } from 'react'

function SelectField({
  field,
  defaultValue,
  isInvalid,
}: {
  field: FormFieldConfig<any>
  defaultValue: any
  isInvalid: boolean
}) {
  const [value, setValue] = useState(defaultValue || '')

  return (
    <>
      <input type="hidden" name={String(field.id)} value={value} />
      <Select required={field.required} value={value} onValueChange={setValue}>
        <SelectTrigger id={String(field.id)} aria-invalid={isInvalid}>
          <SelectValue placeholder={field.placeholder || 'Selectează...'} />
        </SelectTrigger>
        <SelectContent
          // AICI ESTE MODIFICAREA CHEIE:
          // Prevenim dialogul să intercepteze click-ul și să reseteze focusul incorect.
          onPointerDownOutside={(e) => e.preventDefault()}
        >
          {field.options?.map((option) => (
            <SelectItem key={String(option.value)} value={String(option.value)} disabled={option.disabled}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </>
  )
}

interface GenericFormFieldsProps<T extends Record<string, unknown>> {
  fieldsConfig: FormFieldConfig<T>[]
  initialData?: Partial<T> | null
  errors?: ActionResponse['errors']
  isEditMode?: boolean
}

export function GenericFormFields<T extends Record<string, unknown>>({
  fieldsConfig,
  initialData,
  errors,
}: GenericFormFieldsProps<T>) {
  return (
    // Am eliminat grid-ul și folosim un layout vertical cu spațiere
    <div className="space-y-4">
      {fieldsConfig.map((field) => {
        const defaultValue = initialData ? initialData[field.id] : undefined
        const fieldErrorMessages = errors && errors[String(field.id)] ? errors[String(field.id)] : undefined
        const inputId = String(field.id)
        const isInvalid = !!fieldErrorMessages && fieldErrorMessages.length > 0

        // Tratament special pentru checkbox-uri pentru a alinia eticheta lângă căsuță
        if (field.type === 'checkbox') {
          return (
            <div key={inputId} className="flex items-center space-x-2 pt-2">
              <Checkbox
                id={inputId}
                name={inputId}
                defaultChecked={defaultValue === undefined ? true : (defaultValue as boolean)}
                aria-invalid={isInvalid}
              />
              <Label htmlFor={inputId} className="font-normal">
                {field.label}
                {field.required && <span className="text-destructive ml-1">*</span>}
              </Label>
            </div>
          )
        }

        // Layout standard pentru toate celelalte câmpuri
        return (
          <div key={inputId} className={`grid w-full items-center gap-1.5 ${field.className || ''}`}>
            <Label htmlFor={inputId}>
              {field.label}
              {field.required && <span className="text-destructive ml-1">*</span>}
            </Label>

            {/* Aici folosim un switch pentru a randa input-ul corect */}
            {(() => {
              switch (field.type) {
                case 'textarea':
                  return (
                    <Textarea
                      id={inputId}
                      name={inputId}
                      defaultValue={defaultValue !== undefined && defaultValue !== null ? String(defaultValue) : ''}
                      placeholder={field.placeholder}
                      required={field.required}
                      aria-invalid={isInvalid}
                    />
                  )
                case 'select':
                  return (
                    <SelectField
                      field={field}
                      defaultValue={
                        defaultValue !== undefined && defaultValue !== null ? String(defaultValue) : undefined
                      }
                      isInvalid={isInvalid}
                    />
                  )
                default:
                  return (
                    <Input
                      id={inputId}
                      name={inputId}
                      type={field.type}
                      step={field.step}
                      defaultValue={defaultValue !== undefined && defaultValue !== null ? String(defaultValue) : ''}
                      placeholder={field.placeholder}
                      required={field.required}
                      aria-invalid={isInvalid}
                    />
                  )
              }
            })()}

            {isInvalid && <p className="text-sm text-destructive">{fieldErrorMessages.join(', ')}</p>}
          </div>
        )
      })}
      {errors?._form && <p className="text-sm text-destructive text-center">{errors._form.join(', ')}</p>}
    </div>
  )
}
