import {
  faArrowUp,
  faEllipsisV,
  faMoneyCheckDollar,
  faSyncAlt,
  faTimesCircle,
  faToggleOff,
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

const renderUpgradeRenewals = ({
  renewal,
  formatDate,
  handleCancelAutoRenewal,
  CreditCard,
  cardInfo,
  RenewalsData,
  automaticRenew,
}) => {
  return (
    renewal.id && (
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
                    icon={faArrowUp}
                    className="text-warning me-2"
                  />
                  <strong>
                    <FormattedMessage id={'Upgrade'} />
                  </strong>{' '}
                </div>
              </Card.Title>
              <div>
                <span className="mx-2">
                  <span className=" fw-normal">
                    <FormattedMessage id="Billing-Date" />
                  </span>
                  <span className="billing-date">
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
                      <FontAwesomeIcon
                        icon={faEllipsisV}
                        className="icon-dark"
                      />
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
                      <FormattedMessage id="Cancel-Upgrade" />
                    </Dropdown.Item>
                    {!renewal.renewalsCount > 0 &&
                      !renewal.isContinuousRenewal && (
                        <Dropdown.Item
                          onClick={() => automaticRenew(renewal?.id)}
                        >
                          <>
                            {' '}
                            <FontAwesomeIcon
                              icon={faToggleOff}
                              className="me-2"
                            />
                            <FormattedMessage id="Enable-Auto-Renewal" />
                          </>
                        </Dropdown.Item>
                      )}
                  </Dropdown.Menu>
                </Dropdown>
              </div>
            </div>
          </Card.Header>
          <Card.Body>
            <Card.Text>
              <span>
                <strong>
                  <FormattedMessage id="Subscription" />
                </strong>{' '}
                {renewal.subscription?.displayName}{' '}
              </span>
            </Card.Text>

            <Card.Text>
              <span>
                <strong>
                  <FormattedMessage id="Advanced-Plan" />
                </strong>{' '}
                {/* Display information about the new plan */}
                {/* For example: */}
                {renewal?.plan?.displayName}
              </span>
            </Card.Text>

            <Card.Text>
              <div className="d-flex align-items-center">
                <strong>
                  <FormattedMessage id="Enabled-Date" />
                </strong>{' '}
                <span className="mx-1">{formatDate(renewal.enabledDate)}</span>
              </div>
            </Card.Text>

            {/* Auto-renewal status */}
            {renewal.renewalsCount > 0 || renewal.isContinuousRenewal ? (
              <Card.Text>
                <FontAwesomeIcon
                  icon={faSyncAlt}
                  className="text-success me-2"
                />
                <strong>
                  <FormattedMessage id="Auto-Renewal" />
                </strong>
                <span className="text-success">
                  {' '}
                  <FormattedMessage id="Enabled" />{' '}
                  {renewal.isContinuousRenewal && (
                    <FormattedMessage id="Indefinitely" />
                  )}
                </span>{' '}
                {renewal.renewalsCount > 0 && (
                  <>
                    <FormattedMessage id="for" />{' '}
                    {renewal.renewalsCount > 1 ? (
                      <span className="text-success">
                        {renewal.renewalsCount}{' '}
                        <FormattedMessage
                          id={`${cycle[renewal.plan.cycle]}s`}
                        />
                      </span>
                    ) : (
                      <span className="text-success">
                        {renewal.renewalsCount}{' '}
                        <FormattedMessage id={`${cycle[renewal.plan.cycle]}`} />
                      </span>
                    )}
                  </>
                )}
              </Card.Text>
            ) : (
              <Card.Text>
                <FontAwesomeIcon
                  icon={faTimesCircle}
                  className="text-danger me-2"
                />
                <strong>
                  <FormattedMessage id="Auto-Renewal" />{' '}
                </strong>
                <strong className="text-danger">
                  {' '}
                  <FormattedMessage id="Disabled" />
                </strong>
              </Card.Text>
            )}
            <div>
              <strong>
                <FormattedMessage id="Payment-Method" />
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
  )
}
export default renderUpgradeRenewals
