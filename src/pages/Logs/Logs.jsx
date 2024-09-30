import React, { useState, useEffect } from 'react'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import {
  Button,
  ButtonGroup,
  Card,
  Dropdown,
} from '@themesberg/react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import useRequest from '../../axios/apis/useRequest'
import { Wrapper } from './Logs.styled'
import { FormattedMessage } from 'react-intl'
import CustomPaginator from '../../components/custom/Shared/CustomPaginator/CustomPaginator'
import SafeFormatMessage from '../../components/custom/Shared/SafeFormatMessage/SafeFormatMessage'
import ColumnSortHeader from '../../components/custom/Shared/ColumnSortHeader/ColumnSortHeader'
import DataLabelWhite from '../../components/custom/Shared/DateLabelWhite/DateLabelWhite'
import { UppercaseMonthDateFormat } from '../../lib/sharedFun/Time'
import ThemeDialog from '../../components/custom/Shared/ThemeDialog/ThemeDialog'
import ShowDetails from '../../components/custom/Shared/ShowDetails/ShowDetails'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEllipsisH, faNewspaper } from '@fortawesome/free-solid-svg-icons'
import { setLoading, setLogsData } from '../../store/slices/main'
import { BsCalendar2Fill, BsFillPersonLinesFill } from 'react-icons/bs'
import BreadcrumbComponent from '../../components/custom/Shared/Breadcrumb/Breadcrumb'
import TableHead from '../../components/custom/Shared/TableHead/TableHead'
import LogsFilterSearchContainer from '../../components/custom/Shared/FilterSearchContainer/LogsFilterSearchContainer/LogsFilterSearchContainer'

export default function Logs() {
  const dispatch = useDispatch()
  const { getLogsList, getLogById } = useRequest()
  const [totalCount, setTotalCount] = useState(0)
  const [searchValue, setSearchValue] = useState('')
  const [sortField, setSortField] = useState('')
  const [sortValue, setSortValue] = useState('')
  const [first, setFirst] = useState(0)
  const [rows, setRows] = useState(10)
  const [rebase, setRebase] = useState(0)
  const [logDetails, setLogDetails] = useState({})
  const [currentId, setCurrentId] = useState('')
  const [visible, setVisible] = useState(false)
  const [popUpLabel, setPopUpLabel] = useState('')
  // const listData = useSelector((state) => state.main.logs?.items)
  const [list, setList] = useState([])
  const [selectedData, setAllSelectedData] = useState()
  console.log({ lll: selectedData })

  useEffect(() => {
    let query = `?page=${Math.ceil(
      (first + 1) / rows
    )}&pageSize=${rows}&filters[0].Field=level&filters[0].Operator=contains`
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
    const fetchLogs = async () => {
      dispatch(setLoading(true))
      try {
        const logsList = await getLogsList(query)
        setList(logsList.data.data.items)
        // dispatch(setLogsData(logsList.data.data))
        setTotalCount(logsList.data.data.totalCount)
      } catch (error) {
        console.error('Error fetching logs:', error)
      } finally {
        dispatch(setLoading(false))
      }
    }

    fetchLogs()
  }, [first, rows, searchValue, sortField, sortValue, selectedData])

  const onPageChange = (event) => {
    setFirst(event.first)
    setRows(event.rows)
  }

  const descriptionPop = async (id) => {
    setCurrentId(id)
    setVisible(true)

    const logDetailResponse = await getLogById(id)
    if (logDetailResponse.data.data) {
      setLogDetails(logDetailResponse.data.data)
      setPopUpLabel(
        <>
          <div>
            Level: <span>{logDetailResponse.data.data.level}</span>
          </div>
          <div>
            <BsCalendar2Fill className="ml-0 mb-1 mr-1" />
            {UppercaseMonthDateFormat(
              logDetailResponse.data.data.stringDate,
              true,
              true,
              true
            )}
          </div>
        </>
      )
    }
  }
  const handleData = (data) => {
    if (!data) return {}

    const { level, template, message, exception, properties, createdDate } =
      data

    return {
      Level: level,
      Template: template,
      Message: message,
      Properties: properties,
      Exception: exception,
      createdDate: UppercaseMonthDateFormat(createdDate, true, true),
    }
  }
  return (
    <Wrapper>
      <BreadcrumbComponent
        breadcrumbInfo={'LogsList'}
        icon={BsFillPersonLinesFill}
      />
      <div className="main-container">
        <TableHead
          setSearchValue={setSearchValue}
          setFirst={setFirst}
          search={true}
          button={false}
          title={<SafeFormatMessage id="Logs-List" />}
          icon={'pi-box'}
        />
        <div className="mb-4">
          <LogsFilterSearchContainer setAllSelectedData={setAllSelectedData} />
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
              {/* Level Column */}
              <Column
                field="level"
                header={
                  <ColumnSortHeader
                    text={<SafeFormatMessage id="Level" />}
                    field="level"
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
                  <DataLabelWhite text={rowData.level} variant={'gray'} />
                )}
              />

              {/* Message Column */}
              <Column
                field="message"
                header={<SafeFormatMessage id="Message" />}
                body={(rowData) => <div>{rowData.message}</div>}
              />

              {/* Created Date Column */}
              <Column
                field="createdDate"
                header={
                  <ColumnSortHeader
                    text={<SafeFormatMessage id="Date" />}
                    field="createdDate"
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
                  <DataLabelWhite
                    text={UppercaseMonthDateFormat(
                      rowData.createdDate,
                      true,
                      true
                    )}
                    variant={'gray'}
                  />
                )}
              />

              {/* Actions Column */}
              <Column
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
            popupLabel={popUpLabel}
            data={handleData(logDetails)}
            setVisible={setVisible}
            className={{
              Message: 'description',
              Template: 'description',
              Exception: 'description',
              Properties: 'description',
            }}
          />
        </ThemeDialog>
      </div>
    </Wrapper>
  )
}
