import React, { useState, useEffect } from 'react'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'

import ColumnSortHeader from '../../Shared/ColumnSortHeader/ColumnSortHeader.jsx'
import TableDate from '../../Shared/TableDate/TableDate.jsx'
import TenantForm from '../../tenant/TenantForm/TenantForm.jsx'
import useRequest from '../../../../axios/apis/useRequest.js'
import { Dialog } from 'primereact/dialog'
import TenantStatus from '../../tenant/TenantStatus/TenantStatus.jsx'
import DeleteConfirmation from '../../global/DeleteConfirmation/DeleteConfirmation.jsx'
import { useNavigate } from 'react-router-dom'
import { Wrapper } from './TenantList.styled.jsx'
import CustomPaginator from '../../Shared/CustomPaginator/CustomPaginator.jsx'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faEdit,
  faEllipsisH,
  faEye,
  faTrash,
} from '@fortawesome/free-solid-svg-icons'
import {
  Card,
  Button,
  ButtonGroup,
  Dropdown,
  Row,
  Col,
} from '@themesberg/react-bootstrap'
import { FormattedMessage } from 'react-intl'
import UpperContent from '../../Shared/UpperContent/UpperContent.jsx'
import Label from '../../Shared/label/Label.jsx'
import { BsBox2Fill } from 'react-icons/bs'
export default function TenantList({ children }) {
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
  const [rows, setRows] = useState(12)
  const [confirm, setConfirm] = useState(false)
  const [currentId, setCurrentId] = useState('')
  const [update, setUpdate] = useState(1)
  const [selectedProduct, setSelectedProduct] = useState()
  const navigate = useNavigate()
  const deleteConfirm = (id) => {
    setCurrentId(id)
    setConfirm(true)
  }
  const deleteTenant = async () => {
    await deleteTenantReq({ id: currentId })
  }

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
  }, [first, rows, searchValue, sortField, sortValue, update, selectedProduct])

  /******************************* */

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
      <UpperContent>
        <h4 className="m-0">Tenants </h4>
      </UpperContent>
      <Card className="m-3 p-3 mt-0">
        <div className="p-d-flex p-flex-column p-ai-center">
          <Row>
            {list.map((tenant) => (
              <Col key={tenant.id} md={3}>
                <Card className="mb-3">
                  <Card.Body>
                    <Card.Title>{tenant.displayName}</Card.Title>
                    <Card.Text>
                      {' '}
                      <Label
                        className="mr-2"
                        background="var(--green2)"
                        value={tenant.subscriptions[0].productName}
                        color="var(--teal-green)"
                        icon={<BsBox2Fill />}
                      />
                      {/* {tenant.systemName} */}
                    </Card.Text>
                    <Card.Text>
                      <TableDate
                        className="px-2"
                        createdDate={tenant.createdDate}
                        editedDate={tenant.editedDate}
                      />
                    </Card.Text>

                    <div className="d-flex justify-content-end">
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
                            onSelect={() => navigate(`/tenants/${tenant.id}`)}
                          >
                            <FontAwesomeIcon icon={faEye} className="mx-2" />{' '}
                            View Details
                          </Dropdown.Item>
                          <Dropdown.Item onSelect={() => editForm(tenant.id)}>
                            <FontAwesomeIcon icon={faEdit} className="mx-2" />{' '}
                            Edit
                          </Dropdown.Item>
                          <Dropdown.Item
                            className="text-danger"
                            onSelect={() => deleteConfirm(tenant.id)}
                          >
                            <FontAwesomeIcon icon={faTrash} className="mx-2" />{' '}
                            Delete
                          </Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
          <CustomPaginator
            first={first}
            rows={rows}
            totalCount={totalCount}
            onPageChange={onPageChange}
          />
          <Dialog
            headerClassName="pb-0"
            className="tenantForm"
            header={'Edit Tenant'}
            visible={visible}
            style={{ width: '30vw', minWidth: '300px' }}
            onHide={() => setVisible(false)}
          >
            <TenantForm
              type={'edit'}
              tenantData={tenantData?.data}
              update={update}
              setUpdate={setUpdate}
              setVisible={setVisible}
              sideBar={false}
            />
          </Dialog>
          <DeleteConfirmation
            message="Do you want to delete this Tenant?"
            icon="pi pi-exclamation-triangle"
            confirm={confirm}
            setConfirm={setConfirm}
            confirmFunction={deleteTenant}
            update={update}
            setUpdate={setUpdate}
            sideBar={false}
          />{' '}
        </div>
      </Card>
    </Wrapper>
  )
}
