import React, { useState, useEffect } from 'react'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { BsBoxSeam } from 'react-icons/bs'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faEdit,
  faEllipsisH,
  faEye,
  faTrashAlt,
} from '@fortawesome/free-solid-svg-icons'
import {
  Card,
  Button,
  ButtonGroup,
  Dropdown,
  Table,
} from '@themesberg/react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import useRequest from '../../../../axios/apis/useRequest'
import { Link, useNavigate, useParams } from 'react-router-dom'
import BreadcrumbComponent from '../../Shared/Breadcrumb/Breadcrumb'
import TableHead from '../../Shared/TableHead/TableHead'
import { FormattedMessage } from 'react-intl'
import ProductForm from '../ProductForm/ProductForm'
import TableDate from '../../Shared/TableDate/TableDate'
import ThemeDialog from '../../Shared/ThemeDialog/ThemeDialog'
import DeleteConfirmation from '../../global/DeleteConfirmation/DeleteConfirmation'
import ColumnSortHeader from '../../Shared/ColumnSortHeader/ColumnSortHeader'
import CustomPaginator from '../../Shared/CustomPaginator/CustomPaginator'
import { setAllFeaturePlan } from '../../../../store/slices/products'
// import { faUserTie } from "@fortawesome/free-solid-svg-icons";

export default function ProductFeaturePlan({ children }) {
  const dispatch = useDispatch()
  const { getFeaturePlanList, deleteProductReq } = useRequest()
  const [visible, setVisible] = useState(false)
  const [totalCount, setTotalCount] = useState(0)
  const [visibleHead, setVisibleHead] = useState(false)
  // const [list, setList] = useState([]);
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
  const routeParams = useParams()

  const deleteConfirm = (id) => {
    setCurrentId(id)
    setConfirm(true)
  }
  const deleteProduct = async () => {
    await deleteProductReq({ id: currentId })
  }

  const listData = useSelector(
    (state) => state.products.products[routeParams.id]?.featurePlan
  )
  let list = listData && Object.values(listData)

  useEffect(() => {
    ;(async () => {
      const FeaturePlanData = await getFeaturePlanList(routeParams.id)
      dispatch(
        setAllFeaturePlan({
          productId: routeParams.id,
          data: FeaturePlanData.data.data,
        })
      )
    })()
  }, [])

  /****************************** */
  const editForm = async (id) => {
    // if (!listData[id].creationEndpoint) {
    //   const productData = await getProduct(id)
    //   dispatch(productInfo(productData.data.data))
    // }
    // setCurrentId(id)
    // setVisible(true)
  }

  const TableRow = (props) => {
    const { title, uniqueName, createdDate, editedDate, id } = props

    return (
      <tr>
        <td>
          <span className="fw-normal">{title}</span>
        </td>
        <td>
          <span className="fw-normal">{uniqueName}</span>
        </td>
        <td>
          <span className={`fw-normal`}>
            <TableDate createdDate={createdDate} editedDate={editedDate} />
          </span>
        </td>
        <td>
          <Dropdown as={ButtonGroup}>
            <Dropdown.Toggle
              as={Button}
              split
              variant="link"
              className="text-dark m-0 p-0"
            >
              <span className="icon icon-sm">
                <FontAwesomeIcon icon={faEllipsisH} className="icon-dark" />
              </span>
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item>
                <Link
                  to={`/tenants/${id}#${'productName'}`}
                  className="w-100 d-block"
                >
                  <FontAwesomeIcon icon={'faGear'} className="me-2" />{' '}
                  <FormattedMessage id="Manage" />
                </Link>
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </td>
      </tr>
    )
  }

  return (
    <>
      <div className="main-container">
        <Card
          border="light"
          className="table-wrapper table-responsive shadow-sm"
        >
          <Card.Body className="pt-0">
            <Table hover className="user-table align-items-center">
              <thead>
                <tr>
                  <th className="border-bottom">
                    <FormattedMessage id="Title" />
                  </th>
                  <th className="border-bottom">
                    <FormattedMessage id="Unique-Name" />
                  </th>
                  <th className="border-bottom">
                    <FormattedMessage id="Status" />
                  </th>
                  <th className="border-bottom">
                    <FormattedMessage id="Created-Date" />
                  </th>
                  <th className="border-bottom">
                    <FormattedMessage id="Actions" />
                  </th>
                </tr>
              </thead>
              <tbody>
                {list?.subscribe?.length
                  ? list?.subscribe?.map((t, index) => (
                      <TableRow key={`index`} {...t} />
                    ))
                  : null}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      </div>
    </>
  )
}
