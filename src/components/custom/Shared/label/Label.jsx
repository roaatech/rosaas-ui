import React from 'react'
import { Wrapper } from './Label.styled'
import { statusConst } from '../../../../const'
const Label = ({
  color,
  background,
  value,
  icon,
  lighter,
  small,
  className,
  hasBorder,
}) => {
  return (
    <Wrapper>
      <span
        className={`${lighter ? 'lighter label' : 'normal label'} ${
          small ? 'small' : ''
        } ${className} `}
        style={{
          color,
          background,
          borderColor: hasBorder && background,
          border: hasBorder && '1px solid',
        }}
      >
        {icon ? icon : null} {value}
      </span>
    </Wrapper>
  )
}

export default Label
