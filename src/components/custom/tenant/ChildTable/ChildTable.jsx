import React, { useEffect, useRef, useState } from 'react'

import {
  Card,
  Col,
  OverlayTrigger,
  Row,
  Table,
  Tooltip,
} from '@themesberg/react-bootstrap'
import { Wrapper } from './ChildTable.style'
import TenantStatus from '../TenantStatus/TenantStatus'
import MetaDataAccordion from '../MetaDataAccordion/MetaDataAccordion'

import Workflow from '../../Shared/Workflow/Workflow'
import { FiRefreshCw } from 'react-icons/fi'
import useRequest from '../../../../axios/apis/useRequest'
import ReactJson from 'react-json-view'

import Label from '../../Shared/label/Label'
import HealthCheckAccordion from '../HealthCheckAccordion/HealthCheckAccordion'
import { DataTransform, formatDate, Time } from '../../../../lib/sharedFun/Time'
import { FormattedMessage, useIntl } from 'react-intl'
import DynamicButtons from '../../Shared/DynamicButtons/DynamicButtons'
import { AiFillEdit } from 'react-icons/ai'
import { useNavigate, useParams } from 'react-router-dom'
import useActions from '../Actions/Actions'
import { useDispatch, useSelector } from 'react-redux'
import { setAllSpecifications } from '../../../../store/slices/products/productsSlice'
import NoteInputConfirmation from '../../Shared/NoteInputConfirmation/NoteInputConfirmation'
import { statusConst } from '../../../../const'
import {
  MdDone,
  MdFactCheck,
  MdOutlineCancel,
  MdGppBad,
  MdGppGood,
  MdGppMaybe,
  MdEmail,
  MdHistory,
  MdDataObject,
  MdList,
} from 'react-icons/md'
import DataLabelWhite from '../../Shared/DateLabelWhite/DateLabelWhite'
import DateLabel from '../../Shared/DateLabel/DateLabel'
import { Routes } from '../../../../routes'
import SafeFormatMessage from '../../Shared/SafeFormatMessage/SafeFormatMessage'
import { productOwnerInfo } from '../../../../store/slices/productsOwners'
import {
  BsFillCheckCircleFill,
  BsFillExclamationCircleFill,
  BsInfo,
  BsInfoCircle,
  BsInfoCircleFill,
} from 'react-icons/bs'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBuildingUser } from '@fortawesome/free-solid-svg-icons'
import { Panel } from 'primereact/panel'
import { Avatar } from 'primereact/avatar'
import { Menu } from 'primereact/menu'
import { Button } from 'primereact/button'
import { HealthStatus, subscriptionMode } from '../../../../const/product'
import useSharedFunctions from '../../Shared/SharedFunctions/SharedFunctions'
import { FaHeartbeat } from 'react-icons/fa'

export default function ChildTable({
  productData,
  tenantId,
  updateDetails,
  updateTenant,
  productIndex,
  tenantObject,
}) {
  console.log({ productData })

  const { getProductSpecification, getProductOwner } = useRequest()
  const dispatch = useDispatch()
  const params = useParams()
  const currentTenantId = params.id
  const currentTenantsData = useSelector(
    (state) => state.tenants.tenants?.[currentTenantId]
  )
  const subscriptionStatusValue =
    currentTenantsData.subscriptions?.[0].subscriptionStatus

  const listProducts = useSelector((state) => state.products.products)
  const { getLocalizedString } = useSharedFunctions()

  useEffect(() => {
    ;(async () => {
      if (listProducts[productData.productId]) {
        if (!listProducts[productData.productId].specifications) {
          const specifications = await getProductSpecification(
            productData.productId
          )

          dispatch(
            setAllSpecifications({
              productId: productData.productId,
              data: specifications.data.data,
            })
          )
        }
      }
    })()
  }, [productData.productId])
  const listData = useSelector((state) => state.productsOwners.productsOwners)

  useEffect(() => {
    ;(async () => {
      if (productData.productOwnerId) {
        const owner = await getProductOwner(productData.productOwnerId)
        dispatch(
          productOwnerInfo({
            id: productData.productOwnerId,
            data: owner.data.data,
          })
        )
      }
    })()
  }, [productData.productOwnerId])
  const currentPOwnerData = listData[productData.productOwnerId]
  const currentProduct = listProducts[productData.productId]
  const [maximizedPanel, setMaximizedPanel] = useState(null)

  const checkSpecificationsArray =
    (currentProduct?.specifications
      ? Object.values(currentProduct.specifications)
      : []
    ).filter(
      (spec) => spec.isPublished === true && spec.isUserEditable === true
    ).length > 0

  const { renderActions } = useActions()
  const { editTenantStatus } = useRequest()
  const [confirm, setConfirm] = useState(false)
  const [status, setStatus] = useState()

  let direction = useSelector((state) => state.main.direction)

  const chagneStatus = async (data, notes) => {
    await editTenantStatus({
      TenantId: tenantId,
      status: data?.status,
      actionType: data?.actionType,
      comment: notes,
      productId: productData.id,
    })
    updateTenant()
  }
  const statusConfirm = (status, actionType) => {
    setConfirm(true)
    setStatus({ status, actionType })
  }

  const intl = useIntl()
  const rowExpansionTemplate = (data) => {
    return (
      <div className="">
        <Card border="light" className="border-0">
          <Card.Body className="p-0">
            <ReactJson src={data} name={false} />
          </Card.Body>
        </Card>
      </div>
    )
  }

  const navigate = useNavigate()
  const handleProductClick = (productId) => {
    navigate(`${Routes.products.path}/${productId}`)
  }

  const routeParams = useParams()
  const metadata = productData?.metadata ? productData.metadata : null
  const [products, setProducts] = useState([
    {
      eventKey: 'metadata',
      title: <SafeFormatMessage id="Meta-Data" />,
      description: metadata ? rowExpansionTemplate(JSON.parse(metadata)) : null,
    },
  ])
  const [colSize, setColSize] = useState(6)
  const subscriptionButtons = []

  // Conditional button for Cancel Subscription
  if (subscriptionStatusValue !== 3) {
    subscriptionButtons.push({
      order: 4,
      type: 'form',
      label: 'Cancel-Subscription',
      component: 'subscriptionActionsForm',
      popupLabel: <SafeFormatMessage id="Cancel-Subscription" />,
      updateTenant: updateTenant,
      icon: <MdGppBad />,
      variant: 'text-danger',
      formType: 'cancel',
      separator: true,
    })
  }

  // Conditional button for Suspend Subscription
  if (subscriptionStatusValue !== 2 && subscriptionStatusValue !== 3) {
    subscriptionButtons.push({
      order: 4,
      type: 'form',
      label: 'Suspend-Subscription',
      component: 'subscriptionActionsForm',
      popupLabel: <SafeFormatMessage id="Suspend-Subscription" />,
      updateTenant: updateTenant,
      icon: <MdGppMaybe />,
      variant: 'text-warning',
      formType: 'suspend',
    })
  }

  // Conditional button for Activate Subscription
  if (subscriptionStatusValue === 2) {
    subscriptionButtons.push({
      order: 4,
      type: 'form',
      label: 'Activate-Subscription',
      component: 'subscriptionActionsForm',
      popupLabel: <SafeFormatMessage id="Activate-Subscription" />,
      updateTenant: updateTenant,
      icon: <MdGppGood />,
      variant: 'text-success',
      formType: 'activate',
    })
  }

  const subscripitonHeaderTemplate = (options) => {
    const className = `${options.className} justify-content-space-between`

    return (
      <div className={className}>
        <div className="flex align-items-center gap-2">
          <span className="font-bold">
            {' '}
            <BsInfoCircleFill className="mx-2" />
            <SafeFormatMessage id="Subscription" />
          </span>
        </div>
        <div>
          <button
            className="p-panel-header-icon p-link mr-2"
            onClick={() => {
              setMaximizedPanel(
                maximizedPanel === 'subscription' ? null : 'subscription'
              )
            }}
          >
            <span
              className={
                maximizedPanel === 'subscription'
                  ? 'pi pi-window-minimize'
                  : 'pi pi-window-maximize'
              }
            />
          </button>

          {(!maximizedPanel || maximizedPanel == 'subscription') &&
            options.togglerElement}
        </div>
      </div>
    )
  }
  const renderSubscriptionBody = () => {
    return (
      <Table
        responsive
        className="table-centered table-nowrap rounded mb-0 accordions p-0"
      >
        <tbody
          className="p-0"
          style={{ backgroundColor: 'var(--secondary-color) !important' }}
        >
          {productData.subscriptionMode === 2 && (
            <tr>
              <td className="fw-bold firstTd ">
                <SafeFormatMessage id="Subscription-Mode" />
              </td>
              <td className=" ">
                <Label
                  className="mr-2 fs-7"
                  {...{
                    background: 'var(--light-blue)',
                    value: intl.formatMessage({ id: 'Trial' }),
                    color: 'var(--blue-2)',
                  }}
                />
              </td>
            </tr>
          )}
          <tr>
            <td className="fw-bold firstTd line-cell">
              <SafeFormatMessage id="Status" />
            </td>
            <td className=" line-cell">
              <TenantStatus statusValue={productData.status} />
            </td>
          </tr>

          <tr>
            <td className="fw-bold firstTd">
              <SafeFormatMessage id="Health-Check-Url" />
            </td>
            <td className=" card p-2 m-2 ">
              <span className="mr-2 mb-1">
                <Label
                  value={
                    productData.healthCheckUrlIsOverridden ? (
                      <SafeFormatMessage id="Overridden" />
                    ) : (
                      <SafeFormatMessage id="Default" />
                    )
                  }
                />
              </span>
              <span className="mr-2 checkurl  ">
                {productData.healthCheckUrl}
              </span>
            </td>
          </tr>
          <tr>
            <td className="fw-bold firstTd">
              <SafeFormatMessage id="Last-Updated-Date" />
            </td>
            <td className="line-cell">
              {DataTransform(productData.editedDate)}
            </td>
          </tr>
          {productData.specifications.map((spec) => (
            <tr key={spec.id}>
              <td className="fw-bold firstTd">
                {spec.displayName[intl.locale] ||
                  (intl.locale === 'ar' && spec.displayName['en']) ||
                  (intl.locale === 'en' && spec.displayName['ar'])}
              </td>
              <td>{spec.value}</td>
            </tr>
          ))}
          {productData?.startDate && (
            <tr>
              <td className="firstTd fw-bold">
                <SafeFormatMessage id="Subscription-Info" />
              </td>
              <td>
                <span>
                  <DataLabelWhite text={productData.plan.systemName} />
                </span>
                {'   '}
                <SafeFormatMessage id="From" />{' '}
                <DataLabelWhite text={formatDate(productData.startDate)} />{' '}
                <SafeFormatMessage id="to" />{' '}
                <DateLabel endDate={productData.endDate} />
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    )
  }

  const subscriptionFooterTemplate = (options) => {
    const className = `${options.className} flex flex-wrap align-items-center justify-content-between gap-3`

    return (
      <div className={className}>
        <div className="flex align-items-center gap-2">
          {productData.subscriptionMode && (
            <OverlayTrigger
              trigger={['hover', 'focus']}
              overlay={
                <Tooltip>
                  <SafeFormatMessage id="Subscription-Mode" />
                </Tooltip>
              }
            >
              <span>
                <Label {...subscriptionMode[productData.subscriptionMode]} />
              </span>
            </OverlayTrigger>
          )}
          {productData.status && (
            <OverlayTrigger
              trigger={['hover', 'focus']}
              overlay={
                <Tooltip>
                  <SafeFormatMessage id="Status" />
                </Tooltip>
              }
            >
              <span>
                <TenantStatus statusValue={productData.status} />{' '}
              </span>
            </OverlayTrigger>
          )}
        </div>
        <span className="p-text-secondary">
          {productData?.plan?.systemName && (
            <OverlayTrigger
              trigger={['hover', 'focus']}
              overlay={
                <Tooltip>
                  {colSize == 6 ? (
                    <SafeFormatMessage id="Subscription-Plan" />
                  ) : (
                    <SafeFormatMessage id="Subscription-Info" />
                  )}
                </Tooltip>
              }
            >
              <span>
                <span>
                  <DataLabelWhite text={productData.plan.systemName} />
                </span>
                {'   '}
                {maximizedPanel == 'subscription' && (
                  <>
                    {' '}
                    <SafeFormatMessage id="From" />{' '}
                    <DataLabelWhite text={formatDate(productData.startDate)} />{' '}
                    <SafeFormatMessage id="to" />{' '}
                    <DateLabel endDate={productData.endDate} />
                  </>
                )}
              </span>
            </OverlayTrigger>
          )}
        </span>
      </div>
    )
  }

  /*Specification Panel */
  const specificationsHeaderTemplate = (options) => {
    const className = `${options.className} justify-content-space-between`

    return (
      <div className={className}>
        <div className="flex align-items-center gap-2">
          <span className="font-bold">
            <MdList className="mx-2 mb-1" />
            <SafeFormatMessage id="Specifications" />
          </span>
        </div>
        <div>
          <button
            className="p-panel-header-icon p-link mr-2"
            onClick={() => {
              setMaximizedPanel(
                maximizedPanel === 'specifications' ? null : 'specifications'
              )
            }}
          >
            <span
              className={
                maximizedPanel === 'specifications'
                  ? 'pi pi-window-minimize'
                  : 'pi pi-window-maximize'
              }
            />
          </button>
          {(!maximizedPanel || maximizedPanel == 'specifications') &&
            options.togglerElement}
        </div>
      </div>
    )
  }

  const specificationsFooterTemplate = (options) => {
    const className = `${options.className} flex flex-wrap align-items-center justify-content-between gap-3`

    return (
      <div className={className}>
        <div>
          {!productData.specifications ||
          productData.specifications.length === 0 ? (
            <div className="text-center ">
              <SafeFormatMessage
                id="No-Specifications-Message"
                defaultMessage="There are no specifications to view."
              />
            </div>
          ) : (
            productData.specifications.map((spec) => {
              return (
                spec.value && (
                  <OverlayTrigger
                    trigger={['hover', 'focus']}
                    overlay={
                      <Tooltip>
                        <span>{getLocalizedString(spec.displayName)}</span>
                      </Tooltip>
                    }
                  >
                    <span style={{ marginRight: '8px' }}>
                      <DataLabelWhite text={spec.value} />{' '}
                    </span>
                  </OverlayTrigger>
                )
              )
            })
          )}
        </div>
      </div>
    )
  }

  const specificationsBodyTemplate = () => {
    if (
      !productData.specifications ||
      productData.specifications.length === 0
    ) {
      return (
        <div className="text-center py-2">
          <SafeFormatMessage
            id="No-Specifications-Message"
            defaultMessage="There are no specifications to view."
          />
        </div>
      )
    }

    return (
      <Table responsive className="table-centered table-nowrap rounded mb-0">
        <tbody>
          {productData.specifications.map((spec) => (
            <tr key={spec.id}>
              <td className="fw-bold">
                {getLocalizedString(spec.displayName)}
              </td>
              <td>{spec.value}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    )
  }

  /* product owner Panel */
  const pOwnerHeaderTemplate = (options) => {
    const className = `${options.className} justify-content-space-between`

    return (
      <div className={className}>
        <div className="flex align-items-center gap-2">
          <span className="font-bold">
            {' '}
            <FontAwesomeIcon icon={faBuildingUser} className="mx-2" />
            <SafeFormatMessage id="Product-Owner" />
          </span>
        </div>
        <div>
          {/* {currentPOwnerData && ( */}
          <button
            className="p-panel-header-icon p-link mr-2"
            onClick={() => {
              setMaximizedPanel(
                maximizedPanel === 'productOwner' ? null : 'productOwner'
              )
            }}
          >
            <span
              className={
                maximizedPanel == 'productOwner'
                  ? 'pi pi-window-minimize'
                  : 'pi pi-window-maximize'
              }
            />
          </button>
          {/* )} */}
          {!maximizedPanel && options.togglerElement}
        </div>
      </div>
    )
  }

  const pOwnerFooterTemplate = (options) => {
    const className = `${options.className} flex flex-wrap align-items-center justify-content-between gap-3`

    return (
      <div className={className}>
        {!currentPOwnerData ? (
          <div className="text-center ">
            <SafeFormatMessage
              id="There-are-no-product-Owner-Data-to-view."
              defaultMessage={'There are no product Owner Data to view.'}
            />
          </div>
        ) : (
          <>
            <div className="flex align-items-center gap-2">
              <OverlayTrigger
                trigger={['hover', 'focus']}
                overlay={
                  <Tooltip>
                    <SafeFormatMessage id="System-Name" />
                  </Tooltip>
                }
              >
                <span>
                  <DataLabelWhite
                    variant={'gray'}
                    text={currentPOwnerData?.systemName}
                    style={{ fontWeight: 'bold' }}
                  />
                </span>
              </OverlayTrigger>
              <OverlayTrigger
                trigger={['hover', 'focus']}
                overlay={
                  <Tooltip>
                    <SafeFormatMessage id="Display-Name" />
                  </Tooltip>
                }
              >
                <span>
                  <Label
                    value={currentPOwnerData?.displayName}
                    color={'var(--second-color)'}
                    background={'var(--second-color-2)'}
                    hasBorder={true}
                  />{' '}
                </span>
              </OverlayTrigger>

              {/* <DataLabelWhite text={currentPOwnerData?.displayName} /> */}
            </div>
            <OverlayTrigger
              trigger={['hover', 'focus']}
              overlay={
                <Tooltip>
                  <SafeFormatMessage id="Administrator-Email" />
                </Tooltip>
              }
            >
              <span>
                {currentPOwnerData?.administrator?.email ||
                'bilal.hkmsh@gmail.com' ? (
                  <DataLabelWhite
                    text={
                      <>
                        <MdEmail className="mx-1" />
                        {currentPOwnerData?.administrator?.email ||
                          'bilal.hkmsh@gmail.com'}
                      </>
                    }
                    variant={'gray'}
                  />
                ) : (
                  '__'
                )}
              </span>
            </OverlayTrigger>
          </>
        )}
      </div>
    )
  }

  const metaDataHeaderTemplate = (options) => {
    const className = `${options.className} justify-content-space-between`

    return (
      <div className={className}>
        <div className="flex align-items-center gap-2">
          <span className="font-bold">
            <MdDataObject className="mx-2 mb-1" />
            <SafeFormatMessage id="Meta-Data" />
          </span>
        </div>
        <div>
          <button
            className="p-panel-header-icon p-link mr-2"
            onClick={() => {
              setMaximizedPanel(
                maximizedPanel === 'metaData' ? null : 'metaData'
              )
            }}
          >
            <span
              className={
                maximizedPanel === 'metaData'
                  ? 'pi pi-window-minimize'
                  : 'pi pi-window-maximize'
              }
            />
          </button>
          {(!maximizedPanel || maximizedPanel == 'metaData') &&
            options.togglerElement}
        </div>
      </div>
    )
  }
  const metaDataBodyTemplate = () => {
    return metadata ? (
      rowExpansionTemplate(JSON.parse(metadata))
    ) : (
      <div className="text-center py-2">
        <SafeFormatMessage id="There-are-no-metadata-to-view." />
      </div>
    )
  }
  const metaDataFooterTemplate = (options) => {
    const className = `${options.className} flex flex-wrap align-items-center justify-content-between gap-3`

    return (
      <div className={className}>
        {metadata ? (
          <div className="flex align-items-center gap-2">
            <OverlayTrigger
              trigger={['hover', 'focus']}
              overlay={
                <Tooltip>
                  <SafeFormatMessage
                    id="Metadata-Available"
                    defaultMessage="This item has metadata."
                  />
                </Tooltip>
              }
            >
              <span>
                <DataLabelWhite text="Metadata" variant={'gray'} />
              </span>
            </OverlayTrigger>
          </div>
        ) : (
          <div className="text-center ">
            <SafeFormatMessage
              id="No-Specifications-Message"
              defaultMessage="There are no specifications to view."
            />
          </div>
        )}
      </div>
    )
  }

  const healthCheckHeaderTemplate = (options) => {
    const className = `${options.className} justify-content-space-between`

    return (
      <div className={className}>
        <div className="flex align-items-center gap-2">
          <span className="font-bold">
            <FaHeartbeat className="mx-2 mb-1" />
            <SafeFormatMessage id="Health-Check" />
          </span>
        </div>
        <div>
          <button
            className="p-panel-header-icon p-link mr-2"
            onClick={() => {
              setMaximizedPanel(
                maximizedPanel === 'healthCheck' ? null : 'healthCheck'
              )
            }}
          >
            <span
              className={
                maximizedPanel === 'healthCheck'
                  ? 'pi pi-window-minimize'
                  : 'pi pi-window-maximize'
              }
            />
          </button>
          {(!maximizedPanel || maximizedPanel == 'healthCheck') &&
            options.togglerElement}
        </div>
      </div>
    )
  }

  const healthCheckBodyTemplate = () => {
    if (productData?.healthCheckStatus.showHealthStatus != true) {
      return (
        <div className="text-center py-2">
          <SafeFormatMessage
            id="No-health-check-status-found"
            defaultMessage="There is no health check status found."
          />
        </div>
      )
    }

    return Object.values(productData).map((item) => (
      <Card key={item.id} className="shadow-sm mt-3">
        <Card.Body>
          <div className="d-flex align-items-center justify-content-between">
            <span className="fw-bold">
              <SafeFormatMessage id="Health-Check-Status" />
            </span>
            <Label {...HealthStatus[item?.healthCheckStatus?.isHealthy]} />
          </div>

          <div className="d-flex align-items-center justify-content-between mt-2">
            <div className="mb-0 w-25">
              <SafeFormatMessage id="Status" />
            </div>
            <div className="small card-stats">
              {item?.healthCheckStatus?.isHealthy ? (
                <span>
                  <OverlayTrigger
                    trigger={['hover', 'focus']}
                    overlay={
                      <Tooltip>
                        {DataTransform(item.healthCheckStatus.lastCheckDate)}
                      </Tooltip>
                    }
                  >
                    <span>
                      {Time(
                        item.healthCheckStatus.lastCheckDate,
                        intl.formatMessage({ id: 'Last-checked' })
                      )}
                    </span>
                  </OverlayTrigger>
                </span>
              ) : (
                <span>
                  <OverlayTrigger
                    trigger={['hover', 'focus']}
                    overlay={
                      <Tooltip>
                        <SafeFormatMessage id="Since" />{' '}
                        {DataTransform(item.healthCheckStatus.checkDate)},
                        <SafeFormatMessage id="last-checked" />{' '}
                        {DataTransform(item.healthCheckStatus.lastCheckDate)}
                      </Tooltip>
                    }
                  >
                    <span className="date">
                      {Time(
                        item.healthCheckStatus.checkDate,
                        intl.formatMessage({ id: 'Since' })
                      )}
                      ,
                      {Time(
                        item.healthCheckStatus.lastCheckDate,
                        intl.formatMessage({ id: 'last-checked' })
                      )}
                    </span>
                  </OverlayTrigger>
                </span>
              )}
            </div>
          </div>

          <div className="mt-3">
            <SafeFormatMessage id="Checks-Count" />:{' '}
            {item.healthCheckStatus.healthyCount}
            <Label
              background="var(--green2)"
              value={item.healthCheckStatus.healthyCount}
              color="var(--teal-green)"
              icon={<BsFillCheckCircleFill />}
            />
            {item.healthCheckStatus.unhealthyCount > 0 && (
              <>
                <Label
                  background="var(--red2)"
                  value={item.healthCheckStatus.unhealthyCount}
                  color="var(--red)"
                  icon={<BsFillExclamationCircleFill />}
                />
              </>
            )}
          </div>

          <div className="mt-2">
            <SafeFormatMessage id="Url" />:{' '}
            {item.healthCheckStatus.healthCheckUrl}
          </div>
          <div className="mt-2">
            <SafeFormatMessage id="Duration" />:{' '}
            {item.healthCheckStatus.duration}
          </div>

          {item?.healthCheckStatus?.isHealthy === false &&
            item.healthCheckStatus?.externalSystemDispatch && (
              <Card border="light" className="shadow-sm mt-3">
                <Card.Body>
                  <h6>
                    <SafeFormatMessage id="External-System-Dispatch" />
                  </h6>
                  <div className="d-flex align-items-center justify-content-between">
                    <div>
                      <SafeFormatMessage id="Is-Successful" />:{' '}
                      {item.healthCheckStatus?.externalSystemDispatch?.isSuccessful.toString()}
                    </div>
                    <div>
                      <SafeFormatMessage id="Url" />:{' '}
                      {item.healthCheckStatus?.externalSystemDispatch?.url}
                    </div>
                  </div>
                  <div className="mt-2">
                    <SafeFormatMessage id="Dispatch-Date" />:{' '}
                    {Time(
                      item.healthCheckStatus?.externalSystemDispatch
                        ?.dispatchDate,
                      intl.formatMessage({ id: 'Last-checked' })
                    )}
                  </div>
                </Card.Body>
              </Card>
            )}
        </Card.Body>
      </Card>
    ))
  }
  const healthCheckFooterTamplate = (options) => {
    const className = `${options.className} flex flex-wrap align-items-center justify-content-between gap-3`

    return (
      <div className={className}>
        {productData?.healthCheckStatus.showHealthStatus != true ? (
          <div className="text-center ">
            <SafeFormatMessage
              id="No-health-check-status-found"
              defaultMessage="There is no health check status found."
            />
          </div>
        ) : (
          productData &&
          Object.values(productData).map((item) => (
            <OverlayTrigger
              trigger={['hover', 'focus']}
              overlay={
                <Tooltip>
                  <SafeFormatMessage id="Health-Check-Status" />{' '}
                </Tooltip>
              }
            >
              <span>
                <Label {...HealthStatus[item?.healthCheckStatus?.isHealthy]} />
              </span>
            </OverlayTrigger>
          ))
        )}
      </div>
    )
  }

  return (
    <Wrapper direction={direction}>
      <div className="dynamicButtons">
        <DynamicButtons
          buttons={
            productData.actions && productData.actions[0]?.status != 13
              ? [
                  {
                    order: 1,
                    type: 'form',
                    id: routeParams.id,
                    label: 'Edit-Specification',
                    component: 'editTenantSpecification',
                    updateTenant: updateTenant,
                    selectedProduct: productData.productId,
                    disable: !checkSpecificationsArray,
                    icon: <AiFillEdit />,
                  },
                  ...renderActions(
                    tenantObject,
                    productData.actions,
                    chagneStatus,
                    statusConfirm
                  ),
                  // Ensure the condition returns an object or nothing
                  ...(currentTenantsData.subscriptions?.[0].status != 11 &&
                  currentTenantsData.subscriptions?.[0].status != 12 &&
                  currentTenantsData.subscriptions?.[0].status != 13
                    ? [...subscriptionButtons]
                    : []),
                  {
                    order: 5, // Adjusted order to avoid duplication
                    type: 'action',
                    label: 'Subscription-Management',
                    func: () => {
                      navigate(
                        `${Routes.Tenant.path}/${routeParams?.id}/Subscription-Management`
                      )
                    },
                    icon: <MdFactCheck />,
                    separator: true,
                  },
                ]
              : renderActions(
                  tenantObject,
                  productData.actions,
                  chagneStatus,
                  statusConfirm
                )
          }
        />
      </div>
      <div className="content-container">
        <div className="content-details">
          <Row>
            {/* maximized Panel */}
            {maximizedPanel === 'subscription' && (
              <Col md={12} className="my-2">
                <Panel
                  headerTemplate={subscripitonHeaderTemplate}
                  footerTemplate={subscriptionFooterTemplate}
                  // collapsed={true}
                  toggleable
                >
                  {renderSubscriptionBody()}
                </Panel>
              </Col>
            )}
            {maximizedPanel === 'specifications' && (
              <Col md={12} className="my-2">
                <Panel
                  headerTemplate={specificationsHeaderTemplate}
                  footerTemplate={specificationsFooterTemplate}
                  // collapsed={true}
                  toggleable
                >
                  {specificationsBodyTemplate()}
                </Panel>
              </Col>
            )}
            {maximizedPanel === 'metaData' && (
              <Col md={12} className="my-2">
                <Panel
                  headerTemplate={metaDataHeaderTemplate}
                  footerTemplate={metaDataFooterTemplate}
                  // collapsed={true}
                  toggleable
                >
                  {metaDataBodyTemplate()}
                </Panel>
              </Col>
            )}
            {maximizedPanel === 'healthCheck' && (
              <Col md={12} className="my-2">
                <Panel
                  headerTemplate={healthCheckHeaderTemplate}
                  footerTemplate={healthCheckFooterTamplate}
                  // collapsed={true}
                  toggleable
                >
                  {healthCheckBodyTemplate()}
                </Panel>
              </Col>
            )}
            {maximizedPanel === 'productOwner' && (
              <Col md={12} className="my-2">
                <Panel
                  headerTemplate={pOwnerHeaderTemplate}
                  footerTemplate={pOwnerFooterTemplate}
                  // collapsed={true}
                  toggleable
                >
                  {currentPOwnerData ? (
                    <Table
                      responsive
                      className="table-centered table-nowrap rounded mb-0 accordions "
                    >
                      <tbody>
                        <tr>
                          <td className="firstTd fw-bold">
                            <SafeFormatMessage id="System-Name" />
                          </td>
                          <td>{currentPOwnerData?.systemName}</td>
                        </tr>
                        <tr>
                          <td className="firstTd fw-bold">
                            <SafeFormatMessage id="Display-Name" />
                          </td>
                          <td>{currentPOwnerData?.displayName}</td>
                        </tr>
                        <tr>
                          <td className="firstTd fw-bold">
                            <SafeFormatMessage id="Products" />
                          </td>
                          <td>
                            {currentPOwnerData.products &&
                              Object.values(currentPOwnerData.products).length >
                                0 && (
                                <div className="d-flex flex-wrap">
                                  {' '}
                                  {Object.values(
                                    currentPOwnerData.products
                                  ).map((product) => (
                                    <span
                                      className="mx-1 my-1"
                                      key={product.id} // Use a unique id from the product
                                      onClick={() =>
                                        handleProductClick(product.id)
                                      }
                                      style={{ cursor: 'pointer' }}
                                    >
                                      <DataLabelWhite
                                        text={product.systemName}
                                      />
                                    </span>
                                  ))}
                                </div>
                              )}
                          </td>
                        </tr>
                        <tr>
                          <td className="firstTd fw-bold">
                            <SafeFormatMessage id="Created-Date" />
                          </td>
                          <td>
                            {DataTransform(currentPOwnerData.createdDate)}
                          </td>
                        </tr>
                        <tr>
                          <td className="firstTd fw-bold">
                            <SafeFormatMessage id="Last-Updated-Date" />
                          </td>
                          <td>{DataTransform(currentPOwnerData.editedDate)}</td>
                        </tr>
                      </tbody>
                    </Table>
                  ) : (
                    <div className="text-center ">
                      <SafeFormatMessage
                        id="There-are-no-product-Owner-Data-to-view."
                        defaultMessage={
                          'There are no product Owner Data to view.'
                        }
                      />
                    </div>
                  )}
                </Panel>
              </Col>
            )}

            {/* Minimized Panel */}
            {maximizedPanel !== 'subscription' && (
              <Col md={maximizedPanel ? 3 : 6} className="my-2">
                <Panel
                  headerTemplate={subscripitonHeaderTemplate}
                  footerTemplate={!maximizedPanel && subscriptionFooterTemplate}
                  collapsed={true}
                  toggleable
                >
                  {renderSubscriptionBody()}
                </Panel>
              </Col>
            )}
            {maximizedPanel !== 'specifications' && (
              <Col md={maximizedPanel ? 3 : 6} className="my-2">
                <Panel
                  headerTemplate={specificationsHeaderTemplate}
                  footerTemplate={
                    !maximizedPanel && specificationsFooterTemplate
                  }
                  collapsed={true}
                  toggleable
                >
                  {specificationsBodyTemplate()}
                </Panel>
              </Col>
            )}
            {maximizedPanel !== 'metaData' && (
              <Col md={maximizedPanel ? 3 : 6} className="my-2">
                <Panel
                  headerTemplate={metaDataHeaderTemplate}
                  footerTemplate={!maximizedPanel && metaDataFooterTemplate}
                  collapsed={true}
                  toggleable
                >
                  {metaDataBodyTemplate()}
                </Panel>
              </Col>
            )}
            {maximizedPanel !== 'healthCheck' && (
              <Col md={maximizedPanel ? 3 : 6} className="my-2  ">
                <Panel
                  headerTemplate={healthCheckHeaderTemplate}
                  footerTemplate={!maximizedPanel && healthCheckFooterTamplate}
                  collapsed={true}
                  toggleable
                >
                  {healthCheckBodyTemplate()}
                </Panel>
              </Col>
            )}

            {maximizedPanel != 'productOwner' && (
              <Col md={maximizedPanel ? 3 : 6} className="my-2">
                <Panel
                  headerTemplate={pOwnerHeaderTemplate}
                  footerTemplate={!maximizedPanel && pOwnerFooterTemplate}
                  collapsed={true}
                  toggleable
                >
                  {currentPOwnerData ? (
                    <Table
                      responsive
                      className="table-centered table-nowrap rounded mb-0 accordions "
                    >
                      <tbody>
                        <tr>
                          <td className="firstTd fw-bold">
                            <SafeFormatMessage id="System-Name" />
                          </td>
                          <td>{currentPOwnerData?.systemName}</td>
                        </tr>
                        <tr>
                          <td className="firstTd fw-bold">
                            <SafeFormatMessage id="Display-Name" />
                          </td>
                          <td>{currentPOwnerData?.displayName}</td>
                        </tr>
                        <tr>
                          <td className="firstTd fw-bold">
                            <SafeFormatMessage id="Products" />
                          </td>
                          <td>
                            {currentPOwnerData.products &&
                              Object.values(currentPOwnerData.products).length >
                                0 && (
                                <div className="d-flex flex-wrap">
                                  {' '}
                                  {Object.values(
                                    currentPOwnerData.products
                                  ).map((product) => (
                                    <span
                                      className="mx-1 my-1"
                                      key={product.id} // Use a unique id from the product
                                      onClick={() =>
                                        handleProductClick(product.id)
                                      }
                                      style={{ cursor: 'pointer' }}
                                    >
                                      <DataLabelWhite
                                        text={product.systemName}
                                      />
                                    </span>
                                  ))}
                                </div>
                              )}
                          </td>
                        </tr>
                        <tr>
                          <td className="firstTd fw-bold">
                            <SafeFormatMessage id="Created-Date" />
                          </td>
                          <td>
                            {DataTransform(currentPOwnerData.createdDate)}
                          </td>
                        </tr>
                        <tr>
                          <td className="firstTd fw-bold">
                            <SafeFormatMessage id="Last-Updated-Date" />
                          </td>
                          <td>{DataTransform(currentPOwnerData.editedDate)}</td>
                        </tr>
                      </tbody>
                    </Table>
                  ) : (
                    <div className="text-center ">
                      <SafeFormatMessage
                        id="There-are-no-product-Owner-Data-to-view."
                        defaultMessage={
                          'There are no product Owner Data to view.'
                        }
                      />
                    </div>
                  )}
                </Panel>
              </Col>
            )}
          </Row>
        </div>
        <div className="content timeLine">
          <Card className="shadow-sm mt-2 ml-2">
            <Card.Header
              style={{ padding: '0.75rem 1.25rem' }}
              className="fs-6"
            >
              <span>
                <MdHistory className="mx-2" />
                <SafeFormatMessage id="History" />
              </span>
              {productData?.status != 13 ? (
                <div className="refresh">
                  <Button
                    onClick={() => {
                      updateTenant()
                    }}
                    type="button"
                    label={<FiRefreshCw />}
                    style={{
                      backgroundColor: 'var(--primary5)',
                      borderColor: 'var(--primary5)',
                    }}
                  />
                </div>
              ) : null}
            </Card.Header>
            <Card.Body className="pb-0">
              <Workflow
                productId={productData && productData?.product?.id}
                updateDetails={updateDetails}
                productIndex={productIndex}
              />
            </Card.Body>
          </Card>
        </div>
        {status && (
          <NoteInputConfirmation
            confirm={confirm}
            setConfirm={setConfirm}
            confirmFunction={chagneStatus}
            message={intl.formatMessage({
              id:
                statusConst[status]?.status?.message ||
                'default-status-message',
            })}
            data={status}
            placeholder={intl.formatMessage({ id: 'Comment' })}
          />
        )}
      </div>
    </Wrapper>
  )
}
