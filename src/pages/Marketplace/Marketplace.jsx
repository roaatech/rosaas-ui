import {
  faBox,
  faBuildingUser,
  faStore,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Card, Col, Row } from '@themesberg/react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import useRequest from '../../axios/apis/useRequest'
import { useDispatch, useSelector } from 'react-redux'
import { FormattedMessage, useIntl } from 'react-intl'
import { useEffect, useState } from 'react'
import {
  setAllProduct,
  updateAllProduct,
} from '../../store/slices/products/productsSlice'
import { Wrapper } from './Marketplace.styled'
import BreadcrumbComponent from '../../components/custom/Shared/Breadcrumb/Breadcrumb'
import { BsBoxSeam } from 'react-icons/bs'
import SafeFormatMessage from '../../components/custom/Shared/SafeFormatMessage/SafeFormatMessage'

const Marketplace = () => {
  const { getProductListPublic, getProductPlanPricePublicbyId } = useRequest()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const intl = useIntl()
  const [language, setLanguage] = useState()
  const listData = useSelector((state) => state.products.products)
  useEffect(() => {
    if (language == intl.locale && Object.keys(listData).length > 0) {
      return
    }
    ;(async () => {
      try {
        const productList = await getProductListPublic()
        dispatch(updateAllProduct(productList.data.data))
        setLanguage(intl.locale)
      } catch (error) {
        console.error('Error fetching product list:', error)
      }
    })()
  }, [Object.keys(listData).length > 0, language == intl.locale])

  let userRole = useSelector((state) => state.auth.userInfo.userType)

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
      <section style={{ minHeight: '92vh' }}>
        {!isRunningInIframe && (
          <BreadcrumbComponent breadcrumbInfo={'Home'} icon={BsBoxSeam} />
        )}
        <div className="main-container">
          <section className=" mt-4 mb-4 pb-3">
            <div className="row justify-content-center">
              <div className="col-lg-12 text-center mb-3">
                <h1 className="product-title py-2">
                  <FontAwesomeIcon icon={faStore} className="mr-2" />
                  <SafeFormatMessage id="Marketplace" />
                </h1>
                <h4 className="product-title">
                  <SafeFormatMessage id="Product-Title" />
                </h4>
                <p className="product-sentence">
                  <SafeFormatMessage id="Product-Sentence" />
                </p>
              </div>
            </div>
          </section>
          {/* <Card>
            <Card.Body> */}
          <Row>
            {Object.values(listData).length > 0 &&
              Object.values(listData).map((product) => (
                <Col key={product.id} sm={6} md={4} lg={3}>
                  <Card
                    className={`p-1 m-1 ${
                      product.systemName === 'rosaas-management-area' &&
                      (product?.productOwner?.systemName == 'roaa' ||
                        product?.client?.systemName == 'roaa')
                        ? 'rosaas-management-area-card'
                        : ''
                    }`}
                  >
                    <Link
                      to={`./${
                        product?.client?.systemName ||
                        product?.productOwner?.systemName
                      }/${product.systemName}`}
                      className="product-link"
                    >
                      <Card.Body>
                        <div className="d-flex align-items-center justify-content-between  py-2">
                          <div className=" mb-0  ">
                            <h6>
                              <FontAwesomeIcon
                                icon={faBox}
                                style={{ cursor: 'pointer' }}
                                className="product-icon"
                              />
                              <span className="product-name ml-2 mr-2">
                                {product?.displayName}
                              </span>
                            </h6>
                            <div className=" mb-0  ">
                              <FontAwesomeIcon
                                icon={faBuildingUser}
                                style={{ cursor: 'pointer' }}
                                className="product-icon small"
                              />
                              <span className=" ml-2 mr-2 small">
                                {product?.client?.systemName ||
                                  product?.productOwner?.systemName}{' '}
                              </span>
                            </div>
                          </div>
                        </div>
                        <Card.Text className="product-description">
                          {product.description || '----'}
                        </Card.Text>
                      </Card.Body>
                    </Link>
                  </Card>
                </Col>
              ))}
          </Row>
          {/* </Card.Body>
          </Card> */}
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
