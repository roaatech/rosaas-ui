// ProductListPage.jsx

import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Card, Row, Col, Container } from '@themesberg/react-bootstrap'
import { setAllProduct } from '../../store/slices/products/productsSlice'
import useRequest from '../../axios/apis/useRequest'
import { Wrapper } from './ProductListPage.styled'
import BreadcrumbComponent from '../../components/custom/Shared/Breadcrumb/Breadcrumb'
import {
  BsFillPersonLinesFill,
  BsBoxSeam,
  BsFillPersonFill,
  BsGearFill,
  BsFillClipboard2CheckFill,
  BsBoxes,
  BsSubscript,
  BsPersonFillDown,
  BsPersonSlash,
  BsPeople,
  BsExclamationTriangle,
} from 'react-icons/bs'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBox, faCopy } from '@fortawesome/free-solid-svg-icons'
import UpperContent from '../../components/custom/Shared/UpperContent/UpperContent'
import { FormattedMessage } from 'react-intl'
const ProductListPage = () => {
  const { getProductListPublic } = useRequest()
  const dispatch = useDispatch()
  const listData = useSelector((state) => state.products.products)
  const description =
    'product description product descriptionproduct descriptionproduct descriptionproduct description'
  const ProductCard = ({ product }) => {
    return (
      <Card className="p-1 m-1">
        <Link to={`./${product.id}`} className="product-link">
          <Card.Body>
            <Card.Title>
              <FontAwesomeIcon
                icon={faBox}
                style={{ cursor: 'pointer' }}
                className="mr-2 product-icon"
              />
              <span className="product-name">{product.title}</span>
            </Card.Title>
            <Card.Text>{product.description || description}</Card.Text>
          </Card.Body>
        </Link>{' '}
      </Card>
    )
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

  return (
    <Wrapper>
      <BreadcrumbComponent
        breadcrumbInfo={'ProductListPublic'}
        icon={BsBoxSeam}
      />
      <UpperContent>
        <h4 className="m-0">
          <FormattedMessage id="Product-List" />
        </h4>
      </UpperContent>
      <div className="main-container">
        <Card>
          <Card.Body>
            <Row>
              {Object.values(listData).map((product) => (
                <Col key={product.id} md={4}>
                  <ProductCard product={product} />
                </Col>
              ))}
            </Row>
          </Card.Body>
        </Card>
      </div>{' '}
    </Wrapper>
  )
}

export default ProductListPage
