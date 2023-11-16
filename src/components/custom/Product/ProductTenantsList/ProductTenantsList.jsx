import React, { useState, useEffect } from 'react'
import TenantStatus from '../../tenant/TenantStatus/TenantStatus'
import useRequest from '../../../../axios/apis/useRequest'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEllipsisH, faGear } from '@fortawesome/free-solid-svg-icons'
import {
  Card,
  Table,
  Button,
  ButtonGroup,
  Dropdown,
} from '@themesberg/react-bootstrap'
import TableDate from '../../Shared/TableDate/TableDate'
import { Link, Navigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import {
  productInfo,
  subscribe,
} from '../../../../store/slices/products/productsSlice.js'
import { setAllTenant } from '../../../../store/slices/tenants'
import { FormattedMessage } from 'react-intl'
import { DataTransform, formatDate } from '../../../../lib/sharedFun/Time'
import DateLabel from '../../Shared/DateLabel/DateLabel'
import DataLabelWhite from '../../Shared/DateLabelWhite/DateLabelWhite'
import Label from '../../Shared/label/Label'
import { subscriptionStatus } from '../../../../const/product'

export const ProductTenantsList = ({ productId, productName }) => {
  const { getProductTenants } = useRequest()
  const [searchValue] = useState('')
  const [sortField] = useState('')
  const [sortValue] = useState('')
  const [first] = useState(0)
  const [rows] = useState(10)
  const [update] = useState(1)
  const [selectedProduct] = useState()

  const dispatch = useDispatch()

  const list = useSelector((state) => state.products.products[productId])

  function isDateTimeInFuture(dateTimeString) {
    // Parse the given date string into a Date object
    const [datePart, timePart] = dateTimeString.split(' ')
    const [day, month, year] = datePart.split('/').map(Number)
    const [hours, minutes, seconds] = timePart.split(':').map(Number)
    const inputDate = new Date(year, month - 1, day, hours, minutes, seconds)

    // Get the current date and time
    const currentDate = new Date()

    // Compare the two dates
    return inputDate > currentDate
  }

  useEffect(() => {
    let params = `${productId}/subscriptions`

    ;(async () => {
      if (!list?.subscribe) {
        const listData = await getProductTenants(params)
        dispatch(setAllTenant(listData.data.data))
        dispatch(subscribe({ id: productId, data: listData.data.data }))
      }
    })()
  }, [first, rows, searchValue, sortField, sortValue, update, selectedProduct])

  const TableRow = (props) => {
    const {
      title,
      uniqueName,
      status,
      createdDate,
      editedDate,
      tenantId,
      plan,
      startDate,
      endDate,
      isActive,
    } = props
    const subscribtionStatus = isActive ? true : false

    return (
      <tr>
        <td>
          <span className="fw-normal">{title}</span>
        </td>
        <td>
          <span className="fw-normal">{uniqueName}</span>
        </td>

        {/* <td>
          <span className="fw-normal">
            <OverlayTrigger
              trigger={["hover", "focus"]}
              overlay={<Tooltip>{list?.defaultHealthCheckUrl}</Tooltip>}>
              <span
                style={{
                  background:
                    urlIsOverridden[healthCheckUrlIsOverridden.toString()]
                      .background,
                }}
                size="sm"
                className="p-1 border-round border-1 border-400 mx-2">
                {urlIsOverridden[healthCheckUrlIsOverridden.toString()].value}
              </span>
            </OverlayTrigger>
          </span>
        </td> */}

        <td>
          <span className={`fw-normal`}>
            <DataLabelWhite text={plan.name} />
          </span>
        </td>
        <td>
          <span>
            <Label {...subscriptionStatus[subscribtionStatus]} />
          </span>
        </td>
        <td>
          {' '}
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
                  to={`/tenants/${tenantId}#${productName}`}
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
    <Card border="light" className="table-wrapper table-responsive shadow-sm">
      <Card.Body className="pt-0">
        <Table hover className="user-table align-items-center">
          <thead>
            <tr>
              <th className="border-bottom">
                <FormattedMessage id="Title" />
              </th>
              <th className="border-bottom">
                <FormattedMessage id="Unique-Name" />
              </th>

              <th className="border-bottom">
                <FormattedMessage id="Plan" />
              </th>
              <th className="border-bottom">
                <FormattedMessage id="Subscribtion-Status" />
              </th>
              <th className="border-bottom">
                <FormattedMessage id="Start-Date" />
              </th>
              <th className="border-bottom">
                <FormattedMessage id="End-Date" />
              </th>
              <th className="border-bottom">
                <FormattedMessage id="Tenant-Status" />
              </th>
              <th className="border-bottom">
                <FormattedMessage id="Created-Date" />
              </th>

              <th className="border-bottom">
                <FormattedMessage id="Actions" />
              </th>
            </tr>
          </thead>
          <tbody>
            {list?.subscribe?.length
              ? list?.subscribe?.map((t, index) => (
                  <TableRow key={index} {...t} />
                ))
              : null}
          </tbody>
        </Table>
      </Card.Body>
    </Card>
  )
}

export default ProductTenantsList
