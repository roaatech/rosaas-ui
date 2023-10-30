import React, { useEffect, useState } from 'react'

import { Card, Table } from '@themesberg/react-bootstrap'
import { Wrapper } from './ChildTable.style'
import TenantStatus from '../TenantStatus/TenantStatus'
import MetaDataAccordion from '../MetaDataAccordion/MetaDataAccordion'

import Workflow from '../../Shared/Workflow/Workflow'
import { Button } from 'primereact/button'
import { FiRefreshCw } from 'react-icons/fi'
import useRequest from '../../../../axios/apis/useRequest'
import ReactJson from 'react-json-view'

import Label from '../../Shared/label/Label'
import HealthCheckAccordion from '../HealthCheckAccordion/HealthCheckAccordion'
import { DataTransform } from '../../../../lib/sharedFun/Time'
import { FormattedMessage, useIntl } from 'react-intl'
import DynamicButtons from '../../Shared/DynamicButtons/DynamicButtons'
import { AiFillEdit } from 'react-icons/ai'
import { useParams } from 'react-router-dom'
import useActions from '../Actions/Actions'
import SubscriptionInfoAccordion from '../SubscriptionInfoAccordion/SubscriptionInfoAccordion'
import { useDispatch, useSelector } from 'react-redux'
import SubscriptionInfoAccordionNew from '../SubscriptionInfoAccordionNew/SubscriptionInfoAccordionNew'
import { setAllSpecifications } from '../../../../store/slices/products/productsSlice'
import NoteInputConfirmation from '../../Shared/NoteInputConfirmation/NoteInputConfirmation'
import { statusConst } from '../../../../const'
export default function ChildTable({
  productData,
  tenantId,
  updateDetails,
  updateTenant,
  productIndex,
  tenantObject,
}) {
  const { getProductSpecification } = useRequest()
  const dispatch = useDispatch()

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
  const currentProduct = listProducts[productData.productId]

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

  const chagneStatus = async (actionStatus, notes) => {
    await editTenantStatus({
      TenantId: tenantId,
      status: actionStatus,
      comment: notes,
      productId: productData.id,
    })
    updateTenant()
  }
  const statusConfirm = (data) => {
    setConfirm(true)
    setStatus(data)
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
  const routeParams = useParams()
  const metadata = productData?.metadata ? productData.metadata : null
  const [products, setProducts] = useState([
    {
      eventKey: 'metadata',
      title: <FormattedMessage id="Meta-Data" />,
      description: metadata ? rowExpansionTemplate(JSON.parse(metadata)) : null,
    },
  ])
  return (
    <Wrapper direction={direction}>
      <div className="dynamicButtons">
        <DynamicButtons
          disableFormButtons={!checkSpecificationsArray}
          buttons={
            productData.actions && productData.actions[0]?.status != 13
              ? [
                  //  {
                  //       order: 1,
                  //       type: 'form',
                  //       id: routeParams.id,
                  //       label: 'Edit',
                  //       component: 'editTenant',
                  //       updateTenant: updateTenant,
                  //       icon: <AiFillEdit />,
                  //     }
                  //   :
                  {
                    order: 1,
                    type: 'form',
                    id: routeParams.id,
                    label: 'Edit-Specification',
                    component: 'editTenantSpecification',
                    updateTenant: updateTenant,
                    selectedProduct: productData.productId,
                    icon: <AiFillEdit />,
                  },
                  ...renderActions(
                    tenantObject,
                    productData.actions,
                    chagneStatus,
                    statusConfirm
                  ),
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
          <Table
            responsive
            className="table-centered table-nowrap rounded mb-0"
          >
            <tbody>
              <tr>
                <td className="fw-bold firstTd line-cell">
                  <FormattedMessage id="Status" />
                </td>
                <td className=" line-cell">
                  <TenantStatus statusValue={productData.status} />
                </td>
              </tr>

              <tr>
                <td className="fw-bold firstTd">
                  <FormattedMessage id="Health-Check-Url" />
                </td>
                <td className="d-flex align-items-center">
                  <span className="mr-2">
                    <Label
                      value={
                        productData.healthCheckUrlIsOverridden ? (
                          <FormattedMessage id="Overridden" />
                        ) : (
                          <FormattedMessage id="Default" />
                        )
                      }
                    />
                  </span>
                  <span className="mr-2 checkurl">
                    {productData.healthCheckUrl}
                  </span>
                </td>
              </tr>
              <tr>
                <td className="fw-bold firstTd">
                  <FormattedMessage id="Last-Updated-Date" />
                </td>
                <td>{DataTransform(productData.editedDate)}</td>
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

              <tr>
                <td className="accordions" colSpan={2}>
                  <MetaDataAccordion defaultKey="metaData" data={products} />
                </td>
              </tr>
              {/* <tr>
                <td className="pl-0 pr-0" colSpan={2}>
                  <SubscriptionInfoAccordion />
                </td>
              </tr> */}
              <tr>
                <td className="accordions" colSpan={2}>
                  <SubscriptionInfoAccordionNew />
                </td>
              </tr>

              {productData?.healthCheckStatus.showHealthStatus == true && (
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
        </div>
        <div className="content timeLine">
          <Card border="light" className="shadow-sm">
            <Card.Header className="fs-6">
              <FormattedMessage id="History" />
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
              id: statusConst[status].message || 'default-status-message',
            })}
            data={status}
            placeholder={intl.formatMessage({ id: 'Comment' })}
          />
        )}
      </div>
    </Wrapper>
  )
}
