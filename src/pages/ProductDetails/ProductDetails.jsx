import React from 'react'
import { useState } from 'react'
import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import TableHead from '../../components/custom/Shared/TableHead/TableHead'
import BreadcrumbComponent from '../../components/custom/Shared/Breadcrumb/Breadcrumb'
import { BsBoxSeam } from 'react-icons/bs'
import useRequest from '../../axios/apis/useRequest'
import { Wrapper } from './ProductDetails.styled'
import ProductDetailsTab from '../../components/custom/Product/ProdcutDetailsTab/ProdcutDetailsTab'
import ProductTenantsList from '../../components/custom/Product/ProductTenantsList/ProductTenantsList'
import { TabView, TabPanel } from 'primereact/tabview'
import { useDispatch, useSelector } from 'react-redux'
import { productInfo } from '../../store/slices/products'
import UpperContent from '../../components/custom/Shared/UpperContent/UpperContent'
import { FormattedMessage } from 'react-intl'
import DynamicButtons from '../../components/custom/Shared/DynamicButtons/DynamicButtons'

const ProductDetails = () => {
  const routeParams = useParams()
  const listData = useSelector((state) => state.products.products)
  let productData = listData[routeParams.id]
  const [visible, setVisible] = useState(false)
  const dispatch = useDispatch()

  const { getProduct, deleteProductReq } = useRequest()

  useEffect(() => {
    ;(async () => {
      const productData = await getProduct(routeParams.id)
      dispatch(productInfo(productData.data.data))
    })()
  }, [visible, routeParams.id])

  return (
    <Wrapper>
      {productData && (
        <BreadcrumbComponent
          breadcrumbInfo={'ProductDetails'}
          param1={productData.id}
          icon={BsBoxSeam}
        />
      )}

      {productData && (
        <div className="main-container">
          <UpperContent>
            <h4 className="m-0">
              <FormattedMessage id="Product-Details" /> : {productData.name}
            </h4>
            <DynamicButtons
              buttons={[
                {
                  type: 'delete',
                  confirmationMessage: 'delete-product-confirmation-message',
                  id: routeParams.id,
                  navAfterDelete: '/products',
                  label: 'Delete-product',
                  request: 'deleteProductReq',
                },
              ]}
            />
          </UpperContent>
          <TabView className="card">
            <TabPanel header={<FormattedMessage id="Details" />}>
              <ProductDetailsTab data={productData} />
            </TabPanel>

            <TabPanel header={<FormattedMessage id="Subscriptions" />}>
              <ProductTenantsList
                productId={productData.id}
                productName={productData.name}
              />
            </TabPanel>
          </TabView>
        </div>
      )}
    </Wrapper>
  )
}
export default ProductDetails
