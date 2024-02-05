import React from 'react'
import { Wrapper } from './DateLabel.styled'
import { formatDate } from '../../../../lib/sharedFun/Time'

function isDateExpired(endDate) {
  const currentDate = new Date()
  return endDate !== 'Unlimited' && currentDate > new Date(endDate)
}

const DateLabel = ({ endDate }) => {
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
        className="label"
        style={{
          color: expired ? 'rgb(255, 104, 104)' : 'var(--teal-green)',
          background: DateStatus[expired].background,
        }}
      >
        {endDate ? formatDate(endDate) : 'Unlimited'}
      </span>
    </Wrapper>
  )
}

export default DateLabel
