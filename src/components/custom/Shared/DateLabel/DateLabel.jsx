import React from 'react'
import { Wrapper } from './DateLabel.styled'
import {
  formatDate,
  UppercaseMonthDateFormat,
} from '../../../../lib/sharedFun/Time'
import SafeFormatMessage from '../SafeFormatMessage/SafeFormatMessage'

function isDateExpired(endDate) {
  if (endDate === 'Unlimited') return false
  const currentDateUTC = new Date().toISOString()
  const endDateUTC = new Date(endDate).toISOString()

  return new Date(currentDateUTC).getTime() > new Date(endDateUTC).getTime()
}

const DateLabel = ({
  endDate,
  formatedDate,
  uppercaseMonthDateFormat,
  uppercaseMonthDateFormatType,
  bold,
  hasTitle,
  title,
  hasBorder,
  validDateColor,
  validBackgroundColor,
}) => {
  if (!endDate || isNaN(new Date(endDate).getTime())) {
    return null // Use null instead of an empty string
  }

  const DateStatus = {
    true: {
      background: 'var(--red2)',
    },
    false: {
      background: validBackgroundColor || 'rgb(239, 249, 246)',
    },
  }
  const expired = isDateExpired(endDate)

  return (
    <Wrapper>
      <span
        className="label"
        style={{
          color: expired ? 'var(--red)' : validDateColor || 'var(--teal-green)',
          background: DateStatus[expired].background,
          borderColor:
            hasBorder && (expired ? 'var(--red)' : 'var(--teal-green)'),
          border: hasBorder ? '1px solid' : undefined,
        }}
      >
        {(hasTitle || title) && (
          <>
            {title ||
              (expired ? (
                <SafeFormatMessage id="Ended-on" />
              ) : (
                <SafeFormatMessage id="Ends-on" />
              ))}
          </>
        )}{' '}
        <span className={hasTitle || bold ? 'fw-bold' : ''}>
          {endDate
            ? formatedDate
              ? endDate
              : uppercaseMonthDateFormat
              ? uppercaseMonthDateFormatType == 'justDate'
                ? UppercaseMonthDateFormat(endDate)
                : UppercaseMonthDateFormat(endDate, true)
              : formatDate(endDate)
            : 'Unlimited'}
        </span>
      </span>
    </Wrapper>
  )
}

export default DateLabel
