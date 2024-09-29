import React, { useState, useEffect } from 'react'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import {
  Breadcrumb,
  Button,
  ButtonGroup,
  Card,
  Dropdown,
} from '@themesberg/react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import useRequest from '../../axios/apis/useRequest'
import { Wrapper } from './Audits.styled'
import { FormattedMessage } from 'react-intl'
import CustomPaginator from '../../components/custom/Shared/CustomPaginator/CustomPaginator'
import SafeFormatMessage from '../../components/custom/Shared/SafeFormatMessage/SafeFormatMessage'
import ColumnSortHeader from '../../components/custom/Shared/ColumnSortHeader/ColumnSortHeader'
import DateLabel from '../../components/custom/Shared/DateLabel/DateLabel'
import BreadcrumbComponent from '../../components/custom/Shared/Breadcrumb/Breadcrumb'
import {
  BsCalendar,
  BsCalendar2Check,
  BsCalendar2Fill,
  BsFillPersonLinesFill,
} from 'react-icons/bs'
import TableHead from '../../components/custom/Shared/TableHead/TableHead'
import DataLabelWhite from '../../components/custom/Shared/DateLabelWhite/DateLabelWhite'
import { UppercaseMonthDateFormat } from '../../lib/sharedFun/Time'
import Label from '../../components/custom/Shared/label/Label'
import { actionTypeColors } from '../../const/product'
import { setAuditsData, setLoading } from '../../store/slices/main'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEllipsisH, faNewspaper } from '@fortawesome/free-solid-svg-icons'
import { Routes } from '../../routes'
import { useNavigate } from 'react-router-dom'
import ThemeDialog from '../../components/custom/Shared/ThemeDialog/ThemeDialog'
import ShowDetails from '../../components/custom/Shared/ShowDetails/ShowDetails'

export default function Audits() {
  const dispatch = useDispatch()
  const { getAuditsList, getAuditById } = useRequest()
  const [totalCount, setTotalCount] = useState(0)
  const [searchValue, setSearchValue] = useState('')
  const [sortField, setSortField] = useState('')
  const [sortValue, setSortValue] = useState('')
  const [first, setFirst] = useState(0)
  const [rows, setRows] = useState(10)
  const [rebase, setRebase] = useState(0)
  const [auditDetails, setAuditDetails] = useState({})
  const [currentId, setCurrentId] = useState('')
  const [visible, setVisible] = useState(false)
  const [popUpLable, setPopUpLable] = useState('')
  // const listData = useSelector((state) => state.main.audits?.items)
  const [list, setList] = useState([])
  useEffect(() => {
    let query = `?page=${Math.ceil(
      (first + 1) / rows
    )}&pageSize=${rows}&filters[0].Field=actionType&filters[0].Operator=contains`
    if (searchValue) query += `&filters[0].Value=${searchValue}`
    if (sortField) query += `&sort.Field=${sortField}`
    if (sortValue) query += `&sort.Direction=${sortValue}`

    const fetchAuditsList = async () => {
      dispatch(setLoading(true))

      try {
        const auditsList = await getAuditsList(query)
        setList(auditsList.data.data.items)
        // dispatch(setAuditsData(auditsList.data.data))
        setTotalCount(auditsList.data.data.totalCount)
      } catch (error) {
        console.error('Error fetching audits:', error)
      } finally {
        dispatch(setLoading(false))
      }
    }

    fetchAuditsList()
  }, [first, rows, searchValue, sortField, sortValue])

  const onPageChange = (event) => {
    setFirst(event.first)
    setRows(event.rows)
  }
  const convertTicksToDate = (ticks) => {
    const ticksPerMillisecond = 10000
    const epochTicks = 621355968000000000
    const date = new Date((ticks - epochTicks) / ticksPerMillisecond)
    return UppercaseMonthDateFormat(date, true, true, true)
  }
  const handleData = (data) => {
    if (!data) return {}

    // Formatting the fetched data to display
    const {
      method,
      jsonData,
      id,
      createdDate,
      actionType,
      actionCategory,
      actionName,
      userId,
      userType,
      clientId,
      duration,
    } = data

    return {
      Method: method,
      'Created Date': createdDate,
      'Action Type': actionType,
      'Action Category': actionCategory,
      'Action Name': actionName,
      'User Type': userType,
      'Client ID': clientId,
      'Duration (ms)': duration,
      'Action Details': jsonData,
    }
  }

  const descriptionPop = async (id) => {
    setCurrentId(id)
    setVisible(true)

    const auditDetailResponse = await getAuditById(id)
    auditDetailResponse.data.data &&
      setAuditDetails(auditDetailResponse.data.data)
    setPopUpLable(
      <>
        <div>
          Action: <span>{auditDetailResponse.data.data.action}</span>
        </div>
        <div>
          <BsCalendar2Fill className="ml-0 mb-1 mr-1" />
          {UppercaseMonthDateFormat(
            auditDetailResponse.data.data.createdDate,
            true,
            true,
            true
          )}
        </div>
      </>
    )
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
              value={list}
              tableStyle={{ minWidth: '50rem' }}
              size={'small'}
            >
              <Column
                field="actionName"
                header={<SafeFormatMessage id="Action-Name" />}
                className="actionName"
              />
              <Column
                field="actionType"
                header={
                  <ColumnSortHeader
                    text={<SafeFormatMessage id="Action-Type" />}
                    field="action"
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
                  rowData && (
                    <Label
                      {...actionTypeColors[rowData?.actionType]}
                      sameWidth={55}
                    />
                  )
                }
              />

              <Column
                field="actionCategory"
                header={<SafeFormatMessage id="Action-Category" />}
              />

              <Column
                field="clientId"
                header={<SafeFormatMessage id="Client-ID" />}
                body={(rowData) =>
                  rowData &&
                  rowData?.clientId && (
                    <DataLabelWhite text={rowData?.clientId} variant={'gray'} />
                  )
                }
                className="clientId"
              />

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
                      <Dropdown.Item onSelect={() => descriptionPop(data.id)}>
                        <FontAwesomeIcon icon={faNewspaper} className="mx-2" />

                        <SafeFormatMessage id="View-Details" />
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
          </Card.Body>
        </Card>
        <ThemeDialog visible={visible} setVisible={setVisible} size={'xl'}>
          <ShowDetails
            popupLabel={popUpLable}
            data={auditDetails && handleData(auditDetails)}
            setVisible={setVisible}
          />
        </ThemeDialog>
      </div>
    </Wrapper>
  )
}
