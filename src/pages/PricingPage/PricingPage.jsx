import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { redirect, useNavigate, useParams } from 'react-router-dom'
import useRequest from '../../axios/apis/useRequest'
import { Card, Col, Row, Button, Container } from '@themesberg/react-bootstrap'
import {
  setAllProduct,
  setAllPlans,
  setAllFeaturePlan,
  setAllPlansPrice,
} from '../../store/slices/products/productsSlice'
import BreadcrumbComponent from '../../components/custom/Shared/Breadcrumb/Breadcrumb'
import { BsBoxSeam, BsCheck2, BsCheck2Circle, BsXCircle } from 'react-icons/bs'
import { useState } from 'react'
import { FormattedMessage } from 'react-intl'
import CheckoutPage from '../CheckoutPagePage/CheckoutPage'
import { cycle } from '../../const'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBox } from '@fortawesome/free-solid-svg-icons'
import UpperContent from '../../components/custom/Shared/UpperContent/UpperContent'
import { signinRedirectPath } from '../../store/slices/auth'
import { setStep } from '../../store/slices/tenants'

const PricingPage = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const routeParams = useParams()
  const productId = routeParams.id
  const listProduct = useSelector((state) => state.products.products)
  const plansPriceList = useSelector(
    (state) => state.products.products[productId]?.plansPrice
  )
  const planList = useSelector(
    (state) => state.products.products[productId]?.plans
  )
  const groupedByCycle =
    plansPriceList &&
    Object.values(plansPriceList)
      .filter(
        (plansPrice) =>
          plansPrice?.isPublished === true &&
          planList?.[plansPrice?.plan?.id].isPublished === true
      )
      .reduce((acc, currentObj) => {
        const { id, cycle, ...rest } = currentObj
        const cycleNumber = parseInt(cycle, 10)

        acc[cycleNumber] = acc[cycleNumber] || {}
        acc[cycleNumber][id] = { id, ...rest }

        return acc
      }, {})
  groupedByCycle &&
    Object.keys(groupedByCycle).forEach((cycle) => {
      groupedByCycle[cycle] = Object.fromEntries(
        Object.entries(groupedByCycle[cycle]).sort(
          ([, a], [, b]) => a.price - b.price
        )
      )
    })

  let userRole = useSelector((state) => state.auth.userInfo.role)

  const [redirectPath, setRedirectPath] = useState('')
  useEffect(() => {
    if (!redirectPath) {
      return
    }
    dispatch(signinRedirectPath({ redirectPath }))
  }, [redirectPath])

  useEffect(() => {
    dispatch(setStep(1))
  }, [])

  if (userRole == undefined) userRole = 'notAuth'

  const listData = useSelector(
    (state) => state.products.products[productId]?.featurePlan
  )

  useEffect(() => {
    if (Object.values(listProduct).length > 0) {
      return
    }

    ;(async () => {
      const productList = await getProductListPublic()
      dispatch(setAllProduct(productList.data.data))
    })()
  }, [Object.values(listProduct).length > 0])

  const [selectedCycle, setSelectedCycle] = useState('')

  const {
    getFeaturePlanListPublic,
    getProductPlansPublic,
    getProductListPublic,
    getProductPlanPriceListPublic,
  } = useRequest()
  useEffect(() => {
    if (!listProduct || Object.keys(listProduct).length === 0) {
      return
    }
    const fetchData = async () => {
      try {
        if (!listData || Object.keys(listData).length === 0) {
          const featurePlanData = await getFeaturePlanListPublic(
            listProduct[productId].systemName
          )
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
          const allPlanData = await getProductPlansPublic(
            listProduct[productId].systemName
          )
          if (allPlanData.data.data && Object.keys(allPlanData.data.data > 0))
            dispatch(
              setAllPlans({
                productId: productId,
                data: allPlanData.data.data,
              })
            )
        }
        if (!plansPriceList || Object.keys(plansPriceList).length == 0) {
          const allPlansPrices = await getProductPlanPriceListPublic(
            listProduct[productId].systemName
          )
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
  }, [productId, Object.keys(listProduct).length > 0])

  const allCycleTypes = plansPriceList && [
    ...new Set(
      Object.values(plansPriceList)
        .filter((plansPrice) => plansPrice?.isPublished === true)
        .map((priceObj) => priceObj.cycle)
    ),
  ]
  const allFeatures = listData && [
    ...new Set(
      Object.values(listData).map((featurePlan) => ({
        id: featurePlan.feature.id,
        displayName: featurePlan.feature?.displayName,
      }))
    ),
  ]
  const uniqueFeatures =
    allFeatures &&
    Array.from(new Set(allFeatures.map(JSON.stringify))).map(JSON.parse)

  const handleCycleChange = (cycle) => {
    setSelectedCycle(cycle)
  }

  const renderCycleRadioButtons = () => {
    const sortedCycleTypes = allCycleTypes?.sort((a, b) => a - b)
    if (!selectedCycle && sortedCycleTypes?.[0]) {
      setSelectedCycle(sortedCycleTypes?.[0])
    }
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
                className="mr-2"
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
          priceObj.plan.id === planId &&
          priceObj.cycle === selectedCycle &&
          priceObj.price >= 0
      )

    const subscribtionId = filteredPrices?.id
    const featureStatusMap = {}
    featurePlans &&
      featurePlans.forEach((featurePlan) => {
        featureStatusMap[featurePlan?.feature?.id] = true
      })
    return (
      <div>
        {
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
              <div className="fw-bold">
                {planList[planId]?.displayName?.toUpperCase()}
              </div>
              {}
            </Card.Header>
            <Card.Body>
              {uniqueFeatures?.map((featurePlan) => (
                <div key={featurePlan.id}>
                  <p>
                    {featureStatusMap[featurePlan.id] ? (
                      <span>
                        <BsCheck2Circle
                          style={{ color: 'var(--second-color)' }}
                        />{' '}
                        {featurePlan.description || featurePlan.displayName}{' '}
                      </span>
                    ) : (
                      <span>
                        <BsXCircle style={{ color: '#a3a3a3' }} />{' '}
                        {featurePlan.displayName}
                      </span>
                    )}{' '}
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
                  userRole == 'notAuth'
                    ? (navigate(`/signin`),
                      setRedirectPath(
                        `/payment/product/${productId}/subscribtion/${subscribtionId}`
                      ))
                    : navigate(
                        `/payment/product/${productId}/subscribtion/${subscribtionId}`
                      )
                }
              >
                <FormattedMessage id="Start-With" />{' '}
                {planList[planId]?.displayName?.toUpperCase()}
              </Button>
            </Card.Footer>
          </Card>
        }
      </div>
    )
  }

  return (
    <div className="main-container">
      <BreadcrumbComponent breadcrumbInfo={'ProductPricing'} icon={BsBoxSeam} />
      <UpperContent>
        <h4 className="m-0">
          <FormattedMessage id="Subscription-Options" />
        </h4>
      </UpperContent>

      <Card>
        <Card.Body>
          <div className="text-center fw-bold  ">
            {' '}
            <FontAwesomeIcon
              icon={faBox}
              style={{ cursor: 'pointer' }}
              className="mr-2 product-icon"
            />
            {listProduct?.[productId]?.displayName?.toUpperCase()}
          </div>
          <div className="text-center">{renderCycleRadioButtons()}</div>
          <Row>
            {groupedByCycle &&
              groupedByCycle[selectedCycle] &&
              Object.keys(groupedByCycle[selectedCycle]).map((plansPrice) => {
                const renderedPlans = renderFeaturePlans(
                  groupedByCycle[selectedCycle]?.[plansPrice]?.plan.id
                )

                return (
                  renderedPlans && (
                    <Col
                      key={groupedByCycle[selectedCycle]?.[plansPrice]?.plan.id}
                      md={groupedByCycle[selectedCycle].length}
                    >
                      {renderedPlans}
                    </Col>
                  )
                )
              })}
          </Row>
        </Card.Body>
      </Card>
    </div>
  )
}

export default PricingPage
