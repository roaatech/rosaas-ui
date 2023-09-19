import React from 'react'
import { Wrapper } from './DateLabelWhite.styled'
import { formatDate } from '../../../../lib/sharedFun/Time'

const DateLabelWhite = ({ text }) => {
  return (
    <Wrapper>
      <span className="label-white">{text}</span>
    </Wrapper>
  )
}

export default DateLabelWhite
