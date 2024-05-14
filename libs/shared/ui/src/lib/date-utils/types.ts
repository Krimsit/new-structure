export type DateTimeValue = string | Date | DateTimeObject

export type DateTimeParams = {
  locale?: string
  timeZone?: string
}

export type DateTimeObject = {
  year: number
  month: number
  day: number
  hour: number
  minute: number
  second: number
  dayOfWeek: number
}

export type SetObject = Partial<Omit<DateTimeObject, 'dayOfWeek'>>

export type DateTimeUnits = 'year' | 'month' | 'day' | 'hour' | 'minute' | 'second'

export type StartOfUnits = 'month' | 'week'

export type AddUnits = 'day'

export type DateTime = {
  toObject(): DateTimeObject
  toUTCObject(): DateTimeObject
  toISO(): string
  toUTCISO(): string
  isSame(date: DateTimeValue): boolean
  isSameByUnit(date: DateTimeValue, unit: DateTimeUnits): boolean
  isToday(): boolean
  isWeekend(): boolean
  day(): number
  month(): number
  year(): number
  dayOfWeek(): number
  hour(): number
  minute(): number
  second(): number
  startOf(unit: StartOfUnits): DateTime
  add(value: number, unit: AddUnits): DateTime
  set(value: SetObject): DateTime
}

export type WeekInfo = {
  firstDay: number
  weekend: number[]
}

export type DateLocale = {
  weekInfo(locale: string): WeekInfo
  weekdaysShort(locale: string): string[]
  months(locale: string): string[]
  monthsShort(locale: string): string[]
  month(locale: string, month: number): string
  monthShort(locale: string, month: number): string
  daysInMonth(year: number, month: number): number
}
