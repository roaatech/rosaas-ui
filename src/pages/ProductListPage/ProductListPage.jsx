// ProductListPage.jsx

import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Card, Row, Col, Container } from '@themesberg/react-bootstrap'
import { setAllProduct } from '../../store/slices/products/productsSlice'
import useRequest from '../../axios/apis/useRequest'
import { Wrapper } from './ProductListPage.styled'
import BreadcrumbComponent from '../../components/custom/Shared/Breadcrumb/Breadcrumb'
import { BsBoxSeam } from 'react-icons/bs'
import logoEn from '../../assets/img/brand/rosas.svg'
import logoAr from '../../assets/img/brand/rosas-ar.svg'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBox, faCopy } from '@fortawesome/free-solid-svg-icons'
import UpperContent from '../../components/custom/Shared/UpperContent/UpperContent'
import { FormattedMessage } from 'react-intl'
import DescriptionCell from '../../components/custom/Shared/DescriptionCell/DescriptionCell'
const ProductListPage = () => {
  const { getProductListPublic } = useRequest()
  const dispatch = useDispatch()
  const listData = useSelector((state) => state.products.products)
  let direction = useSelector((state) => state.main.direction)
  let selectedLogo

  if (direction === 'rtl') {
    selectedLogo = logoAr
  } else {
    selectedLogo = logoEn
  }
  useEffect(() => {
    if (Object.values(listData).length > 0) {
      return
    }

    ;(async () => {
      const productList = await getProductListPublic()
      dispatch(setAllProduct(productList.data.data))
    })()
  }, [Object.values(listData).length > 0])
  const description =
    'product description product descriptionproduct descriptionproduct descriptionproduct description'
  const ProductCard = ({ product }) => {
    return (
      <Card className="p-1 m-1">
        <Link to={`./products-list/${product.id}`} className="product-link">
          <Card.Body>
            <Card.Title>
              <FontAwesomeIcon
                icon={faBox}
                style={{ cursor: 'pointer' }}
                className="mr-2 product-icon"
              />
              <span className="product-name">{product?.displayName}</span>
            </Card.Title>
            <Card.Text className="product-description">
              {product.description || description}
            </Card.Text>{' '}
          </Card.Body>
        </Link>{' '}
      </Card>
    )
  }

  return (
    <Wrapper>
      <BreadcrumbComponent breadcrumbInfo={'Home'} icon={BsBoxSeam} />
      <section
        className="d-flex align-items-center"
        style={{ minHeight: '100vh' }}
      >
        <div className="main-container">
          <section class=" mt-4 mb-4 pb-3">
            <div class="row justify-content-center">
              <div class="col-lg-12 text-center mb-3">
                <h1 class="mt-0">
                  <img src={selectedLogo} alt="Logo" width="100" height="100" />
                </h1>
              </div>
              <div class="col-lg-12 text-center mb-1">
                <h2 class="mt-0">
                  <FormattedMessage id="Seamless-SaaS-Transformation" />
                </h2>
              </div>{' '}
              <div
                class="col-lg-7 col-xl-6 text-center"
                style={{ fontSize: 'var(--largeFont)' }}
              >
                <FormattedMessage id="Rosaas-Description" />
              </div>
              <div class="col-lg-9 col-xl-8 text-center">
                {/* <p class="lead">{{ .Params.lead | safeHTML }}</p> */}
              </div>
            </div>
          </section>

          <Card>
            <Card.Body>
              <Row>
                {Object.values(listData).length > 0 &&
                  Object.values(listData).map((product) => (
                    <Col key={product.id} md={4}>
                      <ProductCard product={product} />
                    </Col>
                  ))}
              </Row>
            </Card.Body>
          </Card>
        </div>{' '}
      </section>
    </Wrapper>
  )
}

export default ProductListPage
