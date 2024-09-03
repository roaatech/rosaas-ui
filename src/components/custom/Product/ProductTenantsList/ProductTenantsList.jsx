import React, { useState, useEffect } from 'react'
import TenantStatus from '../../tenant/TenantStatus/TenantStatus'
import useRequest from '../../../../axios/apis/useRequest'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEllipsisH, faGear, faSort } from '@fortawesome/free-solid-svg-icons'
import {
  Card,
  Table,
  Button,
  ButtonGroup,
  Dropdown,
} from '@themesberg/react-bootstrap'
import TableDate from '../../Shared/TableDate/TableDate'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import {
  subscribe,
  sortSubscriptions,
} from '../../../../store/slices/products/productsSlice.js'
import { setAllTenant } from '../../../../store/slices/tenants'
import { FormattedMessage } from 'react-intl'
import { formatDate } from '../../../../lib/sharedFun/Time'
import DateLabel from '../../Shared/DateLabel/DateLabel'
import DataLabelWhite from '../../Shared/DateLabelWhite/DateLabelWhite'
import Label from '../../Shared/label/Label'
import { activeStatus } from '../../../../const/product'
import { Wrapper } from './ProductTenantsList.styled'
import DynamicButtons from '../../Shared/DynamicButtons/DynamicButtons'
import { Routes } from '../../../../routes.js'

export const ProductTenantsList = ({ productId, productName }) => {
  const { getProductTenants } = useRequest()
  const [sortField, setSortField] = useState('')
  const [sortOrder, setSortOrder] = useState('asc')

  const dispatch = useDispatch()
  const list = useSelector((state) => state.products.products[productId])

  useEffect(() => {
    let params = `${productId}/subscriptions`

    ;(async () => {
      if (!list?.subscribe) {
        const listData = await getProductTenants(params)
        dispatch(setAllTenant(listData.data.data))
        dispatch(subscribe({ id: productId, data: listData.data.data }))
      }
    })()
  }, [productId, list, dispatch, getProductTenants])

  const handleSort = (field) => {
    const order = sortField === field && sortOrder === 'asc' ? 'desc' : 'asc'
    setSortField(field)
    setSortOrder(order)
    dispatch(sortSubscriptions({ productId, sortBy: field, order }))
  }

  const TableRow = (props) => {
    const {
      displayName,
      systemName,
      status,
      createdDate,
      editedDate,
      tenantId,
      plan: { systemName: planSystemName },
      startDate,
      endDate,
      isActive,
    } = props
    const subscriptionStatus = isActive ? true : false

    return (
      <tr>
        <td>
          <span className="fw-normal">{displayName}</span>
        </td>
        <td>
          <span className="fw-normal">{systemName}</span>
        </td>
        <td>
          <span className={`fw-normal`}>
            <DataLabelWhite text={planSystemName} />
          </span>
        </td>
        <td>
          <span>
            <Label {...activeStatus[subscriptionStatus]} />
          </span>
        </td>
        <td>
          <DataLabelWhite text={formatDate(startDate)} />
        </td>
        <td>
          <DateLabel endDate={endDate} />
        </td>
        <td>
          <span className="fw-normal">
            {status && <TenantStatus statusValue={status} />}
          </span>
        </td>
        <td>
          <span className={`fw-normal`}>
            <TableDate createdDate={createdDate} editedDate={editedDate} />
          </span>
        </td>
        <td>
          <Dropdown as={ButtonGroup}>
            <Dropdown.Toggle
              as={Button}
              split
              variant="link"
              className="text-dark m-0 p-0"
            >
              <span className="icon icon-sm">
                <FontAwesomeIcon icon={faEllipsisH} className="icon-dark" />
              </span>
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item>
                <Link
                  to={`${Routes.Tenant.path}/${tenantId}#${productName}`}
                  className="w-100 d-block"
                >
                  <FontAwesomeIcon icon={faGear} className="mx-2" />{' '}
                  <FormattedMessage id="Manage" />
                </Link>
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </td>
      </tr>
    )
  }

  return (
    <Wrapper>
      <Card border="light" className="table-wrapper table-responsive shadow-sm">
        <Card.Body className="pt-0">
          <Table hover className="user-table align-items-center">
            <thead>
              <tr>
                <th
                  className="border-bottom"
                  onClick={() => handleSort('displayName')}
                >
                  <FormattedMessage id="Title" />{' '}
                  <FontAwesomeIcon className="small sort-icon" icon={faSort} />
                </th>
                <th
                  className="border-bottom"
                  onClick={() => handleSort('systemName')}
                >
                  <FormattedMessage id="Unique-Name" />{' '}
                  <FontAwesomeIcon className="small sort-icon" icon={faSort} />
                </th>
                <th
                  className="border-bottom"
                  onClick={() => handleSort('plan.systemName')}
                >
                  <FormattedMessage id="Plan" />{' '}
                  <FontAwesomeIcon className="small sort-icon" icon={faSort} />
                </th>
                <th
                  className="border-bottom"
                  onClick={() => handleSort('isActive')}
                >
                  <FormattedMessage id="Subscription-Status" />{' '}
                  <FontAwesomeIcon className="small sort-icon" icon={faSort} />
                </th>
                <th
                  className="border-bottom"
                  onClick={() => handleSort('startDate')}
                >
                  <FormattedMessage id="Start-Date" />{' '}
                  <FontAwesomeIcon className="small sort-icon" icon={faSort} />
                </th>
                <th
                  className="border-bottom"
                  onClick={() => handleSort('endDate')}
                >
                  <FormattedMessage id="End-Date" />{' '}
                  <FontAwesomeIcon className="small sort-icon" icon={faSort} />
                </th>
                <th
                  className="border-bottom"
                  onClick={() => handleSort('status')}
                >
                  <FormattedMessage id="Tenant-Status" />{' '}
                  <FontAwesomeIcon className="small sort-icon" icon={faSort} />
                </th>
                <th
                  className="border-bottom"
                  onClick={() => handleSort('createdDate')}
                >
                  <FormattedMessage id="Created-Date" />{' '}
                  <FontAwesomeIcon className="small sort-icon" icon={faSort} />
                </th>
                <th className="border-bottom">
                  <FormattedMessage id="Actions" />
                </th>
              </tr>
            </thead>
            <tbody>
              {list?.subscribe?.length
                ? list.subscribe.map((t, index) => (
                    <TableRow key={index} {...t} />
                  ))
                : null}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </Wrapper>
  )
}

export default ProductTenantsList
