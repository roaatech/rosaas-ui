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
import { DataTransform, formatDate } from '../../../../lib/sharedFun/Time'
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
} from 'react-icons/md'
import DataLabelWhite from '../../Shared/DateLabelWhite/DateLabelWhite'
import DateLabel from '../../Shared/DateLabel/DateLabel'
import { Routes } from '../../../../routes'
import SafeFormatMessage from '../../Shared/SafeFormatMessage/SafeFormatMessage'
import { productOwnerInfo } from '../../../../store/slices/productsOwners'
import { BsInfo, BsInfoCircle, BsInfoCircleFill } from 'react-icons/bs'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBuildingUser } from '@fortawesome/free-solid-svg-icons'
import { Panel } from 'primereact/panel'
import { Avatar } from 'primereact/avatar'
import { Menu } from 'primereact/menu'
import { Button } from 'primereact/button'
import { subscriptionMode } from '../../../../const/product'

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
      if (
        productData.productOwnerId ||
        '88283b02-e969-485a-a5a3-9e5d1d0d3337'
      ) {
        const owner = await getProductOwner(
          productData.productOwnerId || '88283b02-e969-485a-a5a3-9e5d1d0d3337'
        )
        dispatch(
          productOwnerInfo({
            id:
              productData.productOwnerId ||
              '88283b02-e969-485a-a5a3-9e5d1d0d3337',
            data: owner.data.data,
          })
        )
      }
    })()
  }, [productData.productOwnerId])
  const currentPOwnerData =
    listData[
      productData.productOwnerId || '88283b02-e969-485a-a5a3-9e5d1d0d3337'
    ]
  const currentProduct = listProducts[productData.productId]
  console.log({ currentPOwnerData })

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
            <SafeFormatMessage id="Subscription-Details" />
          </span>
        </div>
        <div>
          <button
            className="p-panel-header-icon p-link mr-2"
            onClick={() => {
              colSize == 6 ? setColSize(12) : setColSize(6)
            }}
          >
            <span
              className={
                colSize == 6 ? 'pi pi-window-maximize' : 'pi pi-window-minimize'
              }
            />
          </button>
          {options.togglerElement}
        </div>
      </div>
    )
  }

  const subscriptionFooterTemplate = (options) => {
    const className = `${options.className} flex flex-wrap align-items-center justify-content-between gap-3`

    return (
      <div className={className}>
        <div className="flex align-items-center gap-2">
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
        </div>
        <span className="p-text-secondary">
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
              {colSize == 12 && (
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
        </span>
      </div>
    )
  }
  const pOwnerHeaderTemplate = (options) => {
    const className = `${options.className} justify-content-space-between`

    return (
      <div className={className}>
        <div className="flex align-items-center gap-2">
          <span className="font-bold">
            {' '}
            <FontAwesomeIcon icon={faBuildingUser} className="mx-2" />
            <SafeFormatMessage id="Product-Owner-Details" />
          </span>
        </div>
        <div>
          <button
            className="p-panel-header-icon p-link mr-2"
            onClick={() => {
              navigate(
                `${Routes.productsOwners.path}/${
                  productData.productOwnerId ||
                  '88283b02-e969-485a-a5a3-9e5d1d0d3337'
                }`
              )
            }}
          >
            <span className={'pi pi-window-maximize'} />
          </button>
          {options.togglerElement}
        </div>
      </div>
    )
  }

  const pOwnerFooterTemplate = (options) => {
    const className = `${options.className} flex flex-wrap align-items-center justify-content-between gap-3`

    return (
      <div className={className}>
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
            <Col
              md={currentPOwnerData ? (colSize ? colSize : 6) : 12}
              className="my-2"
            >
              <Panel
                headerTemplate={subscripitonHeaderTemplate}
                footerTemplate={subscriptionFooterTemplate}
                collapsed={true}
                toggleable
              >
                <Table
                  responsive
                  className="table-centered table-nowrap rounded mb-0 accordions "
                >
                  {' '}
                  {/* Adjust minWidth as needed */}
                  <tbody>
                    {productData.subscriptionMode == 2 && (
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
                    {productData.specifications.map((spec, index) => (
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
                            <DataLabelWhite
                              text={productData.plan.systemName}
                            />
                          </span>
                          {'   '}
                          <SafeFormatMessage id="From" />{' '}
                          <DataLabelWhite
                            text={formatDate(productData.startDate)}
                          />{' '}
                          <SafeFormatMessage id="to" />{' '}
                          <DateLabel endDate={productData.endDate} />
                        </td>
                      </tr>
                    )}
                    <tr>
                      <td className="accordions" colSpan={2}>
                        <MetaDataAccordion
                          defaultKey="metaData"
                          data={products}
                        />
                      </td>
                    </tr>

                    {productData?.healthCheckStatus.showHealthStatus ==
                      true && (
                      <tr>
                        <td className="accordions" colSpan={2}>
                          <HealthCheckAccordion
                            defaultKey="HealthCheckStatus"
                            data={[productData]}
                          />
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </Panel>
              {/* <Card border="light" className="shadow-sm">
                <Card.Header className="fw-bold">
                  <thead className="border-bottom border-light min-width-100">
                    <div>
                      <h7>
                        <BsInfoCircleFill className="mx-2" />
                        <SafeFormatMessage id="Subscription-Info" />
                      </h7>
                    </div>
                  </thead>
                </Card.Header>
                <Card.Body>
                  <Table
                    responsive
                    className="table-centered table-nowrap rounded mb-0 accordions "
                  >
                    {' '}
                    <tbody>
                      {productData.subscriptionMode == 2 && (
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
                      {productData.specifications.map((spec, index) => (
                        <tr key={spec.id}>
                          <td className="fw-bold firstTd">
                            {spec.displayName[intl.locale] ||
                              (intl.locale === 'ar' &&
                                spec.displayName['en']) ||
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
                              <DataLabelWhite
                                text={productData.plan.systemName}
                              />
                            </span>
                            {'   '}
                            <SafeFormatMessage id="From" />{' '}
                            <DataLabelWhite
                              text={formatDate(productData.startDate)}
                            />{' '}
                            <SafeFormatMessage id="to" />{' '}
                            <DateLabel endDate={productData.endDate} />
                          </td>
                        </tr>
                      )}
                      <tr>
                        <td className="accordions" colSpan={2}>
                          <MetaDataAccordion
                            defaultKey="metaData"
                            data={products}
                          />
                        </td>
                      </tr>

                      {productData?.healthCheckStatus.showHealthStatus ==
                        true && (
                        <tr>
                          <td className="accordions" colSpan={2}>
                            <HealthCheckAccordion
                              defaultKey="HealthCheckStatus"
                              data={[productData]}
                            />
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </Table>
                </Card.Body>
              </Card> */}
            </Col>
            {currentPOwnerData && colSize != 12 && (
              <Col md={6} className="my-2">
                <Panel
                  headerTemplate={pOwnerHeaderTemplate}
                  footerTemplate={pOwnerFooterTemplate}
                  collapsed={true}
                  toggleable
                >
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
                                {Object.values(currentPOwnerData.products).map(
                                  (product) => (
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
                                  )
                                )}
                              </div>
                            )}
                        </td>
                      </tr>
                      <tr>
                        <td className="firstTd fw-bold">
                          <SafeFormatMessage id="Created-Date" />
                        </td>
                        <td>{DataTransform(currentPOwnerData.createdDate)}</td>
                      </tr>
                      <tr>
                        <td className="firstTd fw-bold">
                          <SafeFormatMessage id="Last-Updated-Date" />
                        </td>
                        <td>{DataTransform(currentPOwnerData.editedDate)}</td>
                      </tr>
                    </tbody>
                  </Table>
                </Panel>
                {/* <Card>
                  <Card.Header className="fw-bold">
                    <div>
                      <h7>
                        <thead className="border-bottom border-light">
                          <FontAwesomeIcon
                            icon={faBuildingUser}
                            className="mx-2"
                          />
                          <SafeFormatMessage id="Product-Owner-Details" />
                        </thead>
                      </h7>
                    </div>
                  </Card.Header>
                  <Card.Body className="">
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
                  </Card.Body>
                </Card> */}
              </Col>
            )}
          </Row>
        </div>
        <div className="content timeLine">
          <Card className="shadow-sm mt-2">
            <Card.Header className="fs-6">
              <SafeFormatMessage id="History" />
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
