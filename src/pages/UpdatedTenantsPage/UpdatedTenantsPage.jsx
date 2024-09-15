import React, { useState, useEffect } from 'react'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import BreadcrumbComponent from '../../components/custom/Shared/Breadcrumb/Breadcrumb.jsx'
import { BsFillPersonLinesFill } from 'react-icons/bs'

import ColumnSortHeader from '../../components/custom/Shared/ColumnSortHeader/ColumnSortHeader.jsx'
import TableHead from '../../components/custom/Shared/TableHead/TableHead.jsx'
import TableDate from '../../components/custom/Shared/TableDate/TableDate.jsx'
import TenantForm from '../../components/custom/tenant/TenantForm/TenantForm.jsx'
import useRequest from '../../axios/apis/useRequest.js'
import { Dialog } from 'primereact/dialog'
import DeleteConfirmation from '../../components/custom/global/DeleteConfirmation/DeleteConfirmation.jsx'
import { useNavigate, useParams } from 'react-router-dom'
import { Wrapper } from './UpdatedTenantsPage.styled.jsx'
import CustomPaginator from '../../components/custom/Shared/CustomPaginator/CustomPaginator.jsx'
import AutoCompleteFiled from '../../components/custom/Shared/AutoCompleteFiled/AutoCompleteFiled.jsx'
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
import SafeFormatMessage from '../../components/custom/Shared/SafeFormatMessage/SafeFormatMessage.jsx'
import FilterSearchContainer from '../../components/custom/Shared/FilterSearchContainer/FilterSearchContainer.jsx'
import DataLabelWhite from '../../components/custom/Shared/DateLabelWhite/DateLabelWhite.jsx'
import Label from '../../components/custom/Shared/label/Label.jsx'
import { subscriptionMode, subscriptionStatus } from '../../const/product.js'
import TenantStatus from '../../components/custom/tenant/TenantStatus/TenantStatus.jsx'
import { DataTransform, formatDate } from '../../lib/sharedFun/Time.js'
import DateLabel from '../../components/custom/Shared/DateLabel/DateLabel.jsx'
import useSharedFunctions from '../../components/custom/Shared/SharedFunctions/SharedFunctions.jsx'
export default function UpdatedTenantsPage({ children }) {
  const {
    getTenant,
    getTenantList,
    deleteTenantReq,
    getProductsLookup,
    subscriptionFilteredList,
  } = useRequest()
  const [visible, setVisible] = useState(false)
  const [totalCount, setTotalCount] = useState(0)
  const [visibleHead, setVisibleHead] = useState(false)
  const [list, setList] = useState([])
  console.log({ list })
  const { getLocalizedString } = useSharedFunctions()

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
  const [selectedData, setAllSelectedData] = useState()

  useEffect(() => {
    let query = `?page=${Math.ceil(
      (first + 1) / rows
    )}&pageSize=${rows}&filters[0].Field=SearchTerm`
    if (searchValue) query += `&filters[0].Value=${searchValue}`
    if (sortField) query += `&sort.Field=${sortField}`
    if (sortValue) query += `&sort.Direction=${sortValue}`
    if (
      selectedData &&
      (Array.isArray(selectedData)
        ? selectedData?.length > 0
        : Object.keys(selectedData)?.length > 0)
    ) {
      selectedData &&
        Object.values(selectedData).forEach((item, index) => {
          query += `&filters[${index + 1}].Field=${item.field}&filters[${
            index + 1
          }].Value=${item.value}`
        })
    }
    if (selectedProduct)
      query += `&filters[1].Field=selectedProduct&filters[1].Value=${selectedProduct}`
    ;(async () => {
      const listData = await subscriptionFilteredList(query)
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
    selectedData,
  ])

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
  const viewSystemNameColumn = false

  return (
    <Wrapper>
      <BreadcrumbComponent
        breadcrumbInfo={'TenantList'}
        icon={BsFillPersonLinesFill}
      />
      <div className="main-container">
        <TableHead
          label={<SafeFormatMessage id="Add-Tenant" />}
          popupLabel={'Create Tenant'}
          icon={'pi-user-plus'}
          setSearchValue={setSearchValue}
          visibleHead={visibleHead}
          setVisibleHead={setVisibleHead}
          setFirst={setFirst}
          search={true}
          title={<SafeFormatMessage id="Tenants-List" />}
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
            popupLabel={<SafeFormatMessage id="Create-Tenant" />}
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
        <div className="mb-4">
          <FilterSearchContainer setAllSelectedData={setAllSelectedData} />
        </div>
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
                header={
                  <ColumnSortHeader
                    text="Display Name / System Name"
                    field="tenant.displayName"
                    rebase={rebase}
                    setRebase={setRebase}
                    sortField={sortField}
                    sortValue={sortValue}
                    setSortField={setSortField}
                    setSortValue={setSortValue}
                    setFirst={setFirst}
                  />
                }
                body={(rowData) => (
                  <div>
                    <div>{rowData.tenant.displayName}</div>
                    <small style={{ color: 'gray' }}>
                      {<DataLabelWhite text={rowData.tenant.systemName} />}
                    </small>
                  </div>
                )}
              ></Column>
              <Column
                header={
                  <ColumnSortHeader
                    text="Subscription-Mode"
                    field="subscriptionMode"
                    rebase={rebase}
                    setRebase={setRebase}
                    sortField={sortField}
                    sortValue={sortValue}
                    setSortField={setSortField}
                    setSortValue={setSortValue}
                    setFirst={setFirst}
                  />
                }
                body={(rowData) => (
                  <Label {...subscriptionMode[rowData.subscriptionMode]} />
                )}
              ></Column>
              <Column
                header={
                  <ColumnSortHeader
                    text="Subscription-Status"
                    field="subscriptionStatus"
                    rebase={rebase}
                    setRebase={setRebase}
                    sortField={sortField}
                    sortValue={sortValue}
                    setSortField={setSortField}
                    setSortValue={setSortValue}
                    setFirst={setFirst}
                  />
                }
                body={(rowData) => (
                  <Label {...subscriptionStatus[rowData.subscriptionStatus]} />
                )}
              ></Column>
              <Column
                header={
                  <ColumnSortHeader
                    text="Tenant-Status"
                    field="tenant.status"
                    rebase={rebase}
                    setRebase={setRebase}
                    sortField={sortField}
                    sortValue={sortValue}
                    setSortField={setSortField}
                    setSortValue={setSortValue}
                    setFirst={setFirst}
                  />
                }
                body={(rowData) => (
                  <TenantStatus
                    statusValue={rowData.tenant.status}
                    key={rowData.id}
                  />
                )}
              ></Column>
              <Column
                header={
                  <ColumnSortHeader
                    text="plan"
                    field="Plan.SystemName"
                    rebase={rebase}
                    setRebase={setRebase}
                    sortField={sortField}
                    sortValue={sortValue}
                    setSortField={setSortField}
                    setSortValue={setSortValue}
                    setFirst={setFirst}
                  />
                }
                body={(rowData) =>
                  getLocalizedString(rowData.plan.displayNameLocalizations)
                }
              ></Column>

              <Column
                header={
                  <ColumnSortHeader
                    text="End-Date"
                    field="endDate"
                    rebase={rebase}
                    setRebase={setRebase}
                    sortField={sortField}
                    sortValue={sortValue}
                    setSortField={setSortField}
                    setSortValue={setSortValue}
                    setFirst={setFirst}
                  />
                }
                body={(rowData) => <DateLabel endDate={rowData.endDate} />}
              ></Column>
              {viewSystemNameColumn && (
                <Column
                  field="tenant.systemName"
                  header={
                    <ColumnSortHeader
                      text="System Name"
                      field="tenant.systemName"
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
              )}
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
                  <>
                    <div className="mb-1">
                      <DataLabelWhite
                        style={{ flexWrap: 'nowrap' }}
                        text={
                          <>
                            <SafeFormatMessage id="Last-Update-At" />{' '}
                            {DataTransform(data.editedDate)}
                          </>
                        }
                      />
                    </div>
                    <div className="">
                      <DataLabelWhite
                        text={
                          <>
                            <SafeFormatMessage id="Created-At" />{' '}
                            {DataTransform(data.createdDate)}
                          </>
                        }
                      />
                    </div>
                  </>
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
                          navigate(`${Routes.Tenant.path}/${data.tenant.id}`)
                        }
                      >
                        <FontAwesomeIcon icon={faEye} className="mr-2" /> View
                        Details
                      </Dropdown.Item>
                      <Dropdown.Item onSelect={() => editForm(data.tenant.id)}>
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
                popupLabel={<SafeFormatMessage id="Edit-Tenant" />}
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
