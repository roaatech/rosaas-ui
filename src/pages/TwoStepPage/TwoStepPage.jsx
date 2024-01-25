import {
  Card,
  Col,
  Container,
  ProgressBar,
  Row,
} from '@themesberg/react-bootstrap'
import { useEffect, useState } from 'react'
import { BsArrowBarDown, BsCheck2Circle, BsPersonFill } from 'react-icons/bs'
import CheckoutTenantReg from '../../components/custom/Checkout/CheckoutTenantReg'
import CheckoutPage from '../CheckoutPagePage/CheckoutPage'
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Steps } from 'primereact/steps'
import {
  faInfoCircle,
  faMoneyCheckDollar,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import BreadcrumbComponent from '../../components/custom/Shared/Breadcrumb/Breadcrumb'
import { FormattedMessage } from 'react-intl'
import { Wrapper } from './TwoStepPage.styled'
import {
  setAllPlansPrice,
  setAllProduct,
} from '../../store/slices/products/productsSlice'
import useRequest from '../../axios/apis/useRequest'
import { cycle } from '../../const'

const TwoStepProcessPage = () => {
  const { productId, subscribtionId } = useParams()
  const dispatch = useDispatch()
  const [displayName, setDisplayName] = useState()
  const [systemName, setsystemName] = useState()
  const step = useSelector((state) => state.tenants.currentStep)
  const [currentTenant, setCurrentTenant] = useState('')
  const [orderID, setOrderID] = useState('')
  const plansPriceList = useSelector(
    (state) => state.products.products[productId]?.plansPrice
  )
  const { getProductPlanPriceList, getProductList } = useRequest()
  const listProduct = useSelector((state) => state.products.products)
  useEffect(() => {
    if (!listProduct) {
      let query = `?page=1&pageSize=50&filters[0].Field=SearchTerm`
      ;(async () => {
        const productList = await getProductList(query)
        dispatch(setAllProduct(productList.data.data.items))
      })()
    }
  }, [])
  useEffect(() => {
    if (Object.values(listProduct).length < 0 || !listProduct) {
      return
    }

    const fetchData = async () => {
      try {
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
  const currentPlan = plansPriceList?.[subscribtionId]?.plan?.displayName
  const currentPriceData = plansPriceList?.[subscribtionId]
  const [hasToPay, setHasToPay] = useState()
  return (
    <Wrapper>
      <div className="main-container">
        <BreadcrumbComponent breadcrumbInfo={'ProductList'} />{' '}
        <Row>
          <Card>
            <Card.Body>
              <div className="text-center">
                <Steps
                  model={[
                    {
                      label: (
                        <>
                          <FontAwesomeIcon icon={faInfoCircle} />{' '}
                          <FormattedMessage id="Subscribtion-Info" />
                        </>
                      ),
                    },
                    {
                      label: (
                        <>
                          <FontAwesomeIcon icon={faMoneyCheckDollar} />{' '}
                          <FormattedMessage id="Check-Out" />
                        </>
                      ),
                    },
                  ]}
                  activeIndex={step - 1}
                  readOnly={step != 1 ? false : true}
                />{' '}
              </div>
              {step === 1 && (
                <Container className="card mt-3">
                  <Row>
                    <Col md={7} className="pr-3 border-right-1 border-light ">
                      <CheckoutTenantReg
                        type="create"
                        popupLabel={<FormattedMessage id="Enter-Your-Info" />}
                        currentProduct={productId}
                        currentPrice={subscribtionId}
                        setCurrentTenant={setCurrentTenant}
                        setOrderID={setOrderID}
                        setHasToPay={setHasToPay}
                        setsystemName={setsystemName}
                        setDisplayName={setDisplayName}
                      />
                    </Col>
                    <Col md={5}>
                      <Card.Header className="fw-bold">
                        <FormattedMessage id="Your-Subscribe-Information" />
                      </Card.Header>
                      <Card.Body>
                        {/* product */}
                        <div className="d-flex align-items-center justify-content-between border-bottom border-light pb-2 ">
                          <div className=" w-50 fw-bold">
                            <FormattedMessage id="Product" />
                          </div>
                          <div className=" card-stats">
                            {listProduct?.[productId]?.displayName}
                          </div>
                        </div>

                        {/* plan */}
                        <div className="d-flex align-items-center justify-content-between border-bottom border-light py-3 ">
                          <div className=" w-50 fw-bold">
                            <FormattedMessage id="Plan" />
                          </div>
                          <div className=" card-stats">{currentPlan}</div>
                        </div>

                        {/* subsc */}
                        <div className="d-flex align-items-center justify-content-between border-bottom border-light py-3 ">
                          <div className=" w-50 fw-bold">
                            <FormattedMessage id="Subscription" />
                          </div>
                          {currentPriceData && (
                            <div className=" card-stats">
                              ${currentPriceData?.price} /{' '}
                              <FormattedMessage
                                id={cycle[currentPriceData?.cycle]}
                              />
                            </div>
                          )}
                        </div>
                      </Card.Body>
                    </Col>
                  </Row>
                </Container>
              )}
              {step === 2 && (
                <CheckoutPage
                  currentTenant={currentTenant}
                  orderID={orderID}
                  hasToPay={hasToPay}
                  setHasToPay={setHasToPay}
                  displayName={displayName}
                  systemName={systemName}
                />
              )}{' '}
            </Card.Body>
          </Card>
        </Row>
      </div>
    </Wrapper>
  )
}

export default TwoStepProcessPage
