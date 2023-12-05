import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import useRequest from '../../axios/apis/useRequest'
import { Card, Col, Row, Button } from '@themesberg/react-bootstrap'
import {
  setAllProduct,
  setAllPlans,
  setAllFeaturePlan,
  setAllPlansPrice,
} from '../../store/slices/products/productsSlice'
import BreadcrumbComponent from '../../components/custom/Shared/Breadcrumb/Breadcrumb'
import { BsBoxSeam, BsCheck2 } from 'react-icons/bs'
import { useState } from 'react'
import { FormattedMessage } from 'react-intl'

const PricingPage = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const routeParams = useParams()
  const productId = routeParams.id
  const [columns, setColumns] = useState(3)
  const listProduct = useSelector((state) => state.products.products)
  const plansPriceList = useSelector(
    (state) => state.products.products[productId]?.plansPrice
  )

  useEffect(() => {
    if (Object.values(listProduct).length > 0) {
      return
    }
    let query = `?page=1&pageSize=50&filters[0].Field=SearchTerm`

    ;(async () => {
      const productList = await getProductList(query)
      dispatch(setAllProduct(productList.data.data.items))
    })()
  }, [])
  const listData = useSelector(
    (state) => state.products.products[productId]?.featurePlan
  )

  const planList = useSelector(
    (state) => state.products.products[productId]?.plans
  )

  const {
    getFeaturePlanList,
    getProductPlans,
    getProductList,
    getProductPlanPriceList,
  } = useRequest()
  useEffect(() => {
    if (Object.values(listProduct).length < 0) {
      return
    }
    const fetchData = async () => {
      try {
        if (!listData || Object.keys(listData).length === 0) {
          const featurePlanData = await getFeaturePlanList(productId)
          dispatch(
            setAllFeaturePlan({
              productId: productId,
              data: featurePlanData.data.data,
            })
          )
        }

        if (!planList || Object.keys(planList).length === 0) {
          const allPlanData = await getProductPlans(productId)
          dispatch(
            setAllPlans({
              productId: productId,
              data: allPlanData.data.data,
            })
          )
        }
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
  const renderFeaturePlans = (planId) => {
    const featurePlans =
      listData &&
      Object.values(listData)
        .filter((item) => item.plan.id === planId)
        .sort((a, b) => {
          return a.feature.id.localeCompare(b.feature.id)
        })

    console.log('Sorted featurePlans:', featurePlans)

    return (
      <Card>
        <Card.Header>{planList[planId].name.toUpperCase()}</Card.Header>
        <Card.Body>
          {featurePlans.map((featurePlan) => (
            <div key={featurePlan.id}>
              <p>
                <BsCheck2 />{' '}
                {featurePlan.description || featurePlan.feature.title}
              </p>
            </div>
          ))}
        </Card.Body>
        <Card.Footer>
          <Button
            variant="primary"
            type="submit"
            className="w-100"
            onClick={() => navigate(`/payment/${planId}`)}
          >
            <FormattedMessage id="Start-With" />{' '}
            {planList[planId].name.toUpperCase()}
          </Button>
        </Card.Footer>
      </Card>
    )
  }
  const numPlans = planList && Object.keys(planList)?.length
  const numCols = numPlans > 4 ? 3 : Math.ceil(12 / numPlans)

  return (
    <div className="main-container">
      <Row>
        <BreadcrumbComponent breadcrumbInfo={'ProductList'} icon={BsBoxSeam} />

        {planList &&
          Object.keys(planList).map((planId) => (
            <Col key={planId} md={numCols}>
              {' '}
              {renderFeaturePlans(planId)}
            </Col>
          ))}
      </Row>
    </div>
  )
}

export default PricingPage
