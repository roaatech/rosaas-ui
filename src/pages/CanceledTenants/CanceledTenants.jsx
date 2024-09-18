import React, { useState, useEffect } from 'react'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import BreadcrumbComponent from '../../components/custom/Shared/Breadcrumb/Breadcrumb'
import { BsFillPersonLinesFill } from 'react-icons/bs'
import ColumnSortHeader from '../../components/custom/Shared/ColumnSortHeader/ColumnSortHeader'
import useRequest from '../../axios/apis/useRequest'
import {
  Button,
  Card,
  Dropdown,
  ButtonGroup,
} from '@themesberg/react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faEllipsisH } from '@fortawesome/free-solid-svg-icons'
import { useNavigate } from 'react-router-dom'
import CustomPaginator from '../../components/custom/Shared/CustomPaginator/CustomPaginator'
import { Wrapper } from './CanceledTenant.styled'
import { useSelector } from 'react-redux'
import TableHead from '../../components/custom/Shared/TableHead/TableHead'
import TableDate from '../../components/custom/Shared/TableDate/TableDate'
import { Routes } from '../../routes'

export default function CanceledTenant() {
  const { getTenantList } = useRequest()
  const [totalCount, setTotalCount] = useState(0)
  const [list, setList] = useState([])
  const [first, setFirst] = useState(0)
  const [rows, setRows] = useState(10)
  const [searchValue, setSearchValue] = useState('')
  const [sortField, setSortField] = useState('')
  const [sortValue, setSortValue] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    let query = `?page=${Math.ceil(
      (first + 1) / rows
    )}&pageSize=${rows}&filters[0].Field=SearchTerm`
    if (searchValue) query += `&filters[0].Value=${searchValue}`
    if (sortField) query += `&sort.Field=${sortField}`
    if (sortValue) query += `&sort.Direction=${sortValue}`
    ;(async () => {
      const listData = await getTenantList(query)
      setTotalCount(listData.data.data.totalCount)
      setList(listData.data.data.items)
    })()
  }, [first, rows, searchValue, sortField, sortValue])

  const [visibleHead, setVisibleHead] = useState(false)

  const onPageChange = (event) => {
    setFirst(event.first)
    setRows(event.rows)
  }

  const viewDetails = (id) => {
    navigate(`${Routes.Tenant.path}/${id}`) // Update the route as needed
  }

  return (
    <Wrapper>
      {' '}
      <BreadcrumbComponent
        breadcrumbInfo={'CanceledTenantList'}
        icon={BsFillPersonLinesFill}
      />
      <div className="main-container canceled-tenant">
        <TableHead
          setSearchValue={setSearchValue}
          visibleHead={visibleHead}
          setVisibleHead={setVisibleHead}
          setFirst={setFirst}
          title={'Canceled Tenants'}
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
                className="text-dark "
                field="displayName"
                header={
                  <ColumnSortHeader
                    text="Display Name"
                    field="displayName"
                    sortField={sortField}
                    sortValue={sortValue}
                    setSortField={setSortField}
                    setSortValue={setSortValue}
                    setFirst={setFirst}
                  />
                }
              />
              <Column
                className="text-dark "
                field="systemName"
                header={
                  <ColumnSortHeader
                    text="System Name"
                    field="systemName"
                    sortField={sortField}
                    sortValue={sortValue}
                    setSortField={setSortField}
                    setSortValue={setSortValue}
                    setFirst={setFirst}
                  />
                }
              />
              <Column
                className="text-dark "
                body={(data) => (
                  <TableDate
                    createdDate={data.createdDate}
                    editedDate={data.editedDate}
                  />
                )}
                header="Date"
              />
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
                      <Dropdown.Item onClick={() => viewDetails(data.id)}>
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
