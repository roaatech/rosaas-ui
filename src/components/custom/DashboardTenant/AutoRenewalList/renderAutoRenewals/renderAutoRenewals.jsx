import {
  faEllipsisV,
  faMoneyCheckDollar,
  faSyncAlt,
  faToggleOn,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  Button,
  ButtonGroup,
  Card,
  Col,
  Dropdown,
} from '@themesberg/react-bootstrap'
import { FormattedMessage } from 'react-intl'
import { cycle } from '../../../../../const'
import SafeFormatMessage from '../../../Shared/SafeFormatMessage/SafeFormatMessage'

const renderAutoRenewals = ({
  renewal,
  type,
  formatDate,
  handleCancelAutoRenewal,
  CreditCard,
  cardInfo,
  RenewalsData,
}) => {
  return (
    <Col key={renewal.id} xl={4} lg={4} sm={6}>
      <Card
        className={`mb-4 ${
          RenewalsData.autoRenewalIds.includes(renewal.id) ? 'new-added' : ''
        }`}
      >
        <Card.Header>
          <div className="d-flex justify-content-between">
            <Card.Title className="m-0 p-0">
              <div>
                <FontAwesomeIcon
                  icon={faSyncAlt}
                  className="text-success me-2"
                />
                <strong>
                  <SafeFormatMessage id={'Auto-Renewal'} />
                </strong>{' '}
              </div>
            </Card.Title>
            <div>
              <span className="mx-2">
                <span className=" fw-normal">
                  <SafeFormatMessage id="Billing-Date" />
                </span>
                <span className="text-success">
                  {' '}
                  {formatDate(renewal.subscriptionRenewalDate)}
                </span>
              </span>
              {'  '}
              <Dropdown className="mx-2" as={ButtonGroup}>
                <Dropdown.Toggle
                  as={Button}
                  split
                  variant="link"
                  className="text-dark m-0 p-0"
                >
                  <span className="icon icon-sm">
                    <FontAwesomeIcon icon={faEllipsisV} className="icon-dark" />
                  </span>
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item
                    onClick={() =>
                      handleCancelAutoRenewal(
                        renewal.id,
                        renewal.subscription?.id
                          ? renewal.subscription.id
                          : renewal.id
                      )
                    }
                    className="text-danger"
                  >
                    <FontAwesomeIcon icon={faToggleOn} className="me-2" />
                    <SafeFormatMessage id="Cancel-Auto-Renewal" />
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
          </div>
        </Card.Header>
        <Card.Body>
          <Card.Text>
            <span>
              <strong>
                <SafeFormatMessage id="Subscription" />
              </strong>{' '}
              {renewal.subscription?.displayName}{' '}
            </span>
          </Card.Text>

          <Card.Text>
            <span>
              <strong>
                <SafeFormatMessage id="Plan" />
              </strong>{' '}
              {renewal?.plan?.displayName}
            </span>
          </Card.Text>
          <Card.Text>
            <div className="d-flex align-items-center">
              <strong>
                <SafeFormatMessage id="Enabled-Date" />
              </strong>{' '}
              <span className="mx-1">{formatDate(renewal.enabledDate)}</span>
            </div>
          </Card.Text>
          {/* Auto-renewal status */}
          {(renewal.renewalsCount > 0 || renewal.isContinuousRenewal) && (
            <Card.Text>
              <FontAwesomeIcon icon={faSyncAlt} className="text-success me-2" />
              <strong>
                <SafeFormatMessage id="Auto-Renewal" />
              </strong>
              <span className="text-success">
                {' '}
                <SafeFormatMessage id="Enabled" />{' '}
                {renewal.isContinuousRenewal && (
                  <SafeFormatMessage id="Indefinitely" />
                )}
              </span>{' '}
              {renewal.renewalsCount > 0 && (
                <>
                  <SafeFormatMessage id="for" />{' '}
                  {renewal.renewalsCount > 1 ? (
                    <span className="text-success">
                      {renewal.renewalsCount}{' '}
                      <SafeFormatMessage id={`${cycle[renewal.plan.cycle]}s`} />
                    </span>
                  ) : (
                    <span className="text-success">
                      {renewal.renewalsCount}{' '}
                      <SafeFormatMessage id={`${cycle[renewal.plan.cycle]}`} />
                    </span>
                  )}
                </>
              )}
            </Card.Text>
          )}

          <div>
            <strong>
              <SafeFormatMessage id="Auto-Renewal-Payment-Method" />
            </strong>

            <div className="p-3 ">
              <div>
                <CreditCard
                  cardNumber={renewal.paymentMethodCard?.last4Digits}
                  expiryDate={`${renewal.paymentMethodCard?.expirationMonth}/${renewal.paymentMethodCard?.expirationYear}`}
                  cardHolder={renewal.paymentMethodCard?.cardholderName}
                  isDefault={renewal.isDefault}
                  cardTypeIcon={
                    cardInfo?.[renewal.paymentMethodCard?.brand]?.icon ||
                    faMoneyCheckDollar
                  }
                  cardView={true}
                />
              </div>
            </div>
          </div>
        </Card.Body>
      </Card>
    </Col>
  )
}
export default renderAutoRenewals
