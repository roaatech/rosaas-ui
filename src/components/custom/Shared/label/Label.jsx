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
  sameWidth,
  isClickable,
  onClick,
}) => {
  return (
    <Wrapper>
      <span
        className={`${lighter ? 'lighter label' : 'normal label'} ${
          small ? 'small' : ''
        } ${className} ${isClickable ? 'clickable' : ''}`}
        style={{
          display: sameWidth && 'inline-block',
          color,
          background,
          borderColor: hasBorder && color,
          border: hasBorder && '1px solid',
          width: sameWidth && `${sameWidth}px`,
          textAlign: sameWidth && 'center',
          cursor: isClickable ? 'pointer' : 'default',
          ...style,
        }}
        onClick={isClickable ? onClick : undefined}
      >
        {icon ? icon : null} {value}
      </span>
    </Wrapper>
  )
}

export default Label
