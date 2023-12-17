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
import useRequest from '../../axios/apis/useRequest'
import {
  setAllFeaturePlan,
  setAllPlans,
  setAllPlansPrice,
  setAllProduct,
} from '../../store/slices/products/productsSlice'
import BreadcrumbComponent from '../../components/custom/Shared/Breadcrumb/Breadcrumb'
import {
  BsBoxSeam,
  BsCheck2Circle,
  BsFillQuestionCircleFill,
} from 'react-icons/bs'
import {
  faCreditCard,
  faMoneyBillTransfer,
  faToggleOff,
  faToggleOn,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { FormattedDate, FormattedMessage, useIntl } from 'react-intl'
import Label from '../../components/custom/Shared/label/Label'
import { cycle, subscriptionStatus } from '../../const/product'
import { formatDate } from '../../lib/sharedFun/Time'
import DateLabel from '../../components/custom/Shared/DateLabel/DateLabel'
import NoteInputConfirmation from '../../components/custom/Shared/NoteInputConfirmation/NoteInputConfirmation'
import ThemeDialog from '../../components/custom/Shared/ThemeDialog/ThemeDialog'
import RenewForm from '../../components/custom/tenant/SubscriptionManagement/RenewForm/RenewForm'
import { Wrapper } from './CheckoutPage.styled'
import { setStep } from '../../store/slices/tenants'

const CheckoutPage = (data) => {
  const createdTenantData = useSelector((state) => state.tenants?.createdTenant)

  const orderID = data.orderID || createdTenantData?.orderId
  const { productId, subscribtionId } = useParams()
  const navigate = useNavigate()
  const [invoiceNumber, setInvoiceNumber] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('')

  const dispatch = useDispatch()
  const {
    getFeaturePlanList,
    getProductPlans,
    getProductList,
    getProductPlanPriceList,
    subscriptionDetails,
    cancelAutoRenewal,
    getOrderById,
    paymentCheckout,
  } = useRequest()
  const [update, setUpdate] = useState(0)
  const intl = useIntl()

  const planList = useSelector(
    (state) => state.products.products[productId]?.plans
  )

  const listProduct = useSelector((state) => state.products.products)
  const listData = useSelector(
    (state) => state.products.products[productId]?.featurePlan
  )
  const plansPriceList = useSelector(
    (state) => state.products.products[productId]?.plansPrice
  )
  const [subscriptionData, setsubscriptionData] = useState('')
  const tenantId = data?.currentTenant || createdTenantData?.id
  useEffect(() => {
    if ((subscriptionData && update == 0) || !tenantId) {
      return
    }
    ;(async () => {
      const subscriptionInfo = await subscriptionDetails(productId, tenantId)
      setsubscriptionData(subscriptionInfo.data.data)
    })()
  }, [update, tenantId])
  const handleConfirmation = async (data = '', comment) => {
    await cancelAutoRenewal({
      subscriptionId: subscriptionData?.subscriptionId,
      comment,
    })
    setUpdate(update + 1)
    setConfirm(false)
  }
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
  const [orderData, setOrderData] = useState()
  useEffect(() => {
    if (!orderID) {
      return
    }

    ;(async () => {
      const order = await getOrderById(orderID)
      setOrderData(order.data.data)
    })()
  }, [orderID])

  useEffect(() => {
    if (Object.values(listProduct).length < 0) {
      return
    }
    const fetchData = async () => {
      try {
        if (!listData || Object.keys(listData).length === 0) {
          const featurePlanData = await getFeaturePlanList(productId)
          dispatch(
            setAllFeaturePlan({
              productId: productId,
              data: featurePlanData.data.data,
            })
          )
        }

        if (!planList || Object.keys(planList).length === 0) {
          const allPlanData = await getProductPlans(productId)
          dispatch(
            setAllPlans({
              productId: productId,
              data: allPlanData.data.data,
            })
          )
        }
        if (!plansPriceList || Object.keys(plansPriceList).length == 0) {
          const allPlansPrices = await getProductPlanPriceList(productId)
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
  const [visible, setVisible] = useState(false)
  const [confirm, setConfirm] = useState(false)

  const handleToggleClick = () => {
    if (subscriptionData?.autoRenewal !== null) {
      setConfirm(true)
    } else {
      setVisible(true)
    }
  }

  const handlePayment = async () => {
    if (paymentMethod === 'stripe') {
      const payment = await paymentCheckout({
        subscribtionId,
        tenantId,
        orderID,
      })
      const navigationUrl = payment?.data.data.navigationUrl

      if (navigationUrl) {
        const decodedUrl = decodeURIComponent(navigationUrl)
        window.location.href = decodedUrl

        dispatch(setStep(1))
      }
    }
  }

  const direction = useSelector((state) => state.main.direction)

  const renderFeaturePlans = () => {
    const featurePlans =
      listData &&
      Object.values(listData)
        .filter(
          (item) => item.plan.id === plansPriceList?.[subscribtionId]?.plan.id
        )
        .sort((a, b) => {
          return a.feature.id.localeCompare(b.feature.id)
        })
    return (
      <>
        <Card.Header>
          Plan{' '}
          <span className="fw-bold">
            {plansPriceList?.[subscribtionId]?.plan.title?.toUpperCase()}
          </span>{' '}
          of Product{' '}
          <span className="fw-bold">
            {listProduct?.[productId]?.title?.toUpperCase()}
          </span>
        </Card.Header>
        <Card.Body className="border-bottom ">
          {featurePlans?.map((featurePlan) => (
            <div key={featurePlan.id}>
              <p>
                <BsCheck2Circle style={{ color: 'var(--second-color)' }} />{' '}
                {featurePlan.description || featurePlan.feature.title}
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
          {subscriptionData && (
            <Container className="card">
              <Row>
                <Col md={7}>
                  <Card.Header className="fw-bold">
                    <FormattedMessage id="Your-Subscribe-Information" />
                  </Card.Header>
                  <Card.Body>
                    {/* product */}
                    <div className="d-flex align-items-center justify-content-between border-bottom border-light pb-2 ">
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
                        {listProduct?.[productId].displayName}
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
                        {subscriptionData?.plan?.name}
                      </div>
                    </div>

                    {/* subsc status */}
                    <div className="d-flex align-items-center justify-content-between border-bottom  border-light py-3 ">
                      <div className=" w-50 fw-bold">
                        <FormattedMessage id="Subscription-Status" />
                        <OverlayTrigger
                          trigger={['hover', 'focus']}
                          overlay={
                            <Tooltip>
                              <FormattedMessage id="Subscription-Managenent-Subscription-Status" />
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
                        <Label
                          {...subscriptionStatus[subscriptionData?.isActive]}
                        />
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
                        ${subscriptionData?.planPrice?.price} /{' '}
                        <FormattedMessage
                          id={cycle[subscriptionData?.planPrice?.cycle]}
                        />
                      </div>
                    </div>

                    {/* Auto-Renewal */}
                    <div className="d-flex align-items-center justify-content-between border-bottom border-light py-3 ">
                      <div className="mb-0 w-50 fw-bold">
                        <FormattedMessage id="Auto-Renewal" />{' '}
                        <OverlayTrigger
                          trigger={['hover', 'focus']}
                          overlay={
                            <Tooltip>
                              <FormattedMessage id="Subscription-Managenent-Auto-Renewal" />
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
                      <div className=" ">
                        {subscriptionData?.autoRenewal ? (
                          <Label
                            {...{
                              background: 'rgb(239, 249, 246)',
                              value:
                                subscriptionData?.autoRenewal &&
                                `$${subscriptionData?.autoRenewal?.price} / ${
                                  cycle[subscriptionData?.autoRenewal?.cycle]
                                }`,
                              lighter: true,
                              color: 'rgb(0, 166, 117)',
                            }}
                          />
                        ) : (
                          <Label
                            {...{
                              background: '#ccc',
                              value: intl.formatMessage({ id: 'disabled' }),

                              lighter: true,
                              color: '#000000',
                            }}
                          />
                        )}

                        <FontAwesomeIcon
                          icon={
                            subscriptionData.autoRenewal
                              ? faToggleOn
                              : faToggleOff
                          }
                          className={`${
                            direction == 'rtl'
                              ? 'mr-2 pr-2 border-right-1 border-light '
                              : 'ml-2 pl-2 border-left-1 border-light '
                          }${
                            subscriptionData.autoRenewal
                              ? ' active-toggle  '
                              : ' passive-toggle '
                          }`}
                          onClick={handleToggleClick}
                        />
                      </div>
                    </div>

                    {/* start date */}
                    <div className="d-flex align-items-center justify-content-between  border-bottom border-light py-3 ">
                      <div className=" w-50 fw-bold">
                        <FormattedMessage id="Start-Date" />
                        <OverlayTrigger
                          trigger={['hover', 'focus']}
                          overlay={
                            <Tooltip>
                              <FormattedMessage id="Subscription-Managenent-Start-Date" />
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
                        <Label
                          {...{
                            background: '#cccccc40',
                            value: formatDate(subscriptionData?.startDate),
                            lighter: true,
                          }}
                        />{' '}
                      </div>
                    </div>

                    {/* End Date */}
                    <div className="d-flex align-items-center justify-content-between py-3 ">
                      <div className="mb-0 w-50 fw-bold">
                        <FormattedMessage id="End-Date" />
                        <OverlayTrigger
                          trigger={['hover', 'focus']}
                          overlay={
                            <Tooltip>
                              <FormattedMessage id="Subscription-Managenent-End-Date" />
                            </Tooltip>
                          }
                        >
                          <span>
                            <BsFillQuestionCircleFill
                              className={
                                direction == 'rtl'
                                  ? 'ar-questionCircle mr-2'
                                  : 'ml-2'
                              }
                              style={{ color: '#6c757d' }}
                            />
                          </span>
                        </OverlayTrigger>
                      </div>
                      <div>
                        <DateLabel endDate={subscriptionData.endDate} />
                      </div>
                    </div>
                  </Card.Body>
                </Col>
                <Col md={5} className="border-left-1 border-light  ">
                  <div>
                    {renderFeaturePlans()}
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
                                  <FontAwesomeIcon icon={faMoneyBillTransfer} />{' '}
                                  IBAN
                                </>
                              }
                              value="iban"
                              checked={paymentMethod === 'iban'}
                              onChange={() => setPaymentMethod('iban')}
                            />
                            {paymentMethod === 'iban' && (
                              <Form.Group className="mb-3">
                                <Form.Label>Invoice Number</Form.Label>
                                <Form.Control
                                  type="text"
                                  placeholder="Enter Invoice Number"
                                  value={invoiceNumber}
                                  onChange={(e) =>
                                    setInvoiceNumber(e.target.value)
                                  }
                                />
                              </Form.Group>
                            )}
                            <Form.Check
                              type="radio"
                              label={
                                <>
                                  <FontAwesomeIcon icon={faCreditCard} /> Stripe
                                </>
                              }
                              value="stripe"
                              checked={paymentMethod === 'stripe'}
                              onChange={() => setPaymentMethod('stripe')}
                            />
                          </div>
                        </Card.Body>
                      </Form.Group>
                    </Form>

                    {paymentMethod && (
                      <Card.Footer>
                        {/* Additional checkout information */}
                        <div className="d-flex align-items-start justify-content-between py-3">
                          <div className="w-50">
                            <p className="fw-bold">
                              Order Subtotal Exclude Tax
                            </p>
                            <p className="fw-bold">
                              Order Subtotal Include Tax
                            </p>
                            <p className="total fw-bold py-2 pl-1">
                              <span>Total</span>
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
                        <Button
                          variant="primary"
                          type="button"
                          onClick={handlePayment}
                        >
                          Pay with{' '}
                          {paymentMethod === 'iban' ? 'IBAN' : 'Stripe'}
                        </Button>
                      </Card.Footer>
                    )}
                  </div>
                </Col>
              </Row>
            </Container>
          )}
          {confirm && (
            <NoteInputConfirmation
              confirm={confirm}
              setConfirm={setConfirm}
              confirmFunction={handleConfirmation}
              message={intl.formatMessage({
                id: 'cancel-renew-message',
              })}
              placeholder={intl.formatMessage({ id: 'Comment' })}
            />
          )}
          {
            <ThemeDialog visible={visible} setVisible={setVisible}>
              <RenewForm
                popupLabel={<FormattedMessage id="Renew-Subscription" />}
                type={'edit'}
                tenantData={subscriptionData}
                visible={visible}
                setVisible={setVisible}
                sideBar={false}
                selectedProduct={productId}
                selectedPlan={subscriptionData?.plan?.id}
                currentSubscription={subscriptionData?.subscriptionId}
                setUpdate={setUpdate}
                update={update}
              />
            </ThemeDialog>
          }
        </div>
      </div>
    </Wrapper>
  )
}

export default CheckoutPage
