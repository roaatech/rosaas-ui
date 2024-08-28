import {
  Card,
  Col,
  Row,
  Button,
  Form,
  Container,
  OverlayTrigger,
  Tooltip,
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

const CheckoutPage = (data) => {
  const {
    hasToPay,
    setHasToPay,
    displayName: tenantDisplayName,
    priceData,
    trialPlanId,
  } = data

  const [orderData, setOrderData] = useState()

  const { productSystemName, productOwnerSystemName, priceName } = useParams()

  const hash = window.location.hash
  const currency = useSelector((state) => state.main.currency)

  const array = hash.split('#')
  const orderID = array.find(
    (element) => element !== '' && element !== 'start-with-trial'
  )

  const navigate = useNavigate()
  const [paymentMethod, setPaymentMethod] = useState(2)
  const [rememberCardInfo, setRememberCardInfo] = useState(false)
  const [autoRenewal, setAutoRenewal] = useState(false)

  const dispatch = useDispatch()

  const {
    paymentCheckout,
    getFeaturePlanPublic,
    getOrderByIdPublic,
    getFeaturePlanListPublic,
    applyDiscountCode,
  } = useRequest()

  const listProduct = useSelector((state) => state.products.products)

  const productData = Object.values(
    Object.fromEntries(
      Object.entries(listProduct).filter(
        ([key, value]) => value.systemName === productSystemName
      )
    )
  )[0]

  const [productId, setProductId] = useState(productData?.id)

  useEffect(() => {
    if (!orderID) {
      return
    }

    ;(async () => {
      const order = await getOrderByIdPublic(orderID)
      setOrderData(order.data.data)
    })()
  }, [orderID, currency])

  const [currentFeaturePlan, setCurrentFeaturePlan] = useState()
  const [trialFeaturePlan, setTrialFeaturePlan] = useState()
  const intl = useIntl()

  useEffect(() => {
    if (!priceData || !productSystemName) {
      return
    }

    if (trialPlanId && productSystemName) {
      ;(async () => {
        const featurePlanTrial = await getFeaturePlanListPublic(
          productOwnerSystemName,
          productSystemName
        )
        setTrialFeaturePlan(
          featurePlanTrial.data.data.filter(
            (item) => item.plan.id === trialPlanId
          )
        )
      })()
    } else {
      ;(async () => {
        const featurePlan = await getFeaturePlanPublic(
          productOwnerSystemName,
          productSystemName,
          priceData?.plan.systemName
        )
        setCurrentFeaturePlan(featurePlan.data.data)
      })()
    }
  }, [priceData, productSystemName, trialPlanId])

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
  const [discountCodeStatus, setDiscountCodeStatus] = useState(false)
  const handleDiscountCodeStatus = () => {
    setDiscountCodeStatus(!discountCodeStatus)
  }
  const [navigationLink, setNavigationLink] = useState()
  const handlePayment = async () => {
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
    if (hasToPay && paymentMethod === 2) {
      const navigationUrl = payment?.data.data.navigationUrl
      setNavigationLink(navigationUrl)
      if (navigationUrl && !visible) {
        const decodedUrl = decodeURIComponent(navigationUrl)
        window.location.href = decodedUrl

        dispatch(setStep(1))
      }
    } else {
      payment && navigate('/success')
      dispatch(setStep(1))
    }
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
          <FormattedMessage id={'Plan'} />{' '}
          <span className="fw-bold">
            {priceData?.plan.displayName?.toUpperCase()}
          </span>{' '}
          <FormattedMessage id={'of-Product'} />{' '}
          <span className="fw-bold">
            {listProduct?.[productId]?.displayName?.toUpperCase()}
          </span>
        </Card.Header>
        <Card.Body className="border-bottom ">
          {featurePlans?.map((featurePlan) => (
            <div key={featurePlan.id}>
              <p>
                <BsCheck2Circle style={{ color: 'var(--second-color)' }} />{' '}
                {featurePlan.description || featurePlan.feature.displayName}
              </p>
            </div>
          ))}
        </Card.Body>
      </>
    )
  }
  const [discountCode, setDiscountCode] = useState('')
  const [discountAmount, setDiscountAmount] = useState(0)
  const [isDiscountApplied, setIsDiscountApplied] = useState(false)

  // Function to handle discount code application
  const handleApplyDiscount = async () => {
    try {
      // const response = await applyDiscountCode(discountCode) // Replace with your actual discount code API
      // const { discount } = response.data // Adjust based on your API response
      setDiscountAmount(20)
      toast.success('Discount Applied successfully', {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 4000,
      })
      setIsDiscountApplied(true)
    } catch (error) {
      console.error('Error applying discount code:', error)
      // Handle errors (e.g., show error message)
    }
  }
  return (
    <Wrapper>
      <div className="main-container">
        <div className="p-3">
          <Container className="card">
            <Row>
              <Col md={7}>
                {renderFeaturePlans()}

                <Card.Header className="fw-bold">
                  <FormattedMessage id="Your-Subscribe-Information" />
                </Card.Header>
                <Card.Body>
                  {/* tenant Display name */}

                  <div className="d-flex align-items-center justify-content-between border-bottom border-light pb-2 ">
                    <div className=" w-50 fw-bold">
                      <FormattedMessage id="Display-Name" />
                      <OverlayTrigger
                        trigger={['hover', 'focus']}
                        overlay={
                          <Tooltip>
                            <FormattedMessage id="generated-automatically-by-system" />
                          </Tooltip>
                        }
                      >
                        <span>
                          <BsFillQuestionCircleFill
                            style={{ color: '#6c757d' }}
                            className={
                              direction == 'rtl'
                                ? 'ar-questionCircle mr-2'
                                : 'ml-2'
                            }
                          />
                        </span>
                      </OverlayTrigger>
                    </div>
                    <div className=" card-stats">{tenantDisplayName}</div>
                  </div>

                  {/* Tenant System Name */}

                  {/* <div className="d-flex align-items-center justify-content-between border-bottom border-light py-3 ">
                    <div className=" w-50 fw-bold">
                      <FormattedMessage id="System-Name" />
                      <OverlayTrigger
                        trigger={['hover', 'focus']}
                        overlay={
                          <Tooltip>
                            <FormattedMessage id="generated-automatically-by-system" />
                          </Tooltip>
                        }
                      >
                        <span>
                          <BsFillQuestionCircleFill
                            style={{ color: '#6c757d' }}
                            className={
                              direction == 'rtl'
                                ? 'ar-questionCircle mr-2'
                                : 'ml-2'
                            }
                          />
                        </span>
                      </OverlayTrigger>
                    </div>
                    <div className=" card-stats">{systemName}</div>
                  </div> */}

                  {/* product */}
                  <div className="d-flex align-items-center justify-content-between border-bottom border-light py-3 ">
                    <div className=" w-50 fw-bold">
                      <FormattedMessage id="Product" />
                      <OverlayTrigger
                        trigger={['hover', 'focus']}
                        overlay={
                          <Tooltip>
                            <FormattedMessage id="Subscription-Managenent-Product" />
                          </Tooltip>
                        }
                      >
                        <span>
                          <BsFillQuestionCircleFill
                            style={{ color: '#6c757d' }}
                            className={
                              direction == 'rtl'
                                ? 'ar-questionCircle mr-2'
                                : 'ml-2'
                            }
                          />
                        </span>
                      </OverlayTrigger>
                    </div>
                    <div className=" card-stats">
                      {priceData?.product?.displayName}
                    </div>
                  </div>

                  {/* plan */}
                  <div className="d-flex align-items-center justify-content-between border-bottom border-light py-3 ">
                    <div className=" w-50 fw-bold">
                      <FormattedMessage id="Plan" />
                      <OverlayTrigger
                        trigger={['hover', 'focus']}
                        overlay={
                          <Tooltip>
                            <FormattedMessage id="Subscription-Managenent-Plan" />
                          </Tooltip>
                        }
                      >
                        <span>
                          <BsFillQuestionCircleFill
                            style={{ color: '#6c757d' }}
                            className={
                              direction == 'rtl'
                                ? 'ar-questionCircle mr-2'
                                : 'ml-2'
                            }
                          />
                        </span>
                      </OverlayTrigger>
                    </div>
                    <div className=" card-stats">
                      {priceData?.plan?.displayName}
                    </div>
                  </div>

                  {/* subsc */}
                  <div className="d-flex align-items-center justify-content-between border-bottom border-light py-3 ">
                    <div className=" w-50 fw-bold">
                      <FormattedMessage id="Subscription" />
                      <OverlayTrigger
                        trigger={['hover', 'focus']}
                        overlay={
                          <Tooltip>
                            <FormattedMessage id="Subscription-Managenent-Subscription" />
                          </Tooltip>
                        }
                      >
                        <span>
                          <BsFillQuestionCircleFill
                            style={{ color: '#6c757d' }}
                            className={
                              direction == 'rtl'
                                ? 'ar-questionCircle mr-2'
                                : 'ml-2'
                            }
                          />
                        </span>
                      </OverlayTrigger>
                    </div>
                    <div className=" card-stats">
                      {priceData?.priceDetails?.formattedPrice} /{' '}
                      {cycle[priceData?.cycle] && (
                        <FormattedMessage id={cycle[priceData?.cycle]} />
                      )}{' '}
                    </div>
                  </div>
                </Card.Body>
              </Col>
              <Col
                md={5}
                className={
                  direction == 'rtl'
                    ? 'border-right-1 border-light  '
                    : 'border-left-1 border-light  '
                }
              >
                <div>
                  {/* {hasToPay && (
                    <Form>
                      <Form.Group className="mb-3">
                        <Card.Header className="mb-3 fw-bold">
                          <FormattedMessage id="Payment-Method" />
                        </Card.Header>
                        <Card.Body>
                          <div>
                            <Form.Check
                              type="radio"
                              label={
                                <>
                                  <FontAwesomeIcon icon={faCreditCard} /> Stripe
                                </>
                              }
                              value={2}
                              checked={paymentMethod === 2}
                              onChange={() => setPaymentMethod(2)}
                            />
                          </div>
                        </Card.Body>
                      </Form.Group>
                    </Form>
                  )} */}
                  <Card.Body>
                    {paymentMethod && hasToPay && (
                      <div className="d-flex align-items-start justify-content-between py-3">
                        <div className="">
                          <p className="fw-bold">
                            <FormattedMessage id="Order-Subtotal-Exclude-Tax" />
                          </p>
                          <p className="fw-bold">
                            <FormattedMessage id="Order-Subtotal-Include-Tax" />
                          </p>
                          {isDiscountApplied && (
                            <p className="fw-bold text-danger">
                              <FormattedMessage id="Discount-Amount" />
                            </p>
                          )}

                          {orderData?.orderItems[0]?.trialPeriodInDays ? (
                            <>
                              <p className="fw-bold">
                                <FormattedMessage id="Due-Now" />
                              </p>
                              <p className="fw-bold ">
                                <span className="p-0 mb-0">
                                  <FormattedMessage id="After-Trial" />
                                </span>
                                <br />
                                <span className="normal-text font-small fw-bold">
                                  <FormattedMessage id="Ends-On" /> (
                                  {trialEndDate})
                                </span>
                              </p>
                            </>
                          ) : (
                            <p className="fw-bold">
                              <FormattedMessage id="Total" />
                            </p>
                          )}
                        </div>
                        <div className="">
                          <span className=" d-flex flex-column align-items-center">
                            <p>
                              {
                                orderData?.orderSubtotalExclTaxDetails
                                  .formattedPrice
                              }
                            </p>
                            <p>
                              {
                                orderData?.orderSubtotalInclTaxDetails
                                  .formattedPrice
                              }
                            </p>
                            {isDiscountApplied && (
                              <p className="fw-bold text-danger">
                                - {discountAmount}
                                {` (${orderData?.userCurrencyCode}) `}
                              </p>
                            )}
                            {orderData?.orderItems[0]?.trialPeriodInDays ? (
                              <p className="trial">
                                0.00 {` (${orderData?.userCurrencyCode}) `}/{' '}
                                {orderData?.orderItems[0]?.trialPeriodInDays}{' '}
                                <FormattedMessage id="Days" />
                              </p>
                            ) : (
                              ''
                            )}
                            {isDiscountApplied && (
                              <p className="total fw-bold py-2 px-8">
                                ${orderData?.orderTotal - discountAmount}
                              </p>
                            )}
                            {
                              // !isDiscountApplied &&
                              !isDiscountApplied && (
                                <p className="total fw-bold py-2 px-8">
                                  {orderData?.orderTotalDetails.formattedPrice}
                                </p>
                              )
                            }
                          </span>
                        </div>
                      </div>
                    )}
                    {paymentMethod && hasToPay && (
                      <Form>
                        {/* Discount Code */}
                        <div className=" mr-3">
                          <Form.Check
                            type="checkbox"
                            label={<FormattedMessage id="Add-Discount-Code" />}
                            checked={discountCodeStatus}
                            onChange={handleDiscountCodeStatus}
                            disabled={autoRenewal}
                            className="font-small"
                          />
                          <Form.Group className="mb-3 merged-form-group">
                            {discountCodeStatus && (
                              <>
                                <Form.Control
                                  type="text"
                                  placeholder={intl.formatMessage({
                                    id: 'Enter-Discount-Code',
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
                                  <FormattedMessage id="Apply" />
                                </Button>
                              </>
                            )}
                          </Form.Group>
                        </div>
                        {/* Remember Card Information */}
                        <Form.Group className="mb-3">
                          <Form.Check
                            type="checkbox"
                            label={
                              <FormattedMessage id="Remember-Card-Information" />
                            }
                            checked={rememberCardInfo}
                            onChange={handleRememberCardInfoChange}
                            value={rememberCardInfo}
                            disabled={autoRenewal}
                            className="font-small"
                          />
                        </Form.Group>
                        {/* Auto Renewal */}
                        <Form.Group className="mb-3">
                          <Form.Check
                            type="checkbox"
                            label={<FormattedMessage id="Allow-Auto-Renewal" />}
                            checked={autoRenewal}
                            onChange={handleAutoRenewalChange}
                            value={autoRenewal}
                            className="font-small"
                          />
                        </Form.Group>
                      </Form>
                    )}
                    <div className="button-container">
                      <Button
                        variant="primary"
                        type="button"
                        onClick={handlePayment}
                      >
                        {hasToPay ? (
                          <FormattedMessage id={`Checkout`} />
                        ) : (
                          <FormattedMessage id="Complete" />
                        )}
                      </Button>
                      {hasToPay && (
                        <>
                          <span className="underline m-2">
                            <FormattedMessage id="or" />
                          </span>
                          <Button
                            variant="secondary"
                            type="button"
                            onClick={() => setVisible(true)}
                            className="mx-2"
                          >
                            <FormattedMessage id="Create-Payment-Link" />
                          </Button>
                        </>
                      )}
                    </div>
                  </Card.Body>
                  {orderData?.orderItems[0]?.trialPeriodInDays ? (
                    <Card.Footer>
                      <div className="free-trial-terms">
                        <p className="fw-bold">
                          <FormattedMessage id="Free-Trial-Terms" />
                        </p>

                        <p className="font-small">
                          <BsCheckCircleFill className="check-circle" />{' '}
                          <FormattedMessage id="Auto-Start-Billing-After-Trial" />
                          <br />
                          <BsCheckCircleFill className="check-circle" />{' '}
                          <FormattedMessage
                            id="Cancel-Before"
                            values={{ trialEndDate }}
                          />{' '}
                          {trialEndDate}{' '}
                          <FormattedMessage
                            id="Billing-Starts"
                            values={{ trialEndDate }}
                          />
                        </p>
                      </div>
                    </Card.Footer>
                  ) : (
                    ''
                  )}
                </div>
              </Col>
            </Row>
          </Container>
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
