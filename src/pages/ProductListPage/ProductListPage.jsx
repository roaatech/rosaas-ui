// ProductListPage.jsx

import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Card, Row, Col, Container, Button } from '@themesberg/react-bootstrap'
import { setAllProduct } from '../../store/slices/products/productsSlice'
import useRequest from '../../axios/apis/useRequest'
import { Wrapper } from './ProductListPage.styled'
import BreadcrumbComponent from '../../components/custom/Shared/Breadcrumb/Breadcrumb'
import { BsBoxSeam } from 'react-icons/bs'
import logoEn from '../../assets/img/brand/rosas.svg'
import logoAr from '../../assets/img/brand/rosas-ar.svg'
import { Link, useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBox, faCopy, faStopwatch } from '@fortawesome/free-solid-svg-icons'
import UpperContent from '../../components/custom/Shared/UpperContent/UpperContent'
import { FormattedMessage } from 'react-intl'
import DescriptionCell from '../../components/custom/Shared/DescriptionCell/DescriptionCell'
import { signinRedirectPath } from '../../store/slices/auth'
const ProductListPage = () => {
  const { getProductListPublic, getProductPlanPricePublicbyId } = useRequest()
  const dispatch = useDispatch()
  const navigate = useNavigate()

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
  const [redirectPath, setRedirectPath] = useState('')
  useEffect(() => {
    if (!redirectPath) {
      return
    }
    dispatch(signinRedirectPath({ redirectPath }))
  }, [redirectPath])
  let userRole = useSelector((state) => state.auth.userInfo.role)
  async function getPlanPriceName(id) {
    try {
      const planPrice = await getProductPlanPricePublicbyId(id)
      console.log({ planPrice: planPrice.data.data.systemName })
      return planPrice.data.data.systemName
    } catch (error) {
      console.error('Error fetching plan price:', error)
      return null
    }
  }
  const ProductCard = ({ product }) => {
    return (
      <Card className="p-1 m-1">
        <Card.Body>
          <Card.Title>
            <div className="d-flex align-items-center justify-content-between border-bottom border-light py-2">
              <Link
                to={`./products-list/${product.systemName}`}
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
                      const planPriceNamePromise = getPlanPriceName(
                        product.trialPlanPriceId
                      )
                      const planPriceName = await planPriceNamePromise
                      const path = `/checkout/product/${product.systemName}/plan-price/${planPriceName}`

                      if (!userRole) {
                        // navigate(`/signin`)
                        // setRedirectPath(path)
                        navigate(path)
                      } else {
                        navigate(path)
                      }
                    }}
                  >
                    <FontAwesomeIcon icon={faStopwatch} className="mr-2" />

                    <span style={{ fontSize: 'smaller' }}>
                      <FormattedMessage id="Start-With-Trial" />
                    </span>
                  </Button>
                </div>
              )}
            </div>
          </Card.Title>
          <Link
            to={`./products-list/${product.systemName}`}
            className="product-link "
          >
            <Card.Text className="product-description">
              {product.description || '----'}
            </Card.Text>
          </Link>
        </Card.Body>
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
