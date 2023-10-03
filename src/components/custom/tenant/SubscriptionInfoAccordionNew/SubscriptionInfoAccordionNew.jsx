import React, { useState } from 'react'
import {
  Card,
  Accordion,
  TableCol,
  Row,
  Nav,
  Tab,
  Col,
  Table,
} from '@themesberg/react-bootstrap'
import { DateStatus, featureUnitMap } from '../../../../const'
import { useSelector } from 'react-redux'
import { FormattedMessage } from 'react-intl'
import { formatDate } from '../../../../lib/sharedFun/Time'
import { Wrapper } from './SubscriptionInfoAccordionNew.styled'
import Label from '../../Shared/label/Label'
import DateLabel from '../../Shared/DateLabel/DateLabel'
import { size } from 'lodash'
import DateLabelWhite from '../../Shared/DateLabelWhite/DateLabelWhite'
import { TabPanel, TabView } from 'primereact/tabview'
// import { Col, Row, Nav, Tab } from 'react-bootstrap'
// import { CogIcon, UserCircleIcon } from '@heroicons/react/solid'

const SubscriptionInfoAccordionNew = (props) => {
  const subscriptionData = useSelector(
    (state) => state.tenants.subscriptionData
  )
  console.log({ xxx: subscriptionData })

  console.log({
    dfsdf: subscriptionData.data?.map((feature, index) =>
      feature.subscriptionFeaturesCycles?.map((cycle, cycleIndex) => cycle)
    ),
  })
  const { defaultKey = [], className = '' } = props
  const [activeFeature, setActiveFeature] = useState('')

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
                  <FormattedMessage id="Subscription-Info" />
                </span>
                <span className={`mr-2 `}>
                  <span>
                    <DateLabelWhite text={subscriptionData.planName} />
                  </span>
                  {'   '}
                  <FormattedMessage id="From" />{' '}
                  <DateLabelWhite
                    text={formatDate(subscriptionData.startDate)}
                  />{' '}
                  <FormattedMessage id="to" />{' '}
                  <DateLabel endDate={subscriptionData.endDate} />
                </span>
              </Accordion.Button>

              <Accordion.Body>
                <TabView activeIndex={0} className="custom-tabview">
                  {subscriptionData.subscriptionCycles.map((year, index) => (
                    <TabPanel key={index} header={formatDate(year.startDate)}>
                      <Row>
                        <Col lg={9}>
                          <div className="features">
                            <TabView activeIndex={0}>
                              <TabPanel
                                header="All Features"
                                className="vertical-tab-panel"
                              >
                                <Card.Body className="py-0 px-0">
                                  <Table responsive>
                                    <thead>
                                      <tr>
                                        <th>
                                          <FormattedMessage id="Feature" />
                                        </th>
                                        <th>
                                          <FormattedMessage id="Reset" />
                                        </th>
                                        <th>
                                          <FormattedMessage id="Start-Date" />
                                        </th>
                                        <th>
                                          <FormattedMessage id="End-Date" />
                                        </th>
                                        <th>
                                          <FormattedMessage id="Remind/Limit" />
                                        </th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {subscriptionData &&
                                        subscriptionData.data?.map(
                                          (subscription, index) => (
                                            <tr key={`subscription-${index}`}>
                                              <td className="feature-value">
                                                {subscription.featureName}
                                              </td>
                                              <td>
                                                {subscription.featureReset}
                                              </td>
                                              <td>
                                                <DateLabelWhite
                                                  text={formatDate(
                                                    subscription.featureStartDate
                                                  )}
                                                />
                                              </td>
                                              <td>
                                                <DateLabel
                                                  endDate={
                                                    subscription.featureEndDate
                                                      ? formatDate(
                                                          subscription.featureEndDate
                                                        )
                                                      : formatDate(
                                                          subscriptionData.endDate
                                                        )
                                                  }
                                                />
                                              </td>
                                              <td className="remind-value">
                                                {subscription.remindLimit ===
                                                'nullundefined / nullundefined '
                                                  ? '-'
                                                  : subscription.remindLimit}
                                              </td>
                                            </tr>
                                          )
                                        )}
                                    </tbody>
                                  </Table>
                                </Card.Body>
                              </TabPanel>
                              {subscriptionData.data?.map(
                                (feature, featureIndex) => (
                                  <TabPanel
                                    key={`feature-${featureIndex}`}
                                    header={feature.featureName}
                                  >
                                    <Row>
                                      <Col lg={12}>
                                        <Card.Body className="py-0 px-0">
                                          <Table responsive>
                                            <thead>
                                              <tr>
                                                <th>
                                                  <FormattedMessage id="Reset" />
                                                </th>
                                                <th>
                                                  <FormattedMessage id="Start-Date" />
                                                </th>
                                                <th>
                                                  <FormattedMessage id="End-Date" />
                                                </th>
                                                <th>
                                                  <FormattedMessage id="usage" />
                                                </th>
                                                <th>
                                                  <FormattedMessage id="Remind/Limit" />
                                                </th>
                                              </tr>
                                            </thead>
                                            <tbody>
                                              {feature.subscriptionFeaturesCycles?.map(
                                                (cycle, cycleIndex) => (
                                                  <tr
                                                    key={`cycle-${cycleIndex}`}
                                                  >
                                                    <td>{cycle.reset}</td>
                                                    <td>
                                                      <DateLabelWhite
                                                        text={formatDate(
                                                          cycle.startDate
                                                        )}
                                                      />
                                                    </td>
                                                    <td>
                                                      <DateLabel
                                                        endDate={
                                                          cycle.endDate
                                                            ? formatDate(
                                                                cycle.endDate
                                                              )
                                                            : formatDate(
                                                                subscriptionData.endDate
                                                              )
                                                        }
                                                      />
                                                    </td>
                                                    <td>{cycle.usage}</td>
                                                    <td className="remind-value">
                                                      {cycle.remindLimit ==
                                                      'nullundefined / nullundefined '
                                                        ? '-'
                                                        : cycle.remindLimit}
                                                    </td>
                                                  </tr>
                                                )
                                              )}
                                            </tbody>
                                          </Table>
                                        </Card.Body>
                                      </Col>
                                    </Row>
                                  </TabPanel>
                                )
                              )}
                            </TabView>
                          </div>
                        </Col>
                      </Row>
                    </TabPanel>
                  ))}
                </TabView>
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
        )}
      </Wrapper>
    </>
  )
}

export default SubscriptionInfoAccordionNew
