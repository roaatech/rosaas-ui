import React from 'react'
import { Wrapper } from './TenantStatus.styled'
import { statusConst } from '../../../../const'
import Label from '../../Shared/label/Label'
import { FormattedMessage } from 'react-intl'
import SafeFormatMessage from '../../Shared/SafeFormatMessage/SafeFormatMessage'
const TenantStatus = ({ statusValue }) => {
  return (
    <Wrapper>
      <Label
        color={statusConst[statusValue]?.color}
        background={
          statusConst[statusValue]?.color + statusConst[statusValue]?.opacity
        }
        value={<SafeFormatMessage id={statusConst[statusValue]?.string} />}
        hasBorder={true}
      />
    </Wrapper>
  )
}

export default TenantStatus
