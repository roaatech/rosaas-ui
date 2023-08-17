import React, { useState, useEffect } from 'react'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import {
  BsPencilSquare,
  BsFillTrash3Fill,
  BsFillEyeFill,
  BsBoxSeam,
  BsFillLayersFill,
} from 'react-icons/bs'
import BreadcrumbComponent from '../../components/custom/Shared/Breadcrumb/Breadcrumb'

import ColumnSortHeader from '../../components/custom/Shared/ColumnSortHeader/ColumnSortHeader'
import TableHead from '../../components/custom/Shared/TableHead/TableHead'
import TableDate from '../../components/custom/Shared/TableDate/TableDate'
import PlanForm from '../../components/custom/Plan/PlanForm/PlanForm'
import useRequest from '../../axios/apis/useRequest'
import { Dialog } from 'primereact/dialog'
import DeleteConfirmation from '../../components/custom/global/DeleteConfirmation/DeleteConfirmation.jsx'
import { useNavigate } from 'react-router-dom'
import { Wrapper } from './Plan.styled'
import CustomPaginator from '../../components/custom/Shared/CustomPaginator/CustomPaginator'
export default function Plan({ children }) {
  const { getPlan, getPlanList, deletePlanReq } = useRequest()
  const [visible, setVisible] = useState(false)
  const [totalCount, setTotalCount] = useState(0)
  const [visibleHead, setVisibleHead] = useState(false)
  const [list, setList] = useState([])
  const [rebase, setRebase] = useState(0)
  const [searchValue, setSearchValue] = useState('')
  const [sortField, setSortField] = useState('')
  const [sortValue, setSortValue] = useState('')
  const [first, setFirst] = useState(0)
  const [rows, setRows] = useState(10)
  const [confirm, setConfirm] = useState(false)
  const [currentId, setCurrentId] = useState('')
  const [update, setUpdate] = useState(1)
  const navigate = useNavigate()
  const deleteConfirm = (id) => {
    setCurrentId(id)
    setConfirm(true)
  }
  const deletePlan = async () => {
    await deletePlanReq({ id: currentId })
  }

  // useEffect(() => {
  //   let query = `?page=${Math.ceil(
  //     (first + 1) / rows
  //   )}&pageSize=${rows}&filters[0].Field=SearchTerm`;
  //   if (searchValue) query += `&filters[0].Value=${searchValue}`;
  //   if (sortField) query += `&sort.Field=${sortField}`;
  //   if (sortValue) query += `&sort.Direction=${sortValue}`;

  //   (async () => {
  //     const listData = await getPlanList(query);
  //     setTotalCount(listData.data.data.totalCount);
  //     setList(listData.data.data.items);
  //   })();
  // }, [first, rows, searchValue, sortField, sortValue, update]);

  /******************************* */

  const onPageChange = (event) => {
    setFirst(event.first)
    setRows(event.rows)
  }

  /****************************** */
  const [planData, setPlanData] = useState()
  const editForm = async (id) => {
    const planData = await getPlan(id)

    setPlanData(planData.data)
    setVisible(true)
  }

  return (
    <Wrapper>
      <BreadcrumbComponent
        title={'Plan List'}
        parent={'Plan'}
        icon={BsBoxSeam}
      />
      <div className="main-container">
        <TableHead
          label={'Add Plan'}
          popupLabel={'Create Plan'}
          icon={BsFillLayersFill}
          setSearchValue={setSearchValue}
          visibleHead={visibleHead}
          setVisibleHead={setVisibleHead}
          setFirst={setFirst}
        >
          <PlanForm
            type={'create'}
            update={update}
            setUpdate={setUpdate}
            visibleHead={visibleHead}
            setVisibleHead={setVisibleHead}
          />
        </TableHead>
        <div className="card">
          <DataTable
            value={list}
            tableStyle={{ minWidth: '50rem' }}
            size={'small'}
          >
            <Column
              field="name"
              header={
                <ColumnSortHeader
                  text="Name"
                  field="name"
                  rebase={rebase}
                  setRebase={setRebase}
                  sortField={sortField}
                  sortValue={sortValue}
                  setSortField={setSortField}
                  setSortValue={setSortValue}
                  setFirst={setFirst}
                />
              }
            ></Column>
            <Column
              field="url"
              header={
                <ColumnSortHeader
                  text="Url"
                  field="url"
                  rebase={rebase}
                  setRebase={setRebase}
                  sortField={sortField}
                  sortValue={sortValue}
                  setSortField={setSortField}
                  setSortValue={setSortValue}
                  setFirst={setFirst}
                />
              }
            ></Column>

            <Column
              field={'client.name'}
              header={
                <ColumnSortHeader
                  text="Client"
                  field="client"
                  rebase={rebase}
                  setRebase={setRebase}
                  sortField={sortField}
                  sortValue={sortValue}
                  setSortField={setSortField}
                  setSortValue={setSortValue}
                  setFirst={setFirst}
                />
              }
              showFilterMenu={false}
            />
            <Column
              body={(data, options) => (
                <TableDate
                  createdDate={data.createdDate}
                  editedDate={data.editedDate}
                />
              )}
              style={{ width: '250px', maxidth: '250px' }}
              header={
                <ColumnSortHeader
                  text="Date"
                  field="editedDate"
                  rebase={rebase}
                  setRebase={setRebase}
                  sortField={sortField}
                  sortValue={sortValue}
                  setSortField={setSortField}
                  setSortValue={setSortValue}
                  setFirst={setFirst}
                />
              }
            />
            <Column
              style={{ width: '60px', textAlign: 'center' }}
              body={(data, options) => (
                <>
                  <BsFillEyeFill
                    onClick={() => navigate(`/PlanDetails/${data.id}`)}
                    style={{ cursor: 'pointer' }}
                  />
                </>
              )}
              header="View"
            />
            <Column
              style={{ width: '60px', textAlign: 'center' }}
              body={(data, options) => (
                <>
                  <BsPencilSquare
                    onClick={() => editForm(data.id)}
                    style={{ cursor: 'pointer' }}
                  />
                </>
              )}
              header="Edit"
            />
            <Column
              style={{ width: '60px', textAlign: 'center' }}
              body={(data, options) => (
                <>
                  <BsFillTrash3Fill
                    onClick={() => deleteConfirm(data.id)}
                    style={{ cursor: 'pointer' }}
                  />
                </>
              )}
              header="Delete"
            />
          </DataTable>

          <CustomPaginator
            first={first}
            rows={rows}
            totalCount={totalCount}
            onPageChange={onPageChange}
          />

          {/* <Dialog
            headerClassName="pb-0"
            className="planForm"
            header={"Edit Plan"}
            visible={visible}
            style={{ width: "30vw", minWidth: "300px" }}
            onHide={() => setVisible(false)}>
             <PlanForm
              type={"edit"}
              planData={planData?.data}
              update={update}
              setUpdate={setUpdate}
              setVisible={setVisible}
            />  
          </Dialog> */}
        </div>
        <DeleteConfirmation
          message="Do you want to delete this Plan?"
          icon="pi pi-exclamation-triangle"
          confirm={confirm}
          setConfirm={setConfirm}
          confirmFunction={deletePlan}
          update={update}
          setUpdate={setUpdate}
          sideBar={false}
        />
      </div>
    </Wrapper>
  )
}
