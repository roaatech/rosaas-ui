// import React, { useState, useEffect } from 'react'
// import { DataTable } from 'primereact/datatable'
// import { Column } from 'primereact/column'
// import { BsBoxSeam } from 'react-icons/bs'
// import BreadcrumbComponent from '../../components/custom/Shared/Breadcrumb/Breadcrumb'
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// import {
//   faEdit,
//   faEllipsisH,
//   faEye,
//   faTrashAlt,
// } from '@fortawesome/free-solid-svg-icons'
// import {
//   Col,
//   Row,
//   Form,
//   Card,
//   Button,
//   ButtonGroup,
//   Breadcrumb,
//   InputGroup,
//   Dropdown,
// } from '@themesberg/react-bootstrap'
// // import { faUserTie } from "@fortawesome/free-solid-svg-icons";

// import ColumnSortHeader from '../../components/custom/Shared/ColumnSortHeader/ColumnSortHeader'
// import TableHead from '../../components/custom/Shared/TableHead/TableHead'
// import TableDate from '../../components/custom/Shared/TableDate/TableDate'
// import useRequest from '../../axios/apis/useRequest'
// import { Dialog } from 'primereact/dialog'
// import ProductStatus from '../../components/custom/Product/ProductStatus/ProductStatus'
// import DeleteConfirmation from '../../components/custom/global/DeleteConfirmation/DeleteConfirmation.jsx'
// import { useNavigate } from 'react-router-dom'
// import { Wrapper } from './Plan.styled'
// import CustomPaginator from '../../components/custom/Shared/CustomPaginator/CustomPaginator'
// import ThemeDialog from '../../components/custom/Shared/ThemeDialog/ThemeDialog'
// // import { planInfo, setAllPlans } from '../../store/slices/plans'
// import { useDispatch, useSelector } from 'react-redux'
// import { FormattedMessage } from 'react-intl'
// import PlanForm from '../../components/custom/Plan/PlanForm/PlanForm'
// import DescriptionCell from '../../components/custom/Shared/DescriptionCell/DescriptionCell'

// export default function Plan({ children }) {
//   const dispatch = useDispatch()
//   const { getPlan, getPlanList, deletePlanReq } = useRequest()
//   const [visible, setVisible] = useState(false)
//   const [totalCount, setTotalCount] = useState(0)
//   const [visibleHead, setVisibleHead] = useState(false)
//   // const [list, setList] = useState([]);
//   const [rebase, setRebase] = useState(0)
//   const [searchValue, setSearchValue] = useState('')
//   const [sortField, setSortField] = useState('')
//   const [sortValue, setSortValue] = useState('')
//   const [first, setFirst] = useState(0)
//   const [rows, setRows] = useState(10)
//   const [confirm, setConfirm] = useState(false)
//   const [currentId, setCurrentId] = useState('')
//   const [update, setUpdate] = useState(1)
//   const navigate = useNavigate()
//   const deleteConfirm = (id) => {
//     setCurrentId(id)
//     setConfirm(true)
//   }
//   const deletePlan = async () => {
//     await deletePlanReq({ id: currentId })
//   }

//   const listData = useSelector((state) => state.plans.plans) //*
//   let list = Object.values(listData)

//   useEffect(() => {
//     let query = `?page=${Math.ceil(
//       (first + 1) / rows
//     )}&pageSize=${rows}&filters[0].Field=SearchTerm`
//     if (searchValue) query += `&filters[0].Value=${searchValue}`
//     if (sortField) query += `&sort.Field=${sortField}`
//     if (sortValue) query += `&sort.Direction=${sortValue}`
//     ;(async () => {
//       const planList = await getPlanList(query)

//       let sortedPlans = [...planList.data.data.items]

//       if (sortField === 'displayOrder') {
//         sortedPlans.sort((a, b) => {
//           const displayOrderA = parseInt(a.displayOrder)
//           const displayOrderB = parseInt(b.displayOrder)

//           if (sortValue === 1) {
//             return displayOrderA - displayOrderB
//           } else {
//             return displayOrderB - displayOrderA
//           }
//         })
//       }

//       // dispatch(setAllPlans(sortedPlans))
//       setTotalCount(planList.data.data.totalCount)
//     })()
//   }, [first, rows, searchValue, sortField, sortValue, update])

//   // const statusBodyTemplate = (rowData) => {
//   //   return <ProductStatus rowData={rowData} key={rowData.id} />
//   // }

//   /******************************* */

//   const onPageChange = (event) => {
//     setFirst(event.first)
//     setRows(event.rows)
//   }

//   /****************************** */
//   const editForm = async (id) => {
//     if (!listData[id].creationEndpoint) {
//       const planData = await getPlan(id)
//       // dispatch(planInfo(planData.data.data))
//     }
//     setCurrentId(id)
//     setVisible(true)
//   }

//   /********************************/
//   const [expandedRows, setExpandedRows] = useState([])

//   const toggleRow = (rowData) => {
//     const isRowExpanded = expandedRows.includes(rowData.id)
//     if (isRowExpanded) {
//       setExpandedRows(expandedRows.filter((id) => id !== rowData.id))
//     } else {
//       setExpandedRows([...expandedRows, rowData.id])
//     }
//   }
//   /****************************** */

//   return (
//     <Wrapper>
//       <BreadcrumbComponent breadcrumbInfo={'PlanList'} icon={BsBoxSeam} />
//       <div className="main-container">
//         <TableHead
//           label={<FormattedMessage id="Add-Plan" />}
//           icon={'pi-box'}
//           setSearchValue={setSearchValue}
//           visibleHead={visibleHead}
//           setVisibleHead={setVisibleHead}
//           setFirst={setFirst}
//         >
//           <PlanForm
//             popupLabel={<FormattedMessage id="Create-Plan" />}
//             type={'create'}
//             update={update}
//             setUpdate={setUpdate}
//             visible={visibleHead}
//             setVisible={setVisibleHead}
//           />
//         </TableHead>
//         <Card
//           border="light"
//           className="table-wrapper table-responsive shadow-sm"
//         >
//           <Card.Body className="pt-0">
//             <DataTable
//               value={list}
//               tableStyle={{ minWidth: '50rem' }}
//               size={'small'}
//             >
//               <Column
//                 field="name"
//                 style={{ width: '140px', maxidth: '140px' }}
//                 header={
//                   <ColumnSortHeader
//                     text={<FormattedMessage id="Name" />}
//                     field="name"
//                     rebase={rebase}
//                     setRebase={setRebase}
//                     sortField={sortField}
//                     sortValue={sortValue}
//                     setSortField={setSortField}
//                     setSortValue={setSortValue}
//                     setFirst={setFirst}
//                   />
//                 }
//               ></Column>

//               {/* <Column
//                 field={'description'}
//                 header={
//                   <ColumnSortHeader
//                     text={<FormattedMessage id="Description" />}
//                     field="description"
//                     rebase={rebase}
//                     setRebase={setRebase}
//                     sortField={sortField}
//                     sortValue={sortValue}
//                     setSortField={setSortField}
//                     setSortValue={setSortValue}
//                     setFirst={setFirst}
//                   />
//                 }
//                 showFilterMenu={true}
//               /> */}
//               <Column
//                 field={'description'}
//                 style={{ width: '520px', maxidth: '520px' }}
//                 header={
//                   <ColumnSortHeader
//                     text={<FormattedMessage id="Description" />}
//                     field="description"
//                     rebase={rebase}
//                     setRebase={setRebase}
//                     sortField={sortField}
//                     sortValue={sortValue}
//                     setSortField={setSortField}
//                     setSortValue={setSortValue}
//                     setFirst={setFirst}
//                   />
//                 }
//                 showFilterMenu={true}
//                 body={(data) => (
//                   <DescriptionCell
//                     data={data}
//                     expandedRows={expandedRows}
//                     toggleRow={toggleRow}
//                   />
//                 )}
//               />

//               <Column
//                 field={'displayOrder'}
//                 style={{ width: '170px', maxidth: '170px' }}
//                 header={
//                   <ColumnSortHeader
//                     text={<FormattedMessage id="Display-Order" />}
//                     field="displayOrder"
//                     rebase={rebase}
//                     setRebase={setRebase}
//                     sortField={sortField}
//                     sortValue={sortValue}
//                     setSortField={setSortField}
//                     setSortValue={setSortValue}
//                     setFirst={setFirst}
//                   />
//                 }
//                 showFilterMenu={true}
//               />

//               <Column
//                 body={(data, options) => (
//                   <TableDate
//                     createdDate={data.createdDate}
//                     editedDate={data.editedDate}
//                   />
//                 )}
//                 style={{ width: '250px', maxidth: '250px' }}
//                 header={
//                   <ColumnSortHeader
//                     text={<FormattedMessage id="Date" />}
//                     field="editedDate"
//                     rebase={rebase}
//                     setRebase={setRebase}
//                     sortField={sortField}
//                     sortValue={sortValue}
//                     setSortField={setSortField}
//                     setSortValue={setSortValue}
//                     setFirst={setFirst}
//                   />
//                 }
//               />
//               <Column
//                 body={(data, options) => (
//                   <Dropdown as={ButtonGroup}>
//                     <Dropdown.Toggle
//                       as={Button}
//                       split
//                       variant="link"
//                       className="text-dark m-0 p-0"
//                     >
//                       <span className="icon icon-sm">
//                         <FontAwesomeIcon
//                           icon={faEllipsisH}
//                           className="icon-dark"
//                         />
//                       </span>
//                     </Dropdown.Toggle>
//                     <Dropdown.Menu>
//                       <Dropdown.Item
//                         onSelect={() => navigate(`/plans/${data.id}`)}
//                       >
//                         <FontAwesomeIcon icon={faEye} className="mx-2" />
//                         <FormattedMessage id="View-Details" />
//                       </Dropdown.Item>
//                       <Dropdown.Item onSelect={() => editForm(data.id)}>
//                         <FontAwesomeIcon icon={faEdit} className="mx-2" />
//                         <FormattedMessage id="Edit" />
//                       </Dropdown.Item>
//                       <Dropdown.Item
//                         onClick={() => deleteConfirm(data.id)}
//                         className="text-danger"
//                       >
//                         <FontAwesomeIcon icon={faTrashAlt} className="mx-2" />
//                         <FormattedMessage id="Delete" />
//                       </Dropdown.Item>
//                     </Dropdown.Menu>
//                   </Dropdown>
//                 )}
//                 style={{ width: '60px', textAlign: 'center' }}
//                 header={<FormattedMessage id="Actions" />}
//               />
//             </DataTable>
//             <CustomPaginator
//               first={first}
//               rows={rows}
//               totalCount={totalCount}
//               onPageChange={onPageChange}
//             />

//             <ThemeDialog visible={visible} setVisible={setVisible}>
//               <PlanForm
//                 popupLabel={<FormattedMessage id="Edit-Plan" />}
//                 type={'edit'}
//                 planData={listData[currentId]}
//                 update={update}
//                 setUpdate={setUpdate}
//                 setVisible={setVisible}
//               />
//             </ThemeDialog>

//             <DeleteConfirmation
//               message={
//                 <FormattedMessage id="delete-plan-confirmation-message" />
//               }
//               icon="pi pi-exclamation-triangle"
//               confirm={confirm}
//               setConfirm={setConfirm}
//               confirmFunction={deletePlan}
//               update={update}
//               setUpdate={setUpdate}
//               sideBar={false}
//             />
//           </Card.Body>
//         </Card>
//       </div>
//     </Wrapper>
//   )
// }
