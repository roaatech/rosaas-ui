import React, { useState, useEffect } from 'react'
import { Card, Row, Col } from '@themesberg/react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faCheckCircle,
  faMoneyCheckDollar,
  faTimesCircle,
} from '@fortawesome/free-solid-svg-icons'
import useRequest from '../../../../axios/apis/useRequest.js'
import DataLabelWhite from '../../Shared/DateLabelWhite/DateLabelWhite.jsx'
import { FormattedMessage } from 'react-intl'
import DateLabel from '../../Shared/DateLabel/DateLabel.jsx'
import { formatDate } from '../../../../lib/sharedFun/Time.js'
import CreditCard from '../../CreditCard/CreditCard.jsx'
import { cardInfo } from '../../../../const/cardPayment.js'
import TableDate from '../../Shared/TableDate/TableDate.jsx'

export default function SubscriptionList() {
  const { getSubscriptionsList } = useRequest()
  const [subscriptions, setSubscriptions] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getSubscriptionsList()
        setSubscriptions(response.data.data)
      } catch (error) {
        console.error('Error fetching subscription data:', error)
      }
    }
    fetchData()
  }, [])

  const activeStatus = {
    true: { text: 'Active', icon: faCheckCircle, color: 'success' },
    false: { text: 'Inactive', icon: faTimesCircle, color: 'danger' },
  }

  return (
    <div>
      <h4>Subscription List</h4>
      <Row>
        {subscriptions &&
          subscriptions.map((subscription) => (
            <Col key={subscription.id} md={3}>
              <Card className="mb-4">
                <Card.Body>
                  <Card.Title>{subscription.displayName}</Card.Title>
                  {/* Label for isActive */}
                  <p>
                    <FontAwesomeIcon
                      icon={
                        activeStatus[
                          subscription.isActive ? subscription.isActive : false
                        ].icon
                      }
                      className={`text-${
                        activeStatus[
                          subscription.isActive ? subscription.isActive : false
                        ].color
                      } me-2`}
                    />
                    <strong>Status</strong>{' '}
                    <span
                      className={`text-${
                        activeStatus[
                          subscription.isActive ? subscription.isActive : false
                        ].color
                      }`}
                    >
                      {
                        activeStatus[
                          subscription.isActive ? subscription.isActive : false
                        ].text
                      }
                    </span>
                  </p>
                  <Card.Text>
                    <span>
                      <strong>Plan </strong> {subscription.plan.displayName}
                    </span>
                  </Card.Text>

                  <Card.Text>
                    <div className="d-flex align-items-center">
                      <strong>Created Date</strong>
                      <TableDate
                        className="px-2"
                        createdDate={subscription.createdDate}
                        editedDate={subscription.editedDate}
                      />
                    </div>
                  </Card.Text>

                  {subscription.autoRenewalIsEnabled ? (
                    <p>
                      <FontAwesomeIcon
                        icon={faCheckCircle}
                        className="text-success me-2"
                      />
                      <strong>Auto Renewal</strong>
                      <span className="text-success"> Enabled</span>{' '}
                      {formatDate(subscription.endDate)}
                    </p>
                  ) : (
                    <p>
                      <FontAwesomeIcon
                        icon={faTimesCircle}
                        className="text-danger me-2"
                      />
                      <strong>Auto Renewal</strong>
                      <strong className="text-danger"> Disabled</strong>
                    </p>
                  )}
                  {/* Label for planChangingIsEnabled */}
                  {subscription.planChangingIsEnabled && (
                    <p>
                      <strong>Plan Changing:</strong>{' '}
                      {subscription.planChangingType}
                    </p>
                  )}
                  {/* Display payment method card details */}
                  <div>
                    <strong> Payment Method</strong>
                    <div className="p-3">
                      {subscription.paymentMethodCard && (
                        <div>
                          <CreditCard
                            cardNumber={
                              subscription.paymentMethodCard.last4Digits
                            }
                            expiryDate={`${subscription.paymentMethodCard.expirationMonth}/${subscription.paymentMethodCard.expirationYear}`}
                            cardHolder={
                              subscription.paymentMethodCard.cardholderName
                            }
                            isDefault={subscription.isDefault}
                            cardTypeIcon={
                              cardInfo?.[subscription.paymentMethodCard.brand]
                                ?.icon || faMoneyCheckDollar
                            }
                            cardView={true}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
      </Row>
    </div>
  )
}
