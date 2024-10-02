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

const CheckoutPage = (data) => {
  const { hasToPay, setHasToPay, tenantDisplayName, priceData } = data
  const [orderData, setOrderData] = useState()
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
    if (!orderID) {
      return
    }

    ;(async () => {
      const order = await getOrderByIdPublic(orderID)
      setOrderData(order.data.data)

      if (order.data && order.data.data === null) {
        setProcessFailed(true)
      }
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
    const featurePlans = currentFeaturePlan
      ? currentFeaturePlan.sort((a, b) => {
          return a.feature.id.localeCompare(b.feature.id)
        })
      : trialFeaturePlan &&
        trialFeaturePlan.sort((a, b) => {
          return a.feature.id.localeCompare(b.feature.id)
        })

    return (
      <>
        <Card.Header>
          <SafeFormatMessage id={'Plan'} />{' '}
          <span className="fw-bold">
            {getLocalizedString(
              priceData?.plan.displayNameLocalizations
            )?.toUpperCase() ||
              getLocalizedString(
                priceData?.product?.displayNameLocalizations
              )?.toUpperCase()}
          </span>{' '}
          <SafeFormatMessage id={'of-Product'} />{' '}
          <span className="fw-bold">
            {getLocalizedString(
              listProduct?.[productId]?.displayNameLocalizations
            )?.toUpperCase()}
          </span>
        </Card.Header>
        <Card.Body className="border-bottom ">
          {featurePlans?.map((featurePlan) => {
            return (
              <div key={featurePlan.id}>
                <p>
                  <BsCheck2Circle style={{ color: 'var(--second-color)' }} />{' '}
                  {getLocalizedString(
                    featurePlan.feature.descriptionLocalizations
                  ) ||
                    getLocalizedString(
                      featurePlan.feature.displayNameLocalizations
                    )}
                </p>
              </div>
            )
          })}
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
        <div className="">
          {!processFailed ? (
            <Container className="card">
              <Row>
                <Col lg={7} md={12}>
                  {renderFeaturePlans()}

                  <Card.Header className="fw-bold">
                    <SafeFormatMessage id="Your-Subscribe-Information" />
                  </Card.Header>
                  <Card.Body>
                    {/* tenant Display name */}

                    <div className="d-flex align-items-center justify-content-between border-bottom border-light pb-2 ">
                      <div className=" w-50 fw-bold">
                        <SafeFormatMessage id="Display-Name" />
                        <OverlayTrigger
                          trigger={['hover', 'focus']}
                          overlay={
                            <Tooltip>
                              <SafeFormatMessage id="generated-automatically-by-system" />
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
                      <SafeFormatMessage id="System-Name" />
                      <OverlayTrigger
                        trigger={['hover', 'focus']}
                        overlay={
                          <Tooltip>
                            <SafeFormatMessage id="generated-automatically-by-system" />
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
                        {getLocalizedString(
                          priceData?.product?.displayNameLocalizations
                        )}
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
                        {getLocalizedString(
                          priceData?.plan?.displayNameLocalizations
                        )}
                      </div>
                    </div>

                    {/* subsc */}
                    <div className="d-flex align-items-center justify-content-between border-bottom border-light py-3 ">
                      <div className=" w-50 fw-bold">
                        <SafeFormatMessage id="Subscription" />
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
                          <SafeFormatMessage id={cycle[priceData?.cycle]} />
                        )}{' '}
                      </div>
                    </div>
                  </Card.Body>
                </Col>
                <Col
                  lg={5}
                  md={12}
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
                          <SafeFormatMessage id="Payment-Method" />
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
                                  orderData?.orderSubtotalExclTaxDetails
                                    .formattedPrice
                                }
                              </td>
                            </tr>
                            <tr>
                              <td className="fw-bold">
                                <SafeFormatMessage id="Order-Subtotal-Include-Tax" />
                              </td>
                              <td className="display-cell">
                                {
                                  orderData?.orderSubtotalInclTaxDetails
                                    .formattedPrice
                                }
                              </td>
                            </tr>
                            {isDiscountApplied && (
                              <tr>
                                <td className="fw-bold text-danger">
                                  <SafeFormatMessage id="Discount-Amount" />
                                </td>
                                <td className="text-danger display-cell">
                                  - {discountAmount}{' '}
                                  {` (${orderData?.userCurrencyCode})`}
                                </td>
                              </tr>
                            )}
                            {orderData?.orderItems[0]?.trialPeriodInDays ? (
                              <>
                                <tr>
                                  <td className="fw-bold">
                                    <SafeFormatMessage id="Due-Now" />
                                  </td>
                                  <td className="trial display-cell">
                                    0.00 {` (${orderData?.userCurrencyCode}) `}/{' '}
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
                                        orderData?.orderTotalDetails
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
                                  {orderData?.orderTotalDetails.formattedPrice}
                                </td>
                              </tr>
                            )}
                            {isDiscountApplied && (
                              <tr>
                                <td className="fw-bold py-2 px-8 total">
                                  <SafeFormatMessage id="Total-Payable" />
                                </td>
                                <td className="fw-bold py-2 px-8 total">
                                  ${orderData?.orderTotal - discountAmount}
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      }
                      {
                        <Form>
                          <div className=" mr-3">
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
                                    <SafeFormatMessage id="Apply" />
                                  </Button>
                                </>
                              )}
                            </Form.Group>
                          </div>

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

                    {/* <Card.Body>
                    {paymentMethod && hasToPay && (
                      <div className="d-flex align-items-start justify-content-between py-3">
                        <div className="">
                          <p className="fw-bold">
                            <SafeFormatMessage id="Order-Subtotal-Exclude-Tax" />
                          </p>
                          <p className="fw-bold">
                            <SafeFormatMessage id="Order-Subtotal-Include-Tax" />
                          </p>
                          {isDiscountApplied && (
                            <p className="fw-bold text-danger">
                              <SafeFormatMessage id="Discount-Amount" />
                            </p>
                          )}

                          {orderData?.orderItems[0]?.trialPeriodInDays ? (
                            <>
                              <p className="fw-bold">
                                <SafeFormatMessage id="Due-Now" />
                              </p>
                              <p className="fw-bold ">
                                <span className="p-0 mb-0">
                                  <SafeFormatMessage id="After-Trial" />
                                </span>
                                <br />
                                <span className="normal-text font-small fw-bold">
                                  <SafeFormatMessage id="Ends-On" /> (
                                  {trialEndDate})
                                </span>
                              </p>
                            </>
                          ) : (
                            <p className="fw-bold">
                              <SafeFormatMessage id="Total" />
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
                                <SafeFormatMessage id="Days" />
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
                    
                  </Card.Body> */}
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
