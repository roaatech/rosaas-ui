import React, { useState, useEffect } from 'react'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Breadcrumb, Card } from '@themesberg/react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import useRequest from '../../axios/apis/useRequest'
import { Wrapper } from './Audits.styled'
import { FormattedMessage } from 'react-intl'
import CustomPaginator from '../../components/custom/Shared/CustomPaginator/CustomPaginator'
import SafeFormatMessage from '../../components/custom/Shared/SafeFormatMessage/SafeFormatMessage'
import ColumnSortHeader from '../../components/custom/Shared/ColumnSortHeader/ColumnSortHeader'
import DateLabel from '../../components/custom/Shared/DateLabel/DateLabel'
import BreadcrumbComponent from '../../components/custom/Shared/Breadcrumb/Breadcrumb'
import { BsFillPersonLinesFill } from 'react-icons/bs'
import TableHead from '../../components/custom/Shared/TableHead/TableHead'
import DataLabelWhite from '../../components/custom/Shared/DateLabelWhite/DateLabelWhite'
import { UppercaseMonthDateFormat } from '../../lib/sharedFun/Time'
import Label from '../../components/custom/Shared/label/Label'
import { actionTypeColors } from '../../const/product'

export default function Audits() {
  const dispatch = useDispatch()
  const { getAuditsList } = useRequest()
  const [totalCount, setTotalCount] = useState(0)
  const [searchValue, setSearchValue] = useState('')
  const [sortField, setSortField] = useState('')
  const [sortValue, setSortValue] = useState('')
  const [first, setFirst] = useState(0)
  const [rows, setRows] = useState(10)
  const [rebase, setRebase] = useState(0)

  // Mock Data
  const listData = useSelector((state) => state.audits?.auditsList) || [
    {
      timeStamp: 638362444942249425,
      id: 1,
      createdDate: '2023-11-22T10:08:14',
      actionType: 'PUT',
      actionCategory: 'ClientCredential',
      actionName: 'UpdateClientSecret',
      userId: '9728990f-841c-45bd-b358-14b308c80030',
      userType: 'super_admin',
      clientId: 'spa_rosas_admin_panel',
      duration: 54,
    },
    {
      timeStamp: 638362446192474579,
      id: 2,
      createdDate: '2023-11-22T10:10:19',
      actionType: 'POST',
      actionCategory: 'ClientCredential',
      actionName: 'CreateClientSecret',
      userId: '9728990f-841c-45bd-b358-14b308c80030',
      userType: 'super_admin',
      clientId: 'spa_rosas_admin_panel',
      duration: 54,
    },
    {
      timeStamp: 638362446366934968,
      id: 3,
      createdDate: '2023-11-22T10:10:36',
      actionType: 'POST',
      actionCategory: 'ClientCredential',
      actionName: 'CreateClientSecret',
      userId: '9728990f-841c-45bd-b358-14b308c80030',
      userType: 'super_admin',
      clientId: 'spa_rosas_admin_panel',
      duration: 84,
    },
    {
      timeStamp: 638362446474678382,
      id: 4,
      createdDate: '2023-11-22T10:10:47',
      actionType: 'POST',
      actionCategory: 'ClientCredential',
      actionName: 'RegenerateClientSecret',
      userId: '9728990f-841c-45bd-b358-14b308c80030',
      userType: 'super_admin',
      clientId: 'spa_rosas_admin_panel',
      duration: 48,
    },
    {
      timeStamp: 638362446598351609,
      id: 5,
      createdDate: '2023-11-22T10:10:59',
      actionType: 'DELETE',
      actionCategory: 'ClientCredential',
      actionName: 'DeleteClientSecret',
      userId: '9728990f-841c-45bd-b358-14b308c80030',
      userType: 'super_admin',
      clientId: 'spa_rosas_admin_panel',
      duration: 104,
    },
    {
      timeStamp: 638362446636527174,
      id: 6,
      createdDate: '2023-11-22T10:11:03',
      actionType: 'DELETE',
      actionCategory: 'ClientCredential',
      actionName: 'DeleteClientSecret',
      userId: '9728990f-841c-45bd-b358-14b308c80030',
      userType: 'super_admin',
      clientId: 'spa_rosas_admin_panel',
      duration: 25,
    },
    {
      timeStamp: 638362446720191677,
      id: 7,
      createdDate: '2023-11-22T10:11:12',
      actionType: 'PUT',
      actionCategory: 'ClientCredential',
      actionName: 'UpdateClientSecret',
      userId: '9728990f-841c-45bd-b358-14b308c80030',
      userType: 'super_admin',
      clientId: 'spa_rosas_admin_panel',
      duration: 1,
    },
    {
      timeStamp: 638362446966166218,
      id: 8,
      createdDate: '2023-11-22T10:11:36',
      actionType: 'POST',
      actionCategory: 'ClientCredential',
      actionName: 'CreateClientSecret',
      userId: '9728990f-841c-45bd-b358-14b308c80030',
      userType: 'super_admin',
      clientId: 'spa_rosas_admin_panel',
      duration: 89,
    },
    {
      timeStamp: 638362447420799715,
      id: 9,
      createdDate: '2023-11-22T10:12:22',
      actionType: 'POST',
      actionCategory: 'ClientCredential',
      actionName: 'CreateClientSecret',
      userId: '9728990f-841c-45bd-b358-14b308c80030',
      userType: 'super_admin',
      clientId: 'spa_rosas_admin_panel',
      duration: 15,
    },
    {
      timeStamp: 638362448324158806,
      id: 10,
      createdDate: '2023-11-22T10:13:52',
      actionType: 'PUT',
      actionCategory: 'ClientCredential',
      actionName: 'UpdateClientSecret',
      userId: '9728990f-841c-45bd-b358-14b308c80030',
      userType: 'super_admin',
      clientId: 'spa_rosas_admin_panel',
      duration: 45,
    },
    {
      timeStamp: 638362449009780452,
      id: 11,
      createdDate: '2023-11-22T10:15:00',
      actionType: 'PUT',
      actionCategory: 'ClientCredential',
      actionName: 'UpdateClientSecret',
      userId: '9728990f-841c-45bd-b358-14b308c80030',
      userType: 'super_admin',
      clientId: 'spa_rosas_admin_panel',
      duration: 1,
    },
    {
      timeStamp: 638362449886278777,
      id: 12,
      createdDate: '2023-11-22T10:16:28',
      actionType: 'POST',
      actionCategory: 'Specifications',
      actionName: 'CreateSpecification',
      userId: '9728990f-841c-45bd-b358-14b308c80030',
      userType: 'super_admin',
      clientId: 'spa_rosas_admin_panel',
      duration: 126,
    },
    {
      timeStamp: 638362450547926777,
      id: 13,
      createdDate: '2023-11-22T10:17:34',
      actionType: 'POST',
      actionCategory: 'Specifications',
      actionName: 'CreateSpecification',
      userId: '9728990f-841c-45bd-b358-14b308c80030',
      userType: 'super_admin',
      clientId: 'spa_rosas_admin_panel',
      duration: 77,
    },
    {
      timeStamp: 638362450800016121,
      id: 14,
      createdDate: '2023-11-22T10:18:00',
      actionType: 'POST',
      actionCategory: 'Specifications',
      actionName: 'CreateSpecification',
      userId: '9728990f-841c-45bd-b358-14b308c80030',
      userType: 'super_admin',
      clientId: 'spa_rosas_admin_panel',
      duration: 125,
    },
    {
      timeStamp: 638362451140654711,
      id: 15,
      createdDate: '2023-11-22T10:18:34',
      actionType: 'POST',
      actionCategory: 'Specifications',
      actionName: 'CreateSpecification',
      userId: '9728990f-841c-45bd-b358-14b308c80030',
      userType: 'super_admin',
      clientId: 'spa_rosas_admin_panel',
      duration: 36,
    },
  ]

  useEffect(() => {
    let query = `?page=${Math.ceil(
      (first + 1) / rows
    )}&pageSize=${rows}&filters[0].Field=actionType&filters[0].Operator=contains`
    if (searchValue) query += `&filters[0].Value=${searchValue}`
    if (sortField) query += `&sort.Field=${sortField}`
    if (sortValue) query += `&sort.Direction=${sortValue}`
    ;(async () => {
      const auditsList = await getAuditsList(query)
      dispatch({ type: 'SET_AUDITS_LIST', payload: auditsList.data.data.items })
      setTotalCount(auditsList.data.data.totalCount)
    })()
  }, [first, rows, searchValue, sortField, sortValue])

  const onPageChange = (event) => {
    setFirst(event.first)
    setRows(event.rows)
  }
  const convertTicksToDate = (ticks) => {
    const ticksPerMillisecond = 10000 // 1 tick = 100 ns, 1 ms = 10,000 ticks
    const epochTicks = 621355968000000000 // Ticks at 1970-01-01T00:00:00Z
    const date = new Date((ticks - epochTicks) / ticksPerMillisecond)
    return UppercaseMonthDateFormat(date) // Format the date as a string
  }

  return (
    <Wrapper>
      <BreadcrumbComponent
        breadcrumbInfo={'AuditsList'}
        icon={BsFillPersonLinesFill}
      />
      <div className="main-container">
        <TableHead
          setSearchValue={setSearchValue}
          setFirst={setFirst}
          search={true}
          button={false}
          title={<SafeFormatMessage id="Audits-List" />}
          icon={'pi-box'}
        />
        <Card
          border="light"
          className="table-wrapper table-responsive shadow-sm"
        >
          <Card.Body className="pt-0">
            <DataTable
              value={listData}
              tableStyle={{ minWidth: '50rem' }}
              size={'small'}
            >
              {/* Action Type Column */}
              <Column
                field="actionType"
                header={
                  <ColumnSortHeader
                    text={<SafeFormatMessage id="Action-Type" />}
                    field="actionType"
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
                  <Label {...actionTypeColors[rowData.actionType]} />
                )}
              />

              {/* Action Category Column */}
              <Column
                field="actionCategory"
                header={<SafeFormatMessage id="Action-Category" />}
                body={(rowData) => (
                  <SafeFormatMessage id={rowData.actionCategory} />
                )}
              />

              {/* Action Name Column */}
              <Column
                field="actionName"
                header={<SafeFormatMessage id="Action-Name" />}
                body={(rowData) => (
                  <SafeFormatMessage id={rowData.actionName} />
                )}
              />
              <Column
                field="clientId"
                header={<SafeFormatMessage id="Client-ID" />}
                body={(rowData) => (
                  <DataLabelWhite
                    text={<SafeFormatMessage id={rowData.clientId} />}
                    variant={'gray'}
                  />
                )}
              />
              {/* User Type Column */}
              <Column
                field="userType"
                header={
                  <ColumnSortHeader
                    text={<SafeFormatMessage id="User-Type" />}
                    field="userType"
                    rebase={rebase}
                    setRebase={setRebase}
                    sortField={sortField}
                    sortValue={sortValue}
                    setSortField={setSortField}
                    setSortValue={setSortValue}
                    setFirst={setFirst}
                  />
                }
                body={(rowData) => <SafeFormatMessage id={rowData.userType} />}
              />
              <Column
                field="timeStamp"
                header={
                  <ColumnSortHeader
                    text={<SafeFormatMessage id="Date" />}
                    field="timeStamp"
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
                    {rowData?.timeStamp && (
                      <DataLabelWhite
                        text={convertTicksToDate(rowData?.timeStamp)}
                      />
                    )}
                  </div>
                )}
              />
              {/* Client ID Column */}
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
