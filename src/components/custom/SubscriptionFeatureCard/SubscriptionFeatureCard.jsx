import { Card } from '@themesberg/react-bootstrap'
import { Wrapper } from './SubscriptionFeatureCard.styled'
import { MdError } from 'react-icons/md'
import { FormattedMessage } from 'react-intl'
import Label from '../Shared/label/Label'
import Progress from '../Shared/Progress'
import { ProgressBar } from '@themesberg/react-bootstrap'
import { BsStars } from 'react-icons/bs'

const SubscriptionFeatureCard = ({ featureName, limit, remainingUsage }) => {
  const percentageUsed = ((limit - remainingUsage) / limit) * 100
  const dataAvailable = featureName && limit && remainingUsage !== undefined
  console.log({ percentageUsed })
  const displayValueTemplate = (value) => {
    return `${value}${limit}`
  }
  return (
    <Wrapper>
      <Card className={`credit-card credit-card-hover`}>
        <Card.Body>
          {!dataAvailable ? (
            <div>
              <Card.Title className="small d-flex align-items-center">
                <BsStars className="mr-2" />
                {featureName}
              </Card.Title>
              <Card.Text className="card-number">
                {' '}
                <Progress
                  variant="primary"
                  label={`unlimited`}
                  now={100}
                  min={0}
                  max={100}
                  percent={100}
                />
              </Card.Text>
            </div>
          ) : (
            <>
              <Card.Title className="small d-flex align-items-center">
                {' '}
                <BsStars className="mr-2" />
                {featureName}
              </Card.Title>
              <Card.Text className="card-number">
                {' '}
                <Progress
                  variant="primary"
                  label={`${limit - remainingUsage} of ${remainingUsage} used`}
                  now={100 - percentageUsed}
                  min={0}
                  max={100}
                  percent={100 - percentageUsed}
                />
              </Card.Text>
            </>
          )}
        </Card.Body>
      </Card>
    </Wrapper>
  )
}

export default SubscriptionFeatureCard
