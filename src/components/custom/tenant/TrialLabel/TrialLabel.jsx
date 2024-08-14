import { FormattedMessage, useIntl } from 'react-intl'
import { Wrapper } from './TrialLabel.styled'

const TrialLabel = ({ days }) => {
  const intl = useIntl()
  return (
    <Wrapper>
      <span className="trial-label">
        <span className="top-line"></span>
        <span className="trial-text">
          {days && (
            <>
              {days} <FormattedMessage id="Days" />
              <br />
            </>
          )}
          <FormattedMessage id="Free-Trial" />
        </span>
        <span className="bottom-line"></span>
      </span>
    </Wrapper>
  )
}

export default TrialLabel
