import React, { useEffect, useState } from 'react'
import { Wrapper } from './Welcome.styled'
import BreadcrumbComponent from '../../components/custom/Shared/Breadcrumb/Breadcrumb'
import { useNavigate } from 'react-router-dom'
import { Chart } from 'primereact/chart'
import { useIntl } from 'react-intl'
import useRequest from '../../axios/apis/useRequest'
import { useDispatch, useSelector } from 'react-redux'
import { setAllProductsLookup } from '../../store/slices/products/productReducers'
import { Button, Card, Col, Row, Tab, Tabs } from '@themesberg/react-bootstrap'
import SafeFormatMessage from '../../components/custom/Shared/SafeFormatMessage/SafeFormatMessage'
import FilteringMultiSelect from '../../components/custom/Shared/FilterSearchContainer/FilteringMultiSelect/FilteringMultiSelect'
import TableHead from '../../components/custom/Shared/TableHead/TableHead'
import { setLoading } from '../../store/slices/main'
import { arraysEqual } from '../../components/custom/Shared/SharedFunctions/sharedFunctionConsts'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faArrowLeft,
  faArrowRight,
  faBoxes,
  faCalendar,
  faUser,
  faUsers,
} from '@fortawesome/free-solid-svg-icons'
import ProductForm from '../../components/custom/Product/ProductForm/ProductForm'
import { FaBox, FaBoxes } from 'react-icons/fa'
import {
  BsBoxes,
  BsBuildings,
  BsCheckCircleFill,
  BsClockFill,
  BsPencilSquare,
  BsXCircleFill,
} from 'react-icons/bs'
import { Routes } from '../../routes'
import { MdOutlinePayments, MdPayments } from 'react-icons/md'

const ProductFilterContainer = ({ setAllSelectedProducts }) => {
  const [selectedProducts, setSelectedProducts] = useState([])

  const intl = useIntl()
  const { getProductsLookup } = useRequest()
  const dispatch = useDispatch()
  const productsLookupData = useSelector((state) => state.products?.lookup)

  const productsLookup = productsLookupData?.productsLookup

  useEffect(() => {
    if (productsLookup && Object.keys(productsLookup).length > 0) {
      return
    }
    ;(async () => {
      const listData = await getProductsLookup()
      dispatch(setAllProductsLookup(listData.data.data))
    })()
  }, [dispatch, getProductsLookup, productsLookup])

  const handleSubmit = () => {
    setAllSelectedProducts(selectedProducts)
  }

  return (
    <Card className="mt-1 mb-1 p-3">
      <Card.Header className="d-flex justify-content-between align-items-baseline p-0 pb-2">
        <Card.Title>
          <SafeFormatMessage id="Product-Filter" />
        </Card.Title>
        <Button
          style={{ padding: '8.8px 40px' }}
          className="m-0"
          variant="primary"
          onClick={handleSubmit}
        >
          {intl.formatMessage({ id: 'Submit' })}
        </Button>
      </Card.Header>
      {/* Product MultiSelect */}
      <Row className="p-0 my-2 m-0">
        <Col md={12} className="m-0 my-2 p-0">
          <FilteringMultiSelect
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
            label="Product"
            field="ProductId"
            clearSelection={true}
          />
        </Col>
      </Row>
    </Card>
  )
}
const getRandomColor = () => {
  const letters = '0123456789ABCDEF'
  let color = '#'
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)]
  }
  return color
}

const Dashboard = () => {
  const [visibleHead, setVisibleHead] = useState(false)
  const [selectedProducts, setAllSelectedProducts] = useState([])
  const [selectedFilters, setSelectedFilters] = useState([])
  const [isInitialized, setIsInitialized] = useState(false)
  const [chartData, setChartData] = useState({
    totalSubscriptions: 0,
    dateRange: '',
    chartSubscriptions: { labels: [], data: [] },
    planChartData: { labels: [], datasets: [] },
    planPieChartData: {
      labels: [],
      datasets: [{ data: [], backgroundColor: [] }],
    },
    lineChartData: { labels: [], datasets: [] },
    enhancedData: {},
    canceledCount: 0,
    activeCount: 0,
    suspendedCount: 0,
  })
  const [timeGranularity, setTimeGranularity] = useState('day') // Default to 'day' as per your request
  const [list, setList] = useState([])
  const dispatch = useDispatch()
  const { subscriptionFilteredList, subscriptionCanceledFilteredList } =
    useRequest()

  const [periodOffset, setPeriodOffset] = useState(0)
  const LookupData = useSelector((state) => state.products?.lookup)
  const productsLookup = LookupData?.productsLookup
  const getMaxPeriods = () => {
    if (timeGranularity === 'day') return 7
    if (timeGranularity === 'week') return 7
    if (timeGranularity === 'month') return 12 // Adjust as needed
    return 10 // Default value
  }
  const productOwnersLookup = useSelector(
    (state) => state.productsOwners.lookup
  )

  const formatPeriodLabel = (periodStart, periodEnd, granularity) => {
    if (granularity === 'month') {
      const options = { month: 'short', year: 'numeric' }
      return periodStart.toLocaleDateString(undefined, options)
    } else if (granularity === 'week') {
      const options = { month: 'short', day: 'numeric' }
      return `${periodStart.toLocaleDateString(
        undefined,
        options
      )} - ${periodEnd.toLocaleDateString(undefined, options)}`
    } else if (granularity === 'day') {
      const options = { month: 'short', day: 'numeric' }
      return periodStart.toLocaleDateString(undefined, options)
    }
  }

  const fetchAndEnhanceData = async () => {
    if (!list) {
      return
    }
    dispatch(setLoading(true))
    try {
      const subscriptions = list
      const enhancedData = {}
      const planColors = {}
      const productColors = {}
      const totalSubscriptionsPerPlan = {}

      let earliestStartDate = null
      let latestEndDate = null
      let activeCount = 0
      let suspendedCount = 0
      let canceledCount = 0

      for (const subscription of subscriptions) {
        const status = subscription.subscriptionStatus

        if (status === 1) {
          // Active
          activeCount += 1
        } else if (status === 2) {
          // Suspended
          suspendedCount += 1
        } else if (status === 3) {
          // Canceled
          canceledCount += 1
        }
      }
      // Find the earliest start date and latest end date among all subscriptions
      subscriptions.forEach((subscription) => {
        const startDate =
          new Date(subscription.startDate) || new Date(subscription.createdDate)

        // Determine the effective end date
        let endDate = subscription.cancellationOrSuspensionDate
          ? new Date(subscription.cancellationOrSuspensionDate)
          : subscription.endDate
            ? new Date(subscription.endDate)
            : new Date()

        // Cap endDate at current date
        if (endDate > new Date()) {
          endDate = new Date()
        }

        // Update earliestStartDate and latestEndDate
        if (!earliestStartDate || startDate < earliestStartDate) {
          earliestStartDate = startDate
        }
        if (!latestEndDate || endDate > latestEndDate) {
          latestEndDate = endDate
        }
      })

      // Generate all time periods based on the selected granularity
      const allPeriods = []
      let currentPeriodStart = new Date(earliestStartDate)
      currentPeriodStart.setHours(0, 0, 0, 0)

      while (currentPeriodStart <= latestEndDate) {
        let nextPeriodStart = new Date(currentPeriodStart)
        let periodEnd = null

        if (timeGranularity === 'month') {
          nextPeriodStart.setMonth(currentPeriodStart.getMonth() + 1)
          periodEnd = new Date(nextPeriodStart)
          periodEnd.setDate(periodEnd.getDate() - 1)
          periodEnd.setHours(23, 59, 59, 999)
        } else if (timeGranularity === 'week') {
          periodEnd = new Date(currentPeriodStart)
          periodEnd.setDate(periodEnd.getDate() + 6)
          periodEnd.setHours(23, 59, 59, 999)
          nextPeriodStart.setDate(currentPeriodStart.getDate() + 7)
        } else if (timeGranularity === 'day') {
          periodEnd = new Date(currentPeriodStart)
          periodEnd.setHours(23, 59, 59, 999)
          nextPeriodStart.setDate(currentPeriodStart.getDate() + 1)
        }

        const periodLabel = formatPeriodLabel(
          currentPeriodStart,
          periodEnd,
          timeGranularity
        )

        allPeriods.push({
          key: currentPeriodStart.toISOString(),
          label: periodLabel,
          start: new Date(currentPeriodStart),
          end: periodEnd,
        })

        currentPeriodStart = nextPeriodStart
      }

      // Calculate active subscriptions per period per product
      const subscriptionsByProduct = {}
      for (const subscription of subscriptions) {
        const productId = subscription.product.id
        if (!subscriptionsByProduct[productId]) {
          subscriptionsByProduct[productId] = []
        }
        subscriptionsByProduct[productId].push(subscription)
      }

      // Initialize data structures for each product
      for (const productId in subscriptionsByProduct) {
        const productSubscriptions = subscriptionsByProduct[productId]
        const productName =
          productSubscriptions[0].product.displayNameLocalizations.en

        if (!enhancedData[productId]) {
          enhancedData[productId] = {
            productName,
            subscriptionsCount: 0, // Count of active subscriptions
            activeSubscriptionsPerPeriod: {},
            plans: {},
          }
        }

        for (const subscription of productSubscriptions) {
          const planId = subscription.plan.id
          const planName = subscription.plan.displayNameLocalizations.en

          if (!planColors[planId]) {
            planColors[planId] = getRandomColor()
          }

          if (!productColors[productId]) {
            productColors[productId] = getRandomColor()
          }

          // Determine if the subscription is active
          const isActive = subscription.subscriptionStatus === 1

          // Increment active subscriptions count if active
          if (isActive) {
            enhancedData[productId].subscriptionsCount += 1

            if (!enhancedData[productId].plans[planId]) {
              enhancedData[productId].plans[planId] = {
                planName,
                subscriptionCounts: 0,
              }
            }
            enhancedData[productId].plans[planId].subscriptionCounts += 1
          }
        }
      }

      // Calculate active subscriptions per period per product
      for (const productId in enhancedData) {
        const productData = enhancedData[productId]
        const activeSubscriptionsPerPeriod = {}

        for (const period of allPeriods) {
          const periodKey = period.key
          const periodStart = period.start
          const periodEnd = period.end

          let activeCount = 0

          for (const subscription of subscriptions) {
            if (subscription.product.id !== productId) continue

            const startDate =
              new Date(subscription.startDate) ||
              new Date(subscription.createdDate)
            let endDate = subscription.cancellationOrSuspensionDate
              ? new Date(subscription.cancellationOrSuspensionDate)
              : subscription.endDate
                ? new Date(subscription.endDate)
                : new Date()

            // Cap endDate at current date
            if (endDate > new Date()) {
              endDate = new Date()
            }

            // Determine if the subscription was active during the period
            if (startDate <= periodEnd && endDate >= periodStart) {
              activeCount += 1 // Count the subscription as active during this period
            }
          }

          activeSubscriptionsPerPeriod[periodKey] = activeCount
        }

        productData.activeSubscriptionsPerPeriod = activeSubscriptionsPerPeriod
      }

      // Prepare data for the line chart (active subscriptions over time)
      const maxPeriods = getMaxPeriods()
      const totalPeriods = allPeriods.length
      const start = Math.max(0, totalPeriods - periodOffset - maxPeriods)
      const end = totalPeriods - periodOffset

      const periodsToDisplay = allPeriods.slice(start, end)

      const lineChartData = {
        labels: periodsToDisplay.map((p) => p.label),
        datasets: [],
      }

      // Build datasets for each product
      for (const productId in enhancedData) {
        const productName = enhancedData[productId].productName
        const activeSubscriptionsPerPeriod =
          enhancedData[productId].activeSubscriptionsPerPeriod

        // Prepare data array aligned with labels
        const data = periodsToDisplay.map((period) => {
          const periodKey = period.key
          return activeSubscriptionsPerPeriod[periodKey] || 0
        })

        lineChartData.datasets.push({
          label: productName,
          data: data,
          fill: false,
          borderColor: productColors[productId],
          tension: 0.1,
        })
      }

      // Prepare data for the bar charts
      // Chart for Total Subscriptions per Product
      const chartSubscriptions = {
        labels: [],
        data: [],
      }

      // Chart for Subscriptions per Plan
      const planChartData = {
        labels: [],
        datasets: [],
      }

      const productIds = Object.keys(enhancedData)
      const productNames = productIds.map(
        (productId) => enhancedData[productId].productName
      )
      planChartData.labels = productNames

      const planIds = new Set()
      const planNames = {}

      for (const productId in enhancedData) {
        chartSubscriptions.labels.push(enhancedData[productId].productName)
        chartSubscriptions.data.push(enhancedData[productId].subscriptionsCount)

        for (const planId in enhancedData[productId].plans) {
          planIds.add(planId)
          planNames[planId] = enhancedData[productId].plans[planId].planName
        }
      }

      for (const planId of planIds) {
        const dataset = {
          label: planNames[planId],
          data: [],
          backgroundColor: [],
          borderColor: [],
        }

        for (const productId of productIds) {
          const product = enhancedData[productId]
          const plan = product.plans[planId]
          if (plan) {
            dataset.data.push(plan.subscriptionCounts)
          } else {
            dataset.data.push(0)
          }

          dataset.backgroundColor.push(planColors[planId])
          dataset.borderColor.push(planColors[planId])
        }

        planChartData.datasets.push(dataset)
      }

      // Calculate total subscriptions (only active subscriptions)
      let totalSubscriptions = 0
      for (const productId in enhancedData) {
        totalSubscriptions += enhancedData[productId].subscriptionsCount
      }
      // Calculate total subscriptions per plan across all products
      for (const productId in enhancedData) {
        for (const planId in enhancedData[productId].plans) {
          const planData = enhancedData[productId].plans[planId]
          if (!totalSubscriptionsPerPlan[planId]) {
            totalSubscriptionsPerPlan[planId] = 0
          }
          totalSubscriptionsPerPlan[planId] += planData.subscriptionCounts
        }
      }

      // Prepare data for the pie chart
      const planPieChartData = {
        labels: [],
        datasets: [
          {
            data: [],
            backgroundColor: [],
          },
        ],
      }

      // Build the labels and data arrays for the pie chart
      for (const planId in totalSubscriptionsPerPlan) {
        planPieChartData.labels.push(planNames[planId])
        planPieChartData.datasets[0].data.push(
          totalSubscriptionsPerPlan[planId]
        )
        planPieChartData.datasets[0].backgroundColor.push(planColors[planId])
      }
      // Format date range
      const formatDate = (date) => {
        const options = { year: 'numeric', month: 'short' }
        return date.toLocaleDateString(undefined, options)
      }

      const dateRange = `${formatDate(earliestStartDate)} - ${formatDate(
        latestEndDate
      )}`

      // Update the chart data state
      setChartData({
        totalSubscriptions,
        dateRange,
        chartSubscriptions,
        planChartData,
        planPieChartData,
        lineChartData,
        enhancedData,
        totalPeriods,
        activeCount,
        suspendedCount,
        canceledCount,
      })
    } catch (error) {
      console.error('Error fetching subscription data:', error)
    } finally {
      dispatch(setLoading(false))
    }
  }

  useEffect(() => {
    fetchAndEnhanceData()
  }, [list, timeGranularity, periodOffset]) // Added periodOffset as dependency

  const handlePreviousPeriods = () => {
    if (!chartData.lineChartData || !chartData.lineChartData.labels) return

    const totalPeriods = chartData.totalPeriods // Use the total number of periods
    const maxPeriods = getMaxPeriods()
    if (periodOffset + maxPeriods < totalPeriods) {
      setPeriodOffset(periodOffset + maxPeriods)
    }
  }

  const handleNextPeriods = () => {
    if (!chartData.lineChartData || !chartData.lineChartData.labels) return

    const maxPeriods = getMaxPeriods()
    if (periodOffset - maxPeriods >= 0) {
      setPeriodOffset(periodOffset - maxPeriods)
    } else {
      setPeriodOffset(0)
    }
  }

  const buildQuery = (page = 1, pageSize = 999) => {
    const queryParts = []
    queryParts.push(`page=${page}`)
    queryParts.push(`pageSize=${pageSize}`)

    if (
      selectedProducts &&
      (Array.isArray(selectedProducts)
        ? selectedProducts.length > 0
        : Object.keys(selectedProducts).length > 0)
    ) {
      selectedProducts.forEach((item, index) => {
        queryParts.push(`filters[${index}].Field=${item.field}`)
        if (item.value) {
          queryParts.push(`filters[${index}].Value=${item.value}`)
        }
      })
    }

    return `?${queryParts.join('&')}`
  }

  const fetchSubscriptionList = async (query) => {
    dispatch(setLoading(true))

    try {
      // Fetch active subscriptions
      const activeListData = await subscriptionFilteredList(query)
      const activeItems = activeListData.data.data.items
      // Fetch canceled subscriptions
      const canceledListData = await subscriptionCanceledFilteredList(query)
      const canceledItems = canceledListData.data.data.items

      // Combine both lists
      const combinedList = [...activeItems, ...canceledItems]

      setList(combinedList)
    } catch (error) {
      console.error('Error fetching subscription list:', error)
    } finally {
      dispatch(setLoading(false))
    }
  }

  useEffect(() => {
    if (selectedFilters === selectedProducts && isInitialized) {
      return
    }
    const newQuery = buildQuery()
    setSelectedFilters(selectedProducts.length > 0 ? selectedProducts : [])
    fetchSubscriptionList(newQuery)
    setIsInitialized(true)
  }, [selectedProducts])
  const navigate = useNavigate()

  return (
    <Wrapper>
      <BreadcrumbComponent breadcrumbInfo={'Dashboard'} />
      <div className="main-container">
        <TableHead
          search={false}
          title={<SafeFormatMessage id="Dashboard" />}
          label={<SafeFormatMessage id="Add-Product" />}
          visibleHead={visibleHead}
          setVisibleHead={setVisibleHead}
          button={true}
        >
          <ProductForm
            popupLabel={<SafeFormatMessage id="Create-Product" />}
            type={'create'}
            visible={visibleHead}
            setVisible={setVisibleHead}
            sideBar={true}
          />
        </TableHead>
        <div className="mb-4">
          <Card>
            <Card.Body>
              <Row>
                <GenerateCard
                  count={
                    productOwnersLookup
                      ? Object.keys(productOwnersLookup).length
                      : 0
                  }
                  variant={'var(--second-color-2)'}
                  icon={<BsBuildings />}
                  md={4}
                  title={'Total-Products-Owners'}
                  unit={'Products-Owners'}
                />
                <GenerateCard
                  count={
                    productsLookup ? Object.keys(productsLookup).length : 0
                  }
                  icon={<BsBoxes />}
                  md={4}
                  title={'Total-Products'}
                  unit={'Products'}
                />
                <GenerateCard
                  count={'USD'}
                  icon={<BsBoxes />}
                  variant={'var(--second-color-2)'}
                  md={4}
                  title={'Default-Currency'}
                  unit={
                    <span
                      style={{ cursor: 'pointer', textDecoration: 'underline' }}
                      className="link-unit"
                      onClick={() => navigate(Routes.CurrenciesPage.path)}
                    >
                      <SafeFormatMessage id="Change-Currency" />
                    </span>
                  }
                />
              </Row>
            </Card.Body>
          </Card>
        </div>
        <Row className="justify-content-md-center align-items-stretch">
          {/* Total Subscriptions Card */}
          <Col md={12}>
            <ProductFilterContainer
              setAllSelectedProducts={setAllSelectedProducts}
            />
          </Col>
          <Col md={3} className="my-2">
            <Card className="h-100">
              <Card.Body
                className="d-flex flex-column justify-content-center"
                style={{ backgroundColor: 'var(--second-color-2)' }}
              >
                <Card.Title className="text-center">
                  <h3>
                    <FontAwesomeIcon
                      icon={faUsers}
                      style={{
                        marginRight: '10px',
                        color: 'var(--second-color)',
                      }}
                    />
                    <SafeFormatMessage
                      id="TotalSubscriptions"
                      defaultMessage="Total Subscriptions"
                    />
                  </h3>
                </Card.Title>
                <h1
                  className="display-4 text-center"
                  style={{ color: 'var(--second-color)' }}
                >
                  {chartData.totalSubscriptions}
                </h1>
                <p className="text-center">
                  <FontAwesomeIcon icon={faCalendar} /> {chartData.dateRange}
                </p>
              </Card.Body>
            </Card>
          </Col>
          <GenerateCard
            title="Active-Subscriptions"
            count={chartData.activeCount}
            icon={<BsCheckCircleFill />}
            color="var(--green2)"
            unit={'Subscriptions'}
          />
          <GenerateCard
            title="Suspended-Subscriptions"
            count={chartData.suspendedCount}
            icon={<BsClockFill />}
            color="var(--red2)"
            variant="var(--second-color-2)"
            unit={'Subscriptions'}
          />
          <GenerateCard
            title="Canceled-Subscriptions"
            count={chartData.canceledCount}
            icon={<BsXCircleFill />}
            color="var(--red2)"
            style={{ color: 'var(--second-color)' }}
            unit={'Subscriptions'}
          />
          {/* Bar Chart for Total Subscriptions per Product */}
          <Col md={6} className="mb-4 ">
            <Card className="h-100">
              <Card.Header>
                <Card.Title>
                  <SafeFormatMessage
                    id="TotalSubscriptionsPerProduct"
                    defaultMessage="Total Subscriptions per Product"
                  />
                </Card.Title>
              </Card.Header>
              <Card.Body>
                <Chart
                  type="bar"
                  data={{
                    labels: chartData.chartSubscriptions.labels,
                    datasets: [
                      {
                        label: 'Total Subscriptions',
                        data: chartData.chartSubscriptions.data,
                        backgroundColor: '#42A5F5',
                      },
                    ],
                  }}
                  options={{
                    responsive: true,
                    plugins: {
                      legend: {
                        position: 'top',
                      },
                    },
                    scales: {
                      x: {
                        title: {
                          display: true,
                          text: 'Products',
                        },
                      },
                      y: {
                        title: {
                          display: true,
                          text: 'Subscriptions',
                        },
                        beginAtZero: true,
                      },
                    },
                  }}
                />
              </Card.Body>
            </Card>
          </Col>
          {/* Pie Chart for Subscriptions per Plan */}
          <Col md={6} className="mb-4 ">
            <Card className="h-100">
              <Card.Header>
                <Card.Title>
                  <SafeFormatMessage
                    id="SubscriptionsPerPlan"
                    defaultMessage="Subscriptions per Plan"
                  />
                </Card.Title>
              </Card.Header>
              <Card.Body className="d-flex justify-content-center">
                <Chart
                  type="pie"
                  data={chartData.planPieChartData}
                  options={{
                    responsive: true,
                    plugins: {
                      legend: {
                        position: 'top',
                      },
                    },
                  }}
                  className="w-full md:w-auto"
                />
              </Card.Body>
            </Card>
          </Col>
          {/* Line Chart for Active Subscriptions Over Time */}
          <Col md={6} className="mb-4 ">
            <Card className="h-100">
              <Card.Header>
                <Card.Title>
                  <SafeFormatMessage
                    id="ActiveSubscriptionsOverTime"
                    defaultMessage="Active Subscriptions Over Time"
                  />
                </Card.Title>
              </Card.Header>
              <Card.Body className="px-3 py-3">
                {/* Tabs for Time Granularity Selection */}
                <Tabs
                  activeKey={timeGranularity}
                  onSelect={(k) => {
                    setTimeGranularity(k)
                    setPeriodOffset(0) // Reset period offset when granularity changes
                  }}
                  className="mb-0 px-4"
                >
                  <Tab
                    eventKey="month"
                    title={
                      <SafeFormatMessage id="Month" defaultMessage="Month" />
                    }
                  ></Tab>
                  <Tab
                    eventKey="week"
                    title={
                      <SafeFormatMessage id="Week" defaultMessage="Week" />
                    }
                  ></Tab>
                  <Tab
                    eventKey="day"
                    title={<SafeFormatMessage id="Day" defaultMessage="Day" />}
                  ></Tab>
                </Tabs>
                {/* Navigation Arrows */}
                <div className="m-0 card p-3">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <Button
                      variant="primary"
                      onClick={handlePreviousPeriods}
                      disabled={
                        periodOffset + getMaxPeriods() >= chartData.totalPeriods
                      }
                    >
                      <FontAwesomeIcon icon={faArrowLeft} />
                    </Button>
                    <span>
                      {chartData.lineChartData &&
                      chartData.lineChartData.labels &&
                      chartData.lineChartData.labels.length > 0
                        ? chartData.lineChartData.labels[0]
                        : 'N/A'}{' '}
                      -{' '}
                      {chartData.lineChartData &&
                      chartData.lineChartData.labels &&
                      chartData.lineChartData.labels.length > 0
                        ? chartData.lineChartData.labels[
                            chartData.lineChartData.labels.length - 1
                          ]
                        : 'N/A'}
                    </span>
                    <Button
                      variant="primary"
                      onClick={handleNextPeriods}
                      disabled={periodOffset <= 0}
                    >
                      {' '}
                      <FontAwesomeIcon icon={faArrowRight} />
                    </Button>
                  </div>
                  <Chart
                    type="line"
                    data={chartData.lineChartData}
                    options={{
                      responsive: true,
                      plugins: {
                        legend: {
                          position: 'top',
                        },
                      },
                      scales: {
                        x: {
                          title: {
                            display: true,
                            text:
                              timeGranularity.charAt(0).toUpperCase() +
                              timeGranularity.slice(1),
                          },
                          ticks: {
                            autoSkip: false,
                          },
                        },
                        y: {
                          title: {
                            display: true,
                            text: 'Number of Subscriptions',
                          },
                          beginAtZero: true,
                        },
                      },
                    }}
                  />
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
    </Wrapper>
  )
}

const GenerateCard = ({ title, icon, md, count, unit, variant }) => {
  return (
    <Col md={md}>
      <Card className="h-100 ">
        <Card.Body
          className="d-flex flex-column justify-content-center"
          style={{ backgroundColor: variant }}
        >
          <Card.Title className="text-center">
            <h3>
              <span
                style={{
                  marginRight: '10px',
                  color: 'var(--second-color)',
                }}
              >
                {icon}
              </span>

              <SafeFormatMessage id={title} defaultMessage={title} />
            </h3>
          </Card.Title>
          <div>
            <h1
              className="display-4 text-center"
              style={{ color: 'var(--second-color)' }}
            >
              {count}
            </h1>
            <p
              className="text-center fw-bold"
              style={{ color: 'var(--primary3)' }}
            >
              {unit}
            </p>
          </div>
        </Card.Body>
      </Card>
    </Col>
  )
}
export default Dashboard
