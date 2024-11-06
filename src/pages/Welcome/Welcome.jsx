import React, { useEffect, useState } from 'react'
import { Wrapper } from './Welcome.styled'
import BreadcrumbComponent from '../../components/custom/Shared/Breadcrumb/Breadcrumb'
import { useNavigate } from 'react-router-dom'
import { Chart } from 'primereact/chart'
import { useIntl } from 'react-intl'
import useRequest from '../../axios/apis/useRequest'
import { useDispatch, useSelector } from 'react-redux'
import { setAllProductsLookup } from '../../store/slices/products/productReducers'
import { Button, Card, Col, Row } from '@themesberg/react-bootstrap'
import SafeFormatMessage from '../../components/custom/Shared/SafeFormatMessage/SafeFormatMessage'
import FilteringMultiSelect from '../../components/custom/Shared/FilterSearchContainer/FilteringMultiSelect/FilteringMultiSelect'
import TableHead from '../../components/custom/Shared/TableHead/TableHead'
import { setLoading } from '../../store/slices/main'
import { arraysEqual } from '../../components/custom/Shared/SharedFunctions/sharedFunctionConsts'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCalendar, faUser, faUsers } from '@fortawesome/free-solid-svg-icons'

const ProductFilterContainer = ({ setAllSelectedProducts }) => {
  const [selectedProducts, setSelectedProducts] = useState([])

  const intl = useIntl()
  const { getProductsLookup } = useRequest()
  const dispatch = useDispatch()
  const LookupData = useSelector((state) => state.products?.lookup)
  const productsLookup = LookupData?.productsLookup

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
  const [selectedProducts, setAllSelectedProducts] = useState([])
  const [selectedFilters, setSelectedFilters] = useState([])
  const [isInitialized, setIsInitialized] = useState(false)
  const [chartData, setChartData] = useState({})
  console.log({ chartData })

  const [list, setList] = useState([])
  const dispatch = useDispatch()
  const { subscriptionFilteredList, subscriptionCanceledFilteredList } =
    useRequest()

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

      // Find the earliest start date and latest end date among all subscriptions
      subscriptions.forEach((subscription) => {
        const startDate = new Date(subscription.startDate)

        // Determine the effective end date
        let endDate = new Date()
        if (subscription.cancellationOrSuspensionDate) {
          endDate = new Date(subscription.cancellationOrSuspensionDate)
        } else if (subscription.endDate) {
          endDate = new Date(subscription.endDate)
        }

        // Update earliestStartDate and latestEndDate
        if (!earliestStartDate || startDate < earliestStartDate) {
          earliestStartDate = startDate
        }
        if (!latestEndDate || endDate > latestEndDate) {
          latestEndDate = endDate
        }
        if (latestEndDate > new Date()) {
          latestEndDate = new Date()
        }
      })

      // Generate all months between earliestStartDate and latestEndDate
      const allMonths = []
      const startMonth = new Date(
        earliestStartDate.getFullYear(),
        earliestStartDate.getMonth(),
        1
      )
      const endMonth = new Date(
        latestEndDate.getFullYear(),
        latestEndDate.getMonth(),
        1
      )
      let currentMonth = new Date(startMonth)

      while (currentMonth <= endMonth) {
        const monthKey = `${currentMonth.getFullYear()}-${
          currentMonth.getMonth() + 1
        }`
        allMonths.push(monthKey)
        currentMonth.setMonth(currentMonth.getMonth() + 1)
      }

      // Initialize data structures for each product
      for (const subscription of subscriptions) {
        const productId = subscription.product.id
        const productName = subscription.product.displayNameLocalizations.en
        const planId = subscription.plan.id
        const planName = subscription.plan.displayNameLocalizations.en

        if (!enhancedData[productId]) {
          enhancedData[productId] = {
            productName,
            subscriptionsCount: 0, // Count of active subscriptions
            activeSubscriptionsPerMonth: {},
            plans: {},
          }
        }

        if (!planColors[planId]) {
          planColors[planId] = getRandomColor()
        }

        if (!productColors[productId]) {
          productColors[productId] = getRandomColor()
        }

        // Determine if the subscription is active
        const isActive = subscription.subscriptionStatus === 1 // Adjust status code as needed

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

      // Calculate active subscriptions per month per product
      for (const productId in enhancedData) {
        const productData = enhancedData[productId]
        const activeSubscriptionsPerMonth = {}

        for (let i = 0; i < allMonths.length; i++) {
          const monthKey = allMonths[i]
          const [year, month] = monthKey.split('-').map(Number)
          const monthStart = new Date(year, month - 1, 1)
          const monthEnd = new Date(year, month, 0)

          let activeCount = 0

          for (const subscription of subscriptions) {
            if (subscription.product.id !== productId) continue

            const startDate = new Date(subscription.startDate)
            let endDate = new Date()
            if (subscription.cancellationOrSuspensionDate) {
              endDate = new Date(subscription.cancellationOrSuspensionDate)
            } else if (subscription.endDate) {
              endDate = new Date(subscription.endDate)
            }

            // Check if subscription is active during the month
            if (startDate <= monthEnd || endDate >= monthStart) {
              activeCount += 1
            }
          }

          activeSubscriptionsPerMonth[monthKey] = activeCount
        }

        productData.activeSubscriptionsPerMonth = activeSubscriptionsPerMonth
      }

      // Prepare data for the line chart (active subscriptions over time)
      const lineChartData = {
        labels: allMonths,
        datasets: [],
      }

      // Build datasets for each product
      for (const productId in enhancedData) {
        const productName = enhancedData[productId].productName
        const activeSubscriptionsPerMonth =
          enhancedData[productId].activeSubscriptionsPerMonth

        // Prepare data array aligned with labels
        const data = allMonths.map((monthKey) => {
          return activeSubscriptionsPerMonth[monthKey] || 0
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
      })
    } catch (error) {
      console.error('Error fetching subscription data:', error)
    } finally {
      dispatch(setLoading(false))
    }
  }

  useEffect(() => {
    fetchAndEnhanceData()
  }, [list])

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
    if (arraysEqual(selectedFilters, selectedProducts) && isInitialized) {
      return
    }
    const newQuery = buildQuery()
    setSelectedFilters(selectedProducts.length > 0 ? selectedProducts : [])
    fetchSubscriptionList(newQuery)
    setIsInitialized(true)
  }, [selectedProducts])

  return (
    <Wrapper>
      <BreadcrumbComponent breadcrumbInfo={'Dashboard'} />
      <div className="main-container">
        <TableHead
          search={false}
          button={false}
          title={<SafeFormatMessage id="Dashboard" />}
        />
        <div className="mb-4">
          <ProductFilterContainer
            setAllSelectedProducts={setAllSelectedProducts}
          />
        </div>
        <Row className="justify-content-md-center align-items-stretch">
          {/* Total Subscriptions Card */}
          <Col md={6} className="mb-4 d-none d-sm-block">
            <Card className="h-100">
              <Card.Body
                className="d-flex flex-column justify-content-center"
                style={{ backgroundColor: 'var(--second-color-2)' }}
              >
                <Card.Title className="text-center">
                  <h1>
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
                  </h1>
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
          {/* Bar Chart for Total Subscriptions per Product */}
          <Col md={6} className="mb-4 d-none d-sm-block">
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
                    labels: chartData.chartSubscriptions?.labels,
                    datasets: [
                      {
                        label: 'Total Subscriptions',
                        data: chartData.chartSubscriptions?.data,
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
          {/* Bar Chart for Subscriptions per Plan */}
          <Col md={6} className="mb-4 d-none d-sm-block">
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
          <Col md={6} className="mb-4 d-none d-sm-block">
            <Card className="h-100">
              <Card.Header>
                <Card.Title>
                  <SafeFormatMessage
                    id="ActiveSubscriptionsOverTime"
                    defaultMessage="Active Subscriptions Over Time"
                  />
                </Card.Title>
              </Card.Header>
              <Card.Body>
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
                          text: 'Month',
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
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
    </Wrapper>
  )
}

export default Dashboard
