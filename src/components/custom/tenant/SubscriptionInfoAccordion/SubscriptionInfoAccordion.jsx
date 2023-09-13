import React from 'react'
import { Card, Accordion, Table } from '@themesberg/react-bootstrap'
import { DateStatus, featureUnitMap } from '../../../../const'
import { useSelector } from 'react-redux'
import { FormattedMessage } from 'react-intl'
import { formatDate } from '../../../../lib/sharedFun/Time'
import { Wrapper } from './SubscriptionInfoAccordion.styled'
import Label from '../../Shared/label/Label'
import DateLabel from '../../Shared/DateLabel/DateLabel'
import { size } from 'lodash'

const SubscriptionInfoAccordion = (props) => {
  const subscriptionData = useSelector(
    (state) => state.tenants.subscriptionData
  )
  console.log({ subscriptionData })
  const { defaultKey = [], className = '' } = props

  return (
    <>
      <Wrapper>
        {subscriptionData && (
          <Accordion className={className} defaultActiveKey={defaultKey}>
            <Accordion.Item eventKey="subscription">
              <Accordion.Button
                variant="link"
                className="w-100 d-flex justify-content-between accordionButton"
              >
                <span className="firstTd fw-bold">
                  <FormattedMessage id="Subscription Info" />
                </span>
                <span className={`mr-2 `}>
                  <span
                    style={{
                      fontSize: 'var(--smallFont)',
                      border: '1px solid',
                      padding: '0.05rem 0.5rem',
                      borderRadius: '7px',
                      borderColor: 'var(--surface-400)',
                    }}
                  >
                    {subscriptionData.planName}
                  </span>
                  {'   '}From{' '}
                  <span
                    style={{
                      fontSize: 'var(--smallFont)',
                      border: '1px solid',
                      padding: '0.05rem 0.5rem',
                      borderRadius: '7px',
                      borderColor: 'var(--surface-400)',
                    }}
                  >
                    {formatDate(subscriptionData.startDate)}
                  </span>{' '}
                  to <DateLabel endDate={subscriptionData.endDate} />
                </span>
              </Accordion.Button>
              <Accordion.Body>
                <Card.Body className="py-0 px-0">
                  <Table responsive>
                    <thead>
                      <tr>
                        <th>Feature Name</th>
                        <th>Start Date</th>
                        <th>End Date</th>
                        <th>Remind / Limit</th>
                      </tr>
                    </thead>
                    <tbody>
                      {subscriptionData &&
                        subscriptionData.data?.map((subscription, index) => (
                          <tr key={`subscription-${index}`}>
                            <td>{subscription.featureName}</td>
                            <td>{formatDate(subscription.featureStartDate)}</td>
                            <td>
                              <DateLabel
                                endDate={
                                  subscription.featureEndDate
                                    ? formatDate(subscription.featureEndDate)
                                    : 'Unlimited'
                                }
                              />
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
      </Wrapper>
    </>
  )
}

export default SubscriptionInfoAccordion
