import React, { useState, useEffect } from 'react'

import { Card, Table } from '@themesberg/react-bootstrap'
import { Wrapper } from './ChildTable.style'
import TenantStatus from '../TenantStatus/TenantStatus'
import MetaDataAccordion from '../MetaDataAccordion/MetaDataAccordion'
import Workflow from '../../../../components/custom/Shared/Workflow/Workflow'
import { Button } from 'primereact/button'
import { FiRefreshCw } from 'react-icons/fi'
import { useDispatch } from 'react-redux'
import useRequest from '../../../../axios/apis/useRequest'
import Actions from '../Actions/Actions'
import ReactJson from 'react-json-view'

import Label from '../../Shared/label/Label'
import HealthCheckAccordion from '../HealthCheckAccordion/HealthCheckAccordion'
import { DataTransform } from '../../../../lib/sharedFun/Time'
import { FormattedMessage } from 'react-intl'

export default function ChildTable({
  productData,
  tenantId,
  updateDetails,
  updateTenant,
  productIndex,
}) {
  const { editTenantStatus } = useRequest()
  const dispatch = useDispatch()

  const chagneStatus = async (actionStatus) => {
    await editTenantStatus({
      TenantId: tenantId,
      status: actionStatus,
      productId: productData.id,
    })
    updateTenant()
  }

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

  const metadata = productData?.metadata ? productData.metadata : null
  const [products, setProducts] = useState([
    {
      eventKey: 'metadata',
      title: <FormattedMessage id="Meta-Data" />,
      description: metadata ? rowExpansionTemplate(JSON.parse(metadata)) : null,
    },
  ])

  return (
    <Wrapper>
      <div className="content-container">
        <div className="content-details">
          <Table
            responsive
            className="table-centered table-nowrap rounded mb-0"
          >
            <tbody>
              <tr>
                <td className="fw-bold firstTd">
                  <FormattedMessage id="Status" />
                </td>
                <td>
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

              <tr>
                <td className="pl-0 pr-0" colSpan={2}>
                  <MetaDataAccordion defaultKey="metaData" data={products} />
                </td>
              </tr>

              {productData?.healthCheckStatus.showHealthStatus == true && (
                <tr>
                  <td className="pl-0 pr-0" colSpan={2}>
                    <HealthCheckAccordion
                      defaultKey="HealthCheckStatus"
                      data={[productData]}
                    />
                  </td>
                </tr>
              )}
            </tbody>
          </Table>

          <div className="buttons">
            <div className="action">
              <Actions
                actions={productData.actions}
                chagneStatus={chagneStatus}
              />
            </div>

            {productData?.status != 13 ? (
              <div className="refresh">
                <Button
                  onClick={() => {
                    updateTenant()
                  }}
                  type="button"
                  icon={<FiRefreshCw className="mr-2" />}
                  label="Refresh"
                  style={{
                    backgroundColor: '#239dff',
                    borderColor: '#239dff',
                  }}
                />
              </div>
            ) : null}
          </div>
        </div>
        <div className="content timeLine">
          <Card border="light" className="shadow-sm">
            <Card.Header className="fs-6">History</Card.Header>
            <Card.Body className="pb-0">
              <Workflow
                productId={productData.id}
                updateDetails={updateDetails}
                productIndex={productIndex}
              />
            </Card.Body>
          </Card>
        </div>
      </div>
    </Wrapper>
  )
}
