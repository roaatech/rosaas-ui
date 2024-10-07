import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { redirect, useNavigate, useParams } from 'react-router-dom'
import useRequest from '../../axios/apis/useRequest'
import { Card, Col, Row, Button, Form } from '@themesberg/react-bootstrap'

import {
  BsCheck2Circle,
  BsCheckCircleFill,
  BsStarFill,
  BsXCircle,
} from 'react-icons/bs'
import { useState } from 'react'
import { useIntl } from 'react-intl'
import { cycle } from '../../const'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBox, faInfoCircle } from '@fortawesome/free-solid-svg-icons'
import { signinRedirectPath } from '../../store/slices/auth'
import { setStep } from '../../store/slices/tenants'
import { Wrapper } from './PricingPage.styled'
import TrialLabel from '../../components/custom/tenant/TrialLabel/TrialLabel'
import MarketplaceNavBar from '../../components/Sidebar/MarketplaceNavBar/MarketplaceNavBar'
import SafeFormatMessage from '../../components/custom/Shared/SafeFormatMessage/SafeFormatMessage'
import useSharedFunctions from '../../components/custom/Shared/SharedFunctions/SharedFunctions'
import {
  deleteAllPlanPriceBySystemNamePublic,
  setAllFeaturePlanPublic,
  setAllPlansPricePublic,
  setAllPlansPublic,
  setAllProductPublic,
} from '../../store/slices/publicProductsSlice'
import useGlobal from '../../lib/hocks/global'

const PricingPage = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const routeParams = useParams()
  const [showOldPrice, setShowOldPrice] = useState(true)
  const [language, setLanguage] = useState()
  const [trialEndDate, setTrialEndDate] = useState(null)
  const { setCurrency, changeDirection } = useGlobal()
  const params = new URLSearchParams(window.location.search)
  const paramDirection = params.get('direction')
  const paramCurrencyCode = params.get('currencyCode')
  useEffect(() => {
    if (paramDirection) {
      changeDirection(paramDirection)
    }
    if (currencyCode) {
      setCurrency(paramCurrencyCode, params.get('currencyId'))
    }
  }, [paramDirection, paramCurrencyCode])

  const productSystemName = routeParams.productSystemName
  const productOwnerSystemName = routeParams.productOwnerSystemName || ''
  // const pOSystemName = useSelector((state) => state.main.pOSystemName)

  // useEffect(() => {
  //   if (!productOwnerSystemName) {
  //     return
  //   }
  //   dispatch(setProductOwner(productOwnerSystemName))
  // }, [productOwnerSystemName])

  const listProduct = useSelector((state) => state.publicProducts.products)

  const productData = Object.values(
    Object.fromEntries(
      Object.entries(listProduct).filter(
        ([key, value]) => value.systemName === productSystemName
      )
    )
  )[0]

  const productId = productData?.id

  useEffect(() => {
    if (!productId || !(listProduct && Object.keys(listProduct).length > 0))
      return
    if (listProduct?.[productId]?.trialPeriodInDays) {
      const today = new Date()
      const newTrialEndDate = new Date(
        today.setDate(
          today.getDate() + listProduct?.[productId]?.trialPeriodInDays
        )
      )

      const options = {
        year: 'numeric',
        month: 'short',
        day: '2-digit',
      }

      const formattedTrialEndDate = newTrialEndDate.toLocaleDateString(
        'en-US',
        options
      )
      setTrialEndDate(formattedTrialEndDate)
    }
  }, [
    listProduct?.[productId]?.trialPeriodInDays,
    productId,
    listProduct && Object.keys(listProduct).length > 0,
  ])
  const intl = useIntl()

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
  const { getLocalizedString } = useSharedFunctions()

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
    if (Object.values(listProduct).length > 0) {
      return
    }

    ;(async () => {
      const productList = await getProductListPublic()
      dispatch(setAllProductPublic(productList.data.data))
    })()
  }, [Object.values(listProduct).length > 0])

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
    dispatch(
      deleteAllPlanPriceBySystemNamePublic({ systemName: productSystemName })
    )
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
              setAllFeaturePlanPublic({
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
              setAllPlansPublic({
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
              setAllPlansPricePublic({
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
          [intl.locale]: getLocalizedString(
            featurePlan.feature?.displayNameLocalizations
          ),
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
      <Card.Header className="pt-0">
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
  const extractRedirectionLinkFromDescription = (description) => {
    const linkMatch = description.match(/#redirection-link=([^#]+)#/)
    const redirectionLink = linkMatch ? linkMatch[1] : ''

    // Replace ##word## with a clickable link
    const updatedDescription = description.replace(
      /##(.*?)##/,
      `<a href="${redirectionLink}" target="_blank" style="text-decoration: underline; color: var(--second-color); font-weight: bold;">$1</a>`
    )

    // Remove the redirection link part from the description
    const cleanedDescription = updatedDescription
      .replace(/#redirection-link=([^#]+)#/, '')
      .trim()

    return { cleanedDescription, redirectionLink }
  }
  const convertMargin = (margin) => {
    if (direction == 'ltr') {
      return margin
    } else if (margin == 'mr') {
      return 'ml'
    } else if (margin == 'ml') {
      return 'mr'
    }
  }

  /* RenderFeaturePlans */
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
            [intl.locale]: getLocalizedString(
              featurePlan?.descriptionLocalizations
            ),
          },
        }
      })
    const isAvailableForSelection = planList[planId]?.isAvailableForSelection

    let formattedDescription = ''
    if (!isAvailableForSelection) {
      const descriptionLocalizations = getLocalizedString(
        planList[planId]?.descriptionLocalizations
      )
      const { cleanedDescription } = extractRedirectionLinkFromDescription(
        descriptionLocalizations || ''
      )
      formattedDescription = cleanedDescription
    }

    return (
      <div>
        {
          <Card>
            {/* //style={isAvailableForSelection ? {} : { minWidth: '340px' }}> */}
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
                  getLocalizedString(
                    planList[planId]?.displayNameLocalizations
                  )?.toUpperCase() ||
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
                {isAvailableForSelection ? (
                  <div>
                    {showOldPrice &&
                      filteredPrices?.oldPriceDetails?.formattedPrice && (
                        <div
                          style={{
                            textDecoration: 'line-through',
                            color: 'var(--gray-600)',
                          }}
                          className={`${convertMargin('mr')}-1 `}
                        >
                          {' '}
                          {filteredPrices?.oldPriceDetails?.formattedPrice}
                        </div>
                      )}
                    <span
                      style={{
                        fontSize: '1.5rem',
                        fontWeight: 'bold',
                        transition: 'all 0.9s',
                        // whiteSpace: 'nowrap',
                      }}
                    >
                      {filteredPrices?.priceDetails?.formattedPrice}
                    </span>
                    <span
                      className={`mt-3 ${convertMargin('ml')}-1`}
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
                      className={`${convertMargin('mr')}-1 `}
                    >
                      {getLocalizedString(
                        filteredPrices?.descriptionLocalizations
                      )}
                    </div>
                  </div>
                ) : (
                  <span
                    style={{
                      fontSize: '1.5rem',
                      fontWeight: 'bold',
                      transition: 'all 0.9s',
                      // whiteSpace: 'nowrap',
                      color: 'var(--second-color)',
                    }}
                  >
                    <SafeFormatMessage id="Contact-Us" />
                  </span>
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
                        {getLocalizedString(
                          featureStatusMap?.[feature.id]
                            ?.descriptionLocalizations
                        ) ||
                          getLocalizedString(
                            feature.displayNameLocalizations
                          )}{' '}
                      </span>
                    ) : (
                      <span>
                        <BsXCircle style={{ color: 'var(--silver-gray)' }} />{' '}
                        {getLocalizedString(feature.displayNameLocalizations)}
                      </span>
                    )}{' '}
                  </p>
                </div>
              ))}
            </Card.Body>
            {listProduct?.[productId]?.trialType === 2 && (
              <Card.Footer
                style={{
                  backgroundColor: 'var(--light-blue-2)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  minHeight: '120px',
                }}
              >
                {/* planId !== listProduct?.[productId]?.trialPlanId && */}
                <Form.Group className={` ${intl.locale === 'ar' ? 'rtl' : ''}`}>
                  {planId == listProduct?.[productId]?.trialPlanId ? (
                    <div
                      className="font-small mb-1"
                      style={{ fontWeight: '600' }}
                    >
                      <span style={{ color: 'var(--second-color)' }}>
                        {listProduct?.[productId]?.trialPeriodInDays}{' '}
                        {listProduct?.[productId]?.trialPeriodInDays <= 10 ? (
                          <SafeFormatMessage id="Days" />
                        ) : (
                          <SafeFormatMessage id="Days-ar" />
                        )}{' '}
                      </span>
                      <SafeFormatMessage id="Free-Trial-Plan" />{' '}
                    </div>
                  ) : (
                    <Form.Check
                      type="checkbox"
                      label={
                        <div className="mx-2">
                          <SafeFormatMessage id="With" />{' '}
                          <span style={{ color: 'var(--second-color)' }}>
                            {listProduct?.[productId]?.trialPeriodInDays}{' '}
                            {listProduct?.[productId]?.trialPeriodInDays <=
                            10 ? (
                              <SafeFormatMessage id="Days" />
                            ) : (
                              <SafeFormatMessage id="Days-ar" />
                            )}{' '}
                          </span>
                          <SafeFormatMessage id="Free-Trial-Plan" />{' '}
                        </div>
                      }
                      checked={startWithTrial[planId] || false}
                      onChange={(event) =>
                        handleStartWithTrialChange(event, planId)
                      }
                      className="font-small"
                    />
                  )}
                  {startWithTrial[planId] && (
                    <p className="font-small pb-0 mb-0">
                      <BsCheck2Circle
                        className={`check-circle ${convertMargin('mr')}-2`}
                      />{' '}
                      <SafeFormatMessage
                        id="Cancel-Before"
                        values={{ trialEndDate }}
                      />{' '}
                      {trialEndDate}{' '}
                      <SafeFormatMessage
                        id="Billing-Starts"
                        values={{ trialEndDate }}
                      />
                      <br />{' '}
                      <BsCheck2Circle
                        className={`check-circle ${convertMargin('mr')}-2`}
                      />{' '}
                      <SafeFormatMessage id="Auto-Start-Billing-After-Trial" />
                    </p>
                  )}
                </Form.Group>
              </Card.Footer>
            )}
            <Card.Footer
              style={{
                // whiteSpace:
                //   listProduct?.[productId]?.trialType === 2 ? 'nowrap' : '',
                minHeight:
                  listProduct?.[productId]?.trialType === 2 ? '150px' : '',
                backgroundColor: !isAvailableForSelection
                  ? 'rgb(255 201 102 / 8%)'
                  : '',
                display: 'flex',
                flexDirection: 'column',
                textAlign: !isAvailableForSelection ? 'center' : '',
                justifyContent: 'center',
              }}
            >
              {!isAvailableForSelection ? (
                <div
                  className="text-center text-seamlessly mt-4"
                  style={{ whiteSpace: 'pre-wrap' }}
                  dangerouslySetInnerHTML={{
                    __html: formattedDescription,
                  }}
                />
              ) : (
                <>
                  {planId !== listProduct?.[productId]?.trialPlanId ? (
                    <>
                      {listProduct?.[productId]?.trialType === 2 &&
                        planId !== listProduct?.[productId]?.trialPlanId && (
                          <Form.Group
                            className={` mb-3 ${
                              intl.locale === 'ar' ? 'rtl' : ''
                            }`}
                          >
                            {startWithTrial[planId] && (
                              <div
                                style={{
                                  color: 'var(--second-color)',
                                  textAlign: 'justify',
                                }}
                                className="d-flex justify-content-center "
                              >
                                <span className="">
                                  <BsStarFill
                                    className={`${convertMargin('mr')}-2 mb-1`}
                                  />
                                  <SafeFormatMessage id="during-trial" />
                                  {'  '}
                                  <span className="fw-bold">
                                    <SafeFormatMessage id="no-charges" />
                                  </span>
                                  {'  '}
                                  <SafeFormatMessage id="card-info-securely-saved" />
                                </span>
                              </div>
                            )}
                          </Form.Group>
                        )}
                      {listProduct?.[productId]?.trialType !== 2 && (
                        <div className="small mb-3">
                          <span
                            className={`info-icon ${convertMargin('mr')}-1`}
                          >
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
                              <SafeFormatMessage id="switch-plans" />{' '}
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
                          {getLocalizedString(
                            planList[planId]?.displayNameLocalizations
                          )?.toUpperCase()}
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
                </>
              )}
            </Card.Footer>
          </Card>
        }
      </div>
    )
  }

  let localeDirection = useSelector((state) => state.main.direction)

  /* ResponsivePlans*/
  const getColumnsPerRow = () => {
    if (window.innerWidth >= 1506) {
      return 4
    } else if (window.innerWidth >= 1149) {
      return 3
    } else if (window.innerWidth >= 794) {
      return 2
    } else {
      return 1
    }
  }

  const ResponsivePlans = ({ groupedByCycle, selectedCycle }) => {
    const [columnsPerRow, setColumnsPerRow] = useState(getColumnsPerRow() || 4)

    useEffect(() => {
      const handleResize = () => {
        setColumnsPerRow(getColumnsPerRow())
      }

      window.addEventListener('resize', handleResize)

      return () => window.removeEventListener('resize', handleResize)
    }, [])

    return (
      <Row className="justify-content-center">
        {groupedByCycle &&
          groupedByCycle[selectedCycle] &&
          Object.keys(groupedByCycle[selectedCycle]).map(
            (plansPrice, index, arr) => {
              const renderedPlans = renderFeaturePlans(
                groupedByCycle[selectedCycle]?.[plansPrice]?.plan.id
              )

              const isAloneInRow =
                arr.length % columnsPerRow === 1 && index === arr.length - 1

              return (
                renderedPlans && (
                  //   ${
                  //   isAloneInRow ? 'align-start-alone' : ''
                  // }
                  <Col
                    className={`mt-3 
                    `}
                    key={groupedByCycle[selectedCycle]?.[plansPrice]?.plan.id}
                    lg={columnsPerRow && 12 / columnsPerRow}
                    md={columnsPerRow && 12 / columnsPerRow}
                    sm={columnsPerRow && 12 / columnsPerRow}
                    xs={columnsPerRow && 12 / columnsPerRow}
                  >
                    {renderedPlans}
                  </Col>
                )
              )
            }
          )}
      </Row>
    )
  }

  return (
    <Wrapper direction={localeDirection}>
      <MarketplaceNavBar profile={userRole != 'notAuth'} />
      {/* {userRole != 'notAuth' && (
        <BreadcrumbComponent
          breadcrumbInfo={'ProductPricing'}
          icon={BsBoxSeam}
        />
      )} */}
      <section style={{ minHeight: '100vh' }}>
        <div className="main-container">
          <section className="  mx-4 ">
            <div className="pt-8 text-center fw-bold  ">
              {' '}
              <h4>
                {' '}
                <FontAwesomeIcon
                  icon={faBox}
                  className={`product-icon ${convertMargin(
                    'ml'
                  )}-2 ${convertMargin('mr')}-2`}
                />
                {getLocalizedString(
                  listProduct?.[productId]?.displayNameLocalizations
                )?.toUpperCase()}
                {getLocalizedString(
                  listProduct?.[productId]?.descriptionLocalizations
                ) && (
                  <div
                    style={{
                      fontSize: 'var(--largeFont)',
                      maxWidth: '900px',
                      margin: '0 auto',
                      textAlign: 'center',
                      padding: '0 1rem',
                    }}
                    className="text-center pb-3 mt-2"
                  >
                    {getLocalizedString(
                      listProduct?.[productId]?.descriptionLocalizations
                    )}
                  </div>
                )}
              </h4>
            </div>
          </section>
          <Card>
            <Card.Body>
              <div className="text-center">{renderCycleRadioButtons()}</div>
              <Row className="justify-content-center">
                {groupedByCycle && groupedByCycle[selectedCycle] && (
                  <ResponsivePlans
                    groupedByCycle={groupedByCycle}
                    selectedCycle={selectedCycle}
                  />
                )}
              </Row>
            </Card.Body>
            {listProduct?.[productId]?.trialType == 3 && (
              <Card.Footer style={{ backgroundColor: 'var(--light-blue)' }}>
                <p className=" pb-0 mb-0">
                  <BsCheckCircleFill className="check-circle " />{' '}
                  <SafeFormatMessage id="Auto-Start-Billing-After-Trial" />
                  <br />
                  <BsCheckCircleFill className="check-circle" />{' '}
                  <SafeFormatMessage
                    id="Cancel-Before"
                    values={{ trialEndDate }}
                  />{' '}
                  {trialEndDate}{' '}
                  <SafeFormatMessage
                    id="Billing-Starts"
                    values={{ trialEndDate }}
                  />
                </p>
              </Card.Footer>
            )}
          </Card>
        </div>
      </section>
    </Wrapper>
  )
}

export default PricingPage
