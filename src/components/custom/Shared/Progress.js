import React from 'react'
import { ProgressBar } from '@themesberg/react-bootstrap'

export default (props) => {
  const {
    label,
    variant,
    percent,
    min,
    max,
    now,
    type = 'label',
    size = 'md',
  } = props

  const textColor = type === 'label' ? variant : 'white'
  const bgColorClass = type === 'tooltip' ? `bg-${variant}` : ''

  return (
    <div className="progress-wrapper">
      {
        <div className="progress-info">
          <div
            className={` progress-${type} text-${textColor} ${bgColorClass}`}
          >
            {label}
          </div>
          {percent >= 0 && (
            <div className="progress-percentage">{<span>{percent}%</span>}</div>
          )}
        </div>
      }
      <ProgressBar
        className={`progress-${size}`}
        variant={variant}
        now={now}
        min={min}
        max={max}
      />
    </div>
  )
}
