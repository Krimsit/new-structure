import { useEffect, useMemo, useState } from 'react'

import { dateLocale, dateTime, guessUserTimeZone } from './date-utils'

import type { DateTime, DateTimeObject } from './date-utils'
import type { FC } from 'react'

const getDays = (date: DateTime) => {
  const days: DateTime[] = []
  const currentDate = date.startOf('month').startOf('week')

  for (let i = 0; i < 42; i++) {
    days.push(currentDate.add(i, 'day'))
  }

  return days
}

export type CalendarProps = {
  value?: string
  locale?: string
  onSelect?: (iso: string, object: DateTimeObject, utcObject: DateTimeObject) => void
  timeZone?: string
}

const Calendar: FC<CalendarProps> = ({
  value,
  onSelect,
  locale = 'en',
  timeZone = guessUserTimeZone(),
}) => {
  const [currentDate, setCurrentDate] = useState<DateTime>(dateTime(value, { locale, timeZone }))
  const weekdaysShort = useMemo(() => dateLocale.weekdaysShort(locale), [locale])
  const days: DateTime[] = useMemo(() => getDays(currentDate), [currentDate])
  const currentMonth = useMemo(
    () => dateLocale.month(locale, currentDate.month()),
    [currentDate, locale],
  )

  const handleGetPrevYear = () => {
    setCurrentDate(
      currentDate.set({
        year: currentDate.year() - 1,
      }),
    )
  }

  const handleGetNextYear = () => {
    setCurrentDate(
      currentDate.set({
        year: currentDate.year() + 1,
      }),
    )
  }

  const handleGetPrevMonth = () => {
    const isPrevYear = currentDate.month() - 1 < 0

    setCurrentDate(
      currentDate.set({
        year: isPrevYear ? currentDate.year() - 1 : currentDate.year(),
        month: isPrevYear ? 12 : currentDate.month() - 1,
      }),
    )
  }

  const handleGetNextMonth = () => {
    const isNextYear = currentDate.month() + 1 > 12

    setCurrentDate(
      currentDate.set({
        year: isNextYear ? currentDate.year() + 1 : currentDate.year(),
        month: isNextYear ? 1 : currentDate.month() + 1,
      }),
    )
  }

  const handleSetDate = (date: DateTime) => {
    setCurrentDate(date)
    onSelect?.(date.toUTCISO(), date.toObject(), date.toUTCObject())
  }

  useEffect(() => {
    const date = dateTime(value, { locale, timeZone })

    setCurrentDate(date)
  }, [locale, value, timeZone])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div>
        <div>Locale: {locale}</div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'row', gap: '20px' }}>
        <div>Year: {currentDate.year()}</div>
        <button onClick={handleGetPrevYear}>prev year</button>
        <button onClick={handleGetNextYear}>next year</button>
      </div>
      <div style={{ display: 'flex', flexDirection: 'row', gap: '20px' }}>
        <div>Month: {currentMonth}</div>
        <button onClick={handleGetPrevMonth}>prev month</button>
        <button onClick={handleGetNextMonth}>next month</button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 30px)', gap: 20 }}>
        {weekdaysShort.map((item) => (
          <div key={item}>{item}</div>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 30px)', gap: 20 }}>
        {days.map((item) => (
          <button
            onClick={() => handleSetDate(item)}
            type={'button'}
            key={`${item.day()}_${item.month()}_${item.year()}`}
            style={{
              opacity: item.month() !== currentDate.month() ? 0.5 : 1,
              height: '30px',
              padding: 0,
              margin: 0,
              color: item.isWeekend() ? 'red' : 'black',
              fontWeight: item.isToday() ? 'bolder' : 'normal',
              background: value && item.isSame(value) ? 'blue' : 'inherit',
            }}
          >
            {item.day()} {item.isToday() && '*'} ({item.dayOfWeek()})
          </button>
        ))}
      </div>
    </div>
  )
}

export default Calendar
