import { useState } from 'react'

import TimePicker from './TimePicker'

import type { TimePickerProps } from './TimePicker'
import type { DateTimeObject } from './date-utils'
import type { Meta, StoryObj } from '@storybook/react'

export default {
  title: 'TimePicker',
  component: TimePicker,
  tags: ['component'],
  args: {
    locale: 'en',
    timeZone: 'Europe/Moscow',
  },
  argTypes: {},
} satisfies Meta<TimePickerProps>

export const Playground: StoryObj<TimePickerProps> = {
  render: (props) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [value, setValue] = useState<string>('2024-06-19T20:35:54.000Z')
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
        <TimePicker {...props} value={value} onSelect={handleSelect} />

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
