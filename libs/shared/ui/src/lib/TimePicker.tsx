import { useEffect, useMemo, useState } from 'react'

import { dateTime, guessUserTimeZone } from './date-utils'

import type { DateTime, DateTimeObject, DateTimeUnits } from './date-utils'
import type { FC } from 'react'

export type TimePickerProps = {
  value?: string
  locale?: string
  onSelect?: (iso: string, object: DateTimeObject, utcObject: DateTimeObject) => void
  timeZone?: string
}

const getHours = () => [...Array(24).keys()].map((item) => item + 1)
const getMinutes = () => [...Array(59).keys()].map((item) => item + 1)
const getSeconds = () => [...Array(59).keys()].map((item) => item + 1)

const TimePicker: FC<TimePickerProps> = ({
  value,
  onSelect,
  locale = 'en',
  timeZone = guessUserTimeZone(),
}) => {
  const [currentDate, setCurrentDate] = useState<DateTime>(dateTime(value, { locale, timeZone }))
  const hours = useMemo(() => getHours(), [])
  const minutes = useMemo(() => getMinutes(), [])
  const seconds = useMemo(() => getSeconds(), [])

  const handleSetDate = (newValue: number, unit: DateTimeUnits) => {
    const newDateTime = currentDate.set({
      [unit]: newValue,
    })

    setCurrentDate(newDateTime)
    onSelect?.(newDateTime.toUTCISO(), newDateTime.toObject(), newDateTime.toUTCObject())
  }

  useEffect(() => {
    const date = dateTime(value, { locale, timeZone })

    setCurrentDate(date)
  }, [locale, value, timeZone])

  return (
    <div style={{ display: 'flex', flexDirection: 'row', gap: '20px' }}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          maxHeight: '400px',
          overflowY: 'auto',
        }}
      >
        <div>Hour</div>
        {hours.map((hour) => (
          <button
            key={hour}
            type={'button'}
            onClick={() => handleSetDate(hour, 'hour')}
            style={{
              background: value && currentDate.hour() === hour ? 'blue' : 'inherit',
            }}
          >
            {hour}
          </button>
        ))}
      </div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          maxHeight: '400px',
          overflowY: 'auto',
        }}
      >
        <div>Minute</div>
        {minutes.map((minute) => (
          <button
            key={minute}
            type={'button'}
            onClick={() => handleSetDate(minute, 'minute')}
            style={{
              background: value && currentDate.minute() === minute ? 'blue' : 'inherit',
            }}
          >
            {minute}
          </button>
        ))}
      </div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          maxHeight: '400px',
          overflowY: 'auto',
        }}
      >
        <div>Second</div>
        {seconds.map((second) => (
          <button
            key={second}
            type={'button'}
            onClick={() => handleSetDate(second, 'second')}
            style={{
              background: value && currentDate.second() === second ? 'blue' : 'inherit',
            }}
          >
            {second}
          </button>
        ))}
      </div>
    </div>
  )
}

export default TimePicker
