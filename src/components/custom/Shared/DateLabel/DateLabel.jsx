import React from 'react'
import { Wrapper } from './DateLabel.styled'
import {
  formatDate,
  UppercaseMonthDateFormat,
} from '../../../../lib/sharedFun/Time'
import SafeFormatMessage from '../SafeFormatMessage/SafeFormatMessage'

function isDateExpired(endDate) {
  const currentDate = new Date()
  return endDate !== 'Unlimited' && currentDate > new Date(endDate)
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
      background: 'rgba(255, 104, 104, 0.208)',
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
          color: expired ? 'rgb(255, 104, 104)' : 'var(--teal-green)',
          background: DateStatus[expired].background,
          borderColor:
            hasBorder && (expired ? 'rgb(255, 104, 104)' : 'var(--teal-green)'),
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
              ? UppercaseMonthDateFormat(endDate)
              : formatDate(endDate)
            : 'Unlimited'}
        </span>
      </span>
    </Wrapper>
  )
}

export default DateLabel
