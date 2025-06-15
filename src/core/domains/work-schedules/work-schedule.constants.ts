export const WORK_SCHEDULE_ERRORS = {
  NOT_FOUND: 'Programul de lucru nu a fost găsit',
  INVALID_TIME: 'Ora de început trebuie să fie înaintea orei de sfârșit',
  INVALID_WEEKDAY: 'Ziua săptămânii trebuie să fie între 0 și 6',
  DUPLICATE_SCHEDULE: 'Există deja un program de lucru pentru această zi și oră',
} as const

export const WEEKDAYS = {
  SUNDAY: 0,
  MONDAY: 1,
  TUESDAY: 2,
  WEDNESDAY: 3,
  THURSDAY: 4,
  FRIDAY: 5,
  SATURDAY: 6,
} as const

export const WEEKDAY_NAMES = {
  [WEEKDAYS.SUNDAY]: 'Duminică',
  [WEEKDAYS.MONDAY]: 'Luni',
  [WEEKDAYS.TUESDAY]: 'Marți',
  [WEEKDAYS.WEDNESDAY]: 'Miercuri',
  [WEEKDAYS.THURSDAY]: 'Joi',
  [WEEKDAYS.FRIDAY]: 'Vineri',
  [WEEKDAYS.SATURDAY]: 'Sâmbătă',
} as const
