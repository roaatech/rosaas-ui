import {
  Card,
  Col,
  Row,
  Button,
  Form,
  Container,
  OverlayTrigger,
  Tooltip,
  Table,
} from '@themesberg/react-bootstrap'
import { useEffect } from 'react'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import useRequest from '../../../axios/apis/useRequest'

import {
  BsCheck2Circle,
  BsCheckCircle,
  BsCheckCircleFill,
  BsFillQuestionCircleFill,
} from 'react-icons/bs'
import { faCreditCard } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { FormattedMessage, useIntl } from 'react-intl'
import { cycle } from '../../../const/product'
import { Wrapper } from './CheckoutStep.styled'
import { setStep } from '../../../store/slices/tenants'
import { da } from 'date-fns/locale'
import ThemeDialog from '../Shared/ThemeDialog/ThemeDialog'
import GenerateNavigationLinkModal from './GenerateNavigationLinkModal/GenerateNavigationLinkModal'
import { toast } from 'react-toastify'
import SafeFormatMessage from '../Shared/SafeFormatMessage/SafeFormatMessage'
import useSharedFunctions from '../Shared/SharedFunctions/SharedFunctions'
import { setLoading } from '../../../store/slices/main'
import ProcessFailed from '../../../pages/ProcessFailed/ProcessFailed'
import { set } from 'lodash'

const CheckoutPage = (data) => {
  const { hasToPay, setHasToPay, tenantDisplayName, priceData } = data
  const [orderData, setOrderData] = useState()
  const [appliedDiscountsIds, setAppliedDiscountsIds] = useState([])
  const [discountsList, setDiscountsList] = useState([])
  const [discountsAmountsList, setDiscountsAmountsList] = useState([])

  const [trialPlanId, setTrialPlanId] = useState()

  useEffect(() => {
    if (!orderData) {
      return
    }
    setTrialPlanId(orderData.orderItems[0].planId)
  }, [orderData])

  const { productSystemName, productOwnerSystemName, priceName } = useParams()

  const hash = window.location.hash
  const currency = useSelector((state) => state.main.currency)

  const array = hash.split('#')
  const orderID = array.find(
    (element) => element !== '' && element !== 'start-with-trial'
  )

  const [paymentMethod, setPaymentMethod] = useState(2)
  const [rememberCardInfo, setRememberCardInfo] = useState(false)
  const [autoRenewal, setAutoRenewal] = useState(false)
  const [discountCode, setDiscountCode] = useState('')
  const [isDiscountApplied, setIsDiscountApplied] = useState(false)
  const [discountCodeStatus, setDiscountCodeStatus] = useState(false)
  const [showDiscountAmount, setShowDiscountAmount] = useState(false)

  const dispatch = useDispatch()

  const {
    paymentCheckout,
    getFeaturePlanPublic,
    getOrderByIdPublic,
    validateDiscountCoupon,
    getDiscountsLookupByListIdsArray,
  } = useRequest()

  const listProduct = useSelector((state) => state.publicProducts.products)

  const productData = Object.values(
    Object.fromEntries(
      Object.entries(listProduct).filter(
        ([key, value]) => value.systemName === productSystemName
      )
    )
  )[0]

  const [productId, setProductId] = useState(productData?.id)
  const [processFailed, setProcessFailed] = useState(false)

  useEffect(() => {
    if ((!orderID || orderData) && !isDiscountApplied) {
      return
    }

    ;(async () => {
      const order = await getOrderByIdPublic(orderID)
      setOrderData(order.data.data)
      setAppliedDiscountsIds(
        order.data.data?.calculatedOrderTotal?.appliedDiscountsIds
      )
      setDiscountsAmountsList(order.data.data?.orderDiscounts)

      if (order.data && order.data.data === null) {
        setProcessFailed(true)
      }
    })()

    setIsDiscountApplied(false)
  }, [orderID, currency, isDiscountApplied])
  useEffect(() => {
    if (appliedDiscountsIds.length === 0) {
      return
    }
    ;(async () => {
      const discountsList =
        await getDiscountsLookupByListIdsArray(appliedDiscountsIds)
      setDiscountsList(discountsList.data.data)
    })()
  }, [orderData])

  const [currentFeaturePlan, setCurrentFeaturePlan] = useState()

  const intl = useIntl()

  useEffect(() => {
    if (!priceData || !productSystemName) {
      return
    }

    ;(async () => {
      const featurePlan = await getFeaturePlanPublic(
        productOwnerSystemName,
        productSystemName,
        priceData?.plan.systemName
      )
      setCurrentFeaturePlan(featurePlan.data.data)
    })()
  }, [priceData, productSystemName])

  useEffect(() => {
    if (!orderData) {
      return
    }
    setHasToPay(orderData?.hasToPay)
    setProductId(orderData?.orderItems[0]?.productId)
  }, [orderData])
  const handleAutoRenewalChange = () => {
    const newValue = !autoRenewal

    setAutoRenewal(newValue)

    if (newValue) {
      setRememberCardInfo(true)
    }
  }

  const handleRememberCardInfoChange = () => {
    const newValue = !rememberCardInfo
    if (autoRenewal) {
      setRememberCardInfo(true)
    } else {
      setRememberCardInfo(newValue)
    }
  }

  const handleDiscountCodeStatus = () => {
    setDiscountCodeStatus(!discountCodeStatus)
  }
  const { getLocalizedString } = useSharedFunctions()
  const [navigationLink, setNavigationLink] = useState()
  const handlePayment = async () => {
    !visible && dispatch(setLoading(true))

    const payment = visible
      ? await paymentCheckout({
          orderID,
          paymentMethod: hasToPay ? paymentMethod : null,
          PaymentPlatform: hasToPay ? paymentMethod : null,
          allowStoringCardInfo: rememberCardInfo,
          enableAutoRenewal: autoRenewal,
          ignoreUser: true,
        })
      : await paymentCheckout({
          orderID,
          paymentMethod: hasToPay ? paymentMethod : null,
          PaymentPlatform: hasToPay ? paymentMethod : null,
          allowStoringCardInfo: rememberCardInfo,
          enableAutoRenewal: autoRenewal,
        })

    const navigationUrl = payment?.data.data.navigationUrl
    setNavigationLink(navigationUrl)
    if (navigationUrl && !visible) {
      const decodedUrl = decodeURIComponent(navigationUrl)
      window.location.href = decodedUrl
    }
    !visible && dispatch(setLoading(false))
  }

  const [trialEndDate, setTrialEndDate] = useState(null)
  useEffect(() => {
    if (orderData?.orderItems[0]?.trialPeriodInDays) {
      const today = new Date()
      const newTrialEndDate = new Date(
        today.setDate(
          today.getDate() + orderData?.orderItems[0]?.trialPeriodInDays
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
  }, [orderData])
  const [visible, setVisible] = useState()
  useEffect(() => {
    if (visible) {
      handlePayment()
    }
  }, [visible])

  const direction = useSelector((state) => state.main.direction)
  const renderFeaturePlans = () => {
    const featurePlans =
      currentFeaturePlan &&
      currentFeaturePlan.sort((a, b) => {
        return a.feature.id.localeCompare(b.feature.id)
      })

    return (
      <>
        <Card.Header>
          <SafeFormatMessage id={'Plan'} />{' '}
          <span className="fw-bold">
            {getLocalizedString(
              priceData?.plan.displayNameLocalizations
            )?.toUpperCase() || priceData?.plan.displayName?.toUpperCase()}
          </span>{' '}
          <SafeFormatMessage id={'of-Product'} />{' '}
          <span className="fw-bold">
            {getLocalizedString(
              priceData?.product?.displayNameLocalizations
            )?.toUpperCase() || priceData?.product?.displayName?.toUpperCase()}
          </span>
        </Card.Header>
        <Card.Body className="border-bottom ">
          <Row>
            {featurePlans?.map((featurePlan) => {
              return (
                <Col md={12}>
                  <div key={featurePlan.id}>
                    <p className="font-small">
                      <BsCheck2Circle
                        className="mx-2"
                        style={{ color: 'var(--second-color)' }}
                      />{' '}
                      {getLocalizedString(
                        featurePlan.descriptionLocalizations
                      ) ||
                        getLocalizedString(
                          featurePlan.feature.displayNameLocalizations
                        )}
                    </p>
                  </div>
                </Col>
              )
            })}
          </Row>
        </Card.Body>
      </>
    )
  }
  // Function to handle discount code application
  const handleApplyDiscount = async () => {
    try {
      const response = await validateDiscountCoupon(orderID, {
        couponsCodes: [discountCode],
      }) // Replace with your actual discount code API
      const success = response.data?.metadata?.success // Adjust based on your API response

      if (success) {
        setIsDiscountApplied(true)
        setShowDiscountAmount(true)
        toast.success('Discount Applied successfully', {
          position: toast.POSITION.TOP_CENTER,
          autoClose: 4000,
        })
      } else {
        toast.error('Discount not applied', {
          position: toast.POSITION.TOP_CENTER,
          autoClose: 4000,
        })
      }
    } catch (error) {
      console.error('Error applying discount code:', error)
    }
  }
  const [isAccordionOpen, setAccordionOpen] = useState(false)

  const toggleAccordion = () => {
    setAccordionOpen(!isAccordionOpen)
  }
  return (
    <Wrapper>
      <div className="main-container">
        <div>
          {!processFailed ? (
            <Container className="d-flex justify-content-center">
              <Col md={10}>
                <Card style={{ backgroundColor: 'var(--themeBackground)' }}>
                  <Card.Body>
                    <Row>
                      <Col lg={5} md={12}>
                        <Card.Header className="fw-bold">
                          <SafeFormatMessage id="Your-Subscribe-Information" />
                        </Card.Header>
                        <Card.Body>
                          <Row className="font-small">
                            {/* product */}

                            <div className="  d-flex align-items-center justify-content-between border-bottom border-light p-3 ">
                              <div className=" w-50 fw-bold">
                                <SafeFormatMessage id="Product" />
                                <OverlayTrigger
                                  trigger={['hover', 'focus']}
                                  overlay={
                                    <Tooltip>
                                      <SafeFormatMessage id="Subscription-Managenent-Product" />
                                    </Tooltip>
                                  }
                                >
                                  <span>
                                    <BsFillQuestionCircleFill
                                      style={{ color: 'var(--slate-gray)' }}
                                      className={
                                        direction == 'rtl'
                                          ? 'ar-questionCircle mr-2'
                                          : 'ml-2'
                                      }
                                    />
                                  </span>
                                </OverlayTrigger>
                              </div>
                              <div
                                className=" card-stats w-50 align-text-center"
                                // style={{ textAlign: 'center' }}
                              >
                                {priceData?.product?.displayNameLocalizations
                                  ? getLocalizedString(
                                      priceData?.product
                                        ?.displayNameLocalizations
                                    )
                                  : priceData?.product?.displayName}
                              </div>
                            </div>

                            {/* plan */}

                            <div className="d-flex align-items-center justify-content-between border-bottom border-light py-3 ">
                              <div className=" w-50 fw-bold">
                                <SafeFormatMessage id="Plan" />
                                <OverlayTrigger
                                  trigger={['hover', 'focus']}
                                  overlay={
                                    <Tooltip>
                                      <SafeFormatMessage id="Subscription-Managenent-Plan" />
                                    </Tooltip>
                                  }
                                >
                                  <span>
                                    <BsFillQuestionCircleFill
                                      style={{ color: 'var(--slate-gray)' }}
                                      className={
                                        direction == 'rtl'
                                          ? 'ar-questionCircle mr-2'
                                          : 'ml-2'
                                      }
                                    />
                                  </span>
                                </OverlayTrigger>
                              </div>
                              <div className=" card-stats w-50 align-text-center">
                                {priceData?.plan?.displayNameLocalizations
                                  ? getLocalizedString(
                                      priceData?.plan?.displayNameLocalizations
                                    )
                                  : priceData?.plan?.displayName}
                              </div>
                            </div>

                            {/* subsc */}

                            <div className="d-flex align-items-center justify-content-between border-bottom border-light py-3 ">
                              <div className=" w-50 fw-bold">
                                <SafeFormatMessage id="Subscription-Duration" />
                                <OverlayTrigger
                                  trigger={['hover', 'focus']}
                                  overlay={
                                    <Tooltip>
                                      <SafeFormatMessage id="Subscription-Managenent-Subscription" />
                                    </Tooltip>
                                  }
                                >
                                  <span>
                                    <BsFillQuestionCircleFill
                                      style={{ color: 'var(--slate-gray)' }}
                                      className={
                                        direction == 'rtl'
                                          ? 'ar-questionCircle mr-2'
                                          : 'ml-2'
                                      }
                                    />
                                  </span>
                                </OverlayTrigger>
                              </div>
                              <div className=" card-stats w-50 align-text-center">
                                {cycle[priceData?.cycle] && (
                                  <SafeFormatMessage
                                    id={cycle[priceData?.cycle]}
                                  />
                                )}{' '}
                              </div>
                            </div>
                          </Row>
                        </Card.Body>
                        {renderFeaturePlans()}
                      </Col>
                      <Col
                        lg={7}
                        md={12}
                        className={
                          direction == 'rtl'
                            ? 'border-right-1 border-light  '
                            : 'border-left-1 border-light  '
                        }
                      >
                        <div>
                          {/* Labels and prices table */}
                          <Card.Body>
                            {
                              <table className="table no-border p-0">
                                <tbody className="p-0">
                                  <tr>
                                    <td className="fw-bold">
                                      <SafeFormatMessage id="Order-Subtotal-Exclude-Tax" />
                                    </td>
                                    <td className="display-cell">
                                      {
                                        orderData?.calculatedOrderTotal
                                          .formattedUndiscountedPrice
                                      }
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="fw-bold">
                                      <SafeFormatMessage id="Order-Subtotal-Include-Tax" />
                                    </td>
                                    <td className="display-cell">
                                      {
                                        orderData?.calculatedOrderTotal
                                          .formattedUndiscountedPrice
                                      }
                                    </td>
                                  </tr>
                                  {(showDiscountAmount ||
                                    appliedDiscountsIds?.length > 0) && (
                                    <>
                                      <tr>
                                        <td className="fw-bold text-danger">
                                          <SafeFormatMessage id="Discount-Amount" />
                                        </td>
                                        <td className="fw-bold   display-cell">
                                          <span className="text-danger">
                                            -{' '}
                                            {
                                              orderData?.calculatedOrderTotal
                                                ?.formattedDiscountAmount
                                            }
                                          </span>
                                          <span
                                            onClick={toggleAccordion}
                                            style={{ cursor: 'pointer' }}
                                            className="mx-2"
                                          >
                                            {isAccordionOpen ? '▼' : '►'}{' '}
                                            {/* Arrow toggles direction */}
                                          </span>{' '}
                                        </td>
                                      </tr>
                                      {isAccordionOpen &&
                                        discountsList.map((discount, index) => (
                                          <tr key={index}>
                                            <td className="fw-bold text-danger display-cell">
                                              {discount.displayName}
                                            </td>
                                            <td className="fw-bold text-danger">
                                              -{' '}
                                              {discountsAmountsList &&
                                                Object.values(
                                                  discountsAmountsList
                                                ).find(
                                                  (item) =>
                                                    item.discountId ===
                                                    discount.id
                                                )?.formattedDiscountAmount}
                                            </td>
                                          </tr>
                                        ))}
                                    </>
                                  )}
                                  {orderData?.orderItems[0]
                                    ?.trialPeriodInDays ? (
                                    <>
                                      <tr>
                                        <td className="fw-bold">
                                          <SafeFormatMessage id="Due-Now" />
                                        </td>
                                        <td className="trial display-cell">
                                          0.00{' '}
                                          {` (${orderData?.userCurrencyCode}) `}
                                          /{' '}
                                          {
                                            orderData?.orderItems[0]
                                              ?.trialPeriodInDays
                                          }{' '}
                                          <SafeFormatMessage id="Days" />
                                        </td>
                                      </tr>
                                      <tr>
                                        <td className="fw-bold ">
                                          <SafeFormatMessage id="After-Trial" />
                                          <div className="normal-text font-small fw-bold">
                                            <SafeFormatMessage id="Ends-On" /> (
                                            {trialEndDate})
                                          </div>
                                        </td>
                                        <td className="total fw-bold display-cell ">
                                          <div>
                                            {
                                              orderData?.calculatedOrderTotal
                                                .formattedPrice
                                            }
                                          </div>
                                        </td>
                                      </tr>
                                    </>
                                  ) : (
                                    <tr className="">
                                      <td className="fw-bold ">
                                        <SafeFormatMessage id="Total" />
                                      </td>
                                      <td className="total fw-bold display-cell ">
                                        {' '}
                                        {
                                          orderData?.calculatedOrderTotal
                                            .formattedPrice
                                        }
                                      </td>
                                    </tr>
                                  )}
                                </tbody>
                              </table>
                            }
                            {
                              <Form className=" mt-3">
                                {hasToPay && (
                                  <Form.Group className="mb-3">
                                    <Form.Check
                                      type="checkbox"
                                      label={
                                        <SafeFormatMessage id="Remember-Card-Information" />
                                      }
                                      checked={rememberCardInfo}
                                      onChange={handleRememberCardInfoChange}
                                      value={rememberCardInfo}
                                      disabled={autoRenewal}
                                      className="font-small"
                                    />
                                  </Form.Group>
                                )}

                                <Form.Group className="mb-3">
                                  <Form.Check
                                    type="checkbox"
                                    label={
                                      <SafeFormatMessage id="Allow-Auto-Renewal" />
                                    }
                                    checked={autoRenewal}
                                    onChange={handleAutoRenewalChange}
                                    value={autoRenewal}
                                    className="font-small"
                                  />
                                </Form.Group>
                                <Form.Group className="">
                                  <Form.Check
                                    type="checkbox"
                                    label={
                                      <SafeFormatMessage id="Add-Coupon-Code" />
                                    }
                                    checked={discountCodeStatus}
                                    onChange={handleDiscountCodeStatus}
                                    value={discountCodeStatus}
                                    className="font-small"
                                  />
                                </Form.Group>

                                <div className=" mr-3">
                                  <Form.Group className="mb-3 merged-form-group">
                                    {discountCodeStatus && (
                                      <>
                                        <Form.Control
                                          type="text"
                                          placeholder={intl.formatMessage({
                                            id: 'Enter-Coupon-Code',
                                          })}
                                          value={discountCode}
                                          onChange={(e) =>
                                            setDiscountCode(e.target.value)
                                          }
                                          className="form-control"
                                        />
                                        <Button
                                          variant="secondary"
                                          type="button"
                                          onClick={handleApplyDiscount}
                                          className="btn"
                                        >
                                          <SafeFormatMessage id="Apply" />
                                        </Button>
                                      </>
                                    )}
                                  </Form.Group>
                                </div>
                              </Form>
                            }
                            <div
                              className={
                                hasToPay
                                  ? 'button-container-center'
                                  : 'button-container'
                              }
                            >
                              <Button
                                variant="secondary"
                                type="button"
                                onClick={handlePayment}
                                className={hasToPay ? 'px-6' : 'px-6'}
                              >
                                {hasToPay ? (
                                  <SafeFormatMessage id={`Checkout`} />
                                ) : (
                                  <SafeFormatMessage id="Complete" />
                                )}
                              </Button>
                              {hasToPay && (
                                <>
                                  <span className="underline m-2">
                                    <SafeFormatMessage id="or" />
                                  </span>
                                  <Button
                                    variant="primary"
                                    type="button"
                                    onClick={() => setVisible(true)}
                                    className="mx-2 "
                                  >
                                    <SafeFormatMessage id="Create-Payment-Link" />
                                  </Button>
                                </>
                              )}
                            </div>
                          </Card.Body>

                          <Card.Footer>
                            {orderData?.orderItems[0]?.trialPeriodInDays ? (
                              <div className="free-trial-terms">
                                <p className="fw-bold">
                                  <SafeFormatMessage id="Free-Trial-Terms" />
                                </p>

                                <p className="font-small">
                                  <BsCheckCircleFill className="check-circle" />{' '}
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
                              </div>
                            ) : (
                              ''
                            )}
                          </Card.Footer>
                        </div>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              </Col>
            </Container>
          ) : (
            <Row className="p-2">
              <ProcessFailed
                title="Order Failed"
                message="Your order failed to process. Please try again later."
              />
            </Row>
          )}
          <ThemeDialog visible={visible} setVisible={setVisible}>
            <GenerateNavigationLinkModal
              setVisible={setVisible}
              navigationLink={navigationLink}
            />
          </ThemeDialog>
        </div>
      </div>
    </Wrapper>
  )
}

export default CheckoutPage
