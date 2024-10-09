import React from 'react'
import { Wrapper } from './DateLabel.styled'
import {
  formatDate,
  UppercaseMonthDateFormat,
} from '../../../../lib/sharedFun/Time'
import SafeFormatMessage from '../SafeFormatMessage/SafeFormatMessage'

function isDateExpired(endDate) {
  const currentDate = new Date().toISOString()
  return (
    endDate !== 'Unlimited' &&
    new Date(currentDate).getTime() > new Date(endDate).getTime()
  )
}

const DateLabel = ({
  endDate,
  formatedDate,
  uppercaseMonthDateFormat,
  bold,
  hasTitle,
  hasBorder,
}) => {
  if (!endDate || isNaN(new Date(endDate).getTime())) {
    return ''
  }

  const DateStatus = {
    true: {
      background: 'var(--red2)',
    },
    false: {
      background: 'rgb(239, 249, 246)',
    },
  }
  const expired = !endDate ? false : isDateExpired(endDate)

  return (
    <Wrapper>
      <span
        className={!bold ? 'label' : 'label fw-bold'}
        style={{
          color: expired ? 'var(--red)' : 'var(--teal-green)',
          background: DateStatus[expired].background,
          borderColor:
            hasBorder && (expired ? 'var(--red)' : 'var(--teal-green)'),
          border: hasBorder && '1px solid',
        }}
      >
        {hasTitle &&
          (expired
            ? SafeFormatMessage({ id: 'Ended-on' })
            : SafeFormatMessage({ id: 'Ends-on' }))}
        {'  '}
        <span className={hasTitle ? 'fw-bold' : ''}>
          {endDate
            ? formatedDate
              ? endDate
              : uppercaseMonthDateFormat
              ? UppercaseMonthDateFormat(endDate, true)
              : formatDate(endDate)
            : 'Unlimited'}
        </span>
      </span>
    </Wrapper>
  )
}

export default DateLabel
