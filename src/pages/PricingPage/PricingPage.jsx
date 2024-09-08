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
import { FormattedMessage, useIntl } from 'react-intl'
import { cycle } from '../../const'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBox, faInfoCircle } from '@fortawesome/free-solid-svg-icons'
import { signinRedirectPath } from '../../store/slices/auth'
import { setStep } from '../../store/slices/tenants'
import { Wrapper } from './PricingPage.styled'
import TrialLabel from '../../components/custom/tenant/TrialLabel/TrialLabel'
import MarketplaceNavBar from '../../components/Sidebar/MarketplaceNavBar/MarketplaceNavBar'
import { setProductOwner } from '../../store/slices/main'
import SafeFormatMessage from '../../components/custom/Shared/SafeFormatMessage/SafeFormatMessage'

const PricingPage = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const routeParams = useParams()
  const [showOldPrice, setShowOldPrice] = useState(true)
  const [language, setLanguage] = useState()

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
  const intl = useIntl()

  const plansPriceList = productData?.plansPrice

  const planList = productData?.plans
  console.log({ planList })

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
  console.log({ groupedByCycle })

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
        displayNameLocalizations: {
          [intl.locale]:
            featurePlan.feature?.displayNameLocalizations?.[intl.locale] ||
            featurePlan.feature?.displayName,
        },
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
                  label={<SafeFormatMessage id={cycle[cycleNum]} />}
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
  const currencyCode = currency.currencyCode
  const direction = useSelector((state) => state.main.direction)

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
          descriptionLocalizations: {
            [intl.locale]: featurePlan?.descriptionLocalizations?.[intl.locale],
          },
        }
      })

    return (
      <div>
        {
          <Card>
            <Card.Header
              style={{
                transition: 'all 0.9s',
                minHeight: '173px',
                backgroundColor: 'rgb(255 201 102 / 8%)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                // alignItems: 'center',
              }}
              className=""
            >
              {' '}
              <div
                className="d-flex align-items-center justify-content-between fw-bold mt-2 "
                style={{
                  fontSize: '1.5rem',
                  fontWeight: 'bold',
                }}
              >
                {listProduct?.[productId]?.trialType == 2 &&
                listProduct?.[productId]?.trialPlanId &&
                planId == listProduct?.[productId]?.trialPlanId ? (
                  <SafeFormatMessage id="Trial" />
                ) : (
                  planList[planId]?.displayNameLocalizations?.[
                    intl.locale
                  ]?.toUpperCase() ||
                  planList[planId]?.displayName?.toUpperCase()
                )}

                {listProduct?.[productId]?.trialType == 3 &&
                  planList[planId]?.trialPeriodInDays > 0 && (
                    <div
                      className={
                        direction == 'rtl' ? 'rtl tab-header' : 'tab-header'
                      }
                    >
                      <TrialLabel days={planList[planId]?.trialPeriodInDays} />
                    </div>
                  )}
                {listProduct?.[productId]?.trialType == 2 &&
                  planId == listProduct?.[productId]?.trialPlanId && (
                    <div
                      className={
                        direction == 'rtl' ? 'rtl tab-header' : 'tab-header'
                      }
                    >
                      <TrialLabel
                        days={listProduct?.[productId]?.trialPeriodInDays}
                      />
                    </div>
                  )}
              </div>
              <div className="d-flex align-items-center justify-content-between ">
                <div>
                  {showOldPrice &&
                    filteredPrices?.oldPriceDetails?.formattedPrice && (
                      <div
                        style={{
                          textDecoration: 'line-through',
                          color: 'var(--gray-600)',
                        }}
                        className=" mr-1 "
                      >
                        {' '}
                        {/* {filteredPrices?.priceDetails?.formattedPrice=="40.18 (SAR)"&&<span>40.18 (SAR)</span>} */}
                        {filteredPrices?.oldPriceDetails?.formattedPrice}
                      </div>
                    )}
                  <span
                    style={{
                      fontSize: '1.5rem',
                      fontWeight: 'bold',
                      transition: 'all 0.9s',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {filteredPrices?.priceDetails?.formattedPrice}
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
                      <SafeFormatMessage id={cycle[filteredPrices?.cycle]} />
                    )}
                  </span>
                  <div
                    style={{
                      color: 'var(--second-color) !important',
                      fontSize: '1.2rem',
                    }}
                    className=" mr-1 "
                  >
                    {filteredPrices?.descriptionLocalizations?.[intl.locale] ||
                      filteredPrices?.description}
                  </div>
                </div>
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
                        {featureStatusMap?.[feature.id]
                          ?.descriptionLocalizations?.[intl.locale] ||
                          featureStatusMap?.[feature.id]?.description ||
                          feature.displayNameLocalizations?.[intl.locale] ||
                          feature.displayName}{' '}
                      </span>
                    ) : (
                      <span>
                        <BsXCircle style={{ color: 'var(--silver-gray)' }} />{' '}
                        {feature.displayNameLocalizations?.[intl.locale] ||
                          feature.displayName}
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
                      <Form.Group
                        className={`mb-3 ${intl.locale === 'ar' ? 'rtl' : ''}`}
                      >
                        <Form.Check
                          type="checkbox"
                          label={
                            <>
                              <SafeFormatMessage id="With" />{' '}
                              <span style={{ color: 'var(--second-color' }}>
                                {listProduct?.[productId]?.trialPeriodInDays}{' '}
                                {listProduct?.[productId]?.trialPeriodInDays <=
                                10 ? (
                                  <SafeFormatMessage id="Days" />
                                ) : (
                                  <SafeFormatMessage id="Days-ar" />
                                )}{' '}
                              </span>
                              <SafeFormatMessage id="Free-Trial-Plan" />{' '}
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
                            <SafeFormatMessage id="start-your" />{' '}
                            <strong style={{ color: 'var(--second-color)' }}>
                              <SafeFormatMessage id="trial" />
                            </strong>{' '}
                            ,
                            <span>
                              {' '}
                              <SafeFormatMessage id="then" />{' '}
                              <strong style={{ color: 'var(--second-color)' }}>
                                <SafeFormatMessage id="switch-plans" />
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
                              <SafeFormatMessage id="seamlessly" />
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
                        window.top.location.href = `${
                          listProduct?.[productId]?.planSelectionRedirectUrl
                        }?plan-price=${
                          filteredPrices.systemName
                        }&currency-code=${currencyCode}&trial-enabled=${
                          startWithTrial[planId] ||
                          (listProduct?.[productId]?.trialType === 3 &&
                            planList[planId]?.trialPeriodInDays > 0)
                        }&language=${intl.locale}`
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
                    <>
                      <SafeFormatMessage id="Start-With" />{' '}
                      {planList[planId]?.displayNameLocalizations?.[intl.locale]
                        ? planList[planId]?.displayNameLocalizations?.[
                            intl.locale
                          ]?.toUpperCase()
                        : planList[planId]?.displayName?.toUpperCase()}
                    </>
                  </Button>
                </>
              ) : (
                listProduct?.[productId]?.trialType == 2 && (
                  <div className="text-center text-seamlessly mt-4">
                    <div>
                      <SafeFormatMessage id="start-your" />{' '}
                      <strong style={{ color: 'var(--second-color)' }}>
                        <SafeFormatMessage id="trial" />
                      </strong>
                      ,
                    </div>
                    <div>
                      <SafeFormatMessage id="then" />{' '}
                      <strong style={{ color: 'var(--second-color)' }}>
                        <SafeFormatMessage id="switch-plans" />
                      </strong>{' '}
                      <SafeFormatMessage id="seamlessly" />
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
  const [md, setMd] = useState(4) // Default value for `md` is 4 (3 columns)
  const [colsPerRow, setColsPerRow] = useState(3) // Initial assumption based on md={4}

  // Function to update the column size (`md`) based on window width
  const updateMd = () => {
    const width = window.innerWidth
    let newMd = 4

    if (width < 576) {
      newMd = 12
    } else if (width >= 576 && width < 768) {
      newMd = 6 // sm: 2 columns
    } else if (width >= 768 && width < 992) {
      newMd = 4 // md: 3 columns
    } else {
      newMd = 3 // lg and above: 4 columns
    }

    setMd(newMd) // Update the `md` value
    setColsPerRow(Math.floor(12 / newMd)) // Calculate columns per row
  }

  useEffect(() => {
    updateMd() // Set initial `md` and `colsPerRow` values based on current window width
    window.addEventListener('resize', updateMd) // Adjust on window resize

    // Cleanup event listener on component unmount
    return () => window.removeEventListener('resize', updateMd)
  }, [])

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
                {listProduct?.[productId]?.displayNameLocalizations?.[
                  intl.locale
                ]?.toUpperCase() ||
                  listProduct?.[productId]?.displayName?.toUpperCase()}
                {(listProduct?.[productId]?.description ||
                  listProduct?.[productId]?.descriptionLocalizations?.[
                    intl.locale
                  ]) && (
                  <div
                    style={{
                      fontSize: 'var(--largeFont)',
                      maxWidth: '900px', // Adjust the width as needed
                      margin: '0 auto', // Center horizontally
                      textAlign: 'center', // Center text within the container
                      padding: '0 1rem', // Add some padding for spacing
                    }}
                    className="text-center pb-3 mt-2"
                  >
                    {listProduct?.[productId]?.descriptionLocalizations?.[
                      intl.locale
                    ] || listProduct?.[productId]?.description}
                  </div>
                )}
              </h4>
            </div>
          </section>
          <Card>
            <Card.Body>
              <div className="text-center">{renderCycleRadioButtons()}</div>
              <Row className="justify-content-center mt-3 ">
                {' '}
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
                                .length > 3
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
              </Row>
            </Card.Body>
          </Card>
        </div>
      </section>
    </Wrapper>
  )
}

export default PricingPage
