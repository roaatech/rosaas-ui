import { useIntl } from 'react-intl'
import { Wrapper } from './TrialLabel.styled'

const TrialLabel = () => {
  const intl = useIntl()
  return (
    <Wrapper>
      <span className="trial-label">
        <span className="top-line"></span>
        <span className="trial-text">
          {intl.formatMessage({ id: 'Trial' })}
        </span>
        <span className="bottom-line"></span>
      </span>
    </Wrapper>
  )
}

export default TrialLabel
