import React from 'react'
import { Wrapper } from './DateLabelWhite.styled'
import { formatDate } from '../../../../lib/sharedFun/Time'

const DataLabelWhite = ({ text, style, variant }) => {
  return (
    <Wrapper>
      <span
        className={variant == 'gray' ? 'label-gray' : 'label-white'}
        style={style}
      >
        {text}
      </span>
    </Wrapper>
  )
}

export default DataLabelWhite
