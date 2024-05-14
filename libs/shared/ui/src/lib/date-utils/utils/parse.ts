import { dateLocale } from '../dateLocale'

import type { DateTimeObject } from '../types'

export const parseIntlDateTimeToObj = (
  parts: Intl.DateTimeFormatPart[],
  dayOfWeek: number,
  year: number,
) =>
  parts.reduce<DateTimeObject>(
    (acc, curr) => {
      if (curr.type === 'literal' || curr.type === 'timeZoneName' || curr.type === 'year')
        return acc

      return {
        ...acc,
        [curr.type]: Number(curr.value),
      }
    },
    { dayOfWeek, year } as DateTimeObject,
  )

export const getLocalDate = (date: string | undefined | Date) => {
  if (date instanceof Date) return date

  if (typeof date === 'undefined') return new Date()

  return date ? new Date(date) : new Date()
}

export const getDayOfWeek = (date: Date | number, locale: string, timeZone: string) => {
  const parsedWeekday = new Intl.DateTimeFormat(locale, {
    timeZone: timeZone,
    weekday: 'short',
  }).format(date)

  return dateLocale.weekdaysShort(locale).findIndex((item) => item === parsedWeekday)
}

export const getCorrectYear = (date: Date | number, locale: string, timeZone: string) =>
  Number(
    new Intl.DateTimeFormat(locale, {
      timeZone: timeZone,
      year: 'numeric',
    }).format(date),
  )

export const getTimeZoneInfo = (date: Date | number, locale: string, timeZone: string) => {
  const timeShortZoneParts = new Intl.DateTimeFormat(locale, {
    timeZone: timeZone,
    timeZoneName: 'shortOffset',
  }).formatToParts(date)
  const timeZoneLongParts = new Intl.DateTimeFormat(locale, {
    timeZone: timeZone,
    timeZoneName: 'longOffset',
  }).formatToParts(date)
  const timeZoneShortValue = String(
    timeShortZoneParts.find((item) => item.type === 'timeZoneName')?.value,
  )
  const timeZoneLongValue = String(
    timeZoneLongParts.find((item) => item.type === 'timeZoneName')?.value,
  )
  const timeZoneOffset = Number(timeZoneShortValue.slice(3, timeZoneShortValue.length))
  const timeZoneLong = timeZoneLongValue.slice(3, timeZoneLongValue.length)

  return { timeZoneOffset, timeZoneLong }
}

export const parseDateToTimezone = (
  date: string | undefined | Date,
  locale: string,
  timeZone: string,
) => {
  const localDate = getLocalDate(date)
  const nowUTC = Date.UTC(
    localDate.getUTCFullYear(),
    localDate.getUTCMonth(),
    localDate.getUTCDate(),
    localDate.getUTCHours(),
    localDate.getUTCMinutes(),
    localDate.getUTCSeconds(),
  )
  const parsedDateParts = new Intl.DateTimeFormat(locale, {
    timeZone: timeZone,
    dateStyle: 'short',
    timeStyle: 'long',
    hourCycle: 'h24',
  }).formatToParts(nowUTC)
  const parsedYear = getCorrectYear(nowUTC, locale, timeZone)
  const dayOfWeek = getDayOfWeek(nowUTC, locale, timeZone)

  return parseIntlDateTimeToObj(parsedDateParts, dayOfWeek, parsedYear)
}

export const parseDateTimeObjectToISO = (dateTimeObj: DateTimeObject, timeZone: string) => {
  const year = String(dateTimeObj.year)
  const month =
    String(dateTimeObj.month).length === 1
      ? `0${String(dateTimeObj.month)}`
      : String(dateTimeObj.month)
  const day =
    String(dateTimeObj.day).length === 1 ? `0${String(dateTimeObj.day)}` : String(dateTimeObj.day)
  const hour =
    String(dateTimeObj.hour).length === 1
      ? `0${String(dateTimeObj.hour)}`
      : String(dateTimeObj.hour)
  const minute =
    String(dateTimeObj.minute).length === 1
      ? `0${String(dateTimeObj.minute)}`
      : String(dateTimeObj.minute)
  const second =
    String(dateTimeObj.second).length === 1
      ? `0${String(dateTimeObj.second)}`
      : String(dateTimeObj.second)

  return `${year}-${month}-${day}T${hour}:${minute}:${second}.000${timeZone}`
}
