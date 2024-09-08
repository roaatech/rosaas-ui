// import React from 'react'
// import { useState } from 'react'
// import { useEffect } from 'react'
// import { useParams } from 'react-router-dom'
// import TableHead from '../../components/custom/Shared/TableHead/TableHead'
// import BreadcrumbComponent from '../../components/custom/Shared/Breadcrumb/Breadcrumb'
// import useRequest from '../../axios/apis/useRequest'
// import { Wrapper } from './PlanDetails.styled'
// import { TabView, TabPanel } from 'primereact/tabview'
// import { useDispatch, useSelector } from 'react-redux'

// import UpperContent from '../../components/custom/Shared/UpperContent/UpperContent'
// import { FormattedMessage } from 'react-intl'
// // import { planInfo } from '../../store/slices/plans'
// // import PlanDetailsTab from '../../components/custom/Plan/PlanDetailsTab/PlanDetailsTab'
// import DynamicButtons from '../../components/custom/Shared/DynamicButtons/DynamicButtons'
// import { BsBoxSeam, BsFillTrash3Fill } from 'react-icons/bs'
// import { AiFillEdit } from 'react-icons/ai'

// const PlanDetails = () => {
//   const routeParams = useParams()
//   const listData = useSelector((state) => state.plans.plans)
//   let planData = listData[routeParams.id]
//   const [visible, setVisible] = useState(false)
//   const dispatch = useDispatch()

//   const { getPlan, deletePlanReq } = useRequest()

//   useEffect(() => {
//     ;(async () => {
//       const planData = await getPlan(routeParams.id)
//       // dispatch(planInfo(planData.data.data))
//     })()
//   }, [visible, routeParams.id])

//   return (
//     <Wrapper>
//       {planData && (
//         <BreadcrumbComponent
//           breadcrumbInfo={'PlanDetails'}
//           param1={planData.id}
//           icon={BsBoxSeam}
//         />
//       )}

//       {planData && (
//         <div className="main-container">
//           <UpperContent>
//             <h4 className="m-0">
//               <SafeFormatMessage id="Plan-Details" /> : {planData.name}
//             </h4>
//             <DynamicButtons
//               buttons={[
//                 {
//                   order: 2,
//                   type: 'form',
//                   id: routeParams.id,
//                   label: 'Edit-Plan',
//                   component: 'editPlan',
//                   icon: <AiFillEdit />,
//                 },

//                 {
//                   order: 1,
//                   type: 'delete',
//                   confirmationMessage: 'delete-plan-confirmation-message',
//                   id: routeParams.id,
//                   navAfterDelete: '/plans',
//                   label: 'Delete-Plan',
//                   request: 'deletePlanReq',
//                   icon: <BsFillTrash3Fill />,
//                 },
//               ]}
//             />
//           </UpperContent>
//           <TabView className="card">
//             <TabPanel header={<SafeFormatMessage id="Details" />}>
//               {/* <PlanDetailsTab data={planData} /> */}
//             </TabPanel>
//           </TabView>
//         </div>
//       )}
//     </Wrapper>
//   )
// }
// export default PlanDetails
