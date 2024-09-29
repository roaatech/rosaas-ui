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
  style,
  sameWidth = false,
}) => {
  return (
    <Wrapper>
      <span
        className={`${lighter ? 'lighter label' : 'normal label'} ${
          small ? 'small' : ''
        } ${className} `}
        style={{
          display: sameWidth && 'inline-block',
          color,
          background,
          borderColor: hasBorder && background,
          border: hasBorder && '1px solid',
          width: sameWidth && `${sameWidth}px`,
          textAlign: sameWidth && 'center',
          ...style,
        }}
      >
        {icon ? icon : null} {value}
      </span>
    </Wrapper>
  )
}

export default Label
