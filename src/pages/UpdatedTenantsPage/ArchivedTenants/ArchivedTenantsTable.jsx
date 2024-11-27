import React, { useState, useEffect, useCallback } from 'react'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import BreadcrumbComponent from '../../../components/custom/Shared/Breadcrumb/Breadcrumb'
import { BsCheckCircleFill, BsFillPersonLinesFill } from 'react-icons/bs'
import ColumnSortHeader from '../../../components/custom/Shared/ColumnSortHeader/ColumnSortHeader'
import useRequest from '../../../axios/apis/useRequest'
import {
  Button,
  Card,
  Dropdown,
  ButtonGroup,
  Table,
} from '@themesberg/react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faEllipsisH } from '@fortawesome/free-solid-svg-icons'
import { useNavigate } from 'react-router-dom'
import CustomPaginator from '../../../components/custom/Shared/CustomPaginator/CustomPaginator'
import { Wrapper } from './ArchivedTenantsTable.styled'
import { useSelector } from 'react-redux'
import TableHead from '../../../components/custom/Shared/TableHead/TableHead'
import TableDate from '../../../components/custom/Shared/TableDate/TableDate'
import { Routes } from '../../../routes'
import SafeFormatMessage from '../../../components/custom/Shared/SafeFormatMessage/SafeFormatMessage'
import DataLabelWhite from '../../../components/custom/Shared/DateLabelWhite/DateLabelWhite'
import { UppercaseMonthDateFormat } from '../../../lib/sharedFun/Time'
import Label from '../../../components/custom/Shared/label/Label'
import {
  cycle,
  featureResetMap,
  subscriptionMode,
  subscriptionStatus,
} from '../../../const/product'
import TenantStatus from '../../../components/custom/tenant/TenantStatus/TenantStatus'
import useSharedFunctions from '../../../components/custom/Shared/SharedFunctions/SharedFunctions'
import { ro } from 'date-fns/locale'
import { cancellationOrSuspensionReasons } from '../../../const/subscriptionConsts'
import DateLabel from '../../../components/custom/Shared/DateLabel/DateLabel'
import DescriptionCell from '../../../components/custom/Shared/DescriptionCell/DescriptionCell'
import TenantFormOnboarding from '../../../components/custom/tenant/TenantFormOnboarding/TenantFormOnboarding'
import DynamicButtons from '../../../components/custom/Shared/DynamicButtons/DynamicButtons'
import { MdHistory } from 'react-icons/md'

export default function ArchivedTenantsTable({
  setSelectedTable,
  selectedTable,
}) {
  const { subscriptionCanceledFilteredList } = useRequest()
  const [totalCount, setTotalCount] = useState(0)
  const [list, setList] = useState([])

  const [first, setFirst] = useState(0)
  const [rows, setRows] = useState(10)
  const [searchValue, setSearchValue] = useState('')
  const [sortField, setSortField] = useState('')
  const [sortValue, setSortValue] = useState('')
  const navigate = useNavigate()

  // const fetchData = useCallback(async () => {
  //   let query = `?page=${Math.ceil((first + 1) / rows)}&pageSize=${rows}`
  //   try {
  //     const listData = await subscriptionCanceledFilteredList(query)
  //     setList(listData.data.data.items)
  //   } catch (error) {
  //     console.error('Error fetching data:', error)
  //   }
  // }, [])

  // useEffect(() => {
  //   fetchData()
  // }, [first, rows, searchValue, sortField, sortValue])

  useEffect(() => {
    let query = `?page=${Math.ceil(
      (first + 1) / rows
    )}&pageSize=${rows}&filters[0].Field=SearchTerm`
    if (searchValue) query += `&filters[0].Value=${searchValue}`
    if (sortField) query += `&sort.Field=${sortField}`
    if (sortValue) query += `&sort.Direction=${sortValue}`
    ;(async () => {
      const listData = await subscriptionCanceledFilteredList(query)
      setTotalCount(listData.data.data.totalCount)
      setList(listData.data.data.items)
    })()
  }, [first, rows, searchValue, sortField, sortValue])

  const [visibleHead, setVisibleHead] = useState(false)
  const { getLocalizedString } = useSharedFunctions()

  const onPageChange = (event) => {
    setFirst(event.first)
    setRows(event.rows)
  }
  const [rebase, setRebase] = useState(0)

  const viewDetails = (id) => {
    navigate(`${Routes.Tenant.path}/${id}`)
  }

  return (
    <Wrapper>
      <div className=" canceled-tenant">
        <TableHead
          setSearchValue={setSearchValue}
          setFirst={setFirst}
          search={true}
          button={false}
          title={<SafeFormatMessage id="Archived-Tenants" />}
        >
          <TenantFormOnboarding
            type={'create'}
            popupLabel={<SafeFormatMessage id="Create-Tenant" />}
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
                  table === 'Active' ? <BsCheckCircleFill /> : <MdHistory />,
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
                    <div>{rowData.tenant.displayName}</div>
                    <small style={{ color: 'gray' }}>
                      {
                        <DataLabelWhite
                          variant={'gray'}
                          text={
                            <span className="fw-bold">
                              {rowData.tenant.systemName}
                            </span>
                          }
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
                      <div>
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
                    field="product.systemName"
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
                    </div>
                  </>
                )}
              ></Column>
              <Column
                header={
                  SafeFormatMessage({
                    id: 'cancellation-Reason',
                  })
                  // <ColumnSortHeader
                  //   text={SafeFormatMessage({
                  //     id: 'cancellation-Reason',
                  //   })}
                  //   field="cancellationOrSuspensionReason"
                  //   rebase={rebase}
                  //   setRebase={setRebase}
                  //   sortField={sortField}
                  //   sortValue={sortValue}
                  //   setSortField={setSortField}
                  //   setSortValue={setSortValue}
                  //   setFirst={setFirst}
                  // />
                }
                body={(rowData) => (
                  <>
                    {cancellationOrSuspensionReasons[
                      rowData.cancellationOrSuspensionReason
                    ] && (
                      <Label
                        {...cancellationOrSuspensionReasons[
                          rowData.cancellationOrSuspensionReason
                        ]}
                      />
                    )}
                  </>
                )}
              ></Column>
              <Column
                header={
                  <ColumnSortHeader
                    text={SafeFormatMessage({ id: 'Subscription-Mode' })}
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
                body={(rowData) =>
                  rowData.subscriptionMode != 2 ? (
                    <Label {...subscriptionMode[rowData.subscriptionMode]} />
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
                header={SafeFormatMessage({ id: 'Subscription-Status' })}
                // {
                //   <ColumnSortHeader
                //     text={SafeFormatMessage({ id: 'Subscription-Status' })}
                //     field="subscriptionStatus"
                //     rebase={rebase}
                //     setRebase={setRebase}
                //     sortField={sortField}
                //     sortValue={sortValue}
                //     setSortField={setSortField}
                //     setSortValue={setSortValue}
                //     setFirst={setFirst}
                //   />
                // }
                body={(rowData) => (
                  <Label {...subscriptionStatus[rowData.subscriptionStatus]} />
                )}
              ></Column>
              <Column
                header={SafeFormatMessage({
                  id: 'Tenant-Operational-Status',
                })}
                // {
                //   <ColumnSortHeader
                //     text={SafeFormatMessage({
                //       id: 'Tenant-Operational-Status',
                //     })}
                //     field="SubscriptionMode"
                //     rebase={rebase}
                //     setRebase={setRebase}
                //     sortField={sortField}
                //     sortValue={sortValue}
                //     setSortField={setSortField}
                //     setSortValue={setSortValue}
                //     setFirst={setFirst}
                //   />
                // }
                body={(rowData) => (
                  <TenantStatus
                    statusValue={rowData.tenant.status}
                    key={rowData.id}
                  />
                )}
              ></Column>
              <Column
                header={
                  SafeFormatMessage({
                    id: 'Comment',
                  })
                  // <ColumnSortHeader
                  //   text={SafeFormatMessage({
                  //     id: 'Comment',
                  //   })}
                  //   field="comment"
                  //   rebase={rebase}
                  //   setRebase={setRebase}
                  //   sortField={sortField}
                  //   sortValue={sortValue}
                  //   setSortField={setSortField}
                  //   setSortValue={setSortValue}
                  //   setFirst={setFirst}
                  // />
                }
                body={(rowData) => (
                  <>
                    <DescriptionCell
                      data={{
                        description: rowData.description,
                      }}
                    />
                  </>
                )}
              ></Column>
              <Column
                className="text-dark "
                body={(data) => (
                  <DateLabel
                    hasBorder={true}
                    endDate={data.cancellationOrSuspensionDate}
                    uppercaseMonthDateFormat={true}
                  />
                )}
                header={SafeFormatMessage({
                  id: 'cancellation-Date',
                })}
                // {
                //   <ColumnSortHeader
                //     text={SafeFormatMessage({
                //       id: 'cancellation-Date',
                //     })}
                //     field="cancellationOrSuspensionDate"
                //     rebase={rebase}
                //     setRebase={setRebase}
                //     sortField={sortField}
                //     sortValue={sortValue}
                //     setSortField={setSortField}
                //     setSortValue={setSortValue}
                //     setFirst={setFirst}
                //   />
                // }
              />
              {/* <Column
                className="text-dark "
                body={(rowData) => (
                  <div className="d-flex align-items-center flex-column justify-content-center">
                    <DataLabelWhite
                      text={
                        <>
                          <span>{SafeFormatMessage({ id: 'Started-on' })}</span>{' '}
                          <span className="fw-bold">
                            {UppercaseMonthDateFormat(rowData.createdDate)}
                          </span>
                        </>
                      }
                      variant={'gray'}
                    />
                    <DateLabel
                      endDate={rowData.endDate}
                      uppercaseMonthDateFormat={true}
                      hasTitle={true}
                      hasBorder={true}
                    />
                  </div>
                )}
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
              /> */}
              <Column
                className="text-dark "
                body={(data) => (
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
                        onClick={() => viewDetails(data.tenant.id)}
                      >
                        <FontAwesomeIcon icon={faEye} className="mx-2" /> View
                        Details
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                )}
                header="Actions"
              />
            </DataTable>
            <CustomPaginator
              first={first}
              rows={rows}
              totalCount={totalCount}
              onPageChange={onPageChange}
            />
          </Card.Body>
        </Card>
      </div>
    </Wrapper>
  )
}
