import {
  faBox,
  faBuildingUser,
  faStore,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Card, Col, Row } from '@themesberg/react-bootstrap'
import { Link } from 'react-router-dom'
import useRequest from '../../axios/apis/useRequest'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'

import { Wrapper } from './Marketplace.styled'
import SafeFormatMessage from '../../components/custom/Shared/SafeFormatMessage/SafeFormatMessage'
import useSharedFunctions from '../../components/custom/Shared/SharedFunctions/SharedFunctions'
import { updateAllProductPublic } from '../../store/slices/publicProductsSlice'
import MarketplaceNavBar from '../../components/Sidebar/MarketplaceNavBar/MarketplaceNavBar'

const Marketplace = () => {
  const { getProductListPublic } = useRequest()
  const dispatch = useDispatch()
  const { getLocalizedString } = useSharedFunctions()
  const listData = useSelector((state) => state.publicProducts.products)

  useEffect(() => {
    if (listData && Object.keys(listData).length > 0) {
      return
    }
    ;(async () => {
      try {
        const productList = await getProductListPublic()
        dispatch(updateAllProductPublic(productList.data.data))
      } catch (error) {
        console.error('Error fetching product list:', error)
      }
    })()
  }, [listData && Object.keys(listData).length > 0])

  return (
    <Wrapper>
      <section style={{ minHeight: '92vh' }}>
        <MarketplaceNavBar />
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
            {listData &&
              Object.values(listData).length > 0 &&
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
                                {getLocalizedString(
                                  product?.displayNameLocalizations
                                )}
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
                          {getLocalizedString(
                            product.descriptionLocalizations
                          ) || '----'}
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
