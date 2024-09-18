import React from 'react'
import { useState } from 'react'
import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import BreadcrumbComponent from '../../components/custom/Shared/Breadcrumb/Breadcrumb'
import useRequest from '../../axios/apis/useRequest'
import { Wrapper } from './ProductDetails.styled'
import ProductDetailsTab from '../../components/custom/Product/ProdcutDetailsTab/ProdcutDetailsTab'
import ProductTenantsList from '../../components/custom/Product/ProductTenantsList/ProductTenantsList'
import { TabView, TabPanel } from 'primereact/tabview'
import { useDispatch, useSelector } from 'react-redux'
import {
  productInfo,
  productsChangeAttr,
  removeProductStore,
} from '../../store/slices/products/productsSlice.js'
import UpperContent from '../../components/custom/Shared/UpperContent/UpperContent'
import { FormattedMessage } from 'react-intl'
import DynamicButtons from '../../components/custom/Shared/DynamicButtons/DynamicButtons'
import {
  BsBoxSeam,
  BsFillPersonPlusFill,
  BsFillTrash3Fill,
  BsPencilSquare,
  BsStars,
  BsUiChecks,
  BsCurrencyDollar,
  BsRecycle,
  BsEye,
  BsEyeSlash,
  BsFillPencilFill,
} from 'react-icons/bs'
import { AiFillEdit } from 'react-icons/ai'
import ProductFeaturePlan from '../../components/custom/Product/ProductFeaturePlan/ProductFeaturePlan'
import ProductFeaturesList from '../../components/custom/Product/ProductFeaturesList/ProductFeaturesList'
import ProductPlansList from '../../components/custom/Product/ProductPlansList/ProductPlansList'
import ProductPlansPriceList from '../../components/custom/Product/ProductPlansPrice/ProductPlansPriceList'
import ProductCustomSpecificationList from '../../components/custom/Product/CustomSpecification/ProductCustomSpecificationList'
import {
  MdEditNote,
  MdFactCheck,
  MdOutlinePublishedWithChanges,
  MdOutlineUnpublished,
} from 'react-icons/md'
import { PublishStatus, activeTab, visibilityStatus } from '../../const/product'
import ProductWarnings from '../../components/custom/Product/ProductWarnings/ProductWarnings'
import ClientCredentials from '../../components/custom/Product/ClientCredentials/ClientCredentials'
import Label from '../../components/custom/Shared/label/Label.jsx'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStopwatch } from '@fortawesome/free-solid-svg-icons'
import ProductTrialPeriod from '../../components/custom/Product/ProductTrialPeriod/ProductTrialPeriod.jsx'
import ProductsUsersManagement from '../../components/custom/Product/ProductsUsersManagement/ProductsUsersManagement.jsx'
import WebhookList from '../../components/custom/Product/WebhookList/WebhookList.jsx'
import IntegrationUrlsTab from '../../components/custom/Product/IntegrationUrlsTab/IntegrationUrlsTab.jsx'
import SafeFormatMessage from '../../components/custom/Shared/SafeFormatMessage/SafeFormatMessage.jsx'
import { size } from 'lodash'

const ProductDetails = () => {
  const routeParams = useParams()

  const [visible, setVisible] = useState(false)
  const dispatch = useDispatch()
  const [activeIndex, setActiveIndex] = useState(0)
  useEffect(() => {
    setActiveIndex(activeTab.details)
  }, [routeParams.id])
  const { getProduct, deleteProductReq, publishProduct, visibleProduct } =
    useRequest()

  useEffect(() => {
    ;(async () => {
      const productData = await getProduct(routeParams.id)
      dispatch(productInfo(productData.data.data))
    })()
  }, [visible, routeParams?.id])
  const listData = useSelector((state) => state.products.products)
  let productData = listData[routeParams.id]

  const deleteProduct = async () => {
    await deleteProductReq({ id: routeParams?.id })
    dispatch(removeProductStore(routeParams?.id))
  }
  const togglePublishProduct = async (isPublished) => {
    await publishProduct(routeParams.id, {
      isPublished: !isPublished,
    })

    dispatch(
      productsChangeAttr({
        productId: routeParams.id,
        attributes: {
          isPublished: !isPublished,
        },
      })
    )
  }

  const toggleVisibleProduct = async (isVisible) => {
    await visibleProduct(routeParams.id, {
      isVisible: !isVisible,
    })

    dispatch(
      productsChangeAttr({
        productId: routeParams.id,
        attributes: {
          isVisible: !isVisible,
        },
      })
    )
  }

  return (
    <Wrapper>
      {productData && (
        <BreadcrumbComponent
          breadcrumbInfo={'ProductDetails'}
          param1={productData.id}
          icon={BsBoxSeam}
          data={{ name: productData.systemName }}
        />
      )}

      {productData && (
        <div className="main-container">
          <UpperContent>
            <h4 className="m-0">
              <SafeFormatMessage id="Product-Details" /> :{' '}
              {productData.systemName}{' '}
              <span className="ml-2">
                <Label {...PublishStatus[productData?.isPublished]} />
              </span>
              <span className="ml-2">
                <Label {...visibilityStatus[productData?.isVisible]} />
              </span>
            </h4>
            <DynamicButtons
              buttons={[
                {
                  order: 4,
                  type: 'action',
                  label: productData?.isPublished ? 'Deactivate' : 'Activate',
                  func: () => togglePublishProduct(productData?.isPublished),
                  icon: productData?.isPublished ? (
                    <MdOutlineUnpublished />
                  ) : (
                    <MdOutlinePublishedWithChanges />
                  ),
                },

                {
                  order: 4,
                  type: 'action',
                  label: productData?.isVisible ? 'Hide' : 'Show',
                  func: () => toggleVisibleProduct(productData?.isVisible),
                  icon: productData?.isVisible ? <BsEyeSlash /> : <BsEye />,
                },
                {
                  order: 4,
                  type: 'form',
                  component: 'templateForm',
                  id: routeParams.id,
                  label: 'Add-Name-Template',
                  icon: <BsFillPencilFill />,
                  size: 'lg',
                },
                {
                  order: 4,
                  type: 'form',
                  id: routeParams.id,
                  label: 'Trial-Period',
                  component: 'addTrial',
                  icon: <FontAwesomeIcon icon={faStopwatch} />,
                  setActiveIndex: setActiveIndex,
                },
                {
                  order: 4,
                  type: 'form',
                  id: routeParams.id,
                  label: 'Add-Specification',
                  component: 'addSpecification',
                  icon: <MdEditNote />,
                  setActiveIndex: setActiveIndex,
                },
                {
                  order: 4,
                  type: 'form',
                  id: routeParams.id,
                  label: 'Add-Plan',
                  component: 'addPlan',
                  icon: <BsPencilSquare />,
                  setActiveIndex: setActiveIndex,
                },

                {
                  order: 4,
                  type: 'form',
                  id: routeParams.id,
                  label: 'Add-Feature',
                  component: 'addFeature',
                  icon: <BsStars />,
                  setActiveIndex: setActiveIndex,
                },
                {
                  order: 4,
                  type: 'form',
                  id: routeParams.id,
                  label: 'Add-Plan-Feature',
                  component: 'addFeaturePlan',
                  icon: <BsUiChecks />,
                  setActiveIndex: setActiveIndex,
                },
                {
                  order: 4,
                  type: 'form',
                  id: routeParams.id,
                  label: 'Add-Plan-Price',
                  component: 'addPlanPrice',
                  icon: <BsCurrencyDollar />,
                  setActiveIndex: setActiveIndex,
                },
                {
                  order: 2,
                  type: 'form',
                  id: routeParams.id,
                  label: 'Edit',
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
                  request: deleteProduct,
                  icon: <BsFillTrash3Fill />,
                },
              ]}
            />
          </UpperContent>

          <TabView
            scrollable
            className="card"
            activeIndex={activeIndex}
            onTabChange={(e) => setActiveIndex(e.index)}
          >
            {productData && (
              <TabPanel header={<SafeFormatMessage id="Details" />}>
                <ProductDetailsTab
                  data={productData}
                  setActiveIndex={setActiveIndex}
                />
              </TabPanel>
            )}
            {productData && (
              <TabPanel header={<SafeFormatMessage id="Integration-Urls" />}>
                <IntegrationUrlsTab
                  data={productData}
                  setActiveIndex={setActiveIndex}
                />
              </TabPanel>
            )}
            <TabPanel header={<SafeFormatMessage id="Trial-Period" />}>
              <ProductTrialPeriod
                data={productData}
                setActiveIndex={setActiveIndex}
              />
            </TabPanel>
            <TabPanel header={<SafeFormatMessage id="Webhook" />}>
              <WebhookList />
            </TabPanel>
            <TabPanel header={<SafeFormatMessage id="Client-Credentials" />}>
              <ClientCredentials
                data={productData}
                setActiveIndex={setActiveIndex}
              />
            </TabPanel>

            {/* <TabPanel header={<SafeFormatMessage id="User-Management" />}>
              <ProductsUsersManagement />
            </TabPanel> */}
            <TabPanel header={<SafeFormatMessage id="Custom-Specification" />}>
              <ProductCustomSpecificationList
                productId={productData.id}
                productName={productData.systemName}
                setActiveIndex={setActiveIndex}
              />
            </TabPanel>

            <TabPanel header={<SafeFormatMessage id="Plans" />}>
              <ProductPlansList
                productId={productData.id}
                productName={productData.systemName}
                setActiveIndex={setActiveIndex}
              />
            </TabPanel>
            <TabPanel header={<SafeFormatMessage id="Features" />}>
              <ProductFeaturesList
                productId={productData.id}
                productName={productData.systemName}
                setActiveIndex={setActiveIndex}
              />
            </TabPanel>
            <TabPanel header={<SafeFormatMessage id="Plan's-Features" />}>
              <ProductFeaturePlan
                productId={productData.id}
                setActiveIndex={setActiveIndex}
              />
            </TabPanel>
            <TabPanel header={<SafeFormatMessage id="Plans-Prices" />}>
              <ProductPlansPriceList
                productId={productData.id}
                setActiveIndex={setActiveIndex}
              />
            </TabPanel>

            <TabPanel header={<SafeFormatMessage id="Subscriptions" />}>
              <ProductTenantsList
                productId={productData.id}
                productName={productData.systemName}
                setActiveIndex={setActiveIndex}
              />
            </TabPanel>
            <TabPanel
              header={
                <div>
                  <SafeFormatMessage id="Warnings" />
                  {productData?.warningsNum > 0 && (
                    <span className="error-badge">
                      {productData?.warningsNum}
                    </span>
                  )}
                </div>
              }
              className={productData?.warningsNum > 0 && 'warnings'}
            >
              <ProductWarnings
                productId={productData.id}
                setActiveIndex={setActiveIndex}
              />
            </TabPanel>
          </TabView>
        </div>
      )}
    </Wrapper>
  )
}
export default ProductDetails
