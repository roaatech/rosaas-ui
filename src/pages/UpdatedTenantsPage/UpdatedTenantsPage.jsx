import React, { useState, useEffect } from 'react'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import BreadcrumbComponent from '../../components/custom/Shared/Breadcrumb/Breadcrumb.jsx'
import {
  BsCheck,
  BsCheckCircle,
  BsCheckCircleFill,
  BsFillPersonLinesFill,
} from 'react-icons/bs'

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
import {
  featureResetMap,
  subscriptionMode,
  subscriptionStatus,
} from '../../const/product.js'
import TenantStatus from '../../components/custom/tenant/TenantStatus/TenantStatus.jsx'
import {
  DataTransform,
  formatDate,
  UppercaseMonthDateFormat,
} from '../../lib/sharedFun/Time.js'
import DateLabel from '../../components/custom/Shared/DateLabel/DateLabel.jsx'
import useSharedFunctions from '../../components/custom/Shared/SharedFunctions/SharedFunctions.jsx'
import { cancellationOrSuspensionReasons } from '../../const/subscriptionConsts.js'
import TruncateTextWithTooltip from '../../components/custom/Shared/SharedFunctions/textFormatFunctions.jsx'
import DynamicButtons from '../../components/custom/Shared/DynamicButtons/DynamicButtons.jsx'
import { icon } from '@fortawesome/fontawesome-svg-core'
import { MdHistory } from 'react-icons/md'
import ArchivedTenantsTable from './ArchivedTenants/ArchivedTenantsTable.jsx'
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
  const [selectedTable, setSelectedTable] = useState('Active')
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
        {selectedTable === 'Active' && (
          <>
            <div className="">
              <TableHead
                setSearchValue={setSearchValue}
                setFirst={setFirst}
                search={true}
                button={false}
                title={<SafeFormatMessage id="Tenants-List" />}
              >
                <TenantFormOnboarding
                  type={'create'}
                  popupLabel={<SafeFormatMessage id="Create-Tenant" />}
                  update={update}
                  setUpdate={setUpdate}
                  visible={visibleHead}
                  setVisible={setVisibleHead}
                  sideBar={false}
                />
                <DynamicButtons
                  buttons={[
                    ...Object.keys({
                      Archived: 'Archived',
                      Active: 'Active',
                    }).map((table) => ({
                      order: 1,
                      type: 'toggle',
                      label: table,
                      icon:
                        table === 'Active' ? (
                          <BsCheckCircleFill />
                        ) : (
                          <MdHistory />
                        ),
                      tooltip:
                        table === 'Active' ? (
                          <SafeFormatMessage id="Active" />
                        ) : (
                          <SafeFormatMessage id="Archived" />
                        ),
                      group: 'grid-switcher',
                      toggleValue: selectedTable === table,
                      toggleFunc: () => setSelectedTable(table),
                      variant: 'primary',
                    })),
                  ]}
                />
              </TableHead>
            </div>

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
                        text={
                          <div>
                            <div className="d-flex flex-column align-items-center">
                              <div>
                                {SafeFormatMessage({ id: 'Display-Name' })}{' '}
                              </div>
                              <DataLabelWhite
                                variant={'gray'}
                                text={
                                  <span className="fw-bold">
                                    {SafeFormatMessage({ id: 'System-Name' })}
                                  </span>
                                }
                              />
                            </div>
                          </div>
                        }
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
                        <div>
                          <TruncateTextWithTooltip
                            text={rowData.tenant.displayName}
                            maxCharSize={25}
                          />
                        </div>
                        <small style={{ color: 'gray' }}>
                          {
                            <DataLabelWhite
                              variant={'gray'}
                              maxCharSize={25}
                              text={rowData.tenant.systemName}
                              style={{ fontWeight: 'bold' }}
                            />
                          }
                        </small>
                      </div>
                    )}
                    className="name"
                  ></Column>
                  <Column
                    className="Product"
                    header={
                      <ColumnSortHeader
                        text={
                          <div className="d-flex flex-column align-items-center">
                            <div>
                              <SafeFormatMessage id="Product" />{' '}
                            </div>
                            <DataLabelWhite
                              variant={'gray'}
                              text={
                                <span className="fw-bold">
                                  {SafeFormatMessage({ id: 'System-Name' })}
                                </span>
                              }
                            />
                          </div>
                        }
                        field="Product.SystemName"
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
                      <>
                        <span
                          className="fw-bold mb-1"
                          style={{ color: 'var(--second-color)' }}
                        >
                          {getLocalizedString(
                            rowData.product.displayNameLocalizations
                          )}
                        </span>

                        <div>
                          {' '}
                          <DataLabelWhite
                            variant={'gray'}
                            text={
                              <>
                                <span className="fw-bold">
                                  {rowData.product.systemName}
                                </span>
                              </>
                            }
                          />
                        </div>
                      </>
                    )}
                  ></Column>
                  <Column
                    className="plan"
                    header={
                      <ColumnSortHeader
                        text={
                          <div>
                            <div className="d-flex flex-column align-items-center">
                              <div>
                                <SafeFormatMessage id="Plan" />{' '}
                              </div>
                              <DataLabelWhite
                                variant={'gray'}
                                text={
                                  <span className="fw-bold">
                                    {SafeFormatMessage({ id: 'System-Name' })}
                                  </span>
                                }
                              />
                            </div>
                          </div>
                        }
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
                    body={(rowData) => (
                      <>
                        <span
                          className="fw-bold mb-1"
                          style={{ color: 'var(--second-color)' }}
                        >
                          {getLocalizedString(
                            rowData.plan.displayNameLocalizations
                          )}
                        </span>
                        <span
                          className="mt-2 fw-bold "
                          style={{ color: 'var(--gray-600)', fontSize: '10px' }}
                        >
                          {' '}
                          {featureResetMap[rowData?.plan?.cycle] && (
                            <span>
                              {' '}
                              /{' '}
                              {SafeFormatMessage({
                                id: featureResetMap[rowData?.plan?.cycle],
                              })}
                            </span>
                          )}
                        </span>
                        <div>
                          {' '}
                          <DataLabelWhite
                            variant={'gray'}
                            text={
                              <>
                                <span className="fw-bold">
                                  {rowData.plan.systemName}
                                </span>
                              </>
                            }
                          />
                          {/* <Label
                        background="var(--light-blue)"
                        value={
                          <>
                            <span className="fw-bold">
                              {' '}
                              <SafeFormatMessage id="Next-Plan" />{' '}
                            </span>
                            {getLocalizedString(
                              rowData.plan.displayNameLocalizations
                            )}
                          </>
                        }
                        color="var(--blue-2)"
                      /> */}
                        </div>
                      </>
                    )}
                  ></Column>

                  <Column
                    header={
                      <ColumnSortHeader
                        text={SafeFormatMessage({ id: 'Subscription-Mode' })}
                        field="SubscriptionMode"
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
                      rowData.subscriptionMode != 2 ? (
                        <Label
                          {...subscriptionMode[rowData.subscriptionMode]}
                        />
                      ) : (
                        <>
                          <DateLabel
                            endDate={rowData.endDate}
                            uppercaseMonthDateFormat={true}
                            uppercaseMonthDateFormatType="justDate"
                            validBackgroundColor={'var(--light-blue)'}
                            validDateColor={'var(--blue-2)'}
                            bold={true}
                            title={
                              <>
                                <span className="fw-bold ">
                                  <SafeFormatMessage id="Trial" />
                                </span>
                                <span className="mx-1">
                                  {' '}
                                  <SafeFormatMessage id="Ends" />
                                </span>
                              </>
                            }
                          />
                        </>
                      )
                    }
                  ></Column>
                  <Column
                    header={
                      <ColumnSortHeader
                        text={SafeFormatMessage({ id: 'Subscription-Status' })}
                        field="SubscriptionStatus"
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
                      <Label
                        {...subscriptionStatus[rowData.subscriptionStatus]}
                      />
                    )}
                  ></Column>
                  <Column
                    header={
                      <ColumnSortHeader
                        text={SafeFormatMessage({
                          id: 'Tenant-Operational-Status',
                        })}
                        field="Tenant.Status"
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
                        text={SafeFormatMessage({ id: 'Subscription-Period' })}
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
                    body={(rowData) => (
                      <div className="d-flex align-items-center flex-column justify-content-center">
                        <span className="mb-1">
                          <DataLabelWhite
                            text={
                              <>
                                <span>
                                  {SafeFormatMessage({ id: 'Started-on' })}
                                </span>{' '}
                                <span className="fw-bold">
                                  {UppercaseMonthDateFormat(
                                    rowData.startDate,
                                    true
                                  )}
                                </span>
                              </>
                            }
                            variant={'gray'}
                          />
                        </span>
                        <DateLabel
                          endDate={rowData.endDate}
                          uppercaseMonthDateFormat={true}
                          hasTitle={true}
                          hasBorder={true}
                        />
                      </div>
                    )}
                  ></Column>
                  {viewSystemNameColumn && (
                    <Column
                      field="tenant.systemName"
                      header={
                        <ColumnSortHeader
                          text={
                            <span className="fw-bold">
                              {SafeFormatMessage({ id: 'System-Name' })}
                            </span>
                          }
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
                          {/* <DataLabelWhite
                        variant={'gray'}
                        style={{ flexWrap: 'nowrap' }}
                        text={
                          <>
                            <SafeFormatMessage id="Last-Update-At" />{' '}
                            <span className="fw-bold">
                              {UppercaseMonthDateFormat(data.editedDate)}
                            </span>
                          </>
                        }
                      /> */}
                          <TableDate
                            createdDate={data.createdDate}
                            editedDate={data.editedDate}
                            hasLabel={true}
                          />
                        </div>
                        {/* <div className="">
                      <DataLabelWhite
                        variant={'gray'}
                        text={
                          <>
                            <SafeFormatMessage id="Created-At" />{' '}
                            <span className="fw-bold">
                              {UppercaseMonthDateFormat(data.createdDate)}
                            </span>
                          </>
                        }
                      />
                    </div> */}
                      </>
                    )}
                    style={{ width: '250px', maxidth: '250px' }}
                    header={
                      <ColumnSortHeader
                        text={SafeFormatMessage({ id: 'Date' })}
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
                              navigate(
                                `${Routes.Tenant.path}/${data.tenant.id}`
                              )
                            }
                          >
                            <FontAwesomeIcon icon={faEye} className="mr-2" />{' '}
                            View Details
                          </Dropdown.Item>
                          <Dropdown.Item
                            onSelect={() => editForm(data.tenant.id)}
                          >
                            <FontAwesomeIcon icon={faEdit} className="mx-2" />{' '}
                            Edit
                          </Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                    )}
                    style={{ width: '60px', textAlign: 'center' }}
                    header={<SafeFormatMessage id="Actions" />}
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
          </>
        )}
        {selectedTable === 'Archived' && (
          <ArchivedTenantsTable
            selectedTable={selectedTable}
            setSelectedTable={setSelectedTable}
          />
        )}
      </div>
    </Wrapper>
  )
}
