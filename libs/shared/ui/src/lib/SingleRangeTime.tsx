import { useEffect, useMemo, useState } from 'react'

import TimePicker from './TimePicker'
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

export type Value = {
  iso: string
  object: DateTimeObject
  utcObject: DateTimeObject
}

export type SingleRangeTimeProps = {
  startValue?: string
  endValue?: string
  locale?: string
  onSelect?: (start: Value | null, end: Value | null) => void
  timeZone?: string
}

const SingleRangeTime: FC<SingleRangeTimeProps> = ({
  startValue,
  endValue,
  onSelect,
  locale = 'en',
  timeZone = guessUserTimeZone(),
}) => {
  const [currentDate, setCurrentDate] = useState<DateTime>(
    dateTime(startValue ?? undefined, {
      locale,
      timeZone,
    }),
  )
  const [startedDate, setStartedDate] = useState<DateTime | null>(null)
  const [endedDate, setEndedDate] = useState<DateTime | null>(null)
  const [hoveredEndedDate, setHoveredEndedDate] = useState<DateTime | null>(null)
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
      setCurrentDate(date)
      setEndedDate(null)
      setHoveredEndedDate(null)

      onSelect?.(
        { iso: date.toUTCISO(), object: date.toObject(), utcObject: date.toUTCObject() },
        null,
      )

      return
    }

    if (!startedDate) {
      setStartedDate(date)
      setCurrentDate(date)

      onSelect?.(
        { iso: date.toUTCISO(), object: date.toObject(), utcObject: date.toUTCObject() },
        null,
      )

      return
    }

    if (isBefore(date, startedDate)) {
      setStartedDate(date)
      setEndedDate(startedDate)

      onSelect?.(
        { iso: date.toUTCISO(), object: date.toObject(), utcObject: date.toUTCObject() },
        {
          iso: startedDate.toUTCISO(),
          object: startedDate.toObject(),
          utcObject: startedDate.toUTCObject(),
        },
      )

      return
    }

    setEndedDate(date)
    setCurrentDate(date)

    onSelect?.(
      {
        iso: startedDate.toUTCISO(),
        object: startedDate.toObject(),
        utcObject: startedDate.toUTCObject(),
      },
      { iso: date.toUTCISO(), object: date.toObject(), utcObject: date.toUTCObject() },
    )
  }

  const handleUpdateStartedDateTime = (
    iso: string,
    object: DateTimeObject,
    utcObject: DateTimeObject,
  ) => {
    if (!startedDate || !endedDate) return

    setStartedDate(dateTime(iso, { locale, timeZone }))
    onSelect?.(
      {
        iso: iso,
        object: object,
        utcObject: utcObject,
      },
      {
        iso: endedDate.toUTCISO(),
        object: endedDate.toObject(),
        utcObject: endedDate.toUTCObject(),
      },
    )
  }

  const handleUpdateEndedDateTime = (
    iso: string,
    object: DateTimeObject,
    utcObject: DateTimeObject,
  ) => {
    if (!startedDate || !endedDate) return

    setEndedDate(dateTime(iso, { locale, timeZone }))
    onSelect?.(
      {
        iso: startedDate.toUTCISO(),
        object: startedDate.toObject(),
        utcObject: startedDate.toUTCObject(),
      },
      {
        iso: iso,
        object: object,
        utcObject: utcObject,
      },
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
    const startedDate = startValue ? dateTime(startValue, { locale, timeZone }) : null
    const endedDate = endValue ? dateTime(endValue, { locale, timeZone }) : null
    const currentDate = dateTime(startValue ?? undefined, {
      locale,
      timeZone,
    })

    setCurrentDate(currentDate)
    setStartedDate(startedDate)
    setEndedDate(endedDate)
    setHoveredEndedDate(endedDate)
  }, [locale, startValue, endValue, timeZone])

  return (
    <div style={{ display: 'flex', flexDirection: 'row', gap: '20px' }}>
      {startedDate && endedDate && (
        <TimePicker
          value={startValue}
          onSelect={handleUpdateStartedDateTime}
          locale={locale}
          timeZone={timeZone}
        />
      )}
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
              onMouseEnter={() => handleMouseEnter(item)}
              type={'button'}
              key={`${item.day()}_${item.month()}_${item.year()}`}
              style={{
                opacity: item.month() !== currentDate.month() ? 0.5 : 1,
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
      {startedDate && endedDate && (
        <TimePicker
          value={endValue}
          onSelect={handleUpdateEndedDateTime}
          locale={locale}
          timeZone={timeZone}
        />
      )}
    </div>
  )
}

export default SingleRangeTime
