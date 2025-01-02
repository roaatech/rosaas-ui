import React, { useEffect, useState } from 'react'
import { ReviewAndLaunchWrapper } from './ReviewAndLaunch.styled'
import {
  Alert,
  Card,
  Col,
  Container,
  Row,
  Table,
} from '@themesberg/react-bootstrap'
import useRequest from '../../../axios/apis/useRequest'
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import {
  productInfo,
  productsChangeAttr,
} from '../../../store/slices/products/productsSlice'
import PricingPage from '../../../pages/PricingPage/PricingPage'
import SafeFormatMessage from '../Shared/SafeFormatMessage/SafeFormatMessage'
import Label from '../Shared/label/Label'
import { PublishStatus, visibilityStatus } from '../../../const/product'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTriangleExclamation } from '@fortawesome/free-solid-svg-icons'

const ReviewAndLaunch = ({}) => {
  const { getProduct } = useRequest()
  const routeParams = useParams()

  const productId = routeParams.id || routeParams.productId
  const products = useSelector((state) => state.products.products)
  const currentProduct = products?.[productId]
  const { publishProduct, visibleProduct } = useRequest()
  const dispatch = useDispatch()
  const togglePublishProduct = async (isPublished) => {
    await publishProduct(productId, {
      isPublished: !isPublished,
    })

    dispatch(
      productsChangeAttr({
        productId: productId,
        attributes: {
          isPublished: !isPublished,
        },
      })
    )
  }

  const toggleVisibleProduct = async (isVisible) => {
    await visibleProduct(productId, {
      isVisible: !isVisible,
    })

    dispatch(
      productsChangeAttr({
        productId: productId,
        attributes: {
          isVisible: !isVisible,
        },
      })
    )
  }
  return (
    <ReviewAndLaunchWrapper>
      <div className=" d-flex justify-content-between align-items-center my-4">
        <h4 className="" style={{ color: 'var(--primary4)' }}>
          <SafeFormatMessage id="Launch-Product" />
        </h4>
      </div>
      <Card border="light" className="shadow-sm mb-4">
        <Card.Body className="p-4">
          <Row className="d-flex justify-content-center">
            <Col md={6}>
              <Row className="d-flex justify-content-center">
                <Col md={6} className="d-flex justify-content-center">
                  <span className="fw-bold">
                    <SafeFormatMessage id={'Product-Status'} />
                  </span>
                </Col>
                <Col md={6} className="d-flex justify-content-center">
                  <span className="mx-2">
                    <Label
                      className={'clickable'}
                      isClickable={true}
                      onClick={() =>
                        togglePublishProduct(currentProduct?.isPublished)
                      }
                      {...PublishStatus[currentProduct?.isPublished]}
                    />
                  </span>
                </Col>
              </Row>
            </Col>
            <Col md={6}>
              <Row>
                <Col md={6} className="d-flex justify-content-center">
                  <span className="fw-bold">
                    <SafeFormatMessage id={'Product-Visibility'} />
                  </span>
                </Col>
                <Col md={6} className="d-flex justify-content-center">
                  <span className="mx-2">
                    <Label
                      isClickable={true}
                      onClick={() =>
                        toggleVisibleProduct(currentProduct?.isVisible)
                      }
                      {...visibilityStatus[currentProduct?.isVisible]}
                    />
                  </span>
                </Col>
              </Row>
            </Col>
          </Row>
        </Card.Body>
      </Card>
      <div className=" d-flex justify-content-between align-items-center my-4">
        <h4 className="" style={{ color: 'var(--primary4)' }}>
          <SafeFormatMessage id="Preview-Pricing" />
        </h4>
      </div>

      {currentProduct?.isPublished && currentProduct?.isVisible ? (
        <Card border="light" className="shadow-sm mb-4">
          <Card.Body className="p-4">
            <PricingPage
              ProductOwnerSystemName={currentProduct?.client?.systemName}
              ProductSystemName={currentProduct?.systemName}
              reviewAndLaunch={true}
            />
          </Card.Body>
        </Card>
      ) : (
        <Alert variant="warning">
          <div className="d-flex justify-content-center align-items-center">
            <FontAwesomeIcon icon={faTriangleExclamation} className="mr-2" />
            <strong>
              <SafeFormatMessage id={'Warning'} /> -
            </strong>
            {'  '}
            <span className="mx-2">
              <SafeFormatMessage
                id="Product-Not-Published"
                defaultMessage={
                  'product should be active and visible to preview pricing'
                }
              />
            </span>
          </div>
        </Alert>
      )}
    </ReviewAndLaunchWrapper>
  )
}

export default ReviewAndLaunch
