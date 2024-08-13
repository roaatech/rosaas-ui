import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { Wrapper } from './DiscountsPage.styled'
import BreadcrumbComponent from '../../components/custom/Shared/Breadcrumb/Breadcrumb'
import {
  Button,
  ButtonGroup,
  Card,
  Dropdown,
} from '@themesberg/react-bootstrap'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faEdit,
  faEllipsisH,
  faEye,
  faTrashAlt,
} from '@fortawesome/free-solid-svg-icons'
import { FormattedMessage } from 'react-intl'
import CustomPaginator from '../../components/custom/Shared/CustomPaginator/CustomPaginator'
import TableHead from '../../components/custom/Shared/TableHead/TableHead'
import DiscountForm from '../../components/custom/Discounts/DiscountForm/DiscountForm'
import Label from '../../components/custom/Shared/label/Label'
import { activeStatus } from '../../const/product'
import useRequest from '../../axios/apis/useRequest'
import {
  discountChangeAttr,
  removeDiscount,
  setAllDiscounts,
} from '../../store/slices/discountsSlice'
import DeleteConfirmation from '../../components/custom/global/DeleteConfirmation/DeleteConfirmation'
import { MdOutlineCheck, MdOutlineError } from 'react-icons/md'

export default function DiscountsPage() {
  const dispatch = useDispatch()
  const [visible, setVisible] = useState(false)
  const [totalCount, setTotalCount] = useState(0)
  const [visibleHead, setVisibleHead] = useState(false)
  const [first, setFirst] = useState(0) // For pagination
  const [rows, setRows] = useState(10) // Rows per page
  const [searchValue, setSearchValue] = useState('') // For filtering
  const { getDiscounts, activeDiscount, deleteDiscount } = useRequest()
  const [confirm, setConfirm] = useState(false)
  const [currentId, setCurrentId] = useState('')
  const [update, setUpdate] = useState(1)
  const navigate = useNavigate()

  const listData = useSelector((state) => state?.discountsSlice?.discounts)

  useEffect(() => {
    const fetchDiscounts = async () => {
      const response = await getDiscounts(
        `?page=${first / rows + 1}&pageSize=${rows}&search=${searchValue}`
      )
      if (response?.data) {
        dispatch(setAllDiscounts(response.data.data))
        setTotalCount(response.data.data.totalCount)
      }
    }

    fetchDiscounts()
  }, [first, rows, searchValue, update])

  const deleteDiscountFun = async () => {
    const response = await deleteDiscount(currentId)
    if (response?.status === 200) {
      dispatch(removeDiscount(currentId))
      setConfirm(false)
    }
  }

  const activateDiscount = async (id, isActive) => {
    const response = await activeDiscount(id, { isActive })
    if (response?.status === 200) {
      dispatch(discountChangeAttr({ discountId: id, attributes: { isActive } }))
    }
  }

  const onPageChange = (event) => {
    setFirst(event.first)
    setRows(event.rows)
  }

  const onFilterChange = (value) => {
    setSearchValue(value)
    setFirst(0) // Reset to first page on filter change
  }
  const discountTypeOptions = [
    { value: 1, label: 'Assigned to Plans' },
    { value: 2, label: 'Assigned to Products' },
    { value: 3, label: 'Assigned to Products Owners' },
    { value: 4, label: 'Assigned to Order Total' },
    { value: 5, label: 'Assigned to Order SubTotal' },
  ]
  return (
    <Wrapper>
      <BreadcrumbComponent breadcrumbInfo={'DiscountsList'} />
      <div className="main-container">
        <TableHead
          label={<FormattedMessage id="Add-Discount" />}
          icon={'pi-box'}
          searchValue={searchValue}
          setSearchValue={onFilterChange}
          visibleHead={visibleHead}
          setVisibleHead={setVisibleHead}
          title={<FormattedMessage id="Discounts-List" />}
        >
          <DiscountForm
            popupLabel={<FormattedMessage id="Create-Discount" />}
            type={'create'}
            update={update}
            setUpdate={setUpdate}
            visible={visibleHead}
            setVisible={setVisibleHead}
          />
        </TableHead>
        <Card
          border="light"
          className="table-wrapper table-responsive shadow-sm"
        >
          <Card.Body className="pt-0">
            <DataTable
              value={listData && Object.values(listData)}
              tableStyle={{ minWidth: '50rem' }}
              size={'small'}
              rows={rows}
              totalRecords={totalCount}
              first={first}
              onPage={onPageChange}
            >
              <Column field="displayName" header="Name" />
              <Column
                header="Discount type"
                body={(rowData) => {
                  const discountType = discountTypeOptions.find(
                    (option) => option.value === rowData.discountType
                  )
                  return discountType
                    ? discountType.label
                    : rowData.discountType
                }}
              />{' '}
              <Column
                header="Discount"
                body={(rowData) =>
                  rowData.discountAmount > 0
                    ? `${rowData.discountAmount}$`
                    : `${rowData.discountPercentage}%`
                }
              />
              <Column
                header="Start Date"
                body={(rowData) => rowData.startDate.replace('T', ' ')}
              />{' '}
              <Column
                header="End date"
                body={(rowData) => rowData.endDate.replace('T', ' ')}
              />{' '}
              <Column field="timesUsed" header="Times used" />
              <Column
                field="isActive"
                header="Is active"
                body={(data) => <Label {...activeStatus[data.isActive]} />}
              />
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
                      <Dropdown.Item
                        onClick={() =>
                          activateDiscount(data.id, !data.isActive)
                        }
                      >
                        {!data.isActive ? (
                          <span className=" ">
                            <MdOutlineCheck className="mx-2" />
                            <FormattedMessage id="Activate" />
                          </span>
                        ) : (
                          <span className=" ">
                            <MdOutlineError className="mx-2" />
                            <FormattedMessage id="Deactivate" />
                          </span>
                        )}
                      </Dropdown.Item>
                      <Dropdown.Item onSelect={() => navigate(`./${data.id}`)}>
                        <FontAwesomeIcon icon={faEye} className="mx-2" />
                        <FormattedMessage id="View-Details" />
                      </Dropdown.Item>
                      <Dropdown.Item onSelect={() => setVisible(true)}>
                        <FontAwesomeIcon icon={faEdit} className="mx-2" />
                        <FormattedMessage id="Edit" />
                      </Dropdown.Item>
                      <Dropdown.Item
                        onClick={() => {
                          setCurrentId(data.id)
                          setConfirm(true)
                        }}
                        className="text-danger"
                      >
                        <FontAwesomeIcon icon={faTrashAlt} className="mx-2" />
                        <FormattedMessage id="Delete" />
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                )}
                style={{ width: '60px', textAlign: 'center' }}
                header={<FormattedMessage id="Actions" />}
              />
            </DataTable>
            <CustomPaginator
              first={first}
              rows={rows}
              totalCount={totalCount}
              onPageChange={onPageChange}
            />
            <DeleteConfirmation
              message={<FormattedMessage id="delete-confirmation-message" />}
              icon="pi pi-exclamation-triangle"
              confirm={confirm}
              setConfirm={setConfirm}
              confirmFunction={deleteDiscountFun}
              sideBar={false}
            />
          </Card.Body>
        </Card>
      </div>
    </Wrapper>
  )
}
