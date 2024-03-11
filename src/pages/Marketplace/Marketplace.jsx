import { faBox, faStopwatch, faStore } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button, Card, Col, Row } from '@themesberg/react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import useRequest from '../../axios/apis/useRequest'
import { useDispatch, useSelector } from 'react-redux'
import { FormattedMessage } from 'react-intl'
import { useEffect } from 'react'
import { setAllProduct } from '../../store/slices/products/productsSlice'
import { Wrapper } from './Marketplace.styled'
import BreadcrumbComponent from '../../components/custom/Shared/Breadcrumb/Breadcrumb'
import { BsBoxSeam } from 'react-icons/bs'

const Marketplace = () => {
  const { getProductListPublic, getProductPlanPricePublicbyId } = useRequest()
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const listData = useSelector((state) => state.products.products)

  useEffect(() => {
    if (Object.values(listData).length > 0) {
      return
    }

    ;(async () => {
      const productList = await getProductListPublic()
      dispatch(setAllProduct(productList.data.data))
    })()
  }, [Object.values(listData).length > 0])

  let userRole = useSelector((state) => state.auth.userInfo.role)

  async function getPlanPriceName(id) {
    try {
      const planPrice = await getProductPlanPricePublicbyId(id)
      return planPrice.data.data.systemName
    } catch (error) {
      console.error('Error fetching plan price:', error)
      return null
    }
  }
  const isRunningInIframe = window.self !== window.top

  return (
    <Wrapper>
      {!isRunningInIframe && (
        <BreadcrumbComponent breadcrumbInfo={'Home'} icon={BsBoxSeam} />
      )}
      <section
        className="d-flex align-items-center"
        style={{ minHeight: '100vh' }}
      >
        <div className="main-container">
          {' '}
          <section className=" mt-4 mb-4 pb-3">
            <div className="row justify-content-center">
              <div className="col-lg-12 text-center mb-3">
                {' '}
                <h1 className="product-title py-2">
                  <FontAwesomeIcon icon={faStore} className="mr-2" />
                  <FormattedMessage id="Marketplace" />
                </h1>
                <h4 className="product-title">
                  <FormattedMessage id="Product-Title" />
                </h4>
                <p className="product-sentence">
                  <FormattedMessage id="Product-Sentence" />
                </p>
              </div>
            </div>
          </section>
          <Card>
            <Card.Body>
              <Row>
                {Object.values(listData).length > 0 &&
                  Object.values(listData).map((product) => (
                    <Col key={product.id} md={4}>
                      <Card className="p-1 m-1">
                        <Card.Body>
                          <div className="d-flex align-items-center justify-content-between  py-2">
                            <Link
                              to={`./${product.systemName}`}
                              className="product-link mb-0 w-50 fw-bold"
                            >
                              <FontAwesomeIcon
                                icon={faBox}
                                style={{ cursor: 'pointer' }}
                                className="product-icon"
                              />
                              <span className="product-name ml-2 mr-2">
                                {product?.displayName}
                              </span>
                            </Link>
                            {product?.trialType == 2 && (
                              <div className="text-small">
                                <Button
                                  variant="secondary"
                                  size="sm"
                                  onClick={async () => {
                                    const planPriceNamePromise =
                                      getPlanPriceName(product.trialPlanPriceId)
                                    const planPriceName =
                                      await planPriceNamePromise
                                    const path = `/checkout/product/${product.systemName}/plan-price/${planPriceName}`

                                    if (!userRole) {
                                      navigate(path)
                                    } else {
                                      navigate(path)
                                    }
                                  }}
                                >
                                  <FontAwesomeIcon
                                    icon={faStopwatch}
                                    className="mr-2"
                                  />

                                  <span style={{ fontSize: 'smaller' }}>
                                    <FormattedMessage id="Start-With-Trial" />
                                  </span>
                                </Button>
                              </div>
                            )}
                          </div>
                          <Link
                            to={`./${product.systemName}`}
                            className="product-link "
                          >
                            <Card.Text className="product-description">
                              {product.description || '----'}
                            </Card.Text>
                          </Link>
                        </Card.Body>
                      </Card>
                    </Col>
                  ))}
              </Row>
            </Card.Body>
          </Card>
        </div>
      </section>
      <div className="copy">
        COPYRIGHT <span className="yellow">&copy;</span> 2023 ROAA INFORMATION
        TECHNOLOGY
      </div>
    </Wrapper>
  )
}

export default Marketplace
