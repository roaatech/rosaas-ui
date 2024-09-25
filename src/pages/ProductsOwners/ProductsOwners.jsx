import React, { useState, useEffect } from 'react'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { BsFillPersonLinesFill, BsBoxSeam } from 'react-icons/bs'
import BreadcrumbComponent from '../../components/custom/Shared/Breadcrumb/Breadcrumb'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faEdit,
  faEllipsisH,
  faEye,
  faTrashAlt,
} from '@fortawesome/free-solid-svg-icons'
import {
  Col,
  Row,
  Form,
  Card,
  Button,
  ButtonGroup,
  Breadcrumb,
  InputGroup,
  Dropdown,
} from '@themesberg/react-bootstrap'
import ColumnSortHeader from '../../components/custom/Shared/ColumnSortHeader/ColumnSortHeader'
import TableHead from '../../components/custom/Shared/TableHead/TableHead'
import TableDate from '../../components/custom/Shared/TableDate/TableDate'
import ProductForm from '../../components/custom/Product/ProductForm/ProductForm'
import useRequest from '../../axios/apis/useRequest'
import { Dialog } from 'primereact/dialog'
import ProductStatus from '../../components/custom/Product/ProductStatus/ProductStatus'
import DeleteConfirmation from '../../components/custom/global/DeleteConfirmation/DeleteConfirmation.jsx'
import { useNavigate } from 'react-router-dom'
import { Wrapper } from './ProductsOwners.styled'
import CustomPaginator from '../../components/custom/Shared/CustomPaginator/CustomPaginator'
import ThemeDialog from '../../components/custom/Shared/ThemeDialog/ThemeDialog'
import {
  productOwnerInfo,
  removeProductOwnerStore,
  setAllProductOwners,
} from '../../store/slices/productsOwners.js'
import { useDispatch, useSelector } from 'react-redux'
import { FormattedMessage } from 'react-intl'
import { Routes } from '../../routes.js'
import ProductOwnerForm from '../../components/custom/ProductOwner/ProductOwnerForm.jsx'
import SafeFormatMessage from '../../components/custom/Shared/SafeFormatMessage/SafeFormatMessage.jsx'
import Label from '../../components/custom/Shared/label/Label.jsx'
import { ProductOwnerStatus } from '../../const/productOwnerConsts.js'
import { subscriptionMode, subscriptionStatus } from '../../const/product.js'

export default function ProductsOwners({ children }) {
  const dispatch = useDispatch()
  const { getProductOwner, getProductOwnersList, deleteProductOwnerReq } =
    useRequest()
  const [visible, setVisible] = useState(false)
  const [totalCount, setTotalCount] = useState(0)
  const [visibleHead, setVisibleHead] = useState(false)
  const [rebase, setRebase] = useState(0)
  const [searchValue, setSearchValue] = useState('')
  const [sortField, setSortField] = useState('')
  const [sortValue, setSortValue] = useState('')
  const [first, setFirst] = useState(0)
  const [rows, setRows] = useState(10)
  const [confirm, setConfirm] = useState(false)
  const [currentId, setCurrentId] = useState('')
  const [update, setUpdate] = useState(1)
  const navigate = useNavigate()

  const deleteConfirm = (id) => {
    setCurrentId(id)
    setConfirm(true)
  }

  const deleteProductOwner = async () => {
    await deleteProductOwnerReq({ id: currentId })
    dispatch(removeProductOwnerStore(currentId))
  }

  const listData = useSelector((state) => state.productsOwners.productsOwners)
  let [list, setList] = useState(Object.values(listData))

  useEffect(() => {
    let query = `?page=${Math.ceil(
      (first + 1) / rows
    )}&pageSize=${rows}&filters[0].Field=name&filters[0].Operator=contains`
    if (searchValue) query += `&filters[0].Value=${searchValue}`
    if (sortField) query += `&sort.Field=${sortField}`
    if (sortValue) query += `&sort.Direction=${sortValue}`
    ;(async () => {
      const productList = await getProductOwnersList(query)
      dispatch(setAllProductOwners(productList.data.data.items))
      setTotalCount(productList.data.data.totalCount)
      setList(productList.data.data.items)
    })()
  }, [first, rows, searchValue, sortField, sortValue, update])

  const onPageChange = (event) => {
    setFirst(event.first)
    setRows(event.rows)
  }

  const editForm = async (id) => {
    setCurrentId(id)
    setVisible(true)
  }
  return (
    <Wrapper>
      <BreadcrumbComponent
        breadcrumbInfo={'ProductsOwnersList'}
        icon={BsFillPersonLinesFill}
      />
      <div className="main-container">
        <TableHead
          label={<SafeFormatMessage id="Add-Product-Owner" />}
          icon={'pi-box'}
          setSearchValue={setSearchValue}
          visibleHead={visibleHead}
          setVisibleHead={setVisibleHead}
          setFirst={setFirst}
          title={<SafeFormatMessage id="Product-Owner-List" />}
        >
          <ProductOwnerForm
            popupLabel={<SafeFormatMessage id="Create-Product-Owner" />}
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
              value={list && Object.values(list)}
              tableStyle={{ minWidth: '50rem' }}
              size={'small'}
            >
              <Column
                field="displayName"
                header={
                  <ColumnSortHeader
                    text={<SafeFormatMessage id="Display-Name" />}
                    field="displayName"
                    rebase={rebase}
                    setRebase={setRebase}
                    sortField={sortField}
                    sortValue={sortValue}
                    setSortField={setSortField}
                    setSortValue={setSortValue}
                    setFirst={setFirst}
                  />
                }
              ></Column>
              <Column
                field="systemName"
                header={
                  <ColumnSortHeader
                    text={<SafeFormatMessage id="System-Name" />}
                    field="systemName"
                    rebase={rebase}
                    setRebase={setRebase}
                    sortField={sortField}
                    sortValue={sortValue}
                    setSortField={setSortField}
                    setSortValue={setSortValue}
                    setFirst={setFirst}
                  />
                }
              ></Column>
              <Column
                field="status"
                header={
                  <ColumnSortHeader
                    text={<SafeFormatMessage id="Status" />}
                    field="status"
                    setRebase={setRebase}
                    sortField={sortField}
                    sortValue={sortValue}
                    setSortField={setSortField}
                    setSortValue={setSortValue}
                    setFirst={setFirst}
                  />
                }
                body={(rowData) => (
                  <Label {...ProductOwnerStatus[rowData?.status]} />
                )}
              />
              <Column
                field="subscription.subscriptionStatus"
                header={
                  <ColumnSortHeader
                    text="Subscription Status"
                    field="subscription.subscriptionStatus"
                    setRebase={setRebase}
                    sortField={sortField}
                    sortValue={sortValue}
                    setSortField={setSortField}
                    setSortValue={setSortValue}
                    setFirst={setFirst}
                  />
                }
                body={(rowData) =>
                  rowData?.subscription?.subscriptionStatus ? (
                    <Label
                      {...subscriptionStatus[
                        rowData?.subscription?.subscriptionStatus
                      ]}
                    />
                  ) : (
                    '__'
                  )
                }
              />
              <Column
                field="subscription.subscriptionMode"
                header={
                  <ColumnSortHeader
                    text="Subscription Mode"
                    field="subscription.subscriptionMode"
                    setRebase={setRebase}
                    sortField={sortField}
                    sortValue={sortValue}
                    setSortField={setSortField}
                    setSortValue={setSortValue}
                    setFirst={setFirst}
                  />
                }
                body={(rowData) =>
                  rowData?.subscription?.subscriptionMode ? (
                    <Label
                      {...subscriptionMode[
                        rowData?.subscription?.subscriptionMode
                      ]}
                    />
                  ) : (
                    '__'
                  )
                }
              />

              <Column
                body={(data, options) => (
                  <TableDate
                    createdDate={data.createdDate}
                    editedDate={data.editedDate}
                  />
                )}
                style={{ width: '250px', maxidth: '250px' }}
                header={
                  <ColumnSortHeader
                    text={<SafeFormatMessage id="Date" />}
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
                          navigate(`${Routes.productsOwners.path}/${data.id}`)
                        }
                      >
                        <FontAwesomeIcon icon={faEye} className="mx-2" />
                        <SafeFormatMessage id="View-Details" />
                      </Dropdown.Item>
                      <Dropdown.Item onSelect={() => editForm(data.id)}>
                        <FontAwesomeIcon icon={faEdit} className="mx-2" />
                        <SafeFormatMessage id="Edit" />
                      </Dropdown.Item>
                      {/* <Dropdown.Item
                        onClick={() => deleteConfirm(data.id)}
                        className="text-danger"
                      >
                        <FontAwesomeIcon icon={faTrashAlt} className="mx-2" />
                        <SafeFormatMessage id="Delete" />
                      </Dropdown.Item> */}
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

            <ThemeDialog visible={visible} setVisible={setVisible}>
              <ProductOwnerForm
                popupLabel={<SafeFormatMessage id="Edit-Product-Owner" />}
                type={'edit'}
                productOwnerData={listData && listData[currentId]}
                update={update}
                setUpdate={setUpdate}
                setVisible={setVisible}
              />
            </ThemeDialog>

            <DeleteConfirmation
              message={
                <SafeFormatMessage id="delete-product-owner-confirmation-message" />
              }
              icon="pi pi-exclamation-triangle"
              confirm={confirm}
              setConfirm={setConfirm}
              confirmFunction={deleteProductOwner}
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
