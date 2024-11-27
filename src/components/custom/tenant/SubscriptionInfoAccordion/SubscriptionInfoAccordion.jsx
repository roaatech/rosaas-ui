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
import DateLabelWhite from '../../Shared/DateLabelWhite/DateLabelWhite'
import SafeFormatMessage from '../../Shared/SafeFormatMessage/SafeFormatMessage'

const SubscriptionInfoAccordion = (props) => {
  const subscriptionData = useSelector(
    (state) => state.tenants.subscriptionData
  )
  const { defaultKey = [], className = '' } = props

  return (
    <>
      <Wrapper>
        {subscriptionData.startDate && (
          <Accordion className={className} defaultActiveKey={defaultKey}>
            <Accordion.Item eventKey="subscription">
              <Accordion.Button
                variant="link"
                className="w-100 d-flex justify-content-between accordionButton"
              >
                <span className="firstTd fw-bold">
                  <SafeFormatMessage id="Subscription-Info" />
                </span>
                <span className={`mr-2 `}>
                  <span>
                    <DateLabelWhite text={subscriptionData.planName} />
                  </span>
                  {'   '}
                  <SafeFormatMessage id="From" />{' '}
                  <DateLabelWhite
                    text={formatDate(subscriptionData.startDate)}
                  />{' '}
                  <SafeFormatMessage id="to" />{' '}
                  <DateLabel endDate={subscriptionData.endDate} />
                </span>
              </Accordion.Button>
              <Accordion.Body>
                <Card.Body className="py-0 px-0">
                  <Table responsive>
                    <thead>
                      <tr>
                        <th>
                          <SafeFormatMessage id="Feature" />
                        </th>
                        <th>
                          <SafeFormatMessage id="Reset" />
                        </th>
                        <th>
                          <SafeFormatMessage id="Start-Date" />
                        </th>
                        <th>
                          <SafeFormatMessage id="End-Date" />
                        </th>
                        <th>
                          <SafeFormatMessage id="Remind/Limit" />
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {subscriptionData &&
                        subscriptionData.data?.map((subscription, index) => (
                          <tr key={`subscription-${index}`}>
                            <td>{subscription.featureName}</td>
                            <td>{subscription.featureReset}</td>
                            <td>
                              <DateLabelWhite
                                text={formatDate(subscription.featureStartDate)}
                              />
                            </td>
                            <td>
                              <DateLabel
                                endDate={
                                  subscription.featureEndDate
                                    ? formatDate(subscription.featureEndDate)
                                    : formatDate(subscriptionData.endDate)
                                }
                                formatedDate={true}
                              />
                            </td>
                            <td>
                              {subscription.remindLimit ===
                              'nullundefined / nullundefined '
                                ? '-'
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
