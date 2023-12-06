import {
  Card,
  Col,
  Row,
  Button,
  Form,
  Container,
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
import { BsBoxSeam, BsCheck2, BsCheck2Circle } from 'react-icons/bs'
import {
  faCreditCard,
  faMoneyBillTransfer,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { FormattedMessage } from 'react-intl'
import { countriesArray } from '../../const/product'

const CheckoutPage = () => {
  const { productId, subscribtionId } = useParams()
  console.log(useParams())
  const navigate = useNavigate()
  const [invoiceNumber, setInvoiceNumber] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('')

  const dispatch = useDispatch()
  const {
    getFeaturePlanList,
    getProductPlans,
    getProductList,
    getProductPlanPriceList,
  } = useRequest()

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
  console.log({ plansPriceList: plansPriceList[subscribtionId] })
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

  const handlePayment = async () => {
    if (paymentMethod === 'iban') {
      alert(`Paid with IBAN. Invoice Number: ${invoiceNumber}`)
    } else if (paymentMethod === 'stripe') {
      const stripePayment = await simulateStripePayment()
      if (stripePayment.success) {
        alert('Payment with Stripe successful!')
        navigate('/success')
      } else {
        alert('Payment with Stripe failed!')
      }
    }
  }
  const planPrice = plansPriceList?.[subscribtionId]?.price
  console.log({ planPrice })
  const calculateTaxes = () => {
    if (paymentMethod === 'iban') {
      return 0.1 * planPrice
    } else if (paymentMethod === 'stripe') {
      return 0.15 * planPrice
    }
    return 0
  }
  const taxes = calculateTaxes()
  const total = planPrice + taxes

  const simulateStripePayment = async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true })
      }, 2000)
    })
  }
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
            {plansPriceList?.[subscribtionId]?.plan.title.toUpperCase()}
          </span>{' '}
          of Product{' '}
          <span className="fw-bold">
            {listProduct?.[productId].displayName.toUpperCase()}
          </span>
        </Card.Header>
        <Card.Body className="border-bottom">
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
    <div className="main-container">
      <BreadcrumbComponent breadcrumbInfo={'ProductList'} icon={BsBoxSeam} />{' '}
      <div className="p-3">
        <Container className="card">
          <Row>
            <Col md={7}>
              <Card.Body>{renderFeaturePlans()}</Card.Body>
            </Col>
            <Col md={5} className="border-left-1 border-light ">
              <div>
                <Card.Body>
                  <Form>
                    <Form.Group className="mb-3">
                      <Card.Header className="mb-3">Payment Method</Card.Header>
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
                              onChange={(e) => setInvoiceNumber(e.target.value)}
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
                    </Form.Group>
                  </Form>
                </Card.Body>

                {paymentMethod && (
                  <Card.Footer>
                    {/* Additional checkout information */}
                    <div>
                      <p>Total Price: ${planPrice}</p>
                      <p>Taxes: ${taxes}</p>
                      <p>Total: ${total}</p>
                    </div>
                    <Button
                      variant="primary"
                      type="button"
                      onClick={handlePayment}
                    >
                      Pay with {paymentMethod === 'iban' ? 'IBAN' : 'Stripe'}
                    </Button>
                  </Card.Footer>
                )}
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  )
}

export default CheckoutPage
