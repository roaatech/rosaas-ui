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
import {
  setDefaultCurrencyCodeAndId,
  setLoading,
} from '../../store/slices/main'
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
  BsFillXCircleFill,
  BsPencilSquare,
  BsPlusCircleFill,
  BsTrash,
  BsXCircleFill,
} from 'react-icons/bs'
import { Routes } from '../../routes'
import { MdOutlinePayment, MdOutlinePayments, MdPayments } from 'react-icons/md'
import FilteringDropdown from '../../components/custom/Shared/FilterSearchContainer/FilteringDropdown/FilteringDropdown'
import { setAllPlansLookup } from '../../store/slices/products/productsSlice'
import { el } from 'date-fns/locale'
import FilterSearchContainer from '../../components/custom/Shared/FilterSearchContainer/FilterSearchContainer'
import GenerateCard from './GenerateCard'

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
          <SafeFormatMessage
            id="Product-Filter"
            defaultMessage={'Product Filter'}
          />
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
            label="Product"
            field="ProductId"
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

const UpdatedDashboard = () => {
  const [visibleHead, setVisibleHead] = useState(false)
  const [allSelectedData, setAllSelectedData] = useState([])

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

  const [countsData, setCountsData] = useState({
    totalSubscriptions: 0,
    canceledCount: 0,
    activeCount: 0,
    suspendedCount: 0,
    totalSubscriptionsPerPlan: {},
    inSubscription: 0,
    inTrial: 0,
    inPayment: 0,
    creation: 0,
    activation: 0,
    deactivation: 0,
    deletion: 0,
  })
  const [planChartData, setPlanChartData] = useState({
    planPieChartData: {
      labels: [],
      datasets: [{ data: [], backgroundColor: [] }],
    },
  })

  const [timeGranularity, setTimeGranularity] = useState('day') // Default to 'day' as per your request
  const [StatisticsCountsList, setStatisticsCountsList] = useState([])
  const [timelineData, setTimelineData] = useState([])
  const [StatisticsDetailsList, setStatisticsDetailsList] = useState([])
  const [periodOffset, setPeriodOffset] = useState(0)
  const [currencies, setCurrencies] = useState([])
  const dispatch = useDispatch()
  const {
    getStatisticsDetailsList,
    getStatisticsCountsListByProductId,
    getStatisticsCountsList,
    getStatisticsDetailsListByProductId,
    getCurrenciesPublishList,
    getPlanFilteredList,
  } = useRequest()

  const LookupData = useSelector((state) => state.products?.lookup)
  const productsLookup = LookupData?.productsLookup
  const productOwnersLookup = useSelector(
    (state) => state.productsOwners.lookup
  )
  const defaultCurrency = useSelector((state) => state.main.defaultCurrency)

  useEffect(() => {
    const fetchCurrencies = async () => {
      try {
        const currencies = await getCurrenciesPublishList()
        const currenciesData = currencies?.data?.data
        const primaryCurrency =
          currenciesData && currenciesData.find((c) => c.isPrimaryCurrency)
        dispatch(
          setDefaultCurrencyCodeAndId({
            id: primaryCurrency?.id,
            currencyCode: primaryCurrency?.currencyCode,
          })
        )
      } catch (error) {
        console.error(error)
      }
    }

    fetchCurrencies()
  }, [])
  const getMaxPeriods = () => {
    if (timeGranularity === 'day') return 7
    if (timeGranularity === 'week') return 7
    if (timeGranularity === 'month') return 12 // Adjust as needed
    return 10 // Default value
  }

  // Utility function to parse date
  const parseDate = (dateStr) => new Date(dateStr)

  // Calculate the earliest start date and current moment
  const earliestStartDate = StatisticsDetailsList.reduce((earliest, item) => {
    const start = parseDate(item.startDate)
    return start < earliest ? start : earliest
  }, new Date())

  const currentMoment = new Date()

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
  // Generate labels and active subscriptions
  const generateChartData = () => {
    // Initialize datasets for each product
    const datasets = {}
    const productIds = [
      ...new Set(StatisticsDetailsList.map((item) => item.productId)),
    ]

    productIds.forEach((productId) => {
      datasets[productId] = []
    })

    // Generate all periods
    const allPeriods = []
    let currentPeriodStart = new Date(earliestStartDate)
    currentPeriodStart.setHours(0, 0, 0, 0)

    while (currentPeriodStart <= currentMoment) {
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

      const periodKey = currentPeriodStart.toISOString()
      allPeriods.push({
        key: periodKey,
        label: formatPeriodLabel(
          currentPeriodStart,
          periodEnd,
          timeGranularity
        ),
        start: new Date(currentPeriodStart),
        end: periodEnd,
      })

      currentPeriodStart = nextPeriodStart
    }

    // Calculate active subscriptions for each product and period
    allPeriods.forEach(({ key, start, end }) => {
      productIds.forEach((productId) => {
        let activeCount = 0

        StatisticsDetailsList.forEach((subscription) => {
          if (subscription.productId !== productId) return

          const startDate = new Date(
            subscription.startDate || subscription.createdDate
          )
          let endDate = subscription.cancellationOrSuspensionDate
            ? new Date(subscription.cancellationOrSuspensionDate)
            : subscription.endDate
              ? new Date(subscription.endDate)
              : new Date()

          // Cap endDate at current date
          if (endDate > currentMoment) {
            endDate = currentMoment
          }

          // Check if the subscription was active during the period
          if (startDate <= end && endDate >= start) {
            activeCount += 1 // Count as active during this period
          }
        })

        // Add the active count to the dataset
        datasets[productId].push(activeCount)
      })
    })

    // Build chart data
    setChartData({
      labels: allPeriods.map((period) => period.label),
      lineChartData: {
        labels: allPeriods.map((period) => period.label),
        datasets: Object.entries(datasets).map(([productId, data]) => ({
          label: `${productsLookup[productId]?.systemName || 'Unknown'}`,
          data,
          fill: false,
          borderColor: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
          tension: 0.1,
        })),
      },
      totalPeriods: allPeriods.length,
    })
  }
  const [chartSubscriptions, setChartSubscriptions] = useState({
    labels: [],
    data: [],
  })

  const fetchSubscriptionsPerProductChartData = () => {
    const chartSubscriptions = {
      labels: [],
      data: [],
    }

    const productCounts = StatisticsCountsList?.products

    // Check if productCounts is iterable (an array)
    if (Array.isArray(productCounts)) {
      for (const product of productCounts) {
        const productId = product.key

        chartSubscriptions.labels.push(
          productsLookup[productId]?.systemName || 'Unknown'
        )
        chartSubscriptions.data.push(product.count || 0)
      }
    } else {
      console.error(
        'productCounts is not iterable or not an array:',
        productCounts
      )
    }

    setChartSubscriptions(chartSubscriptions)
  }

  useEffect(() => {
    if (!StatisticsCountsList) {
      return
    }
    fetchSubscriptionsPerProductChartData()
  }, [StatisticsCountsList])
  const fetchSubscriptionsCounts = async () => {
    if (!StatisticsCountsList) {
      return
    }
    dispatch(setLoading(true))
    try {
      const subscriptionsCounts = StatisticsCountsList

      let activeCount = 0
      let suspendedCount = 0
      let canceledCount = 0
      let totalSubscriptions = 0
      let totalSubscriptionsPerPlan = {}

      const SubscriptionStatusEnum = {
        Active: 1,
        Suspended: 2,
        Canceled: 3,
      }
      const TenantStep = {
        Creation: 1,
        Activation: 2,
        Deactivation: 3,
        Deletion: 4,
      }
      const plans = subscriptionsCounts.plans

      for (const plan of plans) {
        const planId = plan.key
        if (!totalSubscriptionsPerPlan[planId]) {
          totalSubscriptionsPerPlan[planId] = 0
        }
        totalSubscriptionsPerPlan[planId] += plan.count
      }
      let inSubscription = 0
      let inTrial = 0
      let inPayment = 0
      const statuses = subscriptionsCounts.subscriptionStatus
      for (const status of statuses) {
        if (status.key === 1) {
          activeCount += status.count
        } else if (status.key === SubscriptionStatusEnum.Suspended) {
          suspendedCount += status.count
        } else if (status.key === SubscriptionStatusEnum.Canceled) {
          canceledCount += status.count
        }
      }
      const subscriptionModes = subscriptionsCounts.subscriptionModes
      for (const subscriptionMode of subscriptionModes) {
        if (subscriptionMode.key === 1) {
          inSubscription += subscriptionMode.count
        } else if (subscriptionMode.key === 2) {
          inTrial += subscriptionMode.count
        } else if (subscriptionMode.key === 3) {
          inPayment += subscriptionMode.count
        }
        totalSubscriptions += subscriptionMode.count
      }

      const tenantSteps = subscriptionsCounts.tenantSteps
      let creation = 0
      let activation = 0
      let deactivation = 0
      let deletion = 0
      for (const tenantStep of tenantSteps) {
        if (tenantStep.key === TenantStep.Creation) {
          creation += tenantStep.count
        } else if (tenantStep.key === TenantStep.Activation) {
          activation += tenantStep.count
        } else if (tenantStep.key === TenantStep.Deactivation) {
          deactivation += tenantStep.count
        } else if (tenantStep.key === TenantStep.Deletion) {
          deletion += tenantStep.count
        }
      }

      // Update the chart data state
      setCountsData({
        activeCount,
        suspendedCount,
        canceledCount,
        totalSubscriptions,
        totalSubscriptionsPerPlan,
        inSubscription,
        inTrial,
        inPayment,
        creation,
        activation,
        deactivation,
        deletion,
      })
    } catch (error) {
      console.error('Error fetching subscription data:', error)
    } finally {
      dispatch(setLoading(false))
    }
  }
  const fetchPlanPieChartData = async () => {
    if (!StatisticsCountsList) {
      return
    }
    const planList = await getPlanFilteredList()
    const planslistData = planList.data.data

    dispatch(
      setAllPlansLookup(planList.data.data && Object.values(planList.data.data))
    )
    const subscriptionsCounts = StatisticsCountsList
    const plans = subscriptionsCounts?.plans
    let totalSubscriptionsPerPlan = {}

    const planPieChartData = {
      labels: [],
      datasets: [
        {
          data: [],
          backgroundColor: [],
        },
      ],
    }
    const planIds = new Set()
    const planNames = {}
    const planColors = {}
    for (const plan of plans) {
      const planId = plan.key
      const currentPlan =
        planslistData && planslistData.find((plan) => plan.id === planId)
      if (!totalSubscriptionsPerPlan[planId]) {
        totalSubscriptionsPerPlan[planId] = 0
      }
      totalSubscriptionsPerPlan[planId] += plan.count
      planNames[planId] = currentPlan?.systemName
    }
    for (const plan of plans) {
      const planId = plan.key
      if (!planColors[planId]) {
        planColors[planId] = getRandomColor()
      }
    }
    for (const plan of plans) {
      const planId = plan.key
      planPieChartData.labels.push(planNames[planId])
      planPieChartData.datasets[0].data.push(totalSubscriptionsPerPlan[planId])
      planPieChartData.datasets[0].backgroundColor.push(planColors[planId])
    }
    setPlanChartData({
      planPieChartData,
    })
  }

  useEffect(() => {
    fetchSubscriptionsCounts()
    fetchPlanPieChartData()
  }, [StatisticsCountsList, timeGranularity, periodOffset])
  useEffect(() => {
    generateChartData()
  }, [timeGranularity, Object.keys(StatisticsDetailsList).length])
  const handlePreviousPeriods = () => {
    setPeriodOffset(periodOffset + 1)
  }

  const handleNextPeriods = () => {
    setPeriodOffset(periodOffset - 1)
  }

  const buildQuery = (page = 1, pageSize = 999) => {
    const queryParts = []
    queryParts.push(`page=${page}`)
    queryParts.push(`pageSize=${pageSize}`)

    if (
      allSelectedData &&
      (Array.isArray(allSelectedData)
        ? allSelectedData.length > 0
        : Object.keys(allSelectedData).length > 0)
    ) {
      allSelectedData.forEach((item, index) => {
        queryParts.push(`filters[${index}].Field=${item.field}`)
        if (item.value) {
          queryParts.push(`filters[${index}].Value=${item.value}`)
        }
      })
    }

    return `?${queryParts.join('&')}`
  }

  const fetchSubscriptionList = async (queryParams) => {
    dispatch(setLoading(true))

    try {
      // Fetch active subscriptions
      // if (allSelectedData && Object.keys(allSelectedData).length > 0) {
      //   const productId = allSelectedData?.[0].value
      //   const StatisticsCounts =
      //     await getStatisticsCountsListByProductId(productId)
      //   StatisticsCounts &&
      //     StatisticsCounts?.data?.data &&
      //     setStatisticsCountsList(StatisticsCounts.data.data)
      //   const StatisticsDetails =
      //     await getStatisticsDetailsListByProductId(productId)
      //   StatisticsDetails &&
      //     StatisticsDetails?.data?.data &&
      //     setStatisticsDetailsList(StatisticsDetails.data.data)
      // } else {
      const StatisticsCounts = await getStatisticsCountsList(queryParams)
      StatisticsCounts &&
        StatisticsCounts?.data?.data &&
        setStatisticsCountsList(StatisticsCounts.data.data)
      const StatisticsDetails = await getStatisticsDetailsList(queryParams)
      StatisticsDetails &&
        StatisticsDetails?.data?.data &&
        setStatisticsDetailsList(StatisticsDetails.data.data)
      // }
    } catch (error) {
      console.error('Error fetching subscription list:', error)
    } finally {
      dispatch(setLoading(false))
    }
  }
  function getActiveSubscriptionsTimelineData(subscriptions) {
    const currentDate = new Date() // Current date-time
    const activeCounts = {}

    subscriptions.forEach((sub) => {
      const startDate = new Date(sub.startDate)
      const endDate = sub.cancellationOrSuspensionDate
        ? new Date(sub.cancellationOrSuspensionDate)
        : new Date(sub.endDate)

      // Check if the subscription is active
      if (currentDate >= startDate && currentDate <= endDate) {
        const productId = sub.productId

        // Increment count for the product
        activeCounts[productId] = (activeCounts[productId] || 0) + 1
      }
    })
    setTimelineData(activeCounts)
  }

  useEffect(() => {
    if (selectedFilters === allSelectedData && isInitialized) {
      return
    }

    const newQuery = buildQuery()
    setSelectedFilters(allSelectedData.length > 0 ? allSelectedData : [])
    fetchSubscriptionList(newQuery)
    getActiveSubscriptionsTimelineData(StatisticsDetailsList)
    setIsInitialized(true)
  }, [allSelectedData])
  const navigate = useNavigate()

  return (
    <Wrapper>
      <BreadcrumbComponent breadcrumbInfo={'Dashboard'} />
      <div className="main-container">
        <TableHead
          search={false}
          title={<SafeFormatMessage id="Dashboard" />}
          label={
            <SafeFormatMessage
              id="Add-Product"
              defaultMessage={'Add Product'}
            />
          }
          visibleHead={visibleHead}
          setVisibleHead={setVisibleHead}
          button={true}
        >
          <ProductForm
            popupLabel={
              <SafeFormatMessage
                id="Create-Product"
                defaultMessage={'Create Product'}
              />
            }
            type={'create'}
            visible={visibleHead}
            setVisible={setVisibleHead}
            sideBar={true}
          />
        </TableHead>
        <div className="mb-4"></div>
        <Row className="justify-content-md-center align-items-stretch">
          {/* Total Subscriptions Card */}
          <Row className="my-4">
            <Col md={12}>
              <FilterSearchContainer setAllSelectedData={setAllSelectedData} />
            </Col>
          </Row>
          <Row className="mt-3">
            <GenerateCard
              count={
                productOwnersLookup
                  ? Object.keys(productOwnersLookup).length
                  : 0
              }
              variant={'var(--second-color-2)'}
              icon={<BsBuildings />}
              md={4}
              title={<SafeFormatMessage id="Total-Products-Owners" />}
              unit={<SafeFormatMessage id="Products-Owners" />}
            />
            <GenerateCard
              count={productsLookup ? Object.keys(productsLookup).length : 0}
              icon={<BsBoxes />}
              md={4}
              title={<SafeFormatMessage id="Total-Products" />}
              unit={<SafeFormatMessage id="Products" />}
            />
            <GenerateCard
              count={defaultCurrency?.currencyCode}
              icon={<BsBoxes />}
              variant={'var(--second-color-2)'}
              md={4}
              title={SafeFormatMessage({ id: 'default-currency' })}
              unit={
                <span
                  style={{ cursor: 'pointer', textDecoration: 'underline' }}
                  className="link-unit"
                  onClick={() => navigate(Routes.CurrenciesPage.path)}
                >
                  <SafeFormatMessage
                    id="Change-Currency"
                    defaultMessage={'Change Currency'}
                  />
                </span>
              }
            />
          </Row>

          <Row className="my-4">
            <h4 className="mt-3 " style={{ color: 'var(--primary4)' }}>
              <SafeFormatMessage
                id="Subscription-Status"
                defaultMessage={'Subscription Status'}
              />
            </h4>
            <Col md={3} className="my-2">
              <Card className="h-100">
                <Card.Body
                  className="d-flex flex-column justify-content-center"
                  style={{ backgroundColor: 'var(--second-color-2)' }}
                >
                  <Card.Title className="text-center">
                    <h5>
                      <FontAwesomeIcon
                        icon={faUsers}
                        style={{
                          marginRight: '10px',
                          marginLeft: '10px',
                          color: 'var(--second-color)',
                        }}
                      />
                      <SafeFormatMessage
                        id="TotalSubscriptions"
                        defaultMessage="Total Subscriptions"
                      />
                    </h5>
                  </Card.Title>
                  <h1
                    className="display-4 text-center"
                    style={{ color: 'var(--second-color)' }}
                  >
                    {countsData.totalSubscriptions}
                  </h1>
                  <p
                    className="text-center fw-bold"
                    style={{ color: 'var(--primary3)' }}
                  >
                    <SafeFormatMessage
                      id="Subscriptions"
                      defaultMessage="Subscriptions"
                    />
                  </p>
                </Card.Body>
              </Card>
            </Col>
            <GenerateCard
              title={SafeFormatMessage({
                id: 'active-subscriptions',
                defaultMessage: 'Active Subscriptions',
              })}
              count={countsData.activeCount}
              icon={<BsCheckCircleFill />}
              color="var(--green2)"
              unit={
                <SafeFormatMessage
                  id="Subscriptions"
                  defaultMessage="Subscriptions"
                />
              }
            />
            <GenerateCard
              title={SafeFormatMessage({
                id: 'suspended-subscriptions',
                defaultMessage: 'Suspended Subscriptions',
              })}
              count={countsData.suspendedCount}
              icon={<BsClockFill />}
              color="var(--red2)"
              variant="var(--second-color-2)"
              unit={
                <SafeFormatMessage
                  id="Subscriptions"
                  defaultMessage="Subscriptions"
                />
              }
            />
            <GenerateCard
              title={SafeFormatMessage({
                id: 'canceled-subscriptions',
                defaultMessage: 'Canceled Subscriptions',
              })}
              count={countsData.canceledCount}
              icon={<BsXCircleFill />}
              color="var(--red2)"
              style={{ color: 'var(--second-color)' }}
              unit={
                <SafeFormatMessage
                  id="Subscriptions"
                  defaultMessage="Subscriptions"
                />
              }
            />
          </Row>
          <Row className="my-4">
            <h4 className="mt-3" style={{ color: 'var(--primary4)' }}>
              <SafeFormatMessage
                id="Subscription-Mode"
                defaultMessage={'Subscription Mode'}
              />
            </h4>
            <GenerateCard
              title={SafeFormatMessage({
                id: 'recurring-subscription',
                defaultMessage: 'Recurring Subscription',
              })}
              count={countsData.inSubscription}
              icon={<BsCheckCircleFill />}
              color="var(--green2)"
              unit={
                <SafeFormatMessage
                  id="Subscriptions"
                  defaultMessage="Subscriptions"
                />
              }
            />
            <GenerateCard
              title={SafeFormatMessage({
                id: 'trial-subscription',
                defaultMessage: 'Trial Subscription',
              })}
              count={countsData.inTrial}
              icon={<BsClockFill />}
              color="var(--red2)"
              variant="var(--second-color-2)"
              unit={
                <SafeFormatMessage
                  id="Subscriptions"
                  defaultMessage="Subscriptions"
                />
              }
            />
            <GenerateCard
              title={SafeFormatMessage({
                id: 'one-time-subscription',
                defaultMessage: 'One Time Subscription',
              })}
              count={countsData.inPayment}
              icon={<MdOutlinePayment />}
              color="var(--red2)"
              style={{ color: 'var(--second-color)' }}
              unit={
                <SafeFormatMessage
                  id="Subscriptions"
                  defaultMessage="Subscriptions"
                />
              }
            />
          </Row>
          <Row className="my-4">
            <h4 className="mt-3" style={{ color: 'var(--primary4)' }}>
              <SafeFormatMessage
                id="Tenant-Steps"
                defaultMessage={'Tenant Steps'}
              />
            </h4>
            <GenerateCard
              title={SafeFormatMessage({ id: 'creation' })}
              count={countsData.creation}
              icon={<BsPlusCircleFill />}
              color="var(--green2)"
              variant="var(--second-color-2)"
              unit={
                <SafeFormatMessage
                  id="Tenant-Steps"
                  defaultMessage={'Tenant Steps'}
                />
              }
            />
            <GenerateCard
              title={SafeFormatMessage({ id: 'activation' })}
              count={countsData.activation}
              icon={<BsCheckCircleFill />}
              color="var(--green2)"
              unit={
                <SafeFormatMessage
                  id="Tenant-Steps"
                  defaultMessage={'Tenant Steps'}
                />
              }
            />
            <GenerateCard
              title={SafeFormatMessage({ id: 'deactivation' })}
              count={countsData.deactivation}
              icon={<BsFillXCircleFill />}
              variant="var(--second-color-2)"
              unit={
                <SafeFormatMessage
                  id="Tenant-Steps"
                  defaultMessage={'Tenant Steps'}
                />
              }
            />
            <GenerateCard
              title={SafeFormatMessage({ id: 'deletion' })}
              count={countsData.deletion}
              icon={<BsTrash />}
              color="var(--green2)"
              unit={
                <SafeFormatMessage
                  id="Tenant-Steps"
                  defaultMessage={'Tenant Steps'}
                />
              }
            />
          </Row>

          {/* Pie Chart for Subscriptions per Plan */}
          <Row className="my-4">
            <h4 className="mt-3" style={{ color: 'var(--primary4)' }}>
              <SafeFormatMessage id="Charts" />
            </h4>
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
                <Card.Body>
                  <Chart
                    type="pie"
                    data={planChartData?.planPieChartData}
                    options={{
                      responsive: true,
                      plugins: {
                        legend: {
                          position: 'top',
                        },
                      },
                    }}
                    height="99%"
                    className=" d-flex justify-content-center"
                  />
                </Card.Body>
              </Card>
            </Col>
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
                      labels: ' ',
                      datasets: chartSubscriptions?.labels.map(
                        (product, index) => ({
                          label: product,
                          data: [chartSubscriptions?.data[index]],
                          backgroundColor: getRandomColor(),
                        })
                      ),
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
                            text: 'Total Subscriptions',
                          },
                        },
                        y: {
                          title: {
                            display: true,
                            text: 'Products',
                          },
                          beginAtZero: true,
                        },
                      },
                    }}
                  />
                </Card.Body>
              </Card>
            </Col>
            {/* Line Chart for Active Subscriptions Over Time */}
            <Col md={12} className="mb-4 ">
              <Card className="h-100">
                <Card.Header>
                  <Card.Title>
                    <SafeFormatMessage id="Active-Subscriptions-Over-Time" />
                  </Card.Title>
                </Card.Header>
                <Card.Body>
                  <Tabs
                    activeKey={timeGranularity}
                    onSelect={(k) => {
                      setTimeGranularity(k)
                      setPeriodOffset(0)
                    }}
                  >
                    <Tab
                      eventKey="month"
                      title={SafeFormatMessage({ id: 'Month' })}
                    ></Tab>
                    <Tab
                      eventKey="week"
                      title={SafeFormatMessage({ id: 'Week' })}
                    ></Tab>
                    <Tab
                      eventKey="day"
                      title={SafeFormatMessage({ id: 'Day' })}
                    ></Tab>
                  </Tabs>
                  <div className="d-flex justify-content-between align-items-center mt-4">
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
                      {chartData.lineChartData?.labels?.[0] || 'N/A'} -{' '}
                      {chartData.lineChartData?.labels?.[
                        chartData.lineChartData.labels.length - 1
                      ] || 'N/A'}
                    </span>
                    <Button
                      variant="primary"
                      onClick={handleNextPeriods}
                      disabled={periodOffset <= 0}
                    >
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
        </Row>
      </div>
    </Wrapper>
  )
}

export default UpdatedDashboard
