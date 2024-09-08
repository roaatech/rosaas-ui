import { FormattedMessage, useIntl } from 'react-intl'
import { Wrapper } from './TrialLabel.styled'
import SafeFormatMessage from '../../Shared/SafeFormatMessage/SafeFormatMessage'

const TrialLabel = ({ days }) => {
  const intl = useIntl()
  return (
    <Wrapper>
      <span className="trial-label">
        <span className="top-line"></span>
        <span className="trial-text">
          {days && (
            <>
              {days} {'  '}
              {days <= 10 ? (
                <SafeFormatMessage id="Days" />
              ) : (
                <SafeFormatMessage id="Days-ar" />
              )}
              <br />
            </>
          )}
          <SafeFormatMessage id="Free-Trial" />
        </span>
        <span className="bottom-line"></span>
      </span>
    </Wrapper>
  )
}

export default TrialLabel
