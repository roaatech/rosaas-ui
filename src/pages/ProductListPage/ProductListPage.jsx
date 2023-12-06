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
const ProductListPage = () => {
  const { getProductList } = useRequest()
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
              <span className="product-name">{product.displayName}</span>
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
    let query = `?page=1&pageSize=50&filters[0].Field=SearchTerm`

    ;(async () => {
      const productList = await getProductList(query)
      dispatch(setAllProduct(productList.data.data.items))
    })()
  }, [dispatch, listData])

  return (
    <Wrapper>
      <BreadcrumbComponent breadcrumbInfo={'ProductList'} icon={BsBoxSeam} />
      <div className="main-container">
        <Container>
          <Row>
            <Col md={12}>
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
            </Col>
          </Row>
        </Container>
      </div>{' '}
    </Wrapper>
  )
}

export default ProductListPage
