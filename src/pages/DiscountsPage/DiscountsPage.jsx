import React, { useEffect, useMemo, useState } from 'react'
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
import {
  MdCheck,
  MdClose,
  MdOutlineCheck,
  MdOutlineClose,
  MdOutlineError,
} from 'react-icons/md'
import { DataTransform, formatDate } from '../../lib/sharedFun/Time'
import DateLabel from '../../components/custom/Shared/DateLabel/DateLabel'
import ThemeDialog from '../../components/custom/Shared/ThemeDialog/ThemeDialog'
import SafeFormatMessage from '../../components/custom/Shared/SafeFormatMessage/SafeFormatMessage'

export default function DiscountsPage() {
  const dispatch = useDispatch()
  const [visible, setVisible] = useState(false)
  const [totalCount, setTotalCount] = useState(0)
  const [visibleHead, setVisibleHead] = useState(false)
  const [first, setFirst] = useState(0) // For pagination
  const [rows, setRows] = useState(10) // Rows per page
  const { getDiscounts, activeDiscount, deleteDiscount } = useRequest()
  const [confirm, setConfirm] = useState(false)
  const [currentId, setCurrentId] = useState('')
  const navigate = useNavigate()

  const listData = useSelector((state) => state?.discountsSlice?.discounts)

  useEffect(() => {
    const fetchDiscounts = async () => {
      const response = await getDiscounts(
        `?page=${first / rows + 1}&pageSize=${rows}`
      )
      if (response?.data) {
        dispatch(setAllDiscounts(response.data.data))
        setTotalCount(response.data.data.totalCount)
      }
    }

    fetchDiscounts()
  }, [first, rows])

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

  // const onFilterChange = (value) => {
  //   setSearchValue(value)
  //   setFirst(0) // Reset to first page on filter change
  // }
  const discountTypeOptions = [
    'Assigned to Plans',
    'Assigned to Products',
    'Assigned to Products Owners',
    'Assigned to Order Total',
    'Assigned to Order SubTotal',
  ]
  const processedData = useMemo(() => {
    return Object.values(listData)?.map((discount) => ({
      ...discount,
    }))
  }, [listData])

  return (
    <Wrapper>
      <BreadcrumbComponent breadcrumbInfo={'DiscountsList'} />
      <div className="main-container">
        <TableHead
          label={<SafeFormatMessage id="Add-Discount" />}
          icon={'pi-box'}
          search={false}
          visibleHead={visibleHead}
          setVisibleHead={setVisibleHead}
          title={<SafeFormatMessage id="Discounts-List" />}
        >
          <DiscountForm
            popupLabel={<SafeFormatMessage id="Create-Discount" />}
            type={'create'}
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
              value={processedData && Object.values(processedData)}
              tableStyle={{ minWidth: '50rem' }}
              size={'small'}
              rows={rows}
              totalRecords={totalCount}
              first={first}
              onPage={onPageChange}
            >
              <Column field="displayName" header="Name" />
              <Column
                body={(data) => discountTypeOptions[data.discountType - 1]}
                header="Discount type"
              />
              <Column
                header="Discount"
                body={(rowData) =>
                  rowData.discountAmount > 0
                    ? `${rowData.discountAmount}$`
                    : `${rowData.discountPercentage}%`
                }
              />
              <Column
                body={(data) =>
                  data.startDate && (
                    <Label
                      {...{
                        value: DataTransform(data.startDate),
                        lighter: true,
                      }}
                    />
                  )
                }
                header="Start Date"
              />
              <Column
                body={(data) =>
                  data.endDate && (
                    <DateLabel
                      formatedDate={true}
                      endDate={DataTransform(data.endDate)}
                    />
                  )
                }
                header="End date"
              />
              <Column
                body={(data) => (data.timesUsed ? data.timesUsed : 0)}
                header="Times used"
              />

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
                            <MdCheck className="mx-2" />
                            <SafeFormatMessage id="Activate" />
                          </span>
                        ) : (
                          <span className=" ">
                            <MdClose className="mx-2" />
                            <SafeFormatMessage id="Deactivate" />
                          </span>
                        )}
                      </Dropdown.Item>
                      <Dropdown.Item onSelect={() => navigate(`./${data.id}`)}>
                        <FontAwesomeIcon icon={faEye} className="mx-2" />
                        <SafeFormatMessage id="View-Details" />
                      </Dropdown.Item>
                      <Dropdown.Item
                        onSelect={() => {
                          setCurrentId(data.id)
                          setVisible(true)
                        }}
                      >
                        <FontAwesomeIcon icon={faEdit} className="mx-2" />
                        <SafeFormatMessage id="Edit" />
                      </Dropdown.Item>
                      <Dropdown.Item
                        onClick={() => {
                          setCurrentId(data.id)
                          setConfirm(true)
                        }}
                        className="text-danger"
                      >
                        <FontAwesomeIcon icon={faTrashAlt} className="mx-2" />
                        <SafeFormatMessage id="Delete" />
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
            <DeleteConfirmation
              message={<SafeFormatMessage id="delete-confirmation-message" />}
              icon="pi pi-exclamation-triangle"
              confirm={confirm}
              setConfirm={setConfirm}
              confirmFunction={deleteDiscountFun}
              sideBar={false}
            />
            <ThemeDialog visible={visible} setVisible={setVisible}>
              <DiscountForm
                popupLabel={<SafeFormatMessage id="Edit-Discount" />}
                type={'edit'}
                visible={visible}
                setVisible={setVisible}
                discountData={listData[currentId]}
                currentId={currentId}
              />
            </ThemeDialog>
          </Card.Body>
        </Card>
      </div>
    </Wrapper>
  )
}
