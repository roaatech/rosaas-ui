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
import {
  deleteFeaturePlan,
  setAllFeaturePlan,
} from '../../../../store/slices/products'
import FeaturePlanForm from './FeaturePlanForm/FeaturePlanForm'
// import { faUserTie } from "@fortawesome/free-solid-svg-icons";

export default function ProductFeaturePlan({ children }) {
  const dispatch = useDispatch()
  const { getFeaturePlanList, deleteProductReq, deleteFeaturePlanReq } =
    useRequest()
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
  const [type, setType] = useState('')
  const [popUpLable, setPopUpLable] = useState('')

  const productId = routeParams.id
  const deleteConfirm = (id) => {
    setCurrentId(id)
    setConfirm(true)
  }
  const deleteProduct = async () => {
    await deleteProductReq({ id: currentId })
  }

  const handleDeleteFeaturePlan = async (id) => {
    try {
      await deleteFeaturePlanReq({ productId, PlanFeatureId: id })
      dispatch(deleteFeaturePlan({ productId, PlanFeatureId: id }))
    } catch (error) {
      console.error('Error deleting feature:', error)
    }
  }

  const listData = useSelector(
    (state) => state.products.products[productId]?.featurePlan
  )
  let list = listData && Object.values(listData)

  const editForm = async (id) => {
    //  if (!listData[id].creationEndpoint) {
    //  const featureData = await getFeature(id, productId)
    //  dispatch(FeatureInfo(featureData.data.data))
    setPopUpLable('Edit-Feature')
    setType('edit')
    // }
    setCurrentId(id)
    setVisible(true)
  }

  useEffect(() => {
    ;(async () => {
      const FeaturePlanData = await getFeaturePlanList(productId)
      console.log(FeaturePlanData, 'ooooooooooo')
      dispatch(
        setAllFeaturePlan({
          productId: productId,
          data: FeaturePlanData.data.data,
        })
      )
    })()
  }, [])

  /****************************** */

  const TableRow = (props) => {
    const { limit, description, feature, plan, createdDate, editedDate, id } =
      props

    return (
      <tr>
        <td>
          <span className="fw-normal">{description}</span>
        </td>
        <td>
          <span className="fw-normal">{limit}</span>
        </td>
        <td>
          <span className="fw-normal">{feature.name}</span>
        </td>
        <td>
          <span className="fw-normal">{plan.name}</span>
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
              {/* <Dropdown.Item onSelect={() => navigate(`/products/${productId}/features/${id}`)}>
                <FontAwesomeIcon icon={faEye} className="me-2" />
                <FormattedMessage id="View-Details" />
              </Dropdown.Item> */}
              <Dropdown.Item onSelect={() => editForm(id)}>
                <FontAwesomeIcon icon={faEdit} className="me-2" />
                <FormattedMessage id="Edit" />
              </Dropdown.Item>
              <Dropdown.Item
                onClick={() => handleDeleteFeaturePlan(id)}
                className="text-danger"
              >
                <FontAwesomeIcon icon={faTrashAlt} className="me-2" />
                <FormattedMessage id="Delete" />
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </td>
      </tr>
    )
  }

  return (
    <>
      <div>
        <Card
          border="light"
          className="table-wrapper table-responsive shadow-sm"
        >
          <Card.Body className="pt-0">
            <Table hover className="user-table align-items-center">
              <thead>
                <tr>
                  <th className="border-bottom">
                    <FormattedMessage id="Description" />
                  </th>
                  <th className="border-bottom">
                    <FormattedMessage id="Limit" />
                  </th>
                  <th className="border-bottom">
                    <FormattedMessage id="Feature" />
                  </th>
                  <th className="border-bottom">
                    <FormattedMessage id="Plan" />
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
                {list
                  ? list?.map((t, index) => {
                      console.log({ t })
                      return <TableRow key={`index`} {...t} />
                    })
                  : null}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      </div>

      <ThemeDialog visible={visible} setVisible={setVisible}>
        {/* {listData && currentId && (
        
             */}
        {/* {listData &&
          currentId &&
          console.log(
            listData,
            '88888888888888888'
            // currentId,
            // '888888888888'
            // listData?[currentId]
          )}
         */}

        <FeaturePlanForm
          popupLabel={<FormattedMessage id={popUpLable} />}
          type={type}
          // FeaturePlanData={listData[currentId]}
          // update={update}
          // setUpdate={setUpdate}
          setVisible={setVisible}
        />
      </ThemeDialog>
      <button
        onClick={() => {
          setVisible(true)
          setPopUpLable('Add-Feature')
          setType('create')
        }}
      >
        add feature plan
      </button>
    </>
  )
}
