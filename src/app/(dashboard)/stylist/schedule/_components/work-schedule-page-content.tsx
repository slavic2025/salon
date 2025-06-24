'use client'

import type { WorkSchedule } from '@/core/domains/work-schedules/work-schedule.types'
import { WORK_SCHEDULE_CONSTANTS } from '@/core/domains/work-schedules/work-schedule.constants'

import { AddWorkScheduleDialog } from './add-work-schedule-dialog'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/atoms/card'
import { Button } from '@/components/atoms/button'
import { DeleteConfirmationDialog } from '@/components/molecules/delete-confirmation-dialog'
import { EmptyState } from '@/components/molecules/empty-state'
import { Trash2 } from 'lucide-react'
import { deleteWorkScheduleAction } from '@/features/work-schedules/actions'

// Un mic helper local pentru a formata ora. Poate fi mutat în `lib/formatters.ts`.
const formatTime = (time: string) => time.slice(0, 5)

interface SchedulePageContentProps {
  initialSchedules: WorkSchedule[]
  stylistId: string
}

export function SchedulePageContent({ initialSchedules, stylistId }: SchedulePageContentProps) {
  // Grupăm programele pe zile folosind array-ul din constante
  const schedulesByDay = WORK_SCHEDULE_CONSTANTS.WEEKDAYS.map((day, index) => ({
    day,
    schedules: initialSchedules
      .filter((s) => s.weekday === index)
      .sort((a, b) => a.start_time.localeCompare(b.start_time)),
  }))

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl md:text-3xl font-bold">Programul Meu de Lucru</h1>
        <AddWorkScheduleDialog stylistId={stylistId} />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {schedulesByDay.map(({ day, schedules }) => (
          <Card key={day}>
            <CardHeader>
              ``
              <CardTitle>{day}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {schedules.length > 0 ? (
                schedules.map((schedule) => (
                  <div key={schedule.id} className="flex items-center justify-between rounded-md bg-muted p-2 text-sm">
                    <span className="font-mono">
                      {formatTime(schedule.start_time)} - {formatTime(schedule.end_time)}
                    </span>

                    {/* Folosim noua componentă de ștergere, mult mai declarativă */}
                    <DeleteConfirmationDialog action={deleteWorkScheduleAction} itemId={schedule.id}>
                      <DeleteConfirmationDialog.Trigger asChild>
                        <Button variant="ghost" size="icon" className="h-7 w-7">
                          <Trash2 className="h-4 w-4 text-destructive" />
                          <span className="sr-only">Șterge interval</span>
                        </Button>
                      </DeleteConfirmationDialog.Trigger>
                      <DeleteConfirmationDialog.Content>
                        <DeleteConfirmationDialog.Header>
                          <DeleteConfirmationDialog.Title>Confirmă Ștergerea</DeleteConfirmationDialog.Title>
                          <DeleteConfirmationDialog.Description>
                            Ești sigur că vrei să ștergi intervalul {formatTime(schedule.start_time)} -{' '}
                            {formatTime(schedule.end_time)}?
                          </DeleteConfirmationDialog.Description>
                        </DeleteConfirmationDialog.Header>
                      </DeleteConfirmationDialog.Content>
                    </DeleteConfirmationDialog>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">Liber</p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
