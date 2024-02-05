import React, { useState } from 'react'
import { Card, Row, Nav, Tab, Col, Table } from '@themesberg/react-bootstrap'
import { cycle, featureResetMap, featureUnitMap } from '../../const'
import { useDispatch, useSelector } from 'react-redux'
import { FormattedMessage, useIntl } from 'react-intl'
import { DataTransform, formatDate } from '../../lib/sharedFun/Time'
import { Wrapper } from './SubscriptionManagement.styled'
import DateLabel from '../../components/custom/Shared/DateLabel/DateLabel'
import { TabPanel, TabView } from 'primereact/tabview'
import DynamicButtons from '../../components/custom/Shared/DynamicButtons/DynamicButtons'
import {
  MdChangeCircle,
  MdOutlineAutorenew,
  MdPublishedWithChanges,
  MdTrackChanges,
} from 'react-icons/md'
import { useParams } from 'react-router-dom'
import {
  BsArrowCounterclockwise,
  BsDownload,
  BsFillPersonLinesFill,
  BsUpload,
} from 'react-icons/bs'
import BreadcrumbComponent from '../../components/custom/Shared/Breadcrumb/Breadcrumb'
import UpperContent from '../../components/custom/Shared/UpperContent/UpperContent'
import { useEffect } from 'react'
import useRequest from '../../axios/apis/useRequest'
import {
  setAllOrders,
  subscriptionData,
  tenantInfo,
} from '../../store/slices/tenants'

import NoteInputConfirmation from '../../components/custom/Shared/NoteInputConfirmation/NoteInputConfirmation'
import RenewForm from '../../components/custom/tenant/SubscriptionManagement/RenewForm/RenewForm'
import ThemeDialog from '../../components/custom/Shared/ThemeDialog/ThemeDialog'
import { fetchSubscriptionDetails } from '../../components/custom/tenant/SubscriptionManagement/fetchSubscriptionDetails/fetchSubscriptionDetails'
import Label from '../../components/custom/Shared/label/Label'

import SubsGeneralData from '../../components/custom/tenant/SubscriptionManagement/SubsGeneralData/SubsGeneralData'
import SubsFeatures from '../../components/custom/tenant/SubscriptionManagement/SubsFeatures/SubsFeatures'
import SubsFeaturesHistory from '../../components/custom/tenant/SubscriptionManagement/SubsFeaturesHistory/SubsFeaturesHistotry'
import SubsGeneralHistoryData from '../../components/custom/tenant/SubscriptionManagement/SubsGeneralHistoryData/SubsGeneralHistoryData'
import TrialLabel from '../../components/custom/tenant/TrialLabel/TrialLabel'

const SubscriptionManagement = (props) => {
  const routeParams = useParams()
  const tenantId = routeParams.id
  let direction = useSelector((state) => state.main.direction)
  const tenantsData = useSelector((state) => state.tenants.tenants)
  const lastOrderId = tenantsData?.[tenantId]?.lastOrderId

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
    getOrdersListByTenantId,
  } = useRequest()
  const [currentProduct, setCurrentProduct] = useState('')
  const [currentTab, setCurrentTab] = useState()
  const [hasResetableValue, setHasResetableValue] = useState()
  const [currentTabCycle, setCurrentTabCycle] = useState()
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

  const handleResetLimit = () => {
    hasResetableValue && setShowResetConfirmation(true)
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

  const productslist = useSelector((state) => state.products.products)
  const productDetails = currentProduct && productslist[currentProduct]
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
    if (currentTab == 0) {
      setCurrentTabCycle(subscriptionDatas?.currentSubscriptionCycleId)
    }
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
  const orderStatus = tenantsData[tenantId]?.orders?.[lastOrderId]?.orderStatus
  const isChangablePlan = [1, 2].includes(orderStatus)

  useEffect(() => {
    if (tenantsData[tenantId]?.orders) {
      return
    }
    ;(async () => {
      const orders = await getOrdersListByTenantId(tenantId)

      dispatch(
        setAllOrders({
          tenantId,
          data: orders.data.data,
        })
      )
    })()
  }, [tenantId])

  const [confirm, setConfirm] = useState(false)
  return (
    <Wrapper direction={direction}>
      {subscriptionDatas && (
        <BreadcrumbComponent
          breadcrumbInfo={'TenantManagement'}
          icon={BsFillPersonLinesFill}
          data={{ name: tenantsData[routeParams.id]?.displayName }}
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
                isChangablePlan
                  ? {
                      order: 1,
                      type: 'form',
                      id: routeParams.id,
                      label: 'Change-Plan',
                      component: 'upDowngradeSubscription',
                      selectedProduct: currentProduct,
                      update,
                      setUpdate,
                      icon: <MdChangeCircle />,
                      formType: 'changeOrderPlan',
                      currentOrderId: lastOrderId,
                    }
                  : {
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
                      disable: !subscriptionData?.isPlanChangeAllowed,
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
                  disable: !subscriptionData?.isPlanChangeAllowed,
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
                  disable: !hasResetableValue,
                },
                {
                  order: 4,
                  type: 'action',
                  label: 'Reset-Subs',
                  func: handleResetSubscription,
                  icon: <BsArrowCounterclockwise />,
                  disable: !ResettableAllowed,
                },
              ]}
            />
          </UpperContent>

          {subscriptionDatas.startDate && (
            <div>
              <TabView
                activeIndex={
                  currentTab >= 0
                    ? currentTab
                    : handleTabChange(
                        subscriptionDatas.subscriptionCycles.findIndex(
                          (cyc) =>
                            subscriptionDatas.currentSubscriptionCycleId ===
                            cyc.subscriptionCycleId
                        )
                      )
                }
                className="card "
                onTabChange={(e) => {
                  setCurrentTabCycle(
                    subscriptionDatas?.subscriptionCycles[e.index]
                      ?.subscriptionCycleId
                  )
                  handleTabChange(e.index)
                }}
              >
                {subscriptionDatas?.subscriptionCycles?.map((cyc, index) => (
                  <TabPanel
                    key={cyc?.subscriptionCycleId}
                    header={
                      subscriptionDatas?.currentSubscriptionCycleId ===
                      cyc?.subscriptionCycleId ? (
                        <div className="tab-header">
                          {formatDate(cyc.startDate)}
                          {` (${intl.formatMessage({ id: 'Current' })})`}
                          {cyc.cycleType == 2 && <TrialLabel />}
                        </div>
                      ) : (
                        <div className="tab-header">
                          {cyc.cycleType == 2 ? (
                            <FormattedMessage id="Trial" />
                          ) : (
                            formatDate(cyc.startDate)
                          )}
                        </div>
                      )
                    }
                  >
                    <div className="pr-2 pl-2">
                      {subscriptionDatas?.currentSubscriptionCycleId ===
                      cyc?.subscriptionCycleId ? (
                        <SubsGeneralData
                          cyc={cyc}
                          tenantsData={tenantsData}
                          handleToggleClick={handleToggleClick}
                          ResettableAllowed={ResettableAllowed}
                          handleResetSubscription={handleResetSubscription}
                          handleResetLimit={handleResetLimit}
                          currentTabCycle={currentTabCycle}
                          hasResetableValue={hasResetableValue}
                          isTrial={cyc.cycleType == 2}
                        />
                      ) : (
                        <SubsGeneralHistoryData
                          tenantsData={tenantsData}
                          handleToggleClick={handleToggleClick}
                          ResettableAllowed={ResettableAllowed}
                          handleResetSubscription={handleResetSubscription}
                          handleResetLimit={handleResetLimit}
                          isTrial={cyc.cycleType == 2}
                        />
                      )}

                      <Row className="p-1">
                        <Col
                          className={`${
                            window.innerWidth <= 768 ? 'col-sm-12' : ''
                          }`}
                        >
                          <div>
                            <TabView
                              className="card "
                              activeIndex={
                                subscriptionDatas?.currentSubscriptionCycleId ===
                                cyc?.subscriptionCycleId
                                  ? currentTabFeatures
                                  : 1
                              }
                              onTabChange={(e) =>
                                handleFeatureTabChange(e.index)
                              }
                            >
                              {subscriptionDatas?.currentSubscriptionCycleId ===
                                cyc?.subscriptionCycleId && (
                                <TabPanel
                                  header={
                                    <FormattedMessage id="Subscription-Features" />
                                  }
                                  key={'subscriptionFeatures'}
                                >
                                  <SubsFeatures
                                    subscriptionId={
                                      subscriptionDatas?.subscriptionId
                                    }
                                    update={update}
                                    setHasResetableValue={setHasResetableValue}
                                  />
                                </TabPanel>
                              )}
                              <TabPanel
                                key={'featuresHistory'}
                                header={
                                  <FormattedMessage id="Features-History" />
                                }
                              >
                                <SubsFeaturesHistory
                                  subscriptionId={
                                    subscriptionDatas?.subscriptionId
                                  }
                                  currentTabFeatures={currentTabFeatures}
                                  currentTabCycle={currentTabCycle}
                                  update={update}
                                />{' '}
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
