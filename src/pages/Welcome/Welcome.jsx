import React, { useState } from 'react'
import { Wrapper } from './Welcome.styled'
import { useEffect } from 'react'
import BreadcrumbComponent from '../../components/custom/Shared/Breadcrumb/Breadcrumb'
import Progress from '../../components/custom/Shared/Progress/Progress'
import { FormattedMessage, useIntl } from 'react-intl'
import UpperContent from '../../components/custom/Shared/UpperContent/UpperContent'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import useRequest from '../../axios/apis/useRequest'
import { tenantInfo } from '../../store/slices/tenants'
import { Card, Col, Container, Row } from '@themesberg/react-bootstrap'
import DataDisplayRow from '../../components/custom/Shared/DataDisplayRow/DataDisplayRow'
import DataLabelWhite from '../../components/custom/Shared/DateLabelWhite/DateLabelWhite'
import { formatDate } from '../../lib/sharedFun/Time'
import DateLabel from '../../components/custom/Shared/DateLabel/DateLabel'
import TenantStatus from '../../components/custom/tenant/TenantStatus/TenantStatus'
import Label from '../../components/custom/Shared/label/Label'
import DynamicButtons from '../../components/custom/Shared/DynamicButtons/DynamicButtons'
import { MdExpandMore, MdInfoOutline } from 'react-icons/md'

const Dashboard = () => {
  useEffect(() => {
    document.title = 'RoSaaS-Dashboard'
  }, [])
  const { getTenant } = useRequest()
  const dispatch = useDispatch()
  const intl = useIntl()
  const tenantsData = useSelector((state) => state.tenants.tenants)
  const [selectedTenant, setSelectedTenant] = useState('')
  const subscriptionData = tenantsData?.[selectedTenant]?.subscriptions[0]
  const navigate = useNavigate()
  const handleTenantChange = (e) => {
    setSelectedTenant(e.target.value)
  }
  useEffect(() => {
    ;(async () => {
      if (selectedTenant && !subscriptionData?.status) {
        const tenantData = await getTenant(selectedTenant)
        dispatch(tenantInfo(tenantData.data.data))
      }
    })()
  }, [selectedTenant])
  return (
    <Wrapper>
      <BreadcrumbComponent breadcrumbInfo={'Dashboard'} />{' '}
      {/* Assuming you have a Wrapper styled component */}
      <UpperContent>
        <h4 className="m-0">
          <FormattedMessage id="Dashboard" />
        </h4>
      </UpperContent>
      <div className="px-4  align-items-center d-flex flex-wrap flex-md-nowrap align-items-center  mb-5">
        <h6 className="mx-2">
          <FormattedMessage id="Tenant" />{' '}
        </h6>
        <select
          className="form-control custom-container  "
          name="plan"
          id="plan"
          onChange={handleTenantChange}
        >
          <option value="">
            <FormattedMessage id="Select-Tenant" />
          </option>
          {Object.entries(tenantsData).map(([key, value]) => (
            <option key={key} value={key}>
              {value.displayName}
            </option>
          ))}
        </select>
        {selectedTenant && (
          <>
            {' '}
            <span className="mx-2">
              <FormattedMessage id="Of" />
            </span>
            <Label
              {...{
                className: 'py-2',
                background: 'var(--orange-yellow-blend)',
                value: subscriptionData?.productName,
                color: 'var(--mocha-brown)',
              }}
            />
          </>
        )}
      </div>
      {selectedTenant && (
        <section className="px-4">
          <Row>
            <Col md={5}>
              <Card>
                <Card.Header>
                  {' '}
                  <FormattedMessage id="Tenant-Info" />
                  <DynamicButtons
                    buttons={[
                      {
                        order: 2,
                        type: 'action',
                        label: 'Details',
                        func: () => navigate(`/tenants/${selectedTenant}`),
                        icon: <MdInfoOutline />,
                      },
                    ]}
                  />
                </Card.Header>
                <Card.Body>
                  <DataDisplayRow
                    label="Product"
                    value={subscriptionData?.productName}
                    hideBorderBottom={true}
                  />
                  <DataDisplayRow
                    label="Tenant-Status"
                    value={
                      subscriptionData?.status && (
                        <TenantStatus statusValue={subscriptionData?.status} />
                      )
                    }
                    hideBorderBottom={true}
                  />
                  {/* <DataDisplayRow
                  label="Subscription-Mode"
                  value={
                    <Label
                      className="mr-2 fs-7"
                      {...{
                        background: 'var(--red2)',
                        value: intl.formatMessage({ id: 'Trial' }),

                        color: 'red',
                      }}
                    />
                  }
                  hideBorderBottom={true}
                /> */}
                  <DataDisplayRow
                    label="Plan"
                    value={subscriptionData?.plan?.systemName}
                    hideBorderBottom={true}
                  />
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </section>
      )}
    </Wrapper>
  )
}

export default Dashboard
