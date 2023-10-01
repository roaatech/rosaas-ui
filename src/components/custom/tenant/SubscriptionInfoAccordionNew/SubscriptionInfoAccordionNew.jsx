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
// import { Col, Row, Nav, Tab } from 'react-bootstrap'
// import { CogIcon, UserCircleIcon } from '@heroicons/react/solid'

const SubscriptionInfoAccordionNew = (props) => {
  const subscriptionData = useSelector(
    (state) => state.tenants.subscriptionData
  )
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
                {/* <span className={`mr-2 `}>
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
                </span> */}
              </Accordion.Button>

              <Accordion.Body>
                <Tab.Container defaultActiveKey="home">
                  <Nav
                    fill
                    variant="pills"
                    className="custom-nav-link justify-content-between"
                  >
                    <table className="year">
                      <tbody>
                        <tr>
                          <td>
                            <Nav.Item className="mb-sm-3 mb-md-0">
                              <Nav.Link eventKey="home">2021</Nav.Link>
                            </Nav.Item>
                          </td>
                          <td>
                            <Nav.Item className="mb-sm-3 mb-md-0">
                              <Nav.Link eventKey="profile">2022</Nav.Link>
                            </Nav.Item>
                          </td>
                          <td>
                            <Nav.Item className="mb-sm-3 mb-md-0">
                              <Nav.Link eventKey="messages">2023</Nav.Link>
                            </Nav.Item>
                          </td>
                        </tr>{' '}
                      </tbody>
                    </table>
                  </Nav>
                  <Tab.Content>
                    <Tab.Container defaultActiveKey="allFeatures">
                      <Row>
                        <Col lg={3}>
                          <Nav
                            fill
                            variant="pills"
                            className="flex-column vertical-tab custom-nav-link"
                          >
                            <Nav.Item>
                              <Nav.Link eventKey="allFeatures">
                                All Features
                              </Nav.Link>
                            </Nav.Item>
                            {subscriptionData.data?.map((feature, index) => (
                              <Nav.Item key={`feature-nav-${index}`}>
                                <Nav.Link eventKey={feature.featureName}>
                                  {feature.featureName}
                                </Nav.Link>
                              </Nav.Item>
                            ))}
                          </Nav>
                        </Col>
                        <Col lg={9}>
                          <Tab.Content className="content">
                            <Tab.Pane eventKey="allFeatures">
                              <Card.Body className="py-0 px-0">
                                <Table>
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
                                            <td>{subscription.featureName}</td>
                                            <td>{subscription.featureReset}</td>
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
                                            <td>
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
                            {subscriptionData.data?.map((feature, index) => (
                              <Tab.Pane
                                key={`feature-${index}`}
                                eventKey={feature.featureName}
                              >
                                <Card.Body className="py-0 px-0">
                                  <Table>
                                    <thead>
                                      <tr>
                                        {/* <th>
                                          <FormattedMessage id="Feature" />
                                        </th> */}
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
                                      <tr>
                                        {/* <td>{feature.featureName}</td> */}
                                        <td>{feature.featureReset}</td>
                                        <td>
                                          <DateLabelWhite
                                            text={formatDate(
                                              feature.featureStartDate
                                            )}
                                          />
                                        </td>
                                        <td>
                                          <DateLabel
                                            endDate={
                                              feature.featureEndDate
                                                ? formatDate(
                                                    feature.featureEndDate
                                                  )
                                                : formatDate(
                                                    subscriptionData.endDate
                                                  )
                                            }
                                          />
                                        </td>
                                        <td>{feature.remindLimit || '-'}</td>
                                      </tr>
                                    </tbody>
                                  </Table>
                                </Card.Body>
                              </Tab.Pane>
                            ))}
                          </Tab.Content>
                        </Col>
                      </Row>
                    </Tab.Container>
                  </Tab.Content>
                </Tab.Container>
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
        )}
      </Wrapper>
    </>
  )
}

export default SubscriptionInfoAccordionNew
