import { dateLocale } from './dateLocale'
import {
  addDay,
  getCorrectYear,
  getDayOfWeek,
  getLocalTimeZoneOffset,
  getTimeZoneInfo,
  guessUserTimeZone,
  parseDateTimeObjectToISO,
  parseDateToTimezone,
  parseIntlDateTimeToObj,
  startOfMonth,
  startOfWeek,
} from './utils'

import type {
  AddUnits,
  DateTime,
  DateTimeObject,
  DateTimeParams,
  DateTimeUnits,
  DateTimeValue,
  SetObject,
  StartOfUnits,
} from './types'

export class DateTimeImpl implements DateTime {
  private readonly locale: string
  private readonly timeZone: string
  private readonly dateTimeObj: DateTimeObject
  private readonly dateTimeUTCObj: DateTimeObject
  private readonly dateISO: string
  private readonly dateUTCISO: string

  constructor(date?: DateTimeValue, props?: DateTimeParams) {
    const locale = props?.locale ?? 'en'
    const timeZone = props?.timeZone ?? guessUserTimeZone()
    const isDateTimeObj = typeof date === 'object' && !(date instanceof Date)
    const dateForParse = isDateTimeObj ? date : parseDateToTimezone(date, locale, timeZone)
    const { dateTimeObj, dateTimeUTCObj, dateUTCISO, dateISO } = this.getDateTime(
      dateForParse,
      locale,
      timeZone,
    )

    this.locale = locale
    this.timeZone = timeZone
    this.dateTimeObj = dateTimeObj
    this.dateTimeUTCObj = dateTimeUTCObj
    this.dateUTCISO = dateUTCISO
    this.dateISO = dateISO
  }

  getDateTime(date: DateTimeObject, locale: string, timeZone: string) {
    const copyDateTimeObj = date as DateTimeObject
    const hour = copyDateTimeObj.hour === 24 ? 0 : copyDateTimeObj.hour
    const parsedDate = new Date(
      copyDateTimeObj.year,
      copyDateTimeObj.month - 1,
      copyDateTimeObj.day,
      hour,
      copyDateTimeObj.minute,
      copyDateTimeObj.second,
    )
    const parsedYear = getCorrectYear(parsedDate, locale, timeZone)
    const dayOfWeek = getDayOfWeek(parsedDate, locale, timeZone)
    const { timeZoneLong, timeZoneOffset } = getTimeZoneInfo(parsedDate, locale, timeZone)
    const dateTimeObj: DateTimeObject = {
      ...copyDateTimeObj,
      year: parsedYear,
      dayOfWeek,
    }
    const utcDate = new Date(dateTimeObj.year, dateTimeObj.month - 1, dateTimeObj.day).setHours(
      hour - timeZoneOffset + getLocalTimeZoneOffset(),
      dateTimeObj.minute,
      dateTimeObj.second,
    )
    const parsedUTCDateParts = new Intl.DateTimeFormat(locale, {
      timeZone: 'UTC',
      dateStyle: 'short',
      timeStyle: 'long',
      hourCycle: 'h24',
    }).formatToParts(utcDate)
    const parsedUTCYear = getCorrectYear(utcDate, locale, timeZone)
    const utcDayOfWeek = getDayOfWeek(utcDate, locale, timeZone)
    const dateTimeUTCObj = parseIntlDateTimeToObj(parsedUTCDateParts, utcDayOfWeek, parsedUTCYear)
    const dateISO = parseDateTimeObjectToISO(dateTimeObj, timeZoneLong)
    const dateUTCISO = parseDateTimeObjectToISO(dateTimeUTCObj, 'Z')

    return {
      dateTimeObj,
      dateTimeUTCObj,
      dateUTCISO,
      dateISO,
      timeZoneOffset,
      timeZoneLong,
    }
  }

  day() {
    return this.dateTimeObj.day
  }

  month() {
    return this.dateTimeObj.month
  }

  year() {
    return this.dateTimeObj.year
  }

  dayOfWeek() {
    return this.dateTimeObj.dayOfWeek
  }

  hour() {
    return this.dateTimeObj.hour
  }

  minute() {
    return this.dateTimeObj.minute
  }

  second() {
    return this.dateTimeObj.second
  }

  toISO() {
    return this.dateISO
  }

  toUTCISO() {
    return this.dateUTCISO
  }

  toObject() {
    return this.dateTimeObj
  }

  toUTCObject() {
    return this.dateTimeUTCObj
  }

  isToday() {
    const { dateTimeObj } = this.getDateTime(
      parseDateToTimezone(new Date(), this.locale, this.timeZone),
      this.locale,
      this.timeZone,
    )

    return (
      dateTimeObj.year === this.year() &&
      dateTimeObj.month === this.month() &&
      dateTimeObj.day === this.day()
    )
  }

  isSame(date: DateTimeValue) {
    const isDateTimeObj = typeof date === 'object' && !(date instanceof Date)
    const dateTimeObj = isDateTimeObj ? date : parseDateToTimezone(date, this.locale, this.timeZone)

    return (
      dateTimeObj.year === this.year() &&
      dateTimeObj.month === this.month() &&
      dateTimeObj.day === this.day()
    )
  }

  isSameByUnit(date: DateTimeValue, unit: DateTimeUnits) {
    const isDateTimeObj = typeof date === 'object' && !(date instanceof Date)
    const dateTimeObj = isDateTimeObj ? date : parseDateToTimezone(date, this.locale, this.timeZone)

    return dateTimeObj[unit] === this.dateTimeObj[unit]
  }

  isWeekend() {
    return dateLocale.weekInfo(this.locale).weekend.includes(this.dayOfWeek())
  }

  startOf(unit: StartOfUnits) {
    switch (unit) {
      case 'month': {
        return dateTime(startOfMonth(this.dateTimeObj), {
          locale: this.locale,
          timeZone: this.timeZone,
        })
      }
      case 'week': {
        return dateTime(startOfWeek(this.dateTimeObj, this.locale), {
          locale: this.locale,
          timeZone: this.timeZone,
        })
      }
      default:
        return dateTime(this.dateTimeObj, {
          locale: this.locale,
          timeZone: this.timeZone,
        })
    }
  }

  add(value: number, unit: AddUnits) {
    switch (unit) {
      case 'day': {
        return dateTime(
          {
            ...this.dateTimeObj,
            ...addDay(this.dateTimeObj, value, this.month(), this.year()),
          },
          {
            locale: this.locale,
            timeZone: this.timeZone,
          },
        )
      }
      default:
        return dateTime(this.dateTimeObj, {
          locale: this.locale,
          timeZone: this.timeZone,
        })
    }
  }

  set(value: SetObject) {
    return dateTime(
      {
        ...this.dateTimeObj,
        ...value,
      },
      {
        locale: this.locale,
        timeZone: this.timeZone,
      },
    )
  }
}

export function dateTime(value?: DateTimeValue, props?: DateTimeParams): DateTime {
  return new DateTimeImpl(value, props)
}
