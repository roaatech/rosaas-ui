import React from 'react'
import { useState } from 'react'
import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import TableHead from '../../components/custom/Shared/TableHead/TableHead'
import BreadcrumbComponent from '../../components/custom/Shared/Breadcrumb/Breadcrumb'
import { BsBoxSeam } from 'react-icons/bs'
import useRequest from '../../axios/apis/useRequest'
import { Wrapper } from './FeatureDetails.styled'
import ProductDetailsTab from '../../components/custom/Product/ProdcutDetailsTab/ProdcutDetailsTab'
import ProductTenantsList from '../../components/custom/Product/ProductTenantsList/ProductTenantsList'
import { TabView, TabPanel } from 'primereact/tabview'
import { useDispatch, useSelector } from 'react-redux'
import { FeatureInfo, productInfo } from '../../store/slices/products'
import UpperContent from '../../components/custom/Shared/UpperContent/UpperContent'
import { FormattedMessage } from 'react-intl'
import ProductFeaturesList from '../../components/custom/Product/ProductFeaturesList/ProductFeaturesList'
import FeatureDetailsTab from '../../components/custom/Feature/FeatureDetailsTab/FeatureDetailsTab'

const FeatureDetails = () => {
  const routeParams = useParams()
  const listData = useSelector((state) => state.products.products)
  let featureData = listData[routeParams.productId].features[routeParams.id]
console.log(featureData);
  const [visible, setVisible] = useState(false)
  const dispatch = useDispatch()
  
  const {getFeature, deleteFeatureReq } = useRequest()
  
  useEffect(() => {
    ;(async () => {
      
      
      const featureData = await getFeature(routeParams.id,routeParams.productId)
      // dispatch(FeatureInfo(featureData.data.data))
       console.log(featureData.data.data);
     dispatch(FeatureInfo({ productId:routeParams.productId, featureId:routeParams.id, data: featureData.data.data }))
      // console.log(data);
    })()
  }, [visible, routeParams.id])
  // console.log(routeParams);
  
  
    return (
      <Wrapper>
        {featureData && (
          <BreadcrumbComponent
            breadcrumbInfo={'ProductDetails'}
            param1={featureData.id}
            icon={BsBoxSeam}
          />
        )}
  
        {featureData && (
          <div className="main-container">
            <UpperContent>
              <h4 className="m-0">
                <FormattedMessage id="Feature-Details" /> : {featureData.name}
              </h4>
            </UpperContent>
            <TabView className="card">
              <TabPanel header={<FormattedMessage id="Details" />}>
                <FeatureDetailsTab data={featureData} />
              </TabPanel>
  
             
            </TabView>
          </div>
        )}
      </Wrapper>
    )
  
  
  
}
export default FeatureDetails
