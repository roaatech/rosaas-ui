import React from 'react'
import { Wrapper } from './TableDate.styled'
import { OverlayTrigger, Tooltip } from '@themesberg/react-bootstrap'
import { FormattedMessage } from 'react-intl'
import { DataTransform } from '../../../../lib/sharedFun/Time'

const TableDate = ({
  createdDate = '10/18/200, 11:42AM',
  editedDate = '10/18/200, 11:42AM',
}) => {
  return (
    <Wrapper>
      <OverlayTrigger
        trigger={['hover', 'focus']}
        overlay={
          <Tooltip>
            <div>
              <FormattedMessage id="Last-Update-At" />
              {DataTransform(editedDate)}
            </div>
            <div>
              <FormattedMessage id="Created-At" /> {DataTransform(createdDate)}
            </div>
          </Tooltip>
        }
      >
        <span> {DataTransform(editedDate)}</span>
      </OverlayTrigger>
    </Wrapper>
  )
}

export default TableDate
