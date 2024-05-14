import { useEffect, useMemo, useState } from 'react'

import { dateLocale, dateTime, guessUserTimeZone } from './date-utils'

import type { DateTime, DateTimeObject } from './date-utils'
import type { FC } from 'react'

const getDays = (date: DateTime) => {
  const days: DateTime[] = []
  const firstCurrentDate = date.startOf('month').startOf('week')

  for (let i = 0; i < 42; i++) {
    days.push(firstCurrentDate.add(i, 'day'))
  }

  return days
}

export type Value = {
  iso: string
  object: DateTimeObject
  utcObject: DateTimeObject
}

export type DoubleRangeProps = {
  startValue?: string
  endValue?: string
  locale?: string
  onSelect?: (start: Value | null, end: Value | null) => void
  timeZone?: string
}

const DoubleRange: FC<DoubleRangeProps> = ({
  startValue,
  endValue,
  onSelect,
  locale = 'en',
  timeZone = guessUserTimeZone(),
}) => {
  const [firstCurrentDate, setFirstCurrentDate] = useState<DateTime>(
    dateTime(startValue ?? undefined, {
      locale,
      timeZone,
    }),
  )
  const [secondCurrentDate, setSecondCurrentDate] = useState<DateTime>(
    dateTime(startValue ?? undefined, {
      locale,
      timeZone,
    }),
  )
  const [startedDate, setStartedDate] = useState<DateTime | null>(null)
  const [endedDate, setEndedDate] = useState<DateTime | null>(null)
  const [hoveredEndedDate, setHoveredEndedDate] = useState<DateTime | null>(null)
  const weekdaysShort = useMemo(() => dateLocale.weekdaysShort(locale), [locale])
  const firstCalendarDays: DateTime[] = useMemo(() => getDays(firstCurrentDate), [firstCurrentDate])
  const firstCalendarCurrentMonth = useMemo(
    () => dateLocale.month(locale, firstCurrentDate.month()),
    [firstCurrentDate, locale],
  )
  const secondCalendarDays: DateTime[] = useMemo(
    () => getDays(secondCurrentDate),
    [secondCurrentDate],
  )
  const secondCalendarCurrentMonth = useMemo(
    () => dateLocale.month(locale, secondCurrentDate.month()),
    [secondCurrentDate, locale],
  )

  const handleFirstGetPrevYear = () => {
    setFirstCurrentDate(
      firstCurrentDate.set({
        year: firstCurrentDate.year() - 1,
      }),
    )
  }

  const handleFirstGetNextYear = () => {
    setFirstCurrentDate(
      firstCurrentDate.set({
        year: firstCurrentDate.year() + 1,
      }),
    )
  }

  const handleFirstGetPrevMonth = () => {
    const isPrevYear = firstCurrentDate.month() - 1 < 0

    setFirstCurrentDate(
      firstCurrentDate.set({
        year: isPrevYear ? firstCurrentDate.year() - 1 : firstCurrentDate.year(),
        month: isPrevYear ? 12 : firstCurrentDate.month() - 1,
      }),
    )
  }

  const handleFirstGetNextMonth = () => {
    const isNextYear = firstCurrentDate.month() + 1 > 12

    setFirstCurrentDate(
      firstCurrentDate.set({
        year: isNextYear ? firstCurrentDate.year() + 1 : firstCurrentDate.year(),
        month: isNextYear ? 1 : firstCurrentDate.month() + 1,
      }),
    )
  }

  const handleSecondGetPrevYear = () => {
    setSecondCurrentDate(
      secondCurrentDate.set({
        year: secondCurrentDate.year() - 1,
      }),
    )
  }

  const handleSecondGetNextYear = () => {
    setSecondCurrentDate(
      secondCurrentDate.set({
        year: secondCurrentDate.year() + 1,
      }),
    )
  }

  const handleSecondGetPrevMonth = () => {
    const isPrevYear = secondCurrentDate.month() - 1 < 0

    setSecondCurrentDate(
      firstCurrentDate.set({
        year: isPrevYear ? secondCurrentDate.year() - 1 : secondCurrentDate.year(),
        month: isPrevYear ? 12 : secondCurrentDate.month() - 1,
      }),
    )
  }

  const handleSecondGetNextMonth = () => {
    const isNextYear = secondCurrentDate.month() + 1 > 12

    setSecondCurrentDate(
      secondCurrentDate.set({
        year: isNextYear ? secondCurrentDate.year() + 1 : secondCurrentDate.year(),
        month: isNextYear ? 1 : secondCurrentDate.month() + 1,
      }),
    )
  }

  const isAfter = (date: DateTime, date2: DateTime) => {
    if (date.year() > date2.year()) return true

    if (date.month() > date2.month()) return true

    return (
      date.year() === date2.year() && date.month() === date2.month() && date.day() >= date2.day()
    )
  }

  const isBefore = (date: DateTime, date2: DateTime) => {
    if (date.year() < date2.year()) return true

    if (date.month() < date2.month()) return true

    return (
      date.year() === date2.year() && date.month() === date2.month() && date.day() <= date2.day()
    )
  }

  const handleMouseEnter = (date: DateTime) => {
    if (!startedDate || endedDate) return

    setHoveredEndedDate(date)
  }

  const handleSetDate = (date: DateTime) => {
    if (startedDate && endedDate) {
      setStartedDate(date)
      setFirstCurrentDate(date)
      setEndedDate(null)
      setHoveredEndedDate(null)

      onSelect?.(
        { iso: date.toISO(), object: date.toObject(), utcObject: date.toUTCObject() },
        null,
      )

      return
    }

    if (!startedDate) {
      setStartedDate(date)
      setFirstCurrentDate(date)

      onSelect?.(
        { iso: date.toISO(), object: date.toObject(), utcObject: date.toUTCObject() },
        null,
      )

      return
    }

    if (isBefore(date, startedDate)) {
      setStartedDate(date)
      setEndedDate(startedDate)

      onSelect?.(
        { iso: date.toISO(), object: date.toObject(), utcObject: date.toUTCObject() },
        {
          iso: startedDate.toISO(),
          object: startedDate.toObject(),
          utcObject: startedDate.toUTCObject(),
        },
      )

      return
    }

    setEndedDate(date)
    setFirstCurrentDate(date)

    onSelect?.(
      {
        iso: startedDate.toISO(),
        object: startedDate.toObject(),
        utcObject: startedDate.toUTCObject(),
      },
      { iso: date.toISO(), object: date.toObject(), utcObject: date.toUTCObject() },
    )
  }

  const isInRange = (date: DateTime) => {
    if (!startedDate) return false

    const beforeDate = endedDate ? endedDate : hoveredEndedDate

    if (!beforeDate) return false

    if (isBefore(beforeDate, startedDate)) {
      const isAfterStart = isAfter(date, beforeDate)
      const isBeforeEnd = isBefore(date, startedDate)

      return isAfterStart && isBeforeEnd
    }

    const isAfterStart = isAfter(date, startedDate)
    const isBeforeEnd = isBefore(date, beforeDate)

    return isAfterStart && isBeforeEnd
  }

  const background = (date: DateTime) => {
    if (startedDate && date.isSame(startedDate.toObject())) {
      return 'blue'
    }

    if (endedDate && date.isSame(endedDate.toObject())) {
      return 'blue'
    }

    if (isInRange(date)) {
      return 'yellow'
    }
  }

  useEffect(() => {
    if (!startValue && !endValue) {
      const innerFirstCurrentDate = dateTime(undefined, { locale, timeZone })
      const isNextYear = innerFirstCurrentDate.month() + 1 > 12
      const innerSecondCurrentDate = innerFirstCurrentDate.set({
        year: isNextYear ? innerFirstCurrentDate.year() + 1 : innerFirstCurrentDate.year(),
        month: isNextYear ? 1 : innerFirstCurrentDate.month() + 1,
      })

      setFirstCurrentDate(innerFirstCurrentDate)
      setSecondCurrentDate(innerSecondCurrentDate)

      return
    }

    if (startValue && !endValue) {
      const innerStartedDate = dateTime(startValue, { locale, timeZone })
      const innerFirstCurrentDate = dateTime(startValue, { locale, timeZone })
      const isNextYear = innerFirstCurrentDate.month() + 1 > 12
      const innerSecondCurrentDate = innerFirstCurrentDate.set({
        year: isNextYear ? innerFirstCurrentDate.year() + 1 : innerFirstCurrentDate.year(),
        month: isNextYear ? 1 : innerFirstCurrentDate.month() + 1,
      })

      setFirstCurrentDate(innerFirstCurrentDate)
      setSecondCurrentDate(innerSecondCurrentDate)
      setStartedDate(innerStartedDate)

      return
    }

    if (startValue && endValue) {
      const innerStartedDate = dateTime(startValue, { locale, timeZone })
      const innerEndedDate = dateTime(endValue, { locale, timeZone })

      setFirstCurrentDate(innerStartedDate)
      setSecondCurrentDate(innerEndedDate)
      setStartedDate(innerStartedDate)
      setEndedDate(innerEndedDate)

      return
    }
  }, [locale, startValue, endValue, timeZone])

  return (
    <div style={{ display: 'flex', flexDirection: 'row', gap: '50px' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div>
          <div>Locale: {locale}</div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'row', gap: '20px' }}>
          <div>Year: {firstCurrentDate.year()}</div>
          <button onClick={handleFirstGetPrevYear}>prev year</button>
          <button onClick={handleFirstGetNextYear}>next year</button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'row', gap: '20px' }}>
          <div>Month: {firstCalendarCurrentMonth}</div>
          <button onClick={handleFirstGetPrevMonth}>prev month</button>
          <button onClick={handleFirstGetNextMonth}>next month</button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 30px)', gap: 20 }}>
          {weekdaysShort.map((item) => (
            <div key={item}>{item}</div>
          ))}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 30px)', gap: 20 }}>
          {firstCalendarDays.map((item) => (
            <button
              onClick={() => handleSetDate(item)}
              onMouseEnter={() => handleMouseEnter(item)}
              type={'button'}
              key={`${item.day()}_${item.month()}_${item.year()}`}
              style={{
                opacity: item.month() !== firstCurrentDate.month() ? 0.5 : 1,
                height: '30px',
                padding: 0,
                margin: 0,
                color: item.isWeekend() ? 'red' : 'black',
                fontWeight: item.isToday() ? 'bolder' : 'normal',
                background: background(item),
              }}
            >
              {item.day()} {item.isToday() && '*'}
            </button>
          ))}
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div>
          <div>Locale: {locale}</div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'row', gap: '20px' }}>
          <div>Year: {secondCurrentDate.year()}</div>
          <button onClick={handleSecondGetPrevYear}>prev year</button>
          <button onClick={handleSecondGetNextYear}>next year</button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'row', gap: '20px' }}>
          <div>Month: {secondCalendarCurrentMonth}</div>
          <button onClick={handleSecondGetPrevMonth}>prev month</button>
          <button onClick={handleSecondGetNextMonth}>next month</button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 30px)', gap: 20 }}>
          {weekdaysShort.map((item) => (
            <div key={item}>{item}</div>
          ))}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 30px)', gap: 20 }}>
          {secondCalendarDays.map((item) => (
            <button
              onClick={() => handleSetDate(item)}
              onMouseEnter={() => handleMouseEnter(item)}
              type={'button'}
              key={`${item.day()}_${item.month()}_${item.year()}`}
              style={{
                opacity: item.month() !== secondCurrentDate.month() ? 0.5 : 1,
                height: '30px',
                padding: 0,
                margin: 0,
                color: item.isWeekend() ? 'red' : 'black',
                fontWeight: item.isToday() ? 'bolder' : 'normal',
                background: background(item),
              }}
            >
              {item.day()} {item.isToday() && '*'}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default DoubleRange
