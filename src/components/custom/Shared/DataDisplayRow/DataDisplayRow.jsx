import { OverlayTrigger, Tooltip } from '@themesberg/react-bootstrap'
import React from 'react'
import { FormattedMessage } from 'react-intl'
import SafeFormatMessage from '../SafeFormatMessage/SafeFormatMessage'

const DataDisplayRow = ({ label, value, hideBorderBottom, tooltip }) => {
  return (
    <div
      className={`d-flex align-items-center justify-content-between py-2 ${
        hideBorderBottom ? '' : 'border-bottom border-light'
      }`}
    >
      <div className="mb-0 w-50 fw-bold">
        <SafeFormatMessage id={label} />
      </div>
      <div
        className="card-stats"
        style={{
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}
      >
        {value &&
          (tooltip ? (
            <OverlayTrigger
              trigger={['hover', 'focus']}
              overlay={<Tooltip>{value}</Tooltip>}
            >
              <span> {value}</span>
            </OverlayTrigger>
          ) : (
            value
          ))}
      </div>
    </div>
  )
}

export default DataDisplayRow
