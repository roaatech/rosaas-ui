import React from 'react'
import { Wrapper } from './DateLabelWhite.styled'
import { formatDate } from '../../../../lib/sharedFun/Time'

const DataLabelWhite = ({ text, style }) => {
  return (
    <Wrapper>
      <span className="label-white" style={style}>
        {text}
      </span>
    </Wrapper>
  )
}

export default DataLabelWhite
