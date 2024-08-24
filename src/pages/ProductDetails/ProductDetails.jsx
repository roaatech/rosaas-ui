import React, { useState, useEffect } from 'react'
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
} from 'react-icons/bs'
import { AiFillEdit } from 'react-icons/ai'
import ProductFeaturePlan from '../../components/custom/Product/ProductFeaturePlan/ProductFeaturePlan'
import ProductFeaturesList from '../../components/custom/Product/ProductFeaturesList/ProductFeaturesList'
import ProductPlansList from '../../components/custom/Product/ProductPlansList/ProductPlansList'
import ProductPlansPriceList from '../../components/custom/Product/ProductPlansPrice/ProductPlansPriceList'
import ProductCustomSpecificationList from '../../components/custom/Product/CustomSpecification/ProductCustomSpecificationList'
import {
  MdEditNote,
  MdOutlinePublishedWithChanges,
  MdOutlineUnpublished,
} from 'react-icons/md'
import {
  generalSubTabs,
  mainTabs,
  managementSubTabs,
  PublishStatus,
} from '../../const/product'
import ProductWarnings from '../../components/custom/Product/ProductWarnings/ProductWarnings'
import ClientCredentials from '../../components/custom/Product/ClientCredentials/ClientCredentials'
import Label from '../../components/custom/Shared/label/Label.jsx'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStopwatch } from '@fortawesome/free-solid-svg-icons'
import ProductTrialPeriod from '../../components/custom/Product/ProductTrialPeriod/ProductTrialPeriod.jsx'
import WebhookList from '../../components/custom/Product/WebhookList/WebhookList.jsx'
import IntegrationUrlsTab from '../../components/custom/Product/IntegrationUrlsTab/IntegrationUrlsTab.jsx'

const ProductDetails = () => {
  const routeParams = useParams()
  const [visible, setVisible] = useState(false)
  const dispatch = useDispatch()
  const [activeMainIndex, setActiveMainIndex] = useState(0)
  const [activeGeneralSubIndex, setActiveGeneralSubIndex] = useState(0)
  const [activeManagementSubIndex, setActiveManagementSubIndex] = useState(0)
  const [activeWarningsSubIndex, setActiveWarningsSubIndex] = useState(0)

  useEffect(() => {
    const hash = window.location.hash.substring(1)
    if (hash) {
      const [mainTab, subTab] = hash.split('#')
      const mainTabIndex = getMainTabIndex(mainTab)
      setActiveMainIndex(mainTabIndex)
      if (mainTabIndex === 0) {
        setActiveGeneralSubIndex(getSubTabIndex(mainTabIndex, subTab))
      } else if (mainTabIndex === 1) {
        setActiveManagementSubIndex(getSubTabIndex(mainTabIndex, subTab))
      } else if (mainTabIndex === 2) {
        setActiveWarningsSubIndex(0)
      }
    }
  }, [routeParams.id, window.location.hash])

  const { getProduct, deleteProductReq, publishProduct } = useRequest()

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

  const handleMainTabChange = (e) => {
    setActiveMainIndex(e.index)
    if (e.index === 0) {
      updateHash(e.index, activeGeneralSubIndex)
    } else if (e.index === 1) {
      updateHash(e.index, activeManagementSubIndex)
    } else if (e.index === 2) {
      updateHash(e.index, activeWarningsSubIndex)
    }
  }

  const handleGeneralSubTabChange = (e) => {
    setActiveGeneralSubIndex(e.index)
    updateHash(activeMainIndex, e.index)
  }

  const handleManagementSubTabChange = (e) => {
    setActiveManagementSubIndex(e.index)
    updateHash(activeMainIndex, e.index)
  }

  const updateHash = (mainIndex, subIndex) => {
    const mainTabName = getMainTabName(mainIndex)
    const subTabName = getSubTabName(mainIndex, subIndex)
    window.location.hash =
      mainIndex === 2 ? `${mainTabName}` : `${mainTabName}#${subTabName}`
  }
  const getMainTabIndex = (name) => {
    return mainTabs.indexOf(name) !== -1 ? mainTabs.indexOf(name) : 0
  }

  const getSubTabIndex = (mainTabIndex, name) => {
    const subTabs = mainTabIndex === 0 ? generalSubTabs : managementSubTabs
    return subTabs.indexOf(name) !== -1 ? subTabs.indexOf(name) : 0
  }

  const getMainTabName = (index) => {
    return mainTabs[index] || 'General'
  }

  const getSubTabName = (mainTabIndex, index) => {
    const subTabs = mainTabIndex === 0 ? generalSubTabs : managementSubTabs
    return subTabs[index] || subTabs[0]
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
              <FormattedMessage id="Product-Details" /> :{' '}
              {productData.systemName}{' '}
              <span className="ml-2">
                <Label {...PublishStatus[productData?.isPublished]} />
              </span>
            </h4>
            <DynamicButtons
              buttons={[
                {
                  order: 4,
                  type: 'action',
                  label: productData?.isPublished ? 'Unpublished' : 'Published',
                  func: () => togglePublishProduct(productData?.isPublished),
                  icon: productData?.isPublished ? (
                    <MdOutlineUnpublished />
                  ) : (
                    <MdOutlinePublishedWithChanges />
                  ),
                },
                {
                  order: 4,
                  type: 'form',
                  id: routeParams.id,
                  label: 'Trial-Period',
                  component: 'addTrial',
                  icon: <FontAwesomeIcon icon={faStopwatch} />,
                  setActiveIndex: setActiveGeneralSubIndex,
                  setActiveMainIndex: setActiveMainIndex,
                },
                {
                  order: 4,
                  type: 'form',
                  id: routeParams.id,
                  label: 'Add-Specification',
                  component: 'addSpecification',
                  icon: <MdEditNote />,
                  setActiveIndex: setActiveGeneralSubIndex,
                  setActiveMainIndex: setActiveMainIndex,
                },
                {
                  order: 4,
                  type: 'form',
                  id: routeParams.id,
                  label: 'Add-Plan',
                  component: 'addPlan',
                  icon: <BsPencilSquare />,
                  setActiveIndex: setActiveManagementSubIndex,
                  setActiveMainIndex: setActiveMainIndex,
                },
                {
                  order: 4,
                  type: 'form',
                  id: routeParams.id,
                  label: 'Add-Feature',
                  component: 'addFeature',
                  icon: <BsStars />,
                  setActiveIndex: setActiveManagementSubIndex,
                  setActiveMainIndex: setActiveMainIndex,
                },
                {
                  order: 4,
                  type: 'form',
                  id: routeParams.id,
                  label: 'Add-Plan-Feature',
                  component: 'addFeaturePlan',
                  icon: <BsUiChecks />,
                  setActiveIndex: setActiveManagementSubIndex,
                  setActiveMainIndex: setActiveMainIndex,
                },
                {
                  order: 4,
                  type: 'form',
                  id: routeParams.id,
                  label: 'Add-Plan-Price',
                  component: 'addPlanPrice',
                  icon: <BsCurrencyDollar />,
                  setActiveIndex: setActiveManagementSubIndex,
                  setActiveMainIndex: setActiveMainIndex,
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
            activeIndex={activeMainIndex}
            onTabChange={handleMainTabChange}
          >
            <TabPanel header={<FormattedMessage id="General" />}>
              <TabView
                activeIndex={activeGeneralSubIndex}
                onTabChange={handleGeneralSubTabChange}
              >
                <TabPanel header={<FormattedMessage id="Details" />}>
                  <ProductDetailsTab
                    data={productData}
                    setActiveIndex={setActiveGeneralSubIndex}
                  />
                </TabPanel>
                <TabPanel
                  header={<FormattedMessage id="Custom-Specification" />}
                >
                  <ProductCustomSpecificationList
                    productId={productData.id}
                    productName={productData.systemName}
                    setActiveIndex={setActiveGeneralSubIndex}
                  />
                </TabPanel>
                <TabPanel header={<FormattedMessage id="Integration-Urls" />}>
                  <IntegrationUrlsTab
                    data={productData}
                    setActiveIndex={setActiveGeneralSubIndex}
                  />
                </TabPanel>
                <TabPanel header={<FormattedMessage id="Trial-Period" />}>
                  <ProductTrialPeriod
                    data={productData}
                    setActiveIndex={setActiveGeneralSubIndex}
                  />
                </TabPanel>
                <TabPanel header={<FormattedMessage id="Webhook" />}>
                  <WebhookList />
                </TabPanel>
                <TabPanel header={<FormattedMessage id="Client-Credentials" />}>
                  <ClientCredentials
                    data={productData}
                    setActiveIndex={setActiveGeneralSubIndex}
                  />
                </TabPanel>
              </TabView>
            </TabPanel>

            <TabPanel header={<FormattedMessage id="Management" />}>
              <TabView
                activeIndex={activeManagementSubIndex}
                onTabChange={handleManagementSubTabChange}
              >
                <TabPanel header={<FormattedMessage id="Plans" />}>
                  <ProductPlansList
                    productId={productData.id}
                    productName={productData.systemName}
                    setActiveIndex={setActiveManagementSubIndex}
                  />
                </TabPanel>
                <TabPanel header={<FormattedMessage id="Features" />}>
                  <ProductFeaturesList
                    productId={productData.id}
                    productName={productData.systemName}
                    setActiveIndex={setActiveManagementSubIndex}
                  />
                </TabPanel>
                <TabPanel header={<FormattedMessage id="Plan's-Features" />}>
                  <ProductFeaturePlan
                    productId={productData.id}
                    setActiveIndex={setActiveManagementSubIndex}
                  />
                </TabPanel>
                <TabPanel header={<FormattedMessage id="Plans-Prices" />}>
                  <ProductPlansPriceList
                    productId={productData.id}
                    setActiveIndex={setActiveManagementSubIndex}
                  />
                </TabPanel>
                <TabPanel header={<FormattedMessage id="Subscriptions" />}>
                  <ProductTenantsList
                    productId={productData.id}
                    productName={productData.systemName}
                    setActiveIndex={setActiveManagementSubIndex}
                  />
                </TabPanel>
              </TabView>
            </TabPanel>

            <TabPanel
              header={
                <div>
                  <FormattedMessage id="Warnings" />
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
                setActiveIndex={setActiveManagementSubIndex}
              />
            </TabPanel>
          </TabView>
        </div>
      )}
    </Wrapper>
  )
}

export default ProductDetails
