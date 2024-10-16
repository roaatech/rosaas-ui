import React, { useState, useEffect } from 'react'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import BreadcrumbComponent from '../../components/custom/Shared/Breadcrumb/Breadcrumb'
import { BsFillPersonLinesFill } from 'react-icons/bs'

import ColumnSortHeader from '../../components/custom/Shared/ColumnSortHeader/ColumnSortHeader'
import TableHead from '../../components/custom/Shared/TableHead/TableHead'
import TableDate from '../../components/custom/Shared/TableDate/TableDate'
import TenantForm from '../../components/custom/tenant/TenantForm/TenantForm'
import useRequest from '../../axios/apis/useRequest'
import { Dialog } from 'primereact/dialog'
import TenantStatus from '../../components/custom/tenant/TenantStatus/TenantStatus'
import DeleteConfirmation from '../../components/custom/global/DeleteConfirmation/DeleteConfirmation.jsx'
import { useNavigate, useParams } from 'react-router-dom'
import { Wrapper } from './Tenant.styled'
import CustomPaginator from '../../components/custom/Shared/CustomPaginator/CustomPaginator'
import AutoCompleteFiled from '../../components/custom/Shared/AutoCompleteFiled/AutoCompleteFiled'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit, faEllipsisH, faEye } from '@fortawesome/free-solid-svg-icons'
import {
  Card,
  Button,
  ButtonGroup,
  Dropdown,
} from '@themesberg/react-bootstrap'
import { FormattedMessage } from 'react-intl'
import ThemeDialog from '../../components/custom/Shared/ThemeDialog/ThemeDialog.jsx'
import { Routes } from '../../routes.js'
import TenantFormOnboarding from '../../components/custom/tenant/TenantFormOnboarding/TenantFormOnboarding.jsx'
import { useDispatch, useSelector } from 'react-redux'
import { removeTenant, tenantInfo } from '../../store/slices/tenants.js'
export default function Tenant({ children }) {
  const { getTenant, getTenantList, deleteTenantReq } = useRequest()
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
  const [selectedProduct, setSelectedProduct] = useState()
  const [updateDetails, setUpdateDetails] = useState(0)
  const routeParams = useParams()
  const dispatch = useDispatch()

  const navigate = useNavigate()
  const deleteConfirm = (id) => {
    setCurrentId(id)
    setConfirm(true)
  }
  const deleteTenant = async () => {
    await deleteTenantReq({ id: currentId })
  }
  const tenantsData = useSelector((state) => state.tenants.tenants)

  useEffect(() => {
    let query = `?page=${Math.ceil(
      (first + 1) / rows
    )}&pageSize=${rows}&filters[0].Field=SearchTerm`
    if (searchValue) query += `&filters[0].Value=${searchValue}`
    if (sortField) query += `&sort.Field=${sortField}`
    if (sortValue) query += `&sort.Direction=${sortValue}`
    if (selectedProduct)
      query += `&filters[1].Field=selectedProduct&filters[1].Value=${selectedProduct}`
    ;(async () => {
      const listData = await getTenantList(query)
      setTotalCount(listData.data.data.totalCount)
      setList(listData.data.data.items)
    })()
  }, [
    first,
    rows,
    searchValue,
    sortField,
    sortValue,
    update,
    selectedProduct,
    updateDetails,
  ])

  const statusBodyTemplate = (rowData) => {
    return <TenantStatus statusValue={rowData.status} key={rowData.id} />
  }

  /******************************* */
  const updateTenant = async () => {
    await dispatch(removeTenant(currentId))
    setUpdateDetails(updateDetails + 1)
  }

  const onPageChange = (event) => {
    setFirst(event.first)
    setRows(event.rows)
  }

  /****************************** */
  const [tenantData, setTenantData] = useState()
  const editForm = async (id) => {
    const tenantData = await getTenant(id)
    setTenantData(tenantData.data)
    setVisible(true)
  }

  return (
    <Wrapper>
      <BreadcrumbComponent
        breadcrumbInfo={'TenantList'}
        icon={BsFillPersonLinesFill}
      />
      <div className="main-container">
        <TableHead
          label={<FormattedMessage id="Add-Tenant" />}
          popupLabel={'Create Tenant'}
          icon={'pi-user-plus'}
          setSearchValue={setSearchValue}
          visibleHead={visibleHead}
          setVisibleHead={setVisibleHead}
          setFirst={setFirst}
        >
          {/* <DeleteConfirmation
            message="Do you want to delete this Tenant?"
            icon="pi pi-exclamation-triangle"
            confirm={confirm}
            setConfirm={setConfirm}
            confirmFunction={deleteTenant}
            sideBar={true}
          /> */}
          <TenantFormOnboarding
            type={'create'}
            popupLabel={<FormattedMessage id="Create-Tenant" />}
            update={update}
            setUpdate={setUpdate}
            visible={visibleHead}
            setVisible={setVisibleHead}
            sideBar={false}
          />

          {/* <AutoCompleteFiled
            placeHolder="Select Product"
            dataFunction={productOptions}
            setSelectedProduct={setSelectedProduct}
          /> */}
        </TableHead>
        <Card
          border="light"
          className="table-wrapper table-responsive shadow-sm"
        >
          <Card.Body className="pt-0">
            <DataTable
              value={list}
              tableStyle={{ minWidth: '50rem' }}
              size={'small'}
            >
              <Column
                field="displayName"
                header={
                  <ColumnSortHeader
                    text="Display Name"
                    field="displayName"
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
                field="systemName"
                header={
                  <ColumnSortHeader
                    text="System Name"
                    field="systemName"
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
              {/* <Column
                field="status"
                header={
                  <ColumnSortHeader
                    text="Status"
                    field="status"
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
                body={statusBodyTemplate}
              />*/}
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
                body={(data, options) => (
                  <Dropdown as={ButtonGroup}>
                    <Dropdown.Toggle
                      as={Button}
                      split
                      variant="link"
                      className="text-dark m-0 p-0"
                    >
                      <span className="icon icon-sm">
                        <FontAwesomeIcon
                          icon={faEllipsisH}
                          className="icon-dark"
                        />
                      </span>
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      <Dropdown.Item
                        onSelect={() =>
                          navigate(`${Routes.Tenant.path}/${data.id}`)
                        }
                      >
                        <FontAwesomeIcon icon={faEye} className="mx-2" /> View
                        Details
                      </Dropdown.Item>
                      <Dropdown.Item onSelect={() => editForm(data.id)}>
                        <FontAwesomeIcon icon={faEdit} className="mx-2" /> Edit
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                )}
                style={{ width: '60px', textAlign: 'center' }}
                header="Actions"
              />
            </DataTable>

            <CustomPaginator
              first={first}
              rows={rows}
              totalCount={totalCount}
              onPageChange={onPageChange}
            />

            <ThemeDialog
              headerClassName="pb-0"
              className="tenantForm"
              header={'Edit Tenant'}
              visible={visible}
              style={{ width: '30vw', minWidth: '300px' }}
              onHide={() => setVisible(false)}
            >
              <TenantForm
                type={'edit'}
                popupLabel={<FormattedMessage id="Edit-Tenant" />}
                tenantData={tenantData?.data}
                updateTenant={updateTenant}
                setUpdate={setUpdate}
                setVisible={setVisible}
                sideBar={false}
              />
            </ThemeDialog>

            <DeleteConfirmation
              message="Do you want to delete this Tenant?"
              icon="pi pi-exclamation-triangle"
              confirm={confirm}
              setConfirm={setConfirm}
              confirmFunction={deleteTenant}
              update={update}
              setUpdate={setUpdate}
              sideBar={false}
            />
          </Card.Body>
        </Card>
      </div>
    </Wrapper>
  )
}
