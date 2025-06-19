// src/app/(dashboard)/dashboard/schedule/_components/schedule-page-content.tsx
'use client'
import { WorkSchedule } from '@/core/domains/work-schedules/work-schedule.types'
import { AddWorkScheduleDialog } from './add-work-schedule-dialog'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/atoms/card'
import { GenericDeleteDialog } from '@/components/shared/generic-delete-dialog'
import { Trash2 } from 'lucide-react'
import { Button } from '@/components/atoms/button'
import { deleteWorkScheduleAction } from '@/features/schedule/actions'

const weekdays = ['Duminică', 'Luni', 'Marți', 'Miercuri', 'Joi', 'Vineri', 'Sâmbătă']

export function SchedulePageContent({ initialSchedules }: { initialSchedules: WorkSchedule[] }) {
  const schedulesByDay = weekdays.map((day, index) => ({
    day,
    schedules: initialSchedules
      .filter((s) => s.weekday === index)
      .sort((a, b) => a.start_time.localeCompare(b.start_time)),
  }))

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl md:text-3xl font-bold">Programul Meu de Lucru</h1>
        <AddWorkScheduleDialog />
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {schedulesByDay.map(({ day, schedules }) => (
          <Card key={day}>
            <CardHeader>
              <CardTitle>{day}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {schedules.length > 0 ? (
                schedules.map((schedule) => (
                  <div key={schedule.id} className="flex items-center justify-between rounded-md bg-muted p-2">
                    <span className="font-mono text-sm">
                      {schedule.start_time.slice(0, 5)} - {schedule.end_time.slice(0, 5)}
                    </span>
                    <GenericDeleteDialog
                      deleteAction={deleteWorkScheduleAction}
                      entityId={schedule.id}
                      // AICI ESTE CORECȚIA: Construim un string simplu, fără tag-uri HTML.
                      entityName={`intervalul ${schedule.start_time.slice(0, 5)} - ${schedule.end_time.slice(0, 5)}`}
                      trigger={
                        <Button variant="ghost" size="icon">
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      }
                    />
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">Niciun interval setat.</p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
