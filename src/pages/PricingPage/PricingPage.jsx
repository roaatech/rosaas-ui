import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { redirect, useNavigate, useParams } from 'react-router-dom'
import useRequest from '../../axios/apis/useRequest'
import { Card, Col, Row, Button, Form } from '@themesberg/react-bootstrap'
import {
  setAllProduct,
  setAllPlans,
  setAllFeaturePlan,
  setAllPlansPrice,
  deleteAllPlanPrice,
  deleteAllPlanPriceBySystemName,
} from '../../store/slices/products/productsSlice'
import BreadcrumbComponent from '../../components/custom/Shared/Breadcrumb/Breadcrumb'
import { BsBoxSeam, BsCheck2Circle, BsXCircle } from 'react-icons/bs'
import { useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { cycle } from '../../const'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBox, faInfoCircle } from '@fortawesome/free-solid-svg-icons'
import { signinRedirectPath } from '../../store/slices/auth'
import { setStep } from '../../store/slices/tenants'
import { Wrapper } from './PricingPage.styled'
import TrialLabel from '../../components/custom/tenant/TrialLabel/TrialLabel'
import MarketplaceNavBar from '../../components/Sidebar/MarketplaceNavBar/MarketplaceNavBar'
import { setProductOwner } from '../../store/slices/main'

const PricingPage = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const routeParams = useParams()

  const productSystemName = routeParams.productSystemName
  const productOwnerSystemName = routeParams.productOwnerSystemName || ''
  // const pOSystemName = useSelector((state) => state.main.pOSystemName)

  // useEffect(() => {
  //   if (!productOwnerSystemName) {
  //     return
  //   }
  //   dispatch(setProductOwner(productOwnerSystemName))
  // }, [productOwnerSystemName])

  const listProduct = useSelector((state) => state.products.products)

  const productData = Object.values(
    Object.fromEntries(
      Object.entries(listProduct).filter(
        ([key, value]) => value.systemName === productSystemName
      )
    )
  )[0]

  const productId = productData?.id

  const plansPriceList = productData?.plansPrice

  const planList = productData?.plans

  const groupedByCycle =
    plansPriceList &&
    Object.values(plansPriceList) &&
    Object.values(plansPriceList)
      .filter((plansPrice) => plansPrice?.isPublished === true)
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

  let userRole = useSelector((state) => state.auth.userInfo.userType)
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

  const listData = productData?.featurePlan

  useEffect(() => {
    if (
      Object.values(listProduct).length > 0
      // ||
      // !pOSystemName ||
      // !pOSystemName === '' ||
      // productOwnerSystemName !== pOSystemName
    ) {
      return
    }

    ;(async () => {
      const productList = await getProductListPublic()
      dispatch(setAllProduct(productList.data.data))
    })()
  }, [
    Object.values(listProduct).length > 0,
    // // pOSystemName,
    // productOwnerSystemName,
  ])

  const [selectedCycle, setSelectedCycle] = useState('')

  const {
    getFeaturePlanListPublic,
    getProductPlansPublic,
    getProductListPublic,
    getProductPlanPriceListPublic,
  } = useRequest()
  const [startWithTrial, setStartWithTrial] = useState(true)

  const handleStartWithTrialChange = (event, planId) => {
    setStartWithTrial((prevState) => ({
      ...prevState,
      [planId]: event.target.checked,
    }))
  }
  const currency = useSelector((state) => state.main.currency)

  useEffect(() => {
    if (listProduct?.[productId]?.trialType != 2) {
      return
    }
    const initialStartWithTrial = {}
    planList &&
      Object.keys(planList).forEach((planId) => {
        initialStartWithTrial[planId] = true
      })
    setStartWithTrial(initialStartWithTrial)
  }, [planList])

  useEffect(() => {
    dispatch(deleteAllPlanPriceBySystemName({ systemName: productSystemName }))
  }, [currency])

  useEffect(() => {
    if (
      !listProduct ||
      Object.keys(listProduct).length === 0
      // ||
      // !pOSystemName ||
      // !pOSystemName === '' ||
      // productOwnerSystemName !== pOSystemName
    ) {
      return
    }
    const fetchData = async () => {
      try {
        if (!listData || Object.keys(listData).length === 0) {
          const featurePlanData = await getFeaturePlanListPublic(
            productOwnerSystemName,
            productSystemName
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
            productOwnerSystemName,
            productSystemName
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
            productOwnerSystemName,
            productSystemName
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
  }, [
    productId,
    // Object.keys(listProduct).length > 0,
    // // pOSystemName,
    // productOwnerSystemName,
    plansPriceList && Object.keys(plansPriceList).length > 0,
  ])

  const allCycleTypes = plansPriceList && [
    ...new Set(
      Object.values(plansPriceList)
        .filter((plansPrice) => plansPrice?.isPublished === true)
        .filter((priceObj) => priceObj.cycle === 3 || priceObj.cycle === 4)
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
      <Card.Header>
        <div className="d-flex justify-content-center ">
          {sortedCycleTypes?.map(
            (cycleNum, index) =>
              (cycleNum === 3 || cycleNum === 4) && (
                <Form.Check
                  key={index}
                  type="radio"
                  label={<FormattedMessage id={cycle[cycleNum]} />}
                  value={cycleNum}
                  checked={selectedCycle === cycleNum}
                  onChange={() => handleCycleChange(cycleNum)}
                  className="mx-2"
                />
              )
          )}
        </div>
      </Card.Header>
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
        featureStatusMap[featurePlan?.feature?.id] = {
          status: true,
          description: featurePlan?.description,
        }
      })

    return (
      <div>
        {
          <Card>
            <Card.Header className="">
              <div
                style={{
                  transition: 'all 0.9s',
                }}
                className="d-flex align-items-center justify-content-between "
              >
                <div
                  className="mb-0 w-50 "
                  style={{ display: 'flex', alignItems: 'center' }}
                >
                  <span
                    style={{
                      fontSize: '1.3rem',
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
                    /
                    {filteredPrices?.cycle && (
                      <FormattedMessage id={cycle[filteredPrices?.cycle]} />
                    )}
                  </span>
                </div>
                {listProduct?.[productId]?.trialType == 3 &&
                  planList[planId]?.trialPeriodInDays > 0 && (
                    <div className="tab-header">
                      <TrialLabel days={planList[planId]?.trialPeriodInDays} />
                    </div>
                  )}
                {listProduct?.[productId]?.trialType == 2 &&
                  planId == listProduct?.[productId]?.trialPlanId && (
                    <div className="tab-header">
                      <TrialLabel
                        days={listProduct?.[productId]?.trialPeriodInDays}
                      />
                    </div>
                  )}
              </div>
              <div
                className="fw-bold mt-2 "
                style={{
                  fontSize: '1.5rem',
                  fontWeight: 'bold',
                }}
              >
                {listProduct?.[productId]?.trialType == 2 &&
                planId == listProduct?.[productId]?.trialPlanId ? (
                  <FormattedMessage id="Trial" />
                ) : (
                  planList[planId]?.displayName?.toUpperCase()
                )}
              </div>
            </Card.Header>
            <Card.Body>
              {uniqueFeatures?.map((feature) => (
                <div key={feature.id}>
                  <p>
                    {featureStatusMap?.[feature.id]?.status ? (
                      <span>
                        <BsCheck2Circle
                          style={{ color: 'var(--second-color)' }}
                        />{' '}
                        {featureStatusMap?.[feature.id]?.description ||
                          feature.displayName}{' '}
                      </span>
                    ) : (
                      <span>
                        <BsXCircle style={{ color: 'var(--silver-gray)' }} />{' '}
                        {feature.displayName}
                      </span>
                    )}{' '}
                  </p>
                </div>
              ))}
            </Card.Body>

            <Card.Footer
              style={{
                ...(listProduct?.[productId]?.trialType === 2
                  ? { whiteSpace: 'nowrap', minHeight: '150px' }
                  : {}),
              }}
            >
              {planId != listProduct?.[productId]?.trialPlanId ? (
                <>
                  {listProduct?.[productId]?.trialType == 2 &&
                    planId !== listProduct?.[productId]?.trialPlanId && (
                      <Form.Group className="mb-3">
                        <Form.Check
                          type="checkbox"
                          label={
                            <>
                              <FormattedMessage id="With" />{' '}
                              <span style={{ color: 'var(--second-color' }}>
                                {listProduct?.[productId]?.trialPeriodInDays}{' '}
                                <FormattedMessage id="Days" />{' '}
                              </span>
                              <FormattedMessage id="Free-Trial" />{' '}
                              <FormattedMessage id="Plan" />
                            </>
                          }
                          checked={startWithTrial[planId] || false}
                          onChange={(event) =>
                            handleStartWithTrialChange(event, planId)
                          }
                          className="font-small"
                        />
                        {startWithTrial[planId] && (
                          <div className="small">
                            <span className="info-icon mr-1">
                              <FontAwesomeIcon icon={faInfoCircle} />
                            </span>{' '}
                            <FormattedMessage id="start-your" />{' '}
                            <strong style={{ color: 'var(--second-color)' }}>
                              <FormattedMessage id="trial" />
                            </strong>{' '}
                            ,
                            <span>
                              {' '}
                              <FormattedMessage id="then" />{' '}
                              <strong style={{ color: 'var(--second-color)' }}>
                                <FormattedMessage id="switch-plans" />
                                {'  '}
                              </strong>
                              <span
                                className="info-icon"
                                style={{
                                  color: 'var(--info-color)',
                                  marginLeft: '5px',
                                }}
                              >
                                <i className="bi bi-info-circle"></i>
                              </span>
                              <FormattedMessage id="seamlessly" />
                            </span>
                          </div>
                        )}
                      </Form.Group>
                    )}
                  <Button
                    variant="primary"
                    type="submit"
                    className="w-100"
                    onClick={() => {
                      if (
                        listProduct?.[productId]
                          ?.isPlanSelectionRedirectionEnabled &&
                        listProduct?.[productId]?.planSelectionRedirectUrl
                      ) {
                        window.top.location.href = `${listProduct?.[productId]?.planSelectionRedirectUrl}?plan-price=${filteredPrices.systemName}`
                      } else if (
                        startWithTrial[planId] ||
                        (listProduct?.[productId]?.trialType === 3 &&
                          planList[planId]?.trialPeriodInDays > 0)
                      ) {
                        navigate(
                          `/checkout/${productOwnerSystemName}/${productSystemName}/plan-price/${filteredPrices.systemName}#start-with-trial`
                        )
                      } else {
                        navigate(
                          `/checkout/${productOwnerSystemName}/${productSystemName}/plan-price/${filteredPrices.systemName}`
                        )
                      }
                    }}
                  >
                    <FormattedMessage id="Start-With" />{' '}
                    {planList[planId]?.displayName?.toUpperCase()}
                  </Button>
                </>
              ) : (
                listProduct?.[productId]?.trialType == 2 && (
                  <div className="text-center text-seamlessly mt-4">
                    <div>
                      <FormattedMessage id="start-your" />{' '}
                      <strong style={{ color: 'var(--second-color)' }}>
                        <FormattedMessage id="trial" />
                      </strong>
                      ,
                    </div>
                    <div>
                      <FormattedMessage id="then" />{' '}
                      <strong style={{ color: 'var(--second-color)' }}>
                        <FormattedMessage id="switch-plans" />
                      </strong>{' '}
                      <FormattedMessage id="seamlessly" />
                    </div>
                  </div>
                )
              )}
            </Card.Footer>
          </Card>
        }
      </div>
    )
  }

  return (
    <Wrapper>
      <MarketplaceNavBar profile={userRole != 'notAuth'} />
      {/* {userRole != 'notAuth' && (
        <BreadcrumbComponent
          breadcrumbInfo={'ProductPricing'}
          icon={BsBoxSeam}
        />
      )} */}
      <section style={{ minHeight: '100vh' }}>
        <div className="main-container">
          <section className="  mb-4 pb-3">
            <div className="pt-8 text-center fw-bold  ">
              {' '}
              <h4>
                {' '}
                <FontAwesomeIcon
                  icon={faBox}
                  className="mr-2 product-icon ml-2"
                />
                {listProduct?.[productId]?.displayName?.toUpperCase()}
                {listProduct?.[productId]?.description && (
                  <div
                    style={{ fontSize: 'var(--largeFont)' }}
                    className="col-lg-12 text-center pb-3 mt-2 "
                  >
                    {listProduct?.[productId]?.description}
                  </div>
                )}
              </h4>
            </div>
          </section>
          <Card>
            <Card.Body>
              <div className="text-center">{renderCycleRadioButtons()}</div>
              <Row className=" ">
                {groupedByCycle &&
                  groupedByCycle[selectedCycle] &&
                  Object.keys(groupedByCycle[selectedCycle]).map(
                    (plansPrice) => {
                      const renderedPlans = renderFeaturePlans(
                        groupedByCycle[selectedCycle]?.[plansPrice]?.plan.id
                      )

                      return (
                        renderedPlans && (
                          <Col
                            key={
                              groupedByCycle[selectedCycle]?.[plansPrice]?.plan
                                .id
                            }
                            md={
                              Object.keys(groupedByCycle[selectedCycle])
                                .length >= 3
                                ? groupedByCycle[selectedCycle].length
                                : 3
                            }
                          >
                            {renderedPlans}
                          </Col>
                        )
                      )
                    }
                  )}
              </Row>{' '}
            </Card.Body>
          </Card>
        </div>
      </section>
    </Wrapper>
  )
}

export default PricingPage
