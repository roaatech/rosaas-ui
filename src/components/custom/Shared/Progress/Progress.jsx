import React from 'react'
import { ProgressBar } from '@themesberg/react-bootstrap'
import { Wrapper } from './Progress.styled'

const Progress = (props) => {
  const { max, label, variant, value, type = 'label', size = 'md' } = props
  const now = value ? value : 0
  const textColor = type === 'label' ? variant : 'white'
  const bgColorClass = type === 'tooltip' ? `bg-${variant}` : ''

  return (
    <Wrapper>
      <div className="progress-wrapper">
        <div className="progress-info">
          <div className={`progress-${type} text-${textColor} ${bgColorClass}`}>
            {label}
          </div>
          <div className="progress-percentage">
            <span>
              {now}/{max}
            </span>
          </div>
        </div>
        <ProgressBar
          className={`progress-${size}`}
          variant={variant}
          now={now}
          min={0}
          max={max}
        />
      </div>
    </Wrapper>
  )
}
export default Progress
