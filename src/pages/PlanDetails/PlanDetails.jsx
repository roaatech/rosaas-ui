import React from 'react'
import { useState } from 'react'
import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import TableHead from '../../components/custom/Shared/TableHead/TableHead'
import BreadcrumbComponent from '../../components/custom/Shared/Breadcrumb/Breadcrumb'
import { BsBoxSeam } from 'react-icons/bs'
import useRequest from '../../axios/apis/useRequest'
import { Wrapper } from './PlanDetails.styled'
import { TabView, TabPanel } from 'primereact/tabview'
import { useDispatch, useSelector } from 'react-redux'

import UpperContent from '../../components/custom/Shared/UpperContent/UpperContent'
import { FormattedMessage } from 'react-intl'
import { planInfo } from '../../store/slices/plans'
import PlanDetailsTab from '../../components/custom/Plan/PlanDetailsTab/PlanDetailsTab'

const PlanDetails = () => {
  const routeParams = useParams()
  const listData = useSelector((state) => state.plans.plans)
  let planData = listData[routeParams.id]
  const [visible, setVisible] = useState(false)
  const dispatch = useDispatch()

  const { getplan,  deleteplanReq } = useRequest()

  useEffect(() => {
    ;(async () => {
      const planData = await getplan(routeParams.id)
      dispatch(planInfo(planData.data.data))
    })()
  }, [visible, routeParams.id])

  return (
    <Wrapper>
      {planData && (
        <BreadcrumbComponent
          breadcrumbInfo={'PlanDetails'}
          param1={planData.id}
          icon={BsBoxSeam}
        />
      )}

      {planData && (
        <div className="main-container">
          <UpperContent>
            <h4 className="m-0">
              <FormattedMessage id="Plan-Details" /> : {planData.name}
            </h4>
          </UpperContent>
          {/* <TabView className="card"> */}
              <PlanDetailsTab data={planData} />
            {/* <TabPanel header={<FormattedMessage id="Details" />}> */}
            {/* </TabPanel> */}
{/* 
            <TabPanel header={<FormattedMessage id="Subscriptions" />}>
              <ProductTenantsList
                productId={productData.id}
                productName={productData.name}
              />
            </TabPanel> */}
          {/* </TabView> */}
        </div>
      )}
    </Wrapper>
  )
}
export default PlanDetails
