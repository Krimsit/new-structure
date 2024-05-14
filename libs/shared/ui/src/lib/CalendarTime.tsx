import Calendar from './Calendar'
import TimePicker from './TimePicker'

import type { DateTimeObject } from './date-utils'
import type { FC } from 'react'

export type CalendarTimeProps = {
  value?: string
  locale?: string
  onSelect?: (iso: string, object: DateTimeObject, utcObject: DateTimeObject) => void
  timeZone?: string
}

const CalendarTime: FC<CalendarTimeProps> = (props) => (
  <div style={{ display: 'flex', flexDirection: 'row', gap: '20px' }}>
    <Calendar {...props} />
    <TimePicker {...props} />
  </div>
)

export default CalendarTime
