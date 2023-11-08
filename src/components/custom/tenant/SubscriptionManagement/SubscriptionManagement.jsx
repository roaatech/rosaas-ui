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
import { DataTransform, formatDate } from '../../../../lib/sharedFun/Time'
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
import {
  BsArrowCounterclockwise,
  BsFillPersonLinesFill,
  BsUpload,
} from 'react-icons/bs'
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
import UpgradeForm from './UpgradeForm/UpgradeForm'
import RenewForm from './RenewForm/RenewForm'
import ThemeDialog from '../../Shared/ThemeDialog/ThemeDialog'
import { set } from 'lodash'

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
    console.log({ data: tenantsData[routeParams.id] })
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
    cancelAutoRenewal,
  } = useRequest()
  const [currentProduct, setCurrentProduct] = useState('')
  const [currentTab, setCurrentTab] = useState(0)
  const intl = useIntl()

  const handleTabChange = (index) => {
    setCurrentTab(index)
  }
  const [showResetConfirmation, setShowResetConfirmation] = useState(false)
  const [resetTime, setResetTime] = useState(null)
  const [update, setUpdate] = useState(0)

  const [visible, setVisible] = useState(false)
  const [subscriptionId, setSubscribtionId] = useState()
  const handleToggleClick = () => {
    if (subscriptionDatas?.autoRenewal !== null) {
      setConfirm(true)
    } else {
      setVisible(true)
    }
  }
  const handleConfirmation = async (data = '', comment) => {
    await cancelAutoRenewal({
      subscriptionId: subscriptionDatas?.subscriptionId,
      comment,
    })
    setUpdate(update + 1)
    setConfirm(false)
  }
  const handleResetLimit = () => {
    setShowResetConfirmation(true)
  }

  const handleResetConfirmation = async (data = '', comment) => {
    await subscriptionDetailsLimitReset({
      tenantId: routeParams.id,
      productId: currentProduct,
      comment,
    })
    setUpdate(update + 1)

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
    await subscriptionDetailsResetSub({
      tenantId: routeParams.id,
      productId: currentProduct,
      comment,
    })
    setUpdate(update + 1)
    const resetTimesub = new Date()
    setResetSubscriptionTime(resetTimesub)

    setShowResetSubscriptionConfirmation(false)
  }
  const [formattedSubscriptionData, setFormattedSubscriptionData] =
    useState(null)

  const fetchSubscriptionDetails = async () => {
    try {
      const response = await subscriptionDetails(currentProduct, routeParams.id)
      const formattedData = {
        data: response?.data.data?.subscriptionFeatures?.map((feature) => ({
          featureName: feature.feature.title,
          featureReset: intl.formatMessage({
            id: featureResetMap[feature.feature.reset],
          }),
          featureStartDate: feature.startDate,
          featureEndDate: feature.endDate,
          remindLimit: `${feature.remainingUsage}${
            featureUnitMap[feature.feature.unit]
          } / ${feature.feature.limit}${featureUnitMap[feature.feature.unit]} `,
          subscriptionFeaturesCycles: feature.subscriptionFeaturesCycles.map(
            (cycle) => ({
              subscriptionCycleId: cycle.subscriptionCycleId,
              featureName: cycle.feature.title ? cycle.feature.title : ' ',
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
            plan: cycle.plan.title,
            price: cycle.price,
            cycle: cycle.cycle,
          })
        ),
        planName: response.data.data.plan.title,
        startDate: response.data.data.startDate,
        endDate: response.data.data.endDate,
        currentSubscriptionCycleId:
          response.data.data.currentSubscriptionCycleId,
        lastResetDate: response.data.data.lastResetDate,
        planId: response.data.data.plan.id,
        subscriptionId: response.data.data.subscriptionId,
        lastLimitsResetDate: response.data.data.lastLimitsResetDate,
        autoRenewal: response.data.data.autoRenewal,
      }
      setFormattedSubscriptionData(formattedData)

      console.log({ formattedSubscriptionData })
      return formattedSubscriptionData
    } catch (error) {
      console.error('Error fetching subscription details:', error)
    }
  }
  useEffect(() => {
    if (!currentProduct) {
      return
    }

    fetchSubscriptionDetails()
  }, [routeParams.id, currentProduct, update])
  useEffect(() => {
    if (formattedSubscriptionData) {
      dispatch(
        subscriptionData({
          id: routeParams.id,
          data: formattedSubscriptionData,
        })
      )
    }
    setSubscribtionId(subscriptionDatas?.subscriptionId)
  }, [formattedSubscriptionData])

  const [confirm, setConfirm] = useState(false)
  console.log({ subscriptionDatas })
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
                  icon: <BsArrowCounterclockwise />,
                },
                {
                  order: 4,
                  type: 'action',
                  label: 'Reset-Subs',
                  func: handleResetSubscription,
                  icon: <BsArrowCounterclockwise />,
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
                      <Card border="light" className="shadow-sm p-3">
                        <Row>
                          <Col md={6}>
                            <Card.Body className="py-0 px-0">
                              <div className="d-flex align-items-center justify-content-between border-bottom border-light py-2 ">
                                <div className="mb-0 w-25">
                                  <FormattedMessage id="Plan" />
                                </div>
                                <div className="small card-stats">
                                  {subscriptionDatas.planName}
                                </div>
                              </div>

                              <div className="d-flex align-items-center justify-content-between border-bottom border-light py-2 ">
                                <div className="mb-0 w-25">
                                  <FormattedMessage id="Subscription" />
                                </div>
                                <div className="small card-stats">
                                  ${cyc.price} /{' '}
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

                        <Row>
                          <Col md={6}>
                            <Card.Body className="py-0 px-0">
                              <div className="d-flex align-items-center justify-content-between border-bottom border-light py-2 ">
                                <div className="mb-0 w-25">
                                  <FormattedMessage id="Auto-Renewal" />{' '}
                                  <FontAwesomeIcon
                                    icon={
                                      subscriptionDatas.autoRenewal
                                        ? faToggleOn
                                        : faToggleOff
                                    }
                                    className={
                                      subscriptionDatas.autoRenewal
                                        ? 'active-toggle  ml-2'
                                        : 'passive-toggle ml-2'
                                    }
                                    onClick={handleToggleClick}
                                  />
                                </div>
                                <div className="small card-stats">
                                  {subscriptionDatas?.autoRenewal &&
                                    `$${
                                      subscriptionDatas?.autoRenewal?.price
                                    } / ${
                                      cycle[
                                        subscriptionDatas?.autoRenewal?.cycle
                                      ]
                                    }`}
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
                                  {subscriptionDatas.lastResetDate ? (
                                    <span>
                                      <FormattedMessage id="Reseted-At" />:{' '}
                                      {DataTransform(
                                        subscriptionDatas.lastResetDate
                                      )}
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
                                  {subscriptionDatas.lastLimitsResetDate ? (
                                    <span>
                                      {/* <FormattedMessage id="Reseted-At" />:{' '} */}
                                      {DataTransform(
                                        subscriptionDatas.lastLimitsResetDate
                                      )}
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
                      </Card>
                    </div>
                    <Card border="light" className="shadow-sm mt-2 table-card ">
                      <Card.Body>
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
                                                    ?.filter((subscription) => {
                                                      return subscription.subscriptionFeaturesCycles.some(
                                                        (cycle) =>
                                                          cycle.subscriptionCycleId ===
                                                          subscriptionDatas.currentSubscriptionCycleId
                                                      )
                                                    })
                                                    .map(
                                                      (subscription, index) => (
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
                                                        (cycle, cycleIndex) => (
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
                                                                    cycle.reset
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
                              </Tab.Container>
                            </div>
                          </Col>
                        </Row>
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
                    id: 'cancel-renew-message',
                  })}
                  placeholder={intl.formatMessage({ id: 'Comment' })}
                />
              )}
              {
                <ThemeDialog visible={visible} setVisible={setVisible}>
                  <RenewForm
                    popupLabel={<FormattedMessage id="Renew-Subscription" />}
                    type={'edit'}
                    tenantData={subscriptionDatas}
                    visible={visible}
                    setVisible={setVisible}
                    sideBar={false}
                    selectedProduct={currentProduct}
                    selectedPlan={subscriptionDatas?.planId}
                    currentSubscription={subscriptionDatas?.subscriptionId}
                    setUpdate={setUpdate}
                    update={update}
                  />
                </ThemeDialog>
              }
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
