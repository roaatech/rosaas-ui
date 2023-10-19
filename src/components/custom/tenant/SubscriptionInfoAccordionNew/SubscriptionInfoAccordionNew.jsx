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
  Container,
} from '@themesberg/react-bootstrap'
import {
  DateStatus,
  cycle,
  featureResetMap,
  featureUnitMap,
} from '../../../../const'
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
  let direction = useSelector((state) => state.main.direction)

  const subscriptionData = useSelector(
    (state) => state.tenants.subscriptionData
  )
  console.log({ subscriptionData })
  console.log({
    dataTest: subscriptionData?.subscriptionCycles,
  })

  console.log({
    dfsdf: subscriptionData.data?.map((feature, index) =>
      feature.subscriptionFeaturesCycles?.map((cycle, cycleIndex) => cycle)
    ),
  })
  const { defaultKey = [], className = '' } = props

  const [currentTab, setCurrentTab] = useState(0)
  const [hideAllFeaturesTab, setHideAllFeaturesTab] = useState(false)
  const handleTabChange = (index) => {
    setCurrentTab(index)

    setHideAllFeaturesTab(index !== 0)

    console.log(index !== 0)
  }

  return (
    <>
      <Wrapper direction={direction}>
        {subscriptionData.startDate && (
          <Accordion className={className} defaultActiveKey={defaultKey}>
            <Accordion.Item eventKey="subscription">
              <Accordion.Button variant="link">
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
                <TabView
                  activeIndex={currentTab}
                  className="custom-tabview"
                  onTabChange={(e) => handleTabChange(e.index)}
                >
                  {subscriptionData?.subscriptionCycles?.map((cyc, index) => (
                    <TabPanel
                      key={index}
                      header={
                        subscriptionData?.currentSubscriptionCycleId ===
                        cyc?.subscriptionCycleId
                          ? `${formatDate(cyc.startDate)} (current)`
                          : formatDate(cyc.startDate)
                      }
                    >
                      <div className="info-card">
                        <Card border="light" className="shadow-sm ">
                          <Container>
                            <Row>
                              <Col md={6}>
                                {/* <div className="dispatchCont"> */}
                                <Card.Body className="py-0 px-0">
                                  <div className="d-flex align-items-center justify-content-between border-bottom border-light py-2 ">
                                    <div className="mb-0 w-25">
                                      <FormattedMessage id="Plan" />
                                    </div>
                                    <div className="small card-stats">
                                      {cyc.plan}
                                    </div>
                                  </div>

                                  <div className="d-flex align-items-center justify-content-between  py-2 ">
                                    <div className="mb-0 w-25">
                                      <FormattedMessage id="Price" />
                                    </div>
                                    <div className="small card-stats">
                                      {cyc.price} /
                                      <FormattedMessage id={cycle[cyc.cycle]} />
                                    </div>
                                  </div>
                                </Card.Body>
                                {/* </div> */}
                              </Col>
                              <Col md={6}>
                                {/* <div className="dispatchCont"> */}
                                <Card.Body className="py-0 px-0 ">
                                  <div className="d-flex align-items-center justify-content-between border-bottom border-light py-2 ml-5">
                                    <div className="mb-0 w-25">
                                      <FormattedMessage id="Start-Date" />
                                    </div>
                                    <div className="small card-stats">
                                      {formatDate(cyc.startDate)}
                                    </div>
                                  </div>
                                  <div className="d-flex align-items-center justify-content-between py-2 ml-5">
                                    <div className="mb-0 w-25">
                                      <FormattedMessage id="End-Date" />
                                    </div>
                                    <div className="small card-stats">
                                      {formatDate(cyc.endDate)}
                                    </div>
                                  </div>
                                </Card.Body>
                                {/* </div> */}
                              </Col>
                            </Row>
                          </Container>
                        </Card>
                      </div>
                      <Card
                        border="light"
                        className="shadow-sm mt-2 table-card "
                      >
                        <Card.Body>
                          {/* {setSubscriptionCyc(cyc?.subscriptionCycleId)} */}
                          <Container className="p-0 m-0">
                            <Row>
                              <Col
                                className={` ${
                                  window.innerWidth <= 768 ? 'col-sm-12' : ''
                                }`}
                              >
                                <div>
                                  <Tab.Container defaultActiveKey="allFeatures">
                                    <Container className="p-0 ">
                                      <Row>
                                        <Col md={3}>
                                          <Nav
                                            fill
                                            variant="pills"
                                            className={`flex-column vertical-tab custom-nav-link mb-3 ${
                                              window.innerWidth <= 768
                                                ? 'custom-horizontal-tab'
                                                : ''
                                            }`}
                                          >
                                            <Nav.Item>
                                              <Nav.Link
                                                eventKey="allFeatures"
                                                className={
                                                  hideAllFeaturesTab
                                                    ? 'hide-tab-content'
                                                    : ''
                                                }
                                              >
                                                <FormattedMessage id="All-Features" />
                                              </Nav.Link>
                                            </Nav.Item>
                                            {subscriptionData.data?.map(
                                              (feature, featureIndex) => (
                                                <Nav.Item
                                                  key={`feature-nav-${featureIndex}`}
                                                >
                                                  <Nav.Link
                                                    eventKey={
                                                      feature.featureName
                                                    }
                                                  >
                                                    {feature.featureName}
                                                  </Nav.Link>
                                                </Nav.Item>
                                              )
                                            )}
                                          </Nav>
                                        </Col>
                                        <Col md={9}>
                                          <Tab.Content>
                                            <Tab.Pane
                                              eventKey="allFeatures"
                                              className={
                                                hideAllFeaturesTab
                                                  ? 'hide-tab-content'
                                                  : ''
                                              }
                                            >
                                              <Card.Body className="py-0 px-0">
                                                <Table
                                                  responsive
                                                  className="feat-table"
                                                >
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
                                                      subscriptionData.data
                                                        ?.filter(
                                                          (subscription) => {
                                                            return subscription.subscriptionFeaturesCycles.some(
                                                              (cycle) =>
                                                                cycle.subscriptionCycleId ===
                                                                subscriptionData.currentSubscriptionCycleId
                                                            )
                                                          }
                                                        )
                                                        .map(
                                                          (
                                                            subscription,
                                                            index
                                                          ) => (
                                                            <tr
                                                              key={`subscription-${index}`}
                                                            >
                                                              <td>
                                                                {
                                                                  subscription.featureName
                                                                }
                                                              </td>
                                                              <td>
                                                                {
                                                                  subscription.featureReset
                                                                }
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
                                            </Tab.Pane>
                                            {subscriptionData.data?.map(
                                              (feature, featureIndex) => (
                                                <Tab.Pane
                                                  key={`feature-${featureIndex}`}
                                                  eventKey={feature.featureName}
                                                >
                                                  <Card.Body className="py-0 px-0">
                                                    <div
                                                      style={{
                                                        maxWidth: '100%',
                                                        overflowX: 'auto',
                                                      }}
                                                      className="table-container"
                                                    >
                                                      <Table
                                                        responsive
                                                        className="feat-table"
                                                      >
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
                                                              <FormattedMessage id="usage" />
                                                            </th>
                                                            <th>
                                                              <FormattedMessage id="Remind/Limit" />
                                                            </th>
                                                          </tr>
                                                        </thead>
                                                        <tbody>
                                                          {feature.subscriptionFeaturesCycles
                                                            ?.filter(
                                                              (cycle) =>
                                                                cycle.subscriptionCycleId ===
                                                                cyc.subscriptionCycleId
                                                            )
                                                            .map(
                                                              (
                                                                cycle,
                                                                cycleIndex
                                                              ) => (
                                                                <tr
                                                                  key={`cycle-${cycleIndex}`}
                                                                >
                                                                  <td>
                                                                    {
                                                                      cycle.featureName
                                                                    }
                                                                  </td>
                                                                  <td>
                                                                    <FormattedMessage
                                                                      id={
                                                                        featureResetMap[
                                                                          cycle
                                                                            .reset
                                                                        ]
                                                                      }
                                                                    />
                                                                  </td>
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
                                                                  <td>
                                                                    {
                                                                      cycle.usage
                                                                    }
                                                                  </td>
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
                                                    </div>
                                                  </Card.Body>
                                                </Tab.Pane>
                                              )
                                            )}
                                          </Tab.Content>
                                        </Col>
                                      </Row>
                                    </Container>
                                  </Tab.Container>
                                </div>
                              </Col>
                            </Row>
                          </Container>
                        </Card.Body>
                      </Card>
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
