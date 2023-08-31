import React from 'react'
import { Wrapper } from './Label.styled'
import { statusConst } from '../../../../const'
const Label = ({ color, background, value, icon }) => {
  return (
    <Wrapper>
      <span
        className="label"
        style={{
          color,
          background,
        }}
      >
        {icon ? icon : null} {value}
      </span>
    </Wrapper>
  )
}

export default Label
