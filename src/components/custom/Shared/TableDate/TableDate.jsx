import React from 'react'
import { Wrapper } from './TableDate.styled'
import { OverlayTrigger, Tooltip } from '@themesberg/react-bootstrap'
import { FormattedMessage } from 'react-intl'
import { DataTransform } from '../../../../lib/sharedFun/Time'

const TableDate = ({
  createdDate = '10/18/200, 11:42AM',
  editedDate = '10/18/200, 11:42AM',
}) => {
  const options = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  };

  return (
    <Wrapper>
      <OverlayTrigger
        trigger={['hover', 'focus']}
        overlay={
          <Tooltip>
            <div>
              <FormattedMessage id="Last-Update-At" />{' '}
              {new Date(editedDate).toLocaleDateString('en-US', options)}
            </div>
            <div>
              <FormattedMessage id="Created-At" />{' '}
              {new Date(createdDate).toLocaleDateString('en-US', options)}
            </div>
          </Tooltip>
        }
      >
        <span>
          {new Date(editedDate).toLocaleDateString('en-US', options)}
        </span>
      </OverlayTrigger>
    </Wrapper>
  )
}

export default TableDate
