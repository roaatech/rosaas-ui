import React, { useEffect, useState } from 'react'
import { Button, Card, Col, Row } from '@themesberg/react-bootstrap'
import { useIntl } from 'react-intl'
import './AuditFilterSearchContainer.styled' // Import your CSS
import SafeFormatMessage from '../../SafeFormatMessage/SafeFormatMessage'
import { FaFilter } from 'react-icons/fa'
import { Calendar } from 'primereact/calendar'
import useRequest from '../../../../../axios/apis/useRequest'
import { useDispatch, useSelector } from 'react-redux'
import { setAllProductsLookup } from '../../../../../store/slices/products/productsSlice'
import {
  subscriptionMode,
  subscriptionStatus,
} from '../../../../../const/product'
import { roles } from '../../../../../const/const'
import FilteringDropdown from '../FilteringDropdown/FilteringDropdown'
const AuditsFilterSearchContainer = ({ setAllSelectedData }) => {
  const [selectedClientsIds, setSelectedClientsIds] = useState([])
  const [selectedUserTypes, setSelectedUserTypes] = useState([])
  const [selectedProducts, setSelectedProducts] = useState([])
  const [selectedAuditsActionsIds, setelectedAuditsActionsIds] = useState([])

  const intl = useIntl()
  const { getProductsLookup, getAditsActionListLookup, clientsLookup } =
    useRequest()
  const dispatch = useDispatch()
  const productsLookup = useSelector((state) => state.products?.lookup)

  const [auditsActionListLookup, setAuditsActionListLookup] = useState()
  const [clientsLookupList, setClientsLookupList] = useState({})

  useEffect(() => {
    ;(async () => {
      const listData = await getProductsLookup()
      console.log({ listData })

      dispatch(setAllProductsLookup(listData.data.data))
    })()
  }, [])
  useEffect(() => {
    ;(async () => {
      const AditsActionList = await getAditsActionListLookup()
      const transformedObj =
        AditsActionList &&
        AditsActionList.data.data.reduce((acc, value, index) => {
          acc[index + 1] = { id: value, label: value }
          return acc
        }, {})
      transformedObj && setAuditsActionListLookup(transformedObj)
    })()
  }, [])
  useEffect(() => {
    ;(async () => {
      const clientsList = await clientsLookup()
      const transformedObj =
        clientsList &&
        clientsList.data.data.map((item) => ({
          id: item.value,
          label: item.text,
        }))
      transformedObj && setClientsLookupList(transformedObj)
    })()
  }, [])

  const width = 15
  const width1stRow = 25

  const convertDateRangeToTimestamps = (dateRange) => {
    if (dateRange && dateRange.length === 2) {
      const [startDate, endDate] = dateRange
      const result = []

      if (startDate) {
        result.push({
          field: 'fromDate',
          value: new Date(startDate),
        })
      }

      if (endDate) {
        result.push({
          field: 'toDate',
          value: new Date(endDate),
        })
      }

      return result
    }
    return []
  }

  const [createdDateRange, setCreatedDateRange] = useState(null)

  const selectedCreatedDateRange =
    convertDateRangeToTimestamps(createdDateRange)

  const handleSubmit = () => {
    setAllSelectedData([
      ...selectedClientsIds,
      ...selectedUserTypes,
      ...selectedProducts,
      ...selectedAuditsActionsIds,
      ...selectedCreatedDateRange,
    ])
  }
  const transformToOptionsObject = (data) => {
    return Object.entries(data).reduce((acc, [key, status], index) => {
      if (status?.value !== 'Canceled') {
        acc[index + 1] = {
          id: index + 1,
          label: status?.value,
        }
      }
      return acc
    }, {})
  }
  // Transforming the array
  const transformedUserTypes = roles.map((userType, index) => ({
    id: userType,
    label: userType,
  }))
  const transformedSubscriptionMode = transformToOptionsObject(subscriptionMode)
  const transformedSubscriptionStatus =
    transformToOptionsObject(subscriptionStatus)
  console.log({ transformedSubscriptionMode })

  return (
    <Card className="mt-1 mb-1  p-3">
      <Card.Header className="d-flex justify-content-between align-items-baseline p-0 pb-2">
        <Card.Title>
          <FaFilter className="mx-2 " />{' '}
          <SafeFormatMessage id="Advanced-Filter" />
        </Card.Title>
        <Button
          style={{ padding: '8.8px 40px' }}
          className=" m-0"
          variant="primary"
          onClick={handleSubmit}
        >
          {intl.formatMessage({ id: 'Submit' })}
        </Button>
      </Card.Header>{' '}
      {/* MultiSelect components */}
      <Row className="p-0 my-2 m-0">
        <Col md={4} lg={3} sm={6} className="m-0 my-2 p-0  ">
          <FilteringDropdown
            optionsArray={
              productsLookup &&
              Object.values(
                Object.fromEntries(
                  Object.entries(productsLookup).filter(
                    ([key]) => key !== 'plansLookup'
                  )
                )
              )
            }
            onSubmit={(ids) => setSelectedProducts(ids)}
            label="External-System"
            width={width1stRow}
            field="externalSystem"
          />
        </Col>
        <Col md={4} lg={3} sm={6} className="m-0 my-2 p-0  ">
          <FilteringDropdown
            optionsArray={
              auditsActionListLookup && Object.values(auditsActionListLookup)
            }
            onSubmit={(ids) => setelectedAuditsActionsIds(ids)}
            label="Action"
            width={width1stRow}
            field="action"
          />
        </Col>

        <Col md={4} lg={3} sm={6} className="m-0 my-2 p-0  ">
          <FilteringDropdown
            optionsArray={clientsLookupList && Object.values(clientsLookupList)}
            onSubmit={(ids) => setSelectedClientsIds(ids)}
            label="Client"
            width={width1stRow}
            field="clientId"
            hasSelectAll={true}
          />
        </Col>

        <Col md={4} lg={3} sm={6} className="m-0 my-2 p-0  ">
          <FilteringDropdown
            optionsArray={
              transformedUserTypes && Object.values(transformedUserTypes)
            }
            onSubmit={(ids) => setSelectedUserTypes(ids)}
            label="User-Type"
            width={width1stRow}
            field="userType"
            filter={false}
          />
        </Col>

        <Col md={4} lg={3} sm={6} className="m-0 my-2 p-0  ">
          <div className="d-flex flex-column mx-2  ">
            <SafeFormatMessage id="Date-Range" />

            <Calendar
              value={createdDateRange}
              onChange={(e) => setCreatedDateRange(e.value)}
              selectionMode="range"
              showTime
              dateFormat="yy/mm/dd"
              hourFormat="24"
              placeholder={intl.formatMessage({ id: 'Select-Date-Range' })}
              // style={{ height: '50px' }}
              maxDate={new Date()}
            />
          </div>
        </Col>
      </Row>
    </Card>
  )
}

export default AuditsFilterSearchContainer
