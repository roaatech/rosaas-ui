import React, { useState } from 'react'
import { Wrapper } from './DateLabelWhite.styled'
import { formatDate } from '../../../../lib/sharedFun/Time'
import { truncateText } from '../SharedFunctions/textFormatFunctions'
import { Button, OverlayTrigger, Tooltip } from '@themesberg/react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCopy } from '@fortawesome/free-solid-svg-icons'

const DataLabelWhite = ({ text, style, variant, maxCharSize }) => {
  const handleCopy = () => {
    navigator.clipboard.writeText(text)
  }
  const [show, setShow] = useState(false)
  return (
    <Wrapper>
      {maxCharSize && text.length > maxCharSize ? (
        <OverlayTrigger
          trigger={['hover', 'focus']}
          delay={{ show: 250, hide: 600 }}
          show={show}
          overlay={
            <Tooltip
              onMouseEnter={() => setShow(true)}
              onMouseLeave={() => setTimeout(() => setShow(false), 600)}
            >
              <div className="d-flex align-items-center justify-content-between">
                <span>{text}</span>
                <FontAwesomeIcon
                  icon={faCopy}
                  onClick={handleCopy}
                  style={{ cursor: 'pointer', marginLeft: '8px' }}
                />
              </div>
            </Tooltip>
          }
        >
          <span
            onMouseEnter={() => setShow(true)}
            onMouseLeave={() => {
              setShow(false)
            }}
            className={variant === 'gray' ? 'label-gray' : 'label-white'}
            style={style}
          >
            {maxCharSize && text.length > maxCharSize
              ? `${text.substring(0, maxCharSize)}...`
              : text}
          </span>
        </OverlayTrigger>
      ) : (
        <span
          className={variant === 'gray' ? 'label-gray' : 'label-white'}
          style={style}
        >
          {text}
        </span>
      )}
    </Wrapper>
  )
}

export default DataLabelWhite
