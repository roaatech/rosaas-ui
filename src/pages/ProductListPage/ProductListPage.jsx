// ProductListPage.jsx

import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Card, Row, Col } from '@themesberg/react-bootstrap'
import { setAllProduct } from '../../store/slices/products/productsSlice'
import useRequest from '../../axios/apis/useRequest'
import { Wrapper } from './ProductListPage.styled'
import BreadcrumbComponent from '../../components/custom/Shared/Breadcrumb/Breadcrumb'
import { BsBoxSeam } from 'react-icons/bs'
import { Link } from 'react-router-dom'
const ProductListPage = () => {
  const { getProductList } = useRequest()
  const dispatch = useDispatch()
  const listData = useSelector((state) => state.products.products)
  const description =
    'product description product descriptionproduct descriptionproduct descriptionproduct description'
  const ProductCard = ({ product }) => {
    return (
      <Card className="p-1 m-1">
        <Card.Body>
          <Card.Title>
            <Link to={`./${product.id}`} className="product-link">
              {product.displayName}
            </Link>{' '}
          </Card.Title>
          <Card.Text>{product.description || description}</Card.Text>
        </Card.Body>
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
        <Row>
          {Object.values(listData).map((product) => (
            <Col key={product.id} md={4}>
              <ProductCard product={product} />
            </Col>
          ))}
        </Row>
      </div>{' '}
    </Wrapper>
  )
}

export default ProductListPage
