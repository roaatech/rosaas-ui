import React, { useEffect, useState } from 'react'
import { Button, Card, Col, Row } from '@themesberg/react-bootstrap'
import { useIntl } from 'react-intl'
import './LogsFilterSearchContainer.styled' // Import your CSS
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
import { logLevels, roles } from '../../../../../const/const'
import FilteringDropdown from '../FilteringDropdown/FilteringDropdown'
const LogsFilterSearchContainer = ({ setAllSelectedData }) => {
  const [selectedLogLevels, setSelectedLogLevels] = useState([])

  const intl = useIntl()

  const dispatch = useDispatch()

  const transformedLogLevels = logLevels.map((level, index) => ({
    id: level,
    label: level,
  }))
  // console.log(tr);

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
    setAllSelectedData([...selectedLogLevels, ...selectedCreatedDateRange])
  }

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
              transformedLogLevels && Object.values(transformedLogLevels)
            }
            onSubmit={(ids) => setSelectedLogLevels(ids)}
            label="Level"
            field="level"
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

export default LogsFilterSearchContainer
