import type { DateLocale, WeekInfo } from './types'

export class DateLocaleImpl implements DateLocale {
  weekInfo(locale: string) {
    const localeData = new Intl.Locale(locale) as Intl.Locale & {
      weekInfo: WeekInfo
    }

    return {
      ...localeData.weekInfo,
      firstDay: localeData.weekInfo.firstDay === 7 ? 0 : localeData.weekInfo.firstDay,
      weekend: localeData.weekInfo.weekend.map((item) => (item === 7 ? 0 : item)),
    }
  }

  weekdaysShort(locale: string) {
    const now = new Date()
    const format = new Intl.DateTimeFormat(locale, { weekday: 'short' }).format
    const weekInfo = this.weekInfo(locale)
    const localizedWeekdaysShort = [...Array(7).keys()].map((day) =>
      format(new Date().getTime() - (now.getDay() - day) * 86400000),
    )
    const firstDayOfWeek = weekInfo.firstDay

    return [
      ...localizedWeekdaysShort.slice(firstDayOfWeek, localizedWeekdaysShort.length),
      ...localizedWeekdaysShort.slice(0, firstDayOfWeek),
    ]
  }

  months(locale: string) {
    const now = new Date()
    const format = new Intl.DateTimeFormat(locale, { month: 'long' }).format
    const localizedWeekdaysShort = [...Array(12).keys()].map((month) =>
      format(new Date(now.getUTCFullYear(), month, 1)),
    )

    return localizedWeekdaysShort
  }

  monthsShort(locale: string) {
    const now = new Date()
    const format = new Intl.DateTimeFormat(locale, { month: 'short' }).format
    const localizedWeekdaysShort = [...Array(12).keys()].map((month) =>
      format(new Date(now.getUTCFullYear(), month, 1)),
    )

    return localizedWeekdaysShort
  }

  month(locale: string, month: number) {
    return this.months(locale)[month - 1]
  }

  monthShort(locale: string, month: number) {
    return this.monthsShort(locale)[month - 1]
  }

  daysInMonth(year: number, month: number) {
    return new Date(year, month, 0).getDate()
  }
}

export const dateLocale = new DateLocaleImpl()
