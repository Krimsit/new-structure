import { dateLocale } from '../dateLocale'

import type { DateTimeObject } from '../types'

export const startOfMonth = (dateTimeObj: DateTimeObject): DateTimeObject => ({
  ...dateTimeObj,
  day: 1,
})

export const startOfWeek = (dateTimeObj: DateTimeObject, locale: string): DateTimeObject => {
  const firstDayOfWeek = dateLocale.weekInfo(locale).firstDay
  let month = dateTimeObj.month
  const diff = dateTimeObj.dayOfWeek + (dateTimeObj.dayOfWeek === 0 ? -6 : 1) + firstDayOfWeek - 1
  let newDay = dateTimeObj.day - diff

  if (newDay < 1) {
    month = dateTimeObj.month - 1
    newDay =
      dateLocale.daysInMonth(dateTimeObj.year, dateTimeObj.month - 1) - diff + firstDayOfWeek + 1
  }

  return {
    ...dateTimeObj,
    month: month,
    day: dateTimeObj.dayOfWeek === firstDayOfWeek ? 1 : newDay,
  }
}

export const addDay = (
  dateTimeObj: DateTimeObject,
  value: number,
  month: number,
  year: number,
  paramDay?: number,
): { day: number; month: number; year: number } => {
  const day = paramDay ?? dateTimeObj.day + value
  const daysInMonth = dateLocale.daysInMonth(2024, month)

  if (day > daysInMonth) {
    if (month + 1 > 12) {
      return addDay(dateTimeObj, value, 1, year + 1, day - daysInMonth)
    }

    return addDay(dateTimeObj, value, month + 1, year, day - daysInMonth)
  }

  return {
    day,
    month,
    year,
  }
}
