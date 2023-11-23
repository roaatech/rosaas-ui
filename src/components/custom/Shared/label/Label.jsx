import React from 'react'
import { Wrapper } from './Label.styled'
import { statusConst } from '../../../../const'
const Label = ({ color, background, value, icon, lighter }) => {
  return (
    <Wrapper>
      <span
        className={lighter ? 'lighter label' : 'normal label'}
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
