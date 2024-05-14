import { useState } from 'react'

import DoubleRange from './DoubleRange'

import type { DoubleRangeProps, Value } from './DoubleRange'
import type { Meta, StoryObj } from '@storybook/react'

export default {
  title: 'DoubleRange',
  component: DoubleRange,
  tags: ['component'],
  args: {
    locale: 'en',
    timeZone: 'Europe/Moscow',
  },
  argTypes: {},
} satisfies Meta<DoubleRangeProps>

export const Playground: StoryObj<DoubleRangeProps> = {
  render: (props) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [startedValue, setStartedValue] = useState<Value | null>(null)
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [endedValue, setEndedValue] = useState<Value | null>(null)

    const handleSelect = (startedDate: Value | null, endedDate: Value | null) => {
      setStartedValue(startedDate)
      setEndedValue(endedDate)
    }

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <DoubleRange
          {...props}
          startValue={startedValue?.iso}
          endValue={endedValue?.iso}
          onSelect={handleSelect}
        />

        {startedValue && endedValue && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <pre style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              Range: {startedValue.iso} - {endedValue.iso}
            </pre>
            <div style={{ display: 'flex', flexDirection: 'row', gap: '20px' }}>
              <div>
                <pre style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {JSON.stringify(startedValue.object, null, 2)}
                </pre>
                <pre style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {JSON.stringify(startedValue.utcObject, null, 2)}
                </pre>
              </div>

              <div>
                <pre style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {JSON.stringify(endedValue.object, null, 2)}
                </pre>
                <pre style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {JSON.stringify(endedValue.utcObject, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  },
}
