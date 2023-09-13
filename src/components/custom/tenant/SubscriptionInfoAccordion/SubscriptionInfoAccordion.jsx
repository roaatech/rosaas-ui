import React from 'react'
import { Card, Accordion, Table } from '@themesberg/react-bootstrap'
import { featureUnitMap } from '../../../../const'
import { useSelector } from 'react-redux'
import { FormattedMessage } from 'react-intl'
import { formatDate } from '../../../../lib/sharedFun/Time'

const SubscriptionInfoAccordion = (props) => {
  const subscriptionData = useSelector(
    (state) => state.tenants.subscriptionData
  )
  console.log({ subscriptionData })
  const { defaultKey = [], className = '' } = props
  const isDateExpired = (endDate) => {
    const currentDate = new Date()
    const endDateTime = new Date(endDate)
    return currentDate > endDateTime
  }
  return (
    <>
      {subscriptionData && (
        <Accordion className={className} defaultActiveKey={defaultKey}>
          <Accordion.Item eventKey="subscription">
            <Accordion.Button
              variant="link"
              className="w-100 d-flex justify-content-between accordionButton"
            >
              {/* <span className="firstTd">
              <FormattedMessage id="Health-Check-Status" />
            </span>
            <span className="mr-2 tabHolder">
              <span className="mr-2">
                <Label
                  className="mr-2"
                  {...HealthStatus[item.healthCheckStatus.isHealthy]}
                />
              </span> */}
              <span className="firstTd fw-bold">
                <FormattedMessage id="Subscription Info" />
              </span>
              <span className={`mr-2 `}>{` ${
                subscriptionData.planName
              }, From ${formatDate(subscriptionData.startDate)} to ${formatDate(
                subscriptionData.endDate
              )}`}</span>
            </Accordion.Button>
            <Accordion.Body>
              <Card.Body className="py-0 px-0">
                <Table responsive>
                  <thead>
                    <tr>
                      <th>Feature Name</th>
                      <th>Start Date</th>
                      <th>End Date</th>
                      <th>Remind/Limit</th>
                    </tr>
                  </thead>
                  <tbody>
                    {subscriptionData &&
                      subscriptionData.data?.map((subscription, index) => (
                        <tr key={`subscription-${index}`}>
                          <td>{subscription.featureName}</td>
                          <td>{formatDate(subscription.featureStartDate)}</td>
                          <td>
                            <span
                              className={`mb-0 fw-bold ${
                                isDateExpired(subscriptionData.endDate)
                                  ? 'text-danger'
                                  : ''
                              }`}
                            >
                              {subscription.featureEndDate
                                ? formatDate(subscription.featureEndDate)
                                : 'Unlimited'}
                            </span>
                          </td>
                          <td>
                            {subscription.remindLimit ===
                            'null undefined / null undefined '
                              ? ''
                              : subscription.remindLimit}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </Table>
              </Card.Body>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      )}
    </>
  )
}

export default SubscriptionInfoAccordion
