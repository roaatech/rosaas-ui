import React, { useEffect, useState } from 'react'
import {
  Button,
  Card,
  Col,
  Container,
  Form,
  Row,
} from '@themesberg/react-bootstrap'
import SearchBar from './SearchBar/SearchBar' // Import the search bar component
import FilteringMultiSelect from './FilteringMultiSelect/FilteringMultiSelect' // Import the multi-select component
import { useIntl } from 'react-intl'
import './FilterSearchContainer.styled' // Import your CSS
import SafeFormatMessage from '../SafeFormatMessage/SafeFormatMessage'
import { FaFilter } from 'react-icons/fa'
import { Calendar } from 'primereact/calendar'
import useRequest from '../../../../axios/apis/useRequest'
import { useDispatch, useSelector } from 'react-redux'
import {
  setAllPlansLookup,
  setAllProductsLookup,
} from '../../../../store/slices/products/productsSlice'
import {
  subscriptionMode,
  subscriptionStatus,
  tenantStep,
} from '../../../../const/product'
const FilterSearchContainer = ({ setAllSelectedData }) => {
  const [selectedSubscriptionStatusIds, setSelectedSubscriptionStatusIds] =
    useState([])
  const [SubscriptionModeIds, setSubscriptionModeIds] = useState([])
  const [selectedProducts, setSelectedProducts] = useState([])
  const [selectedTenantStepsIds, setSelectedTenantStepsIds] = useState([])
  const [selectedPlansIds, setSelectedPlansIds] = useState([])
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')

  const intl = useIntl()
  const { getProductsLookup, getPlanFilteredList } = useRequest()
  const dispatch = useDispatch()
  const productsLookup = useSelector((state) => state.products?.lookup)
  const plansLookup = productsLookup?.plansLookup
  const viewComponent = false

  useEffect(() => {
    ;(async () => {
      const listData = await getProductsLookup()
      dispatch(setAllProductsLookup(listData.data.data))
    })()
  }, [])

  const DEBOUNCE_DELAY = 1000
  useEffect(() => {
    let query = ''
    let debounceTimer = null

    if (selectedProducts && Object.values(selectedProducts).length > 0) {
      selectedProducts &&
        Object.values(selectedProducts).forEach((item, index) => {
          if (index === 0) {
            query += `?productIds=${item.value}`
          } else {
            query += `&productIds=${item.value}`
          }
        })
    }

    const sendRequest = () => {
      ;(async () => {
        const listData = await getPlanFilteredList(query || '')

        dispatch(
          setAllPlansLookup(
            listData.data.data && Object.values(listData.data.data)
          )
        )
      })()
    }

    if (query) {
      debounceTimer = setTimeout(() => {
        sendRequest()
      }, DEBOUNCE_DELAY)
    } else {
      sendRequest()
    }

    return () => {
      if (debounceTimer) clearTimeout(debounceTimer)
    }
  }, [selectedProducts])

  const width = 15
  const width1stRow = 25

  const convertDateRangeToTimestamps = (dateRange) => {
    if (dateRange && dateRange.length === 2) {
      const [startDate, endDate] = dateRange
      return {
        startTimestamp: startDate ? new Date(startDate).getTime() : null,
        endTimestamp: endDate ? new Date(endDate).getTime() : null,
      }
    }
    return { startTimestamp: null, endTimestamp: null }
  }

  const [createdDateRange, setCreatedDateRange] = useState(null)
  const [endDateRange, setEndDateRange] = useState(null)
  const { createdStartTimestamp, createdEndTimestamp } =
    convertDateRangeToTimestamps(createdDateRange)
  const { endedStartTimestamp, endedEndTimestamp } =
    convertDateRangeToTimestamps(endDateRange)

  const handleSubmit = () => {
    setAllSelectedData({
      ...selectedSubscriptionStatusIds,
      ...SubscriptionModeIds,
      ...selectedProducts,
      ...selectedTenantStepsIds,
      ...selectedPlansIds,
    })
  }
  const transformToOptionsObject = (data) => {
    return Object.entries(data).reduce((acc, [key, status], index) => {
      console.log({ acc, entry: [key, status], index, data })
      acc[index + 1] = {
        id: index + 1,
        label: status?.displayName,
      }
      return acc
    }, {})
  }

  const transformedSubscriptionMode = transformToOptionsObject(subscriptionMode)
  const transformedSubscriptionStatus =
    transformToOptionsObject(subscriptionStatus)

  return (
    <Card className="mt-1 mb-1  p-3">
      <Card.Header className="d-flex justify-content-between align-items-baseline p-0 pb-2">
        <Card.Title>
          <FaFilter className="mx-2 " />{' '}
          <SafeFormatMessage id="Advanced-Filter" />
        </Card.Title>
        <Button className="px-6 m-0" variant="primary" onClick={handleSubmit}>
          {intl.formatMessage({ id: 'Submit' })}
        </Button>
      </Card.Header>
      <div className="d-flex flex-wrap justify-content-start">
        {' '}
        {/* MultiSelect components */}
        <Row className="p-0 my-2 m-0">
          <Col className="m-0 my-2 p-0 col-md-6 col-lg-4 ">
            <FilteringMultiSelect
              optionsArray={productsLookup && Object.values(productsLookup)}
              onSubmit={(ids) => setSelectedProducts(ids)}
              label="Product"
              width={width1stRow}
              field="ProductId"
            />
          </Col>
          <Col className="m-0 my-2 p-0 col-md-6 col-lg-4 ">
            <FilteringMultiSelect
              optionsArray={plansLookup && Object.values(plansLookup)}
              onSubmit={(ids) => setSelectedPlansIds(ids)}
              label="Plan"
              width={width1stRow}
            />
          </Col>
          <Col className="m-0 my-2 p-0 col-md-6 col-lg-4 ">
            <FilteringMultiSelect
              optionsArray={
                transformedSubscriptionStatus &&
                Object.values(transformedSubscriptionStatus)
              }
              onSubmit={(ids) => setSelectedSubscriptionStatusIds(ids)}
              label="Subscription-Status"
              width={width1stRow}
              field="SubscriptionStatus"
              hasSelectAll={true}
            />
          </Col>

          {viewComponent && (
            <Col className="m-0 my-2 p-0 col-md-6 col-lg-4 ">
              <div className="d-flex flex-column mx-2  ">
                <SafeFormatMessage id="End-Date" />

                <Calendar
                  className={width ? `md:w-${width}rem ` : `md:w-15rem `}
                  value={endDateRange}
                  onChange={(e) => setEndDateRange(e.value)}
                  selectionMode="range"
                  showTime
                  dateFormat="yy/mm/dd"
                  hourFormat="24"
                  placeholder={intl.formatMessage({ id: 'Select-Date-Range' })}
                  style={{ height: '50px' }}
                />
              </div>
            </Col>
          )}
        </Row>
        <Row className="p-0 my-2 m-0">
          <Col className="m-0 my-2 p-0 col-md-6 col-lg-4 ">
            <FilteringMultiSelect
              optionsArray={
                transformedSubscriptionMode &&
                Object.values(transformedSubscriptionMode)
              }
              onSubmit={(ids) => setSubscriptionModeIds(ids)}
              label="Subscription-Mode"
              width={width1stRow}
              field="SubscriptionMode"
              hasSelectAll={true}
            />
          </Col>

          <Col className="m-0 my-2 p-0 col-md-6 col-lg-4 ">
            <FilteringMultiSelect
              optionsArray={tenantStep}
              onSubmit={(ids) => setSelectedTenantStepsIds(ids)}
              label="Tenant-Operational-Status"
              width={width1stRow}
              field={'TenantStep'}
              hasSelectAll={true}
            />
          </Col>

          {viewComponent && (
            <Col className="m-0 my-2 p-0 col-md-6 col-lg-4 ">
              <div className="d-flex flex-column mx-2  ">
                <SafeFormatMessage id="Created-Date" />

                <Calendar
                  className={width ? `md:w-${width}rem ` : `md:w-15rem `}
                  value={createdDateRange}
                  onChange={(e) => setCreatedDateRange(e.value)}
                  selectionMode="range"
                  showTime
                  dateFormat="yy/mm/dd"
                  hourFormat="24"
                  placeholder={intl.formatMessage({ id: 'Select-Date-Range' })}
                  style={{ height: '50px' }}
                  maxDate={new Date()}
                />
              </div>
            </Col>
          )}
          {viewComponent && (
            <Col className="m-0 my-2 p-0 col-md-6 col-lg-4 ">
              <div
                className={
                  width
                    ? `d-flex flex-column mx-2 md:w-${width}rem `
                    : `d-flex flex-column mx-2 md:w-15rem `
                }
              >
                <SafeFormatMessage id="Price-Range" />
                <div className="d-flex align-items-center justify-content-between">
                  <input
                    type="number"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    placeholder={intl.formatMessage({ id: 'Min-Price' })}
                    className="form-control"
                    style={{ height: '50px' }}
                  />
                  <span className="mx-2">-</span>{' '}
                  {/* Separator between min and max */}
                  <input
                    type="number"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    placeholder={intl.formatMessage({ id: 'Max-Price' })}
                    style={{ height: '50px' }}
                    className="form-control"
                  />
                </div>
              </div>
            </Col>
          )}
        </Row>
      </div>
    </Card>
  )
}

export default FilterSearchContainer
