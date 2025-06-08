// src/app/(dashboard)/dashboard/schedule/page.tsx
import { createClient } from '@/lib/supabase-server'
import { workScheduleRepository } from '@/core/domains/work-schedules/work-schedule.repository'
import { notFound } from 'next/navigation'
import { SchedulePageContent } from './_components/schedule-page-content'

async function getStylistSchedules() {
  const supabase = await createClient()
  // Un singur apel la baza de date!
  const { data: schedules, error } = await supabase.rpc('get_schedules_for_current_stylist')

  if (error) {
    console.error('Error fetching schedules via RPC:', error)
    return []
  }
  return schedules
}

export default async function SchedulePage() {
  const initialSchedules = await getStylistSchedules()

  // Nu mai avem nevoie de `stylistId` aici, deoarece formularul îl poate obține singur la submit
  return <SchedulePageContent initialSchedules={initialSchedules} />
}
