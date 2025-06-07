// components/shared/generic-table-item-row.tsx
'use client' // Aceasta componentă este client-side din cauza useFormState și useEffect

import { TableCell, TableRow } from '@/components/ui/table'
import { SubmitButton } from '@/components/ui/submit-button'
import React, { useEffect } from 'react'
import { useFormState } from 'react-dom'
import { toast } from 'sonner' // Importăm direct toast din sonner
import { ActionResponse, INITIAL_FORM_STATE } from '@/lib/types' // Asumăm că aceste tipuri sunt definite aici

// Interfață generică pentru un element din tabel, asigurând că are 'id' și, opțional, 'name'
interface TableItem extends Record<string, unknown> {
  id: string
  name?: string // Util pentru aria-label și mesaje de confirmare
}

// Configurația pentru fiecare coloană de date
interface ColumnConfig<T extends TableItem> {
  key: keyof T // Cheia proprietății din item (e.g., 'name', 'email')
  cellClassName?: string // Clase CSS pentru celula de date
  // Funcție de randare personalizată pentru valoarea celulei
  render?: (value: T[keyof T], item: T) => React.ReactNode
}

interface GenericTableItemRowProps<T extends TableItem> {
  item: T // Elementul de date (Stylist, ServiceData etc.)
  columns: ColumnConfig<T>[] // Definiția coloanelor de date
  EditDialog: React.ComponentType<{ entity: T }> // Componenta de dialog pentru editare
  // Acțiunea de ștergere, compatibilă cu useFormState
  deleteAction: (prevState: ActionResponse, formData: FormData) => Promise<ActionResponse>
  deleteLabel?: string // Textul pentru butonul de ștergere (ex: "Șterge")
  deleteConfirmationMessage?: string // Mesaj personalizat de succes după ștergere
}

export function GenericTableItemRow<T extends TableItem>({
  item,
  columns,
  EditDialog,
  deleteAction,
  deleteLabel = 'Șterge',
  deleteConfirmationMessage,
}: GenericTableItemRowProps<T>) {
  const [state, formDispatch] = useFormState(deleteAction, INITIAL_FORM_STATE)

  useEffect(() => {
    if (state.success && state.message) {
      toast.success('Succes!', {
        description: deleteConfirmationMessage || state.message, // Folosim mesajul personalizat sau cel din state
      })
    } else if (state.message && !state.success) {
      toast.error('Eroare!', {
        description: state.message,
      })
    }
  }, [state, deleteConfirmationMessage]) // Dependențe pentru useEffect

  return (
    <TableRow>
      {/* Randarea celulelor de date configurabile */}
      {columns.map((colConfig) => (
        <TableCell key={String(colConfig.key)} className={colConfig.cellClassName}>
          {/* Folosim funcția render personalizată dacă există, altfel afișăm valoarea direct */}
          {colConfig.render ? colConfig.render(item[colConfig.key], item) : (item[colConfig.key] as React.ReactNode)}
        </TableCell>
      ))}

      {/* Celula pentru acțiuni (editare și ștergere) - este comună și fixă */}
      <TableCell className="flex items-center gap-2">
        <EditDialog entity={item} /> {/* Pasăm elementul către dialogul de editare */}
        <form action={formDispatch} className="inline-block">
          <input type="hidden" name="id" value={item.id} /> {/* ID-ul elementului pentru ștergere */}
          <SubmitButton
            variant="destructive"
            size="sm"
            aria-label={`${deleteLabel} ${item.name || item.id}`} // Folosim numele sau ID-ul pentru accesibilitate
          >
            {deleteLabel}
          </SubmitButton>
        </form>
      </TableCell>
    </TableRow>
  )
}
