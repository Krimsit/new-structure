import { useState } from 'react'

import CalendarTime from './CalendarTime'

import type { CalendarTimeProps } from './CalendarTime'
import type { DateTimeObject } from './date-utils'
import type { Meta, StoryObj } from '@storybook/react'

export default {
  title: 'CalendarTime',
  component: CalendarTime,
  tags: ['component'],
  args: {
    locale: 'en',
    timeZone: 'Europe/Moscow',
  },
  argTypes: {},
} satisfies Meta<CalendarTimeProps>

export const Playground: StoryObj<CalendarTimeProps> = {
  render: (props) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [value, setValue] = useState<string>('')
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [object, setObject] = useState<DateTimeObject | null>(null)
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [utcObject, setUtcObject] = useState<DateTimeObject | null>(null)

    const handleSelect = (utcISO: string, object: DateTimeObject, utcObject: DateTimeObject) => {
      setValue(utcISO)
      setObject(object)
      setUtcObject(utcObject)
    }

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <CalendarTime {...props} value={value} onSelect={handleSelect} />

        {value && (
          <pre style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            Selected date: {value}
          </pre>
        )}

        {object && (
          <pre style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {JSON.stringify(object, null, 2)}
          </pre>
        )}

        {utcObject && (
          <pre style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {JSON.stringify(utcObject, null, 2)}
          </pre>
        )}
      </div>
    )
  },
}
