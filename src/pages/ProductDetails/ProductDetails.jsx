import React from 'react'
import { useState } from 'react'
import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import TableHead from '../../components/custom/Shared/TableHead/TableHead'
import BreadcrumbComponent from '../../components/custom/Shared/Breadcrumb/Breadcrumb'
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
import {
  BsBoxSeam,
  BsFillPersonPlusFill,
  BsFillTrash3Fill,
  BsPencilSquare,
  BsStars,
} from 'react-icons/bs'
import { AiFillEdit } from 'react-icons/ai'
import ProductFeaturePlan from '../../components/custom/Product/ProductFeaturePlan/ProductFeaturePlan'
import ProductFeaturesList from '../../components/custom/Product/ProductFeaturesList/ProductFeaturesList'

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
                  order: 4,
                  type: 'form',
                  id: routeParams.id,
                  label: 'Add-Feature',
                  component: 'addFeature',
                  icon: <BsStars />,
                },
                {
                  order: 4,
                  type: 'form',
                  id: routeParams.id,
                  label: 'Add-Plan',
                  component: 'addPlan',
                  icon: <BsPencilSquare />,
                },
                {
                  order: 2,
                  type: 'form',
                  id: routeParams.id,
                  label: 'Edit-Product',
                  component: 'editProduct',
                  icon: <AiFillEdit />,
                },
                {
                  order: 4,
                  type: 'form',
                  label: 'Add-Tenant',
                  component: 'addTenant',
                  icon: <BsFillPersonPlusFill />,
                },
                {
                  order: 5,
                  type: 'delete',
                  confirmationMessage: 'delete-product-confirmation-message',
                  id: routeParams.id,
                  navAfterDelete: '/products',
                  label: 'Delete-Product',
                  request: 'deleteProductReq',
                  icon: <BsFillTrash3Fill />,
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
            {/* <TabPanel header={<FormattedMessage id="Feature-Plan" />}>
              <ProductFeaturePlan />
            </TabPanel> */}
            <TabPanel header={<FormattedMessage id="Features" />}>
              <ProductFeaturesList
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
