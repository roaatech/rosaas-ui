import React, { useState, useEffect } from 'react'
import useRequest from '../../../../axios/apis/useRequest'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import {
  Card,
  Table,
  Button,
  ButtonGroup,
  Dropdown,
} from '@themesberg/react-bootstrap'
import TableDate from '../../Shared/TableDate/TableDate'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import {
  productInfo,
  features,
  FeatureInfo,
} from '../../../../store/slices/products'
import { featureInfo, setAllFeature } from '../../../../store/slices/features'
import { FormattedMessage } from 'react-intl'
import {
  faEdit,
  faEllipsisH,
  faEye,
  faTrashAlt,
} from '@fortawesome/free-solid-svg-icons'

import DeleteConfirmation from '../../global/DeleteConfirmation/DeleteConfirmation'
import FeatureForm from '../../Feature/FeatureForm/FeatureForm'
import { Dialog } from 'primereact/dialog'
import ThemeDialog from '../../Shared/ThemeDialog/ThemeDialog'

export const ProductFeaturesList = ({ productId, productName }) => {
  const navigate = useNavigate()
  const { getProductFeatures, getFeature, getFeatureList, deleteFeatureReq } =
    useRequest()
  const [searchValue] = useState('')
  const [sortField] = useState('')
  const [sortValue] = useState('')
  const [first] = useState(0)
  const [rows] = useState(10)
  const [update, setUpdate] = useState(1)
  const [selectedProduct] = useState()
  const dispatch = useDispatch()
  const list = useSelector((state) => state.products.products[productId])
  const [currentId, setCurrentId] = useState('')
  const [confirm, setConfirm] = useState(false)
  const [visible, setVisible] = useState(false)

  const deleteConfirm = (id) => {
    setCurrentId(id)
    setConfirm(true)
  }
  const editForm = async (id) => {
    //! if (!listData[id].creationEndpoint) {
    const featureData = await getFeature(id)
    dispatch(FeatureInfo(featureData.data.data))
    // }
    setCurrentId(id)
    setVisible(true)
  }

  useEffect(() => {
    let params = `${productId}/Features`

    ;(async () => {
      if (!list?.features) {
        const listData = await getProductFeatures(params)
        dispatch(setAllFeature(listData.data.data))
        dispatch(features({ id: productId, data: listData.data.data }))
      }
    })()
  }, [first, rows, searchValue, sortField, sortValue, update, selectedProduct])

  const TableRow = (props) => {
    const { name, description, type, unit, reset, id } = props

    return (
      <tr>
        <td>
          <span className="fw-normal">{name}</span>
        </td>
        <td >
          <span className="fw-normal">{description}</span>
          
        </td>

        <td>
          <span className={`fw-normal`}>
            <TableDate createdDate={type} editedDate={type} />
          </span>
        </td>
        <td>
          <span className="fw-normal">{unit}</span>
        </td>
        <td>
          <span className="fw-normal">{reset}</span>
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
              <Dropdown.Item onSelect={() => navigate(`/features/${id}`)}>
                <FontAwesomeIcon icon={faEye} className="me-2" />
                <FormattedMessage id="View-Details" />
              </Dropdown.Item>
              <Dropdown.Item onSelect={() => editForm(id)}>
                <FontAwesomeIcon icon={faEdit} className="me-2" />
                <FormattedMessage id="Edit" />
              </Dropdown.Item>
              <Dropdown.Item
                onClick={() => deleteConfirm(id)}
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
      <Card border="light" className="table-wrapper table-responsive shadow-sm">
        <Card.Body className="pt-0">
          <Table hover className="user-table align-items-center">
            <thead>
              <tr>
                <th className="border-bottom">
                  <FormattedMessage id="Name" />
                </th>
                <th className="border-bottom">
                  <FormattedMessage id="Description" />

                </th>
                
                <th className="border-bottom">
                  <FormattedMessage id="Type" />
                </th>
                <th className="border-bottom">
                  <FormattedMessage id="Unit" />
                </th>
                <th className="border-bottom">
                  <FormattedMessage id="Reset" />
                </th>
                <th className="border-bottom">
                  <FormattedMessage id="Actions" />
                </th>
              </tr>
            </thead>
            <tbody>
              {list?.features?.length
                ? list?.features?.map((t, index) => (
                    <TableRow key={`index`} {...t} />
                  ))
                : null}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
      {/* <Dialog
        headerClassName="pb-0"
        className="tenantForm"
        header={'Edit Tenant'}
        visible={visible}
        style={{ width: '30vw', minWidth: '300px' }}
        onHide={() => setVisible(false)}
      > */}
      {/* <FeatureForm
          type={'create'}
          tenantData={list}
          update={update}
          setUpdate={setUpdate}
          setVisible={setVisible}
          sideBar={false}
        /> */}

      <ThemeDialog visible={visible} setVisible={setVisible}>
        <FeatureForm
          popupLabel={<FormattedMessage id="Edit-Product" />}
          type={'create'}
          tenantData={list}
          update={update}
          setUpdate={setUpdate}
          setVisible={setVisible}
          sideBar={false}
        />
      </ThemeDialog>

      <button onClick={() => setVisible(true)}>Add Feature</button>
    </>
  )
}

export default ProductFeaturesList
