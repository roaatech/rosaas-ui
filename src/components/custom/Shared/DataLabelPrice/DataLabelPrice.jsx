import React from 'react'
import { Wrapper } from './DataLabelPrice.styled'
import { OverlayTrigger, Tooltip } from '@themesberg/react-bootstrap'
import SafeFormatMessage from '../SafeFormatMessage/SafeFormatMessage'

const DataLabelPrice = ({ price, oldPrice }) => {
  return (
    <Wrapper>
      <span className="price-container">
        {oldPrice && (
          <OverlayTrigger
            trigger={['hover', 'focus']}
            overlay={
              <Tooltip>
                {SafeFormatMessage({
                  id: 'Old-Price',
                })}
              </Tooltip>
            }
          >
            {/* Ensure only one direct child */}
            <span className="old-price">{oldPrice}</span>
          </OverlayTrigger>
        )}
        <OverlayTrigger
          trigger={['hover', 'focus']}
          overlay={
            <Tooltip>
              {SafeFormatMessage({
                id: 'Price',
              })}
            </Tooltip>
          }
        >
          {/* Ensure only one direct child */}
          <span className="current-price">{price}</span>
        </OverlayTrigger>
      </span>
    </Wrapper>
  )
}

export default DataLabelPrice
