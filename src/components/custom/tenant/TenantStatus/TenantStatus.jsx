import React from 'react'
import { Wrapper } from './TenantStatus.styled'
import { statusConst } from '../../../../const'
import Label from '../../Shared/label/Label'
import { FormattedMessage } from 'react-intl'
const TenantStatus = ({ statusValue }) => {
  return (
    <Wrapper>
      <Label
        color={statusConst[statusValue].color}
        background={
          statusConst[statusValue].color + statusConst[statusValue].opacity
        }
        value={<FormattedMessage id={statusConst[statusValue].string} />}
      />
    </Wrapper>
  )
}

export default TenantStatus
