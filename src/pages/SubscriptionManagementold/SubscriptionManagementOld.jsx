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
  OverlayTrigger,
  Tooltip,
} from '@themesberg/react-bootstrap'
import { cycle, featureResetMap, featureUnitMap } from '../../const'
import { useDispatch, useSelector } from 'react-redux'
import { FormattedMessage, useIntl } from 'react-intl'
import { DataTransform, formatDate } from '../../lib/sharedFun/Time'
import { Wrapper } from './SubscriptionManagement.styled'
import DateLabel from '../../components/custom/Shared/DateLabel/DateLabel'
import { TabPanel, TabView } from 'primereact/tabview'
import DynamicButtons from '../../components/custom/Shared/DynamicButtons/DynamicButtons'
import { MdOutlineAutorenew } from 'react-icons/md'
import { useParams } from 'react-router-dom'
import {
  BsArrowCounterclockwise,
  BsDownload,
  BsFillPersonLinesFill,
  BsFillQuestionCircleFill,
  BsUpload,
} from 'react-icons/bs'
import BreadcrumbComponent from '../../components/custom/Shared/Breadcrumb/Breadcrumb'
import UpperContent from '../../components/custom/Shared/UpperContent/UpperContent'
import { useEffect } from 'react'
import useRequest from '../../axios/apis/useRequest'
import { subscriptionData, tenantInfo } from '../../store/slices/tenants'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faArrowRotateBackward,
  faToggleOff,
  faToggleOn,
} from '@fortawesome/free-solid-svg-icons'
import NoteInputConfirmation from '../../components/custom/Shared/NoteInputConfirmation/NoteInputConfirmation'
import RenewForm from '../../components/custom/tenant/SubscriptionManagement/RenewForm/RenewForm'
import ThemeDialog from '../../components/custom/Shared/ThemeDialog/ThemeDialog'
import {
  fetchSubscriptionDetails,
  fetchSubscriptionFeatures,
} from '../../components/custom/tenant/SubscriptionManagement/fetchSubscriptionDetails/fetchSubscriptionDetails'
import Label from '../../components/custom/Shared/label/Label'
import {
  PlanChangingType,
  SubscriptionPlanChangeStatus,
  SubscriptionResetStatus,
} from '../../const/subscriptionManagement'

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
    subscriptionDetailsLimitReset,
    subscriptionDetailsResetSub,
    cancelAutoRenewal,
    subscriptionFeturesList,
  } = useRequest()
  const [currentProduct, setCurrentProduct] = useState('')
  const [currentTab, setCurrentTab] = useState(0)
  const [currentTabFeatures, setCurrentTabFeatures] = useState(0)
  const intl = useIntl()

  const handleTabChange = (index) => {
    setCurrentTab(index)
  }
  const handleFeatureTabChange = (index) => {
    setCurrentTabFeatures(index)
  }
  const [showResetConfirmation, setShowResetConfirmation] = useState(false)
  const [update, setUpdate] = useState(0)
  const [visible, setVisible] = useState(false)
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
  const hasSubsFeatsLimitsResettable =
    subscriptionDatas?.hasSubscriptionFeaturesLimitsResettable
  const handleResetLimit = () => {
    hasSubsFeatsLimitsResettable && setShowResetConfirmation(true)
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
  const ResettableAllowed =
    subscriptionDatas?.subscriptionReset?.isResettableAllowed
  const handleResetSubscription = () => {
    ResettableAllowed && setShowResetSubscriptionConfirmation(true)
  }
  const handleResetSubscriptionConfirmation = async (data = '', comment) => {
    await subscriptionDetailsResetSub({
      tenantId: routeParams.id,
      productId: currentProduct,
      comment,
    })
    setUpdate(update + 1)

    setShowResetSubscriptionConfirmation(false)
  }
  const [formattedSubscriptionData, setFormattedSubscriptionData] =
    useState(null)
  useEffect(() => {
    if (!currentProduct || !routeParams.id || subscriptionDatas) {
      return
    }
    fetchSubscriptionDetails({
      currentProduct,
      intl,
      tenantId: routeParams.id,
      setFormattedSubscriptionData,
      formattedSubscriptionData,
      subscriptionDetails,
    })
  }, [routeParams.id, currentProduct])
  useEffect(() => {
    if (!subscriptionDatas) {
      return
    }
    fetchSubscriptionFeatures({
      subscriptionId: subscriptionDatas?.subscriptionId,
      intl,
      subscriptionFeturesList,
    })
  }, [subscriptionDatas])
  useEffect(() => {
    update > 0 &&
      fetchSubscriptionDetails({
        currentProduct,
        intl,
        tenantId: routeParams.id,
        setFormattedSubscriptionData,
        formattedSubscriptionData,
        subscriptionDetails,
      })
  }, [update])
  useEffect(() => {
    if (formattedSubscriptionData) {
      dispatch(
        subscriptionData({
          id: routeParams.id,
          data: formattedSubscriptionData,
        })
      )
    }
  }, [formattedSubscriptionData])

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
              {tenantsData[routeParams.id]?.systemName}
            </h4>
            <DynamicButtons
              buttons={[
                {
                  order: 1,
                  type: 'form',
                  id: routeParams.id,
                  label: 'Upgrade-Subscription',
                  component: 'upDowngradeSubscription',
                  selectedProduct: currentProduct,
                  update,
                  setUpdate,
                  icon: <BsUpload />,
                  formType: 'upgrade',
                },
                {
                  order: 4,
                  type: 'form',
                  id: routeParams.id,
                  label: 'Downgrade-Subscription',
                  component: 'upDowngradeSubscription',
                  selectedProduct: currentProduct,
                  update,
                  setUpdate,
                  icon: <BsDownload />,
                  formType: 'downgrade',
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
                className="card "
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
                    <div className="pr-2 pl-2">
                      <div className="info-card">
                        <Card border="light" className="shadow-sm p-3">
                          <Row>
                            <Col md={6}>
                              <Card.Body className="py-0 px-0">
                                <div className="d-flex align-items-center justify-content-between border-bottom border-light py-2 ">
                                  <div className="mb-0 w-25 fw-bold">
                                    <FormattedMessage id="Product" />
                                    <span className="fw-normal ml-2">
                                      <OverlayTrigger
                                        trigger={['hover', 'focus']}
                                        overlay={
                                          <Tooltip>
                                            {intl.formatMessage({
                                              id: 'Product-Description',
                                            })}
                                          </Tooltip>
                                        }
                                      >
                                        <span>
                                          <BsFillQuestionCircleFill
                                            className={
                                              direction == 'rtl'
                                                ? 'ar-questionCircle'
                                                : ''
                                            }
                                          />
                                        </span>
                                      </OverlayTrigger>
                                    </span>
                                  </div>
                                  <div className=" card-stats">
                                    {
                                      tenantsData[routeParams.id]
                                        ?.subscriptions[0]?.productName
                                    }
                                  </div>
                                </div>
                                <div className="d-flex align-items-center justify-content-between border-bottom border-light py-2 ">
                                  <div className="mb-0 w-25 fw-bold">
                                    <FormattedMessage id="Subscription" />
                                  </div>
                                  <div className=" card-stats">
                                    ${subscriptionDatas.planPrice} /{' '}
                                    <FormattedMessage
                                      id={cycle[subscriptionDatas.planCycle]}
                                    />
                                  </div>
                                </div>
                              </Card.Body>
                            </Col>
                            <Col md={6}>
                              <Card.Body className="py-0 px-0 ">
                                <div className="d-flex align-items-center justify-content-between border-bottom border-light py-2 ">
                                  <div className="mb-0 w-25 fw-bold">
                                    <FormattedMessage id="Plan" />
                                  </div>
                                  <div className=" card-stats">
                                    {subscriptionDatas.planName}
                                  </div>
                                </div>

                                <div className="d-flex align-items-center justify-content-between border-bottom  border-light py-2 ">
                                  <div className="mb-0 w-25 fw-bold">
                                    <FormattedMessage id="Subscription-Status" />
                                  </div>
                                  <div className=" card-stats">
                                    {subscriptionDatas.subscriptionStatus
                                      ? subscriptionDatas.subscriptionStatus
                                      : ''}
                                  </div>
                                </div>
                              </Card.Body>
                            </Col>
                          </Row>

                          <Row>
                            <Col md={6}>
                              <Card.Body className="py-0 px-0">
                                <div className="d-flex align-items-center justify-content-between border-bottom border-light py-2 ">
                                  <div className="mb-0 w-25 fw-bold">
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
                                  <div className=" card-stats">
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

                                <div className="d-flex align-items-center justify-content-between  py-2  border-bottom  border-light ">
                                  <div className="mb-0 fw-bold">
                                    <FormattedMessage id="Reset-Subs" />
                                    <FontAwesomeIcon
                                      className={`${
                                        ResettableAllowed
                                          ? 'ml-3 mr-3  icon-container active-reset'
                                          : 'ml-3 mr-3  icon-container passive-reset'
                                      }`}
                                      icon={faArrowRotateBackward}
                                      onClick={handleResetSubscription}
                                    />
                                  </div>
                                  <div className=" card-stats">
                                    {subscriptionDatas.subscriptionReset
                                      .lastResetDate ||
                                    subscriptionDatas.subscriptionReset
                                      .subscriptionResetStatus ? (
                                      <div>
                                        <span>
                                          {' '}
                                          <Label
                                            {...SubscriptionResetStatus[
                                              subscriptionDatas
                                                ?.subscriptionReset
                                                .subscriptionResetStatus
                                            ]}
                                          />
                                        </span>

                                        {subscriptionDatas.subscriptionReset
                                          .lastResetDate && (
                                          <span>
                                            <FormattedMessage id="Reseted-At" />
                                            :{' '}
                                            {subscriptionDatas
                                              ?.subscriptionReset.lastResetDate
                                              ? DataTransform(
                                                  subscriptionDatas
                                                    ?.subscriptionReset
                                                    .lastResetDate
                                                )
                                              : ''}
                                          </span>
                                        )}
                                      </div>
                                    ) : (
                                      'not reset yet'
                                    )}
                                  </div>
                                </div>
                                <div className="d-flex align-items-center justify-content-between  py-2 ">
                                  <div className="mb-0 w-25 fw-bold">
                                    <FormattedMessage id="Start-Date" />
                                  </div>
                                  <div className=" card-stats">
                                    <Label
                                      {...{
                                        background: '#cccccc40',
                                        value: formatDate(
                                          subscriptionDatas.startDate
                                        ),
                                        lighter: true,
                                      }}
                                    />{' '}
                                  </div>
                                </div>
                              </Card.Body>
                            </Col>
                            <Col md={6}>
                              <Card.Body className="py-0 px-0 ">
                                <div className="d-flex align-items-center justify-content-between border-bottom border-light py-2">
                                  <div className="mb-0 fw-bold">
                                    <FormattedMessage id="Reset-Limit" />

                                    <FontAwesomeIcon
                                      className={`${
                                        hasSubsFeatsLimitsResettable
                                          ? 'ml-3 mr-3  icon-container active-reset'
                                          : 'ml-3 mr-3  icon-container passive-reset'
                                      }`}
                                      icon={faArrowRotateBackward}
                                      onClick={handleResetLimit}
                                    />
                                  </div>
                                  <div className=" card-stats">
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
                                <div className="d-flex align-items-center justify-content-between  py-2 border-bottom  border-light ">
                                  <div className="mb-0 w-25 fw-bold">
                                    {subscriptionDatas?.subscriptionPlanChange &&
                                    subscriptionDatas?.subscriptionPlanChange
                                      .type ? (
                                      <FormattedMessage
                                        id={
                                          PlanChangingType[
                                            subscriptionDatas
                                              .subscriptionPlanChange.type
                                          ]
                                        }
                                      />
                                    ) : (
                                      ''
                                    )}{' '}
                                    <FormattedMessage id="info" />
                                  </div>
                                  <div className=" card-stats">
                                    {subscriptionDatas &&
                                      subscriptionDatas.subscriptionPlanChange && (
                                        <>
                                          {subscriptionDatas
                                            .subscriptionPlanChange
                                            .SubscriptionPlanChangeStatus && (
                                            <Label
                                              {...SubscriptionPlanChangeStatus[
                                                subscriptionDatas
                                                  ?.subscriptionReset
                                                  .SubscriptionPlanChangeStatus
                                              ]}
                                            />
                                          )}
                                          <Label
                                            {...{
                                              background:
                                                'rgba(255, 201, 102, 0.4)',
                                              value: (
                                                <>
                                                  <FormattedMessage
                                                    id={
                                                      subscriptionDatas
                                                        .subscriptionPlanChange
                                                        .planDisplayName
                                                    }
                                                  />
                                                  :{' $'}
                                                  {
                                                    subscriptionDatas
                                                      ?.subscriptionPlanChange
                                                      ?.price
                                                  }
                                                  {' / '}
                                                  {
                                                    cycle[
                                                      subscriptionDatas
                                                        ?.subscriptionPlanChange
                                                        ?.cycle
                                                    ]
                                                  }
                                                </>
                                              ),
                                              color: '#5c472e',
                                            }}
                                          />
                                        </>
                                      )}
                                  </div>
                                </div>
                                <div className="d-flex align-items-center justify-content-between py-2 ">
                                  <div className="mb-0 w-25 fw-bold">
                                    <FormattedMessage id="End-Date" />
                                  </div>
                                  <div className=" card-stats">
                                    <DateLabel
                                      endDate={subscriptionDatas.endDate}
                                    />
                                  </div>
                                </div>
                              </Card.Body>
                            </Col>
                          </Row>
                        </Card>
                      </div>

                      <Row className="p-1">
                        <Col
                          className={`${
                            window.innerWidth <= 768 ? 'col-sm-12' : ''
                          }`}
                        >
                          <div>
                            <TabView
                              className="card "
                              activeIndex={currentTabFeatures}
                              onTabChange={(e) =>
                                handleFeatureTabChange(e.index)
                              }
                            >
                              <TabPanel
                                header={
                                  <FormattedMessage id="Subscription-Features" />
                                }
                                key={'subscriptionFeatures'}
                              >
                                <div className="pr-2 pl-2">
                                  <Card.Body className="py-0 px-0">
                                    <Table responsive className="feat-table">
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
                                            .map((subscription, index) => (
                                              <tr key={`subscription-${index}`}>
                                                <td>
                                                  {subscription.featureName}
                                                </td>
                                                <td>
                                                  {subscription.featureReset}
                                                </td>
                                                <td>
                                                  {' '}
                                                  {subscription.featureReset !=
                                                  'Non Resettable' ? (
                                                    <Label
                                                      {...{
                                                        background: '#cccccc40',
                                                        value: formatDate(
                                                          subscription.featureStartDate
                                                        ),
                                                        lighter: true,
                                                      }}
                                                    />
                                                  ) : (
                                                    '-'
                                                  )}
                                                </td>
                                                <td>
                                                  {subscription.featureReset !=
                                                  'Non Resettable' ? (
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
                                                  ) : (
                                                    '-'
                                                  )}
                                                </td>
                                                <td className="remind-value">
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
                                </div>
                              </TabPanel>
                              <TabPanel
                                key={'featuresHistory'}
                                header={
                                  <FormattedMessage id="Features-History" />
                                }
                              >
                                {' '}
                                <div className="pr-2 pl-2 ">
                                  {' '}
                                  <Tab.Container
                                    defaultActiveKey={
                                      subscriptionDatas.data?.[0]?.featureName
                                    }
                                  >
                                    <Row>
                                      <Col md={3}>
                                        <div className="feat-tab">
                                          <Nav
                                            fill
                                            variant="pills"
                                            className={`  flex-column vertical-tab custom-nav-link mb-3 ${
                                              window.innerWidth <= 768
                                                ? 'custom-horizontal-tab'
                                                : ''
                                            }`}
                                          >
                                            {subscriptionDatas.data?.map(
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
                                        </div>
                                      </Col>
                                      <Col md={9}>
                                        <Tab.Content>
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
                                                    <div className="feat-table">
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
                                                                    {cycle.reset !=
                                                                    1 ? (
                                                                      <Label
                                                                        {...{
                                                                          background:
                                                                            '#cccccc40',
                                                                          value:
                                                                            formatDate(
                                                                              cycle.startDate
                                                                            ),
                                                                          lighter: true,
                                                                        }}
                                                                      />
                                                                    ) : (
                                                                      '-'
                                                                    )}
                                                                  </td>
                                                                  <td>
                                                                    {cycle.reset !=
                                                                    1 ? (
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
                                                                    ) : (
                                                                      '-'
                                                                    )}
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
                              </TabPanel>
                            </TabView>
                          </div>
                        </Col>
                      </Row>
                    </div>
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
