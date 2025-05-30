export interface ServiceData {
  id: string
  name: string
  description: string | null
  duration_minutes: number
  price: number
  is_active: boolean
  category: string | null
  created_at?: Date
  updated_at?: Date
}

export interface ActionResponse {
  success: boolean
  message?: string
  errors?: Partial<Record<keyof ServiceData, string[]>> & {
    _form?: string[]
  }
}
