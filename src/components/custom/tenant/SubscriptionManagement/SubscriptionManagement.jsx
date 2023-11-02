import React, { useState } from 'react'
import {
  Card,
  TableCol,
  Row,
  Nav,
  Tab,
  Col,
  Table,
  Container,
} from '@themesberg/react-bootstrap'
import { cycle, featureResetMap, featureUnitMap } from '../../../../const'
import { useDispatch, useSelector } from 'react-redux'
import { FormattedMessage, useIntl } from 'react-intl'
import { formatDate } from '../../../../lib/sharedFun/Time'
import { Wrapper } from './SubscriptionManagement.styled'
import Label from '../../Shared/label/Label'
import DateLabel from '../../Shared/DateLabel/DateLabel'
import DateLabelWhite from '../../Shared/DateLabelWhite/DateLabelWhite'
import { TabPanel, TabView } from 'primereact/tabview'
import DynamicButtons from '../../Shared/DynamicButtons/DynamicButtons'
import { AiFillEdit } from 'react-icons/ai'
import {
  MdAutorenew,
  MdFactCheck,
  MdFiberNew,
  MdLockReset,
  MdNetworkCheck,
  MdOutlineAutorenew,
} from 'react-icons/md'
import { useParams } from 'react-router-dom'
import { BsFillPersonLinesFill, BsUpload } from 'react-icons/bs'
import BreadcrumbComponent from '../../Shared/Breadcrumb/Breadcrumb'
import UpperContent from '../../Shared/UpperContent/UpperContent'
import { useEffect } from 'react'
import useRequest from '../../../../axios/apis/useRequest'
import { subscriptionData, tenantInfo } from '../../../../store/slices/tenants'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faArrowCircleDown,
  faArrowRotateBackward,
  faRefresh,
  faToggleOff,
  faToggleOn,
} from '@fortawesome/free-solid-svg-icons'
import NoteInputConfirmation from '../../Shared/NoteInputConfirmation/NoteInputConfirmation'
import { GiReturnArrow } from 'react-icons/gi'

const SubscriptionManagement = (props) => {
  const routeParams = useParams()
  let direction = useSelector((state) => state.main.direction)
  const tenantsData = useSelector((state) => state.tenants.tenants)
  useEffect(() => {
    ;(async () => {
      if (!tenantsData[routeParams.id]?.subscriptions[0]) {
        const tenantData = await getTenant(routeParams.id)
        dispatch(tenantInfo(tenantData.data.data))
      }
    })()
  }, [routeParams.id])
  useEffect(() => {
    setCurrentProduct(tenantsData[routeParams.id]?.subscriptions[0]?.productId)
  }, [tenantsData])

  const subscriptionDatas = useSelector(
    (state) => state.tenants.tenants[routeParams.id]?.subscriptionData?.data
  )
  const dispatch = useDispatch()
  const {
    getTenant,
    subscriptionDetails,
    subscriptionDetailsRenew,
    subscriptionDetailsLimitReset,
    subscriptionDetailsResetSub,
  } = useRequest()
  const [currentProduct, setCurrentProduct] = useState('')
  const [currentTab, setCurrentTab] = useState(0)
  const intl = useIntl()

  const handleTabChange = (index) => {
    setCurrentTab(index)
  }
  const [showResetConfirmation, setShowResetConfirmation] = useState(false)
  const [resetTime, setResetTime] = useState(null)

  const [autoRenewal, setAutoRenewal] = useState(false)
  const handleToggleClick = () => {
    setConfirm(true)
  }
  const handleConfirmation = async (data = '', comment) => {
    setAutoRenewal(!autoRenewal)
    await subscriptionDetailsRenew(currentProduct, routeParams.id, {
      autoRenewal: !autoRenewal,
      comment,
    })
    setConfirm(false)
  }
  const handleResetLimit = () => {
    setShowResetConfirmation(true)
  }

  const handleResetConfirmation = async (data = '', comment) => {
    const resetTime = new Date()
    setResetTime(resetTime)
    await subscriptionDetailsLimitReset(currentProduct, routeParams.id, {
      reset: true,
      comment,
    })

    setShowResetConfirmation(false)
  }
  const [
    showResetSubscriptionConfirmation,
    setShowResetSubscriptionConfirmation,
  ] = useState(false)
  const [resetSubscriptionTime, setResetSubscriptionTime] = useState(null)

  const handleResetSubscription = () => {
    setShowResetSubscriptionConfirmation(true)
  }

  const handleResetSubscriptionConfirmation = async (data = '', comment) => {
    await subscriptionDetailsResetSub(currentProduct, routeParams.id, {
      reset: true,
      comment,
    })
    const resetTimesub = new Date()
    setResetSubscriptionTime(resetTimesub)

    setShowResetSubscriptionConfirmation(false)
  }

  useEffect(() => {
    if (!currentProduct) {
      return
    }
    const fetchSubscriptionDetails = async () => {
      try {
        const response = await subscriptionDetails(
          currentProduct,
          routeParams.id
        )
        const formattedSubscriptionData = {
          data: response?.data.data?.subscriptionFeatures?.map((feature) => ({
            featureName: feature.feature.name,
            featureReset: intl.formatMessage({
              id: featureResetMap[feature.feature.reset],
            }),
            featureStartDate: feature.startDate,
            featureEndDate: feature.endDate,
            remindLimit: `${feature.remainingUsage}${
              featureUnitMap[feature.feature.unit]
            } / ${feature.feature.limit}${
              featureUnitMap[feature.feature.unit]
            } `,
            subscriptionFeaturesCycles: feature.subscriptionFeaturesCycles.map(
              (cycle) => ({
                subscriptionCycleId: cycle.subscriptionCycleId,
                featureName: cycle.feature.name ? cycle.feature.name : ' ',
                startDate: cycle.startDate,
                endDate: cycle.endDate,
                type: cycle.type,
                reset: cycle.reset,
                usage: cycle.limit - cycle.remainingUsage,
                limit: cycle.limit,
                remindLimit: `${cycle.remainingUsage}${
                  featureUnitMap[cycle.unit]
                } / ${cycle.limit}${featureUnitMap[cycle.unit]} `,
              })
            ),

            usage: feature.feature.limit - feature.remainingUsage,
          })),
          subscriptionCycles: response.data.data.subscriptionCycles.map(
            (cycle) => ({
              startDate: cycle.startDate,
              endDate: cycle.endDate,
              subscriptionCycleId: cycle.id,
              plan: cycle.plan.name,
              price: cycle.price,
              cycle: cycle.cycle,
            })
          ),
          planName: response.data.data.plan.name,
          startDate: response.data.data.startDate,
          endDate: response.data.data.endDate,
          currentSubscriptionCycleId:
            response.data.data.currentSubscriptionCycleId,
        }
        console.log({ formattedSubscriptionData })

        dispatch(
          subscriptionData({
            id: routeParams.id,
            data: formattedSubscriptionData,
          })
        )
      } catch (error) {
        console.error('Error fetching subscription details:', error)
      }
    }

    fetchSubscriptionDetails()
  }, [routeParams.id, currentProduct])

  const [confirm, setConfirm] = useState(false)

  return (
    <Wrapper direction={direction}>
      {subscriptionDatas && (
        <BreadcrumbComponent
          breadcrumbInfo={'TenantManagement'}
          icon={BsFillPersonLinesFill}
        />
      )}
      {subscriptionDatas && (
        <div className="main-container">
          <UpperContent>
            <h4 className="m-0">
              <FormattedMessage id="Subscription-Management" />:{' '}
              {tenantsData[routeParams.id]?.uniqueName}
            </h4>
            <DynamicButtons
              buttons={[
                {
                  order: 1,
                  type: 'form',
                  id: routeParams.id,
                  label: 'Upgrade-Subscription',
                  component: 'upgradeSubscription',
                  selectedProduct: currentProduct,
                  icon: <BsUpload />,
                },
                {
                  order: 4,
                  type: 'action',
                  label: 'Auto-Renewal',
                  func: handleToggleClick,
                  icon: <MdOutlineAutorenew />,
                },
                {
                  order: 4,
                  type: 'action',
                  label: 'Reset-Limit',
                  func: handleResetLimit,
                  icon: <GiReturnArrow />,
                },
                {
                  order: 4,
                  type: 'action',
                  label: 'Reset-Subs',
                  func: handleResetSubscription,
                  icon: <GiReturnArrow />,
                },
              ]}
            />
          </UpperContent>

          {subscriptionDatas.startDate && (
            <div>
              <TabView
                activeIndex={currentTab}
                className="card"
                onTabChange={(e) => handleTabChange(e.index)}
              >
                {subscriptionDatas?.subscriptionCycles?.map((cyc, index) => (
                  <TabPanel
                    key={index}
                    header={
                      subscriptionDatas?.currentSubscriptionCycleId ===
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
                              <Card.Body className="py-0 px-0">
                                <div className="d-flex align-items-center justify-content-between border-bottom border-light py-2 ">
                                  <div className="mb-0 w-25">
                                    <FormattedMessage id="Plan" />
                                  </div>
                                  <div className="small card-stats">
                                    {cyc.plan}
                                  </div>
                                </div>

                                <div className="d-flex align-items-center justify-content-between border-bottom border-light py-2 ">
                                  <div className="mb-0 w-25">
                                    <FormattedMessage id="Price" />
                                  </div>
                                  <div className="small card-stats">
                                    {cyc.price} /{' '}
                                    <FormattedMessage id={cycle[cyc.cycle]} />
                                  </div>
                                </div>
                              </Card.Body>
                            </Col>
                            <Col md={6}>
                              <Card.Body className="py-0 px-0 ">
                                <div className="d-flex align-items-center justify-content-between border-bottom border-light py-2 ">
                                  <div className="mb-0 w-25">
                                    <FormattedMessage id="Start-Date" />
                                  </div>
                                  <div className="small card-stats">
                                    {formatDate(cyc.startDate)}
                                  </div>
                                </div>
                                <div className="d-flex align-items-center justify-content-between border-bottom  border-light py-2 ">
                                  <div className="mb-0 w-25">
                                    <FormattedMessage id="End-Date" />
                                  </div>
                                  <div className="small card-stats">
                                    {formatDate(cyc.endDate)}
                                  </div>
                                </div>
                              </Card.Body>
                            </Col>
                          </Row>
                        </Container>

                        <Container>
                          <Row>
                            <Col md={6}>
                              <Card.Body className="py-0 px-0">
                                <div className="d-flex align-items-center justify-content-between border-bottom border-light py-2 ">
                                  <div className="mb-0 w-25">
                                    <FormattedMessage id="Auto-Renewal" />
                                  </div>
                                  <div className="small card-stats">
                                    <FontAwesomeIcon
                                      icon={
                                        autoRenewal ? faToggleOn : faToggleOff
                                      }
                                      className={
                                        autoRenewal
                                          ? 'active-toggle fa-lg'
                                          : 'passive-toggle fa-lg'
                                      }
                                      onClick={handleToggleClick}
                                    />
                                  </div>
                                </div>

                                <div className="d-flex align-items-center justify-content-between  py-2 ">
                                  <div className="mb-0 ">
                                    <FormattedMessage id="Reset-Subs" />
                                    <FontAwesomeIcon
                                      className="ml-3 mr-3 small icon-container"
                                      icon={faArrowRotateBackward}
                                      onClick={handleResetSubscription}
                                    />
                                  </div>
                                  <div className="small card-stats">
                                    {resetSubscriptionTime ? (
                                      <span>
                                        <FormattedMessage id="Reseted-At" />:{' '}
                                        {resetSubscriptionTime.toLocaleString()}
                                      </span>
                                    ) : (
                                      'not reset yet'
                                    )}
                                  </div>
                                </div>
                              </Card.Body>
                            </Col>
                            <Col md={6}>
                              <Card.Body className="py-0 px-0 ">
                                <div className="d-flex align-items-center justify-content-between border-bottom border-light py-2">
                                  <div className="mb-0 ">
                                    <FormattedMessage id="Reset-Limit" />

                                    <FontAwesomeIcon
                                      className="ml-3 mr-3 small  icon-container"
                                      icon={faArrowRotateBackward}
                                      onClick={handleResetLimit}
                                    />
                                  </div>
                                  <div className="small card-stats">
                                    {resetTime ? (
                                      <span>
                                        <FormattedMessage id="Reseted-At" />:{' '}
                                        {resetTime.toLocaleString()}
                                      </span>
                                    ) : (
                                      'not reset yet'
                                    )}
                                  </div>
                                </div>
                                <div className="d-flex align-items-center justify-content-between  py-2 ">
                                  <div className="mb-0 w-25">
                                    <FormattedMessage id="Upgrade-info" />
                                  </div>
                                  <div className="small card-stats"></div>
                                </div>
                              </Card.Body>
                            </Col>
                          </Row>
                        </Container>
                      </Card>
                    </div>
                    <Card border="light" className="shadow-sm mt-2 table-card ">
                      <Card.Body>
                        <Container className="p-0 m-0">
                          <Row>
                            <Col
                              className={`${
                                window.innerWidth <= 768 ? 'col-sm-12' : ''
                              }`}
                            >
                              <div>
                                <Tab.Container
                                  defaultActiveKey={
                                    currentTab === 0
                                      ? 'allFeatures'
                                      : subscriptionDatas.data?.[0]?.featureName
                                  }
                                >
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
                                          {currentTab === 0 && (
                                            <Nav.Item>
                                              <Nav.Link eventKey="allFeatures">
                                                <FormattedMessage id="All-Features" />
                                              </Nav.Link>
                                            </Nav.Item>
                                          )}
                                          {subscriptionDatas.data?.map(
                                            (feature, featureIndex) => (
                                              <Nav.Item
                                                key={`feature-nav-${featureIndex}`}
                                              >
                                                <Nav.Link
                                                  eventKey={feature.featureName}
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
                                          {currentTab === 0 && (
                                            <Tab.Pane eventKey="allFeatures">
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
                                                    {subscriptionDatas &&
                                                      subscriptionDatas.data
                                                        ?.filter(
                                                          (subscription) => {
                                                            return subscription.subscriptionFeaturesCycles.some(
                                                              (cycle) =>
                                                                cycle.subscriptionCycleId ===
                                                                subscriptionDatas.currentSubscriptionCycleId
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
                                                                          subscriptionDatas.endDate
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
                                          )}
                                          {subscriptionDatas.data?.map(
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
                                                                            subscriptionDatas.endDate
                                                                          )
                                                                    }
                                                                  />
                                                                </td>
                                                                <td>
                                                                  {cycle.usage}
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
              {confirm && (
                <NoteInputConfirmation
                  confirm={confirm}
                  setConfirm={setConfirm}
                  confirmFunction={handleConfirmation}
                  message={intl.formatMessage({
                    id: 'renew-message',
                  })}
                  placeholder={intl.formatMessage({ id: 'Comment' })}
                />
              )}
              {showResetConfirmation && (
                <NoteInputConfirmation
                  confirm={showResetConfirmation}
                  setConfirm={setShowResetConfirmation}
                  confirmFunction={handleResetConfirmation}
                  message={intl.formatMessage({
                    id: 'reset-limit-message',
                  })}
                  placeholder="Comment"
                />
              )}{' '}
              {showResetSubscriptionConfirmation && (
                <NoteInputConfirmation
                  confirm={showResetSubscriptionConfirmation}
                  setConfirm={setShowResetSubscriptionConfirmation}
                  confirmFunction={handleResetSubscriptionConfirmation}
                  message={intl.formatMessage({
                    id: 'reset-subscription-message',
                  })}
                  placeholder="Comment"
                />
              )}
            </div>
          )}
        </div>
      )}
    </Wrapper>
  )
}

export default SubscriptionManagement
