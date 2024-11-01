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
  const { subscriptionFilteredList } = useRequest()

  const fetchAndEnhanceData = async () => {
    if (!list) {
      return
    }
    dispatch(setLoading(true))
    try {
      const subscriptions = list
      const enhancedData = {}
      const planColors = {} // Store colors for each plan

      subscriptions.forEach((subscription) => {
        const productId = subscription.product.id
        const productName = subscription.product.displayNameLocalizations.en
        const planId = subscription.plan.id
        const planName = subscription.plan.displayNameLocalizations.en

        if (!enhancedData[productId]) {
          enhancedData[productId] = {
            productName,
            subscriptionsCount: 0,
            subscriptionAverage: {},
            plans: {},
          }
          planColors[planId] = getRandomColor()
        }

        enhancedData[productId].subscriptionsCount += 1

        // Plan details
        if (!enhancedData[productId].plans[planId]) {
          enhancedData[productId].plans[planId] = {
            planName,
            subscriptionCounts: 0,
          }
        }
        enhancedData[productId].plans[planId].subscriptionCounts += 1
      })

      // Prepare chart data
      const chartSubscriptions = {
        labels: [],
        data: [],
      }

      const planChartData = {
        labels: [],
        datasets: [],
      }

      // Collect product IDs and names
      const productIds = Object.keys(enhancedData)
      const productNames = productIds.map(
        (productId) => enhancedData[productId].productName
      )
      planChartData.labels = productNames

      // Collect plan IDs and names
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

      // Build datasets for each plan
      for (const planId of planIds) {
        const dataset = {
          label: planNames[planId],
          data: [],
          backgroundColor: [],
          borderColor: [],
        }

        // Align data with labels
        for (const productId of productIds) {
          const product = enhancedData[productId]
          const plan = product.plans[planId]
          if (plan) {
            dataset.data.push(plan.subscriptionCounts)
          } else {
            dataset.data.push(0)
          }
          // Assign colors

          dataset.backgroundColor.push(planColors[planId])
          dataset.borderColor.push(planColors[planId])
        }

        planChartData.datasets.push(dataset)
      }

      setChartData({ chartSubscriptions, planChartData, enhancedData })
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
    if (!(selectedProducts && Object.values(selectedProducts).length > 0)) {
      return
    }
    dispatch(setLoading(true))

    try {
      const listData = await subscriptionFilteredList(query)
      setList(listData.data.data.items)
    } catch (error) {
      console.error('Error fetching subscription list:', error)
    } finally {
      dispatch(setLoading(false))
    }
  }

  useEffect(() => {
    if (arraysEqual(selectedFilters, selectedProducts) && !isInitialized) {
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
        <Row className="justify-content-md-center">
          <Col md={6} className="mb-4 d-none d-sm-block">
            <Card>
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
                />
              </Card.Body>
            </Card>
          </Col>
          {/* Chart for Most Subscribed Plans */}
          <Col md={6} className="mb-4 d-none d-sm-block">
            <Card>
              <Card.Body>
                {' '}
                <Chart
                  type="bar"
                  data={{
                    labels: chartData.planChartData?.labels,
                    datasets: chartData.planChartData?.datasets,
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
