import React from 'react'
import { Wrapper } from './TableDate.styled'
import { OverlayTrigger, Tooltip } from '@themesberg/react-bootstrap'
import { FormattedMessage } from 'react-intl'
import {
  DataTransform,
  UppercaseMonthDateFormat,
} from '../../../../lib/sharedFun/Time'
import SafeFormatMessage from '../SafeFormatMessage/SafeFormatMessage'
import DataLabelWhite from '../DateLabelWhite/DateLabelWhite'

const TableDate = ({
  createdDate = '10/18/200, 11:42AM',
  editedDate = '10/18/200, 11:42AM',
  className,
  hasLabel,
}) => {
  return (
    <Wrapper>
      <OverlayTrigger
        trigger={['hover', 'focus']}
        overlay={
          <Tooltip>
            <div>
              <SafeFormatMessage id="Last-Update-At" />{' '}
              {DataTransform(editedDate)}
            </div>
            <div>
              <SafeFormatMessage id="Created-At" /> {DataTransform(createdDate)}
            </div>
          </Tooltip>
        }
      >
        <span className={className ? className : ''}>
          {' '}
          {hasLabel ? (
            <DataLabelWhite
              style={{ fontWeight: 'bold' }}
              text={UppercaseMonthDateFormat(createdDate, true, true)}
              variant={'gray'}
            />
          ) : (
            DataTransform(createdDate)
          )}
        </span>
      </OverlayTrigger>
    </Wrapper>
  )
}

export default TableDate
