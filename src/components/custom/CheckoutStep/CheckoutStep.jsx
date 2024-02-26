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

import { BsCheck2Circle, BsFillQuestionCircleFill } from 'react-icons/bs'
import { faCreditCard } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { FormattedMessage } from 'react-intl'
import { cycle } from '../../../const/product'
import { Wrapper } from './CheckoutStep.styled'
import { setStep } from '../../../store/slices/tenants'

const CheckoutPage = (data) => {
  const createdTenantData = useSelector((state) => state.tenants?.createdTenant)
  const orderID =
    data.orderID ||
    createdTenantData?.tenantData?.orderId ||
    createdTenantData?.tenantData?.id

  const { hasToPay, setHasToPay, displayName, priceData, setPriceData } = data

  useEffect(() => {
    if (!createdTenantData.tenantData?.hasToPay) {
      return
    }
    createdTenantData.tenantData?.hasToPay &&
      setHasToPay(createdTenantData?.tenantData?.hasToPay)
  }, [])
  const [orderData, setOrderData] = useState()

  const params = useParams()
  const { orderIDParam } = useParams()
  const [systemName, setSystemName] = useState(params.systemName)
  const [priceName, setPriceName] = useState(params.priceName)

  const navigate = useNavigate()
  const [paymentMethod, setPaymentMethod] = useState(2)

  const dispatch = useDispatch()
  const {
    getOrderById,
    paymentCheckout,
    getFeaturePlanPublic,
    getOrderByIdPublic,
  } = useRequest()

  const listProduct = useSelector((state) => state.products.products)

  const productData = Object.values(
    Object.fromEntries(
      Object.entries(listProduct).filter(
        ([key, value]) => value.systemName === systemName
      )
    )
  )[0]
  const [productId, setProductId] = useState(productData?.id)

  const listData = productData?.featurePlan

  useEffect(() => {
    if (!orderID) {
      return
    } else if (createdTenantData?.tenantData && orderData?.orderStatus == 2) {
      return setOrderData(createdTenantData.tenantData)
    }

    ;(async () => {
      const order = await getOrderByIdPublic(orderID)
      setOrderData(order.data.data)
    })()
  }, [orderID])
  const [currentFeaturePlan, setCurrentFeaturePlan] = useState()
  useEffect(() => {
    if (!priceData || !systemName) {
      return
    }
    ;(async () => {
      const featurePlan = await getFeaturePlanPublic(
        systemName,
        priceData?.plan.systemName
      )
      setCurrentFeaturePlan(featurePlan.data.data)
    })()
  }, [priceData, systemName])

  useEffect(() => {
    if (!orderData || !orderIDParam) {
      return
    }
    setHasToPay(orderData?.hasToPay)
    setProductId(orderData?.orderItems[0]?.productId)
  }, [orderData])

  const handlePayment = async () => {
    const payment = await paymentCheckout({
      orderID,
      paymentMethod: hasToPay ? paymentMethod : null,
    })
    if (hasToPay && paymentMethod === 2) {
      const navigationUrl = payment?.data.data.navigationUrl

      if (navigationUrl) {
        const decodedUrl = decodeURIComponent(navigationUrl)
        window.location.href = decodedUrl

        dispatch(setStep(1))
      }
    } else {
      payment && navigate('/success')
      dispatch(setStep(1))
    }
  }

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

  return (
    <Wrapper>
      <div className="main-container">
        <div className="p-3">
          <Container className="card">
            <Row>
              <Col md={7}>
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
                    <div className=" card-stats">
                      {displayName ||
                        createdTenantData?.displayName ||
                        createdTenantData?.tenantInfo?.displayName}
                    </div>
                  </div>

                  {/* Tenant System Name */}

                  <div className="d-flex align-items-center justify-content-between border-bottom border-light py-3 ">
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
                    <div className=" card-stats">
                      {systemName ||
                        createdTenantData?.systemName ||
                        createdTenantData?.tenantInfo?.systemName}
                    </div>
                  </div>

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
                      ${priceData?.price} /{' '}
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
                  {renderFeaturePlans()}
                  {hasToPay && (
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
                  )}

                  <Card.Footer>
                    {/* Additional checkout information */}
                    {paymentMethod && hasToPay && (
                      <div className="d-flex align-items-start justify-content-between py-3">
                        <div className="w-50">
                          <p className="fw-bold">
                            <FormattedMessage id="Order-Subtotal-Exclude-Tax" />
                          </p>
                          <p className="fw-bold">
                            <FormattedMessage id="Order-Subtotal-Include-Tax" />
                          </p>
                          <p className="total fw-bold py-2 pl-1">
                            <span>
                              {' '}
                              <FormattedMessage id="Total" />
                            </span>
                          </p>
                        </div>
                        <div className="w-50">
                          <p>${orderData?.orderSubtotalExclTax}</p>
                          <p>${orderData?.orderSubtotalInclTax}</p>
                          <p className="total fw-bold py-2">
                            ${orderData?.orderTotal}
                          </p>
                        </div>
                      </div>
                    )}
                    {
                      <Button
                        variant="primary"
                        type="button"
                        onClick={handlePayment}
                      >
                        {hasToPay ? (
                          <FormattedMessage
                            id={`Pay-${
                              paymentMethod === 1 ? 'Manual' : 'With-Stripe'
                            }`}
                          />
                        ) : (
                          <FormattedMessage id="Complete" />
                        )}
                      </Button>
                    }
                  </Card.Footer>
                </div>
              </Col>
            </Row>
          </Container>
        </div>
      </div>
    </Wrapper>
  )
}

export default CheckoutPage
