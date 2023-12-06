import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import useRequest from '../../axios/apis/useRequest'
import { Card, Col, Row, Button, Container } from '@themesberg/react-bootstrap'
import {
  setAllProduct,
  setAllPlans,
  setAllFeaturePlan,
  setAllPlansPrice,
} from '../../store/slices/products/productsSlice'
import BreadcrumbComponent from '../../components/custom/Shared/Breadcrumb/Breadcrumb'
import { BsBoxSeam, BsCheck2, BsCheck2Circle } from 'react-icons/bs'
import { useState } from 'react'
import { FormattedMessage } from 'react-intl'
import CheckoutPage from '../CheckoutPagePage/CheckoutPage'
import { cycle } from '../../const'

const PricingPage = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const routeParams = useParams()
  const productId = routeParams.id
  const listProduct = useSelector((state) => state.products.products)
  const plansPriceList = useSelector(
    (state) => state.products.products[productId]?.plansPrice
  )
  console.log({ plansPriceList })
  useEffect(() => {
    if (Object.values(listProduct).length > 0) {
      return
    }
    let query = `?page=1&pageSize=50&filters[0].Field=SearchTerm`

    ;(async () => {
      const productList = await getProductList(query)
      dispatch(setAllProduct(productList.data.data.items))
    })()
  }, [])
  const listData = useSelector(
    (state) => state.products.products[productId]?.featurePlan
  )

  const planList = useSelector(
    (state) => state.products.products[productId]?.plans
  )
  const [selectedCycle, setSelectedCycle] = useState('')

  const {
    getFeaturePlanList,
    getProductPlans,
    getProductList,
    getProductPlanPriceList,
  } = useRequest()
  useEffect(() => {
    if (Object.values(listProduct).length < 0) {
      return
    }
    const fetchData = async () => {
      try {
        if (!listData || Object.keys(listData).length === 0) {
          const featurePlanData = await getFeaturePlanList(productId)
          if (
            featurePlanData.data.data &&
            Object.keys(featurePlanData.data.data > 0)
          ) {
            dispatch(
              setAllFeaturePlan({
                productId: productId,
                data: featurePlanData.data.data,
              })
            )
          } else {
            console.error('Feature plan data is undefined:', featurePlanData)
          }
        }

        if (!planList || Object.keys(planList).length === 0) {
          const allPlanData = await getProductPlans(productId)
          if (allPlanData.data.data && Object.keys(allPlanData.data.data > 0))
            dispatch(
              setAllPlans({
                productId: productId,
                data: allPlanData.data.data,
              })
            )
        }
        if (!plansPriceList || Object.keys(plansPriceList).length == 0) {
          const allPlansPrices = await getProductPlanPriceList(productId)
          if (
            allPlansPrices.data.data &&
            Object.keys(allPlansPrices.data.data > 0)
          )
            dispatch(
              setAllPlansPrice({
                productId: productId,
                data: allPlansPrices.data.data,
              })
            )
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    fetchData()
  }, [productId])

  const allCycleTypes = plansPriceList && [
    ...new Set(Object.values(plansPriceList).map((priceObj) => priceObj.cycle)),
  ]
  console.log({ listData })
  const allFeaturesPlanId = listData && [
    ...new Set(
      Object.values(listData).map((featurePlan) => featurePlan.plan.id)
    ),
  ]
  console.log({ allFeaturesPlanId })

  const handleCycleChange = (cycle) => {
    setSelectedCycle(cycle)
  }

  const renderCycleRadioButtons = () => {
    const sortedCycleTypes = allCycleTypes?.sort((a, b) => a - b)
    if (!selectedCycle && sortedCycleTypes?.[0]) {
      setSelectedCycle(sortedCycleTypes?.[0])
    }
    console.log({ sortedCycleTypes })
    return (
      <div className="mb-4">
        <Card.Header>
          {sortedCycleTypes?.map((cycleNum, index) => (
            <label key={cycleNum} className="ml-5">
              <input
                type="radio"
                value={cycleNum}
                checked={selectedCycle === cycleNum}
                onChange={() => handleCycleChange(cycleNum)}
              />
              {cycle[cycleNum]}
            </label>
          ))}
        </Card.Header>
      </div>
    )
  }

  const renderFeaturePlans = (planId) => {
    const featurePlans =
      listData &&
      Object.values(listData)
        .filter((item) => item.plan.id === planId)
        .sort((a, b) => {
          return a.feature.id.localeCompare(b.feature.id)
        })
    const filteredPrices =
      plansPriceList &&
      Object.values(plansPriceList).find(
        (priceObj) =>
          priceObj.plan.id === planId && priceObj.cycle === selectedCycle
      )
    const subscribtionId = filteredPrices?.id
    console.log({ featurePlans })

    return (
      <div>
        <Card>
          <Card.Header className="">
            <div>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span
                  style={{
                    fontSize: '1.3rem',
                    // fontWeight: 'bold',
                    marginRight: '0.5rem',
                  }}
                  className="mb-4 mr-1"
                >
                  $
                </span>
                <span
                  style={{
                    fontSize: '2rem',
                    fontWeight: 'bold',
                    transition: 'all 0.9s',
                  }}
                >
                  {filteredPrices?.price}
                </span>
                <span
                  className="mt-3 ml-1"
                  style={{
                    transition: 'all 0.9s',
                  }}
                >
                  {' '}
                  /{cycle[filteredPrices?.cycle]}
                </span>
              </div>
            </div>
            <div className="fw-bold">{planList[planId].name.toUpperCase()}</div>
            {}
          </Card.Header>
          <Card.Body>
            {featurePlans.map((featurePlan) => (
              <div key={featurePlan.id}>
                <p>
                  <BsCheck2Circle style={{ color: 'var(--second-color)' }} />{' '}
                  {featurePlan.description || featurePlan.feature.title}
                </p>
              </div>
            ))}
          </Card.Body>

          <Card.Footer>
            <Button
              variant="primary"
              type="submit"
              className="w-100"
              onClick={() =>
                navigate(
                  `/checkout/${productId}/subscribtion/${subscribtionId}`
                )
              }
            >
              <FormattedMessage id="Start-With" />{' '}
              {planList[planId].name.toUpperCase()}
            </Button>
          </Card.Footer>
        </Card>
      </div>
    )
  }
  const numPlans = planList && Object.keys(planList)?.length
  const numCols = numPlans > 4 ? 3 : Math.ceil(12 / numPlans)

  return (
    <div className="main-container">
      <BreadcrumbComponent breadcrumbInfo={'ProductList'} icon={BsBoxSeam} />
      <Container>
        <Row>
          <Col md={12}>
            <Card>
              <Card.Body>
                <div className="text-center">{renderCycleRadioButtons()}</div>
                <Row>
                  {planList &&
                    Object.keys(planList).map((planId) => (
                      <Col key={planId} md={numCols}>
                        {renderFeaturePlans(planId)}
                      </Col>
                    ))}
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default PricingPage
