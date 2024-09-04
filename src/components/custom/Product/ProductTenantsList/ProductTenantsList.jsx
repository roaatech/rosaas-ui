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
  filterSubscriptions,
  setSearchTerm,
} from '../../../../store/slices/products/productsSlice.js'
import { setAllTenant } from '../../../../store/slices/tenants'
import { FormattedMessage, useIntl } from 'react-intl'
import { formatDate } from '../../../../lib/sharedFun/Time'
import DateLabel from '../../Shared/DateLabel/DateLabel'
import DataLabelWhite from '../../Shared/DateLabelWhite/DateLabelWhite'
import Label from '../../Shared/label/Label'
import { activeStatus, subscriptionStatus } from '../../../../const/product'
import { Wrapper } from './ProductTenantsList.styled'
import DynamicButtons from '../../Shared/DynamicButtons/DynamicButtons'
import { Routes } from '../../../../routes.js'
import { BsSearch } from 'react-icons/bs'
import { InputText } from 'primereact/inputtext'
import CancelSubscriptionForm from '../../tenant/CancelSubscriptionForm/CancelSubscriptionForm.jsx'
import ThemeDialog from '../../Shared/ThemeDialog/ThemeDialog.jsx'
import { MdOutlineCancel } from 'react-icons/md'

export const ProductTenantsList = ({ productId, productName }) => {
  const { getProductTenants } = useRequest()
  const [sortField, setSortField] = useState('')
  const [sortOrder, setSortOrder] = useState('asc')
  const [inputValue, setInputValue] = useState('')

  const dispatch = useDispatch()
  const list = useSelector((state) => state.products.products[productId])
  const searchTerm = useSelector(
    (state) => state.products.products[productId].searchTerm
  )
  console.log({ list })

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

  useEffect(() => {
    dispatch(filterSubscriptions({ productId }))
  }, [searchTerm && Object.values(searchTerm).length, dispatch, productId])

  const handleSort = (field) => {
    const order = sortField === field && sortOrder === 'asc' ? 'desc' : 'asc'
    setSortField(field)
    setSortOrder(order)
    dispatch(sortSubscriptions({ productId, sortBy: field, order }))
  }

  const handleSearch = (e) => {
    const value = e.target.value
    setInputValue(value)
    dispatch(setSearchTerm({ productId, searchTerm: value }))
  }
  const [visible, setVisible] = useState(false)
  const [currentSubscriptionId, setCurrentSubscriptionId] = useState()
  const [currentSystemName, setCurrentSystemName] = useState()
  const [popupLabel, setpopuplabel] = useState()
  const [type, setType] = useState()
  const suspendSubscription = async (subscriptionId, systemName) => {
    setCurrentSubscriptionId(subscriptionId)
    setCurrentSystemName(systemName)
    setVisible(true)
    setType('suspend')
    setpopuplabel(<FormattedMessage id="Suspend-Subscription" />)
  }
  const cancelSubscription = async (subscriptionId, systemName) => {
    setCurrentSubscriptionId(subscriptionId)
    setCurrentSystemName(systemName)
    setVisible(true)
    setType('cancel')
    setpopuplabel(<FormattedMessage id="Cancel-Subscription" />)
  }

  const intl = useIntl()
  const TableRow = (props) => {
    const {
      displayName,
      systemName,
      status,
      createdDate,
      editedDate,
      tenantId,
      plan: { systemName: planSystemName } = {},
      startDate,
      endDate,
      subscriptionStatus: subscriptionStatusValue,
      subscriptionId,
    } = props

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
            <Label {...subscriptionStatus[subscriptionStatusValue]} />
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
              {subscriptionStatusValue != 3 && (
                <Dropdown.Item
                  onSelect={() => {
                    cancelSubscription(subscriptionId, systemName)
                  }}
                >
                  <span className="text-danger">
                    <MdOutlineCancel className="mx-2" />
                    <FormattedMessage id="Cancel-Subscription" />
                  </span>
                </Dropdown.Item>
              )}
              {subscriptionStatusValue != 2 && subscriptionStatusValue != 3 && (
                <Dropdown.Item
                  onSelect={() => {
                    suspendSubscription(subscriptionId, systemName)
                  }}
                >
                  <span className="text-warning">
                    <MdOutlineCancel className="mx-2" />
                    <FormattedMessage id="Suspend-Subscription" />
                  </span>
                </Dropdown.Item>
              )}
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
          <div className="d-flex justify-content-end mb-3">
            <div className="p-input-icon-left mx-3">
              <BsSearch />
              <InputText
                className="form-control"
                placeholder={intl.formatMessage({ id: 'Search' })}
                value={inputValue}
                onChange={handleSearch}
              />
            </div>
          </div>

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
              {list?.filtered?.length && searchTerm
                ? list.filtered &&
                  list.filtered.map((t, index) => (
                    <TableRow key={index} {...t} />
                  ))
                : !searchTerm &&
                  list.subscribe &&
                  list.subscribe.map((t, index) => (
                    <TableRow key={index} {...t} />
                  ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
      <ThemeDialog visible={visible} setVisible={setVisible}>
        <>
          <CancelSubscriptionForm
            popupLabel={popupLabel}
            setVisible={setVisible}
            systemName={currentSystemName}
            subscriptionId={currentSubscriptionId}
            type={type}
          />
        </>
      </ThemeDialog>
    </Wrapper>
  )
}

export default ProductTenantsList
