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
import { useDispatch, useSelector } from 'react-redux'
import { features, storeFeatureDelete } from '../../../../store/slices/products'
import { FormattedMessage } from 'react-intl'
import {
  faEdit,
  faEllipsisH,
  faTrashAlt,
} from '@fortawesome/free-solid-svg-icons'

import DeleteConfirmation from '../../global/DeleteConfirmation/DeleteConfirmation'
import FeatureForm from '../../Feature/FeatureForm/FeatureForm'
import ThemeDialog from '../../Shared/ThemeDialog/ThemeDialog'
import DescriptionCell from '../../Shared/DescriptionCell/DescriptionCell'
import {
  featureResetMap,
  featureTypeMap,
  featureUnitMap,
} from '../../../../const'

export const ProductFeaturesList = ({ productId, productName }) => {
  const { getProductFeatures, deleteFeatureReq } = useRequest()
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
  const [type, setType] = useState('')
  const [popUpLable, setPopUpLable] = useState('')

  // const deleteConfirm = (id) => {
  //   setCurrentId(id)
  //   setConfirm(true)
  // }
  const editForm = async (id) => {
    setPopUpLable('Edit-Feature')
    setType('edit')
    setCurrentId(id)
    setVisible(true)
  }

  useEffect(() => {
    let params = `${productId}/Features`

    ;(async () => {
      // if (!list?.features) {
      const listData = await getProductFeatures(params)
      dispatch(features({ id: productId, data: listData.data.data }))
      // }
    })()
  }, [first, rows, searchValue, sortField, sortValue, update, selectedProduct])

  const TableRow = (props) => {
    const {
      name,
      description,
      type,
      unit,
      reset,
      id,
      createdDate,
      editedDate,
    } = props

    const mappedType = featureTypeMap[type]
    const mappedUnit = featureUnitMap[unit]
    const mappedReset = featureResetMap[reset]

    const handleDeleteFeature = async (productId, featureId) => {
      try {
        await deleteFeatureReq(productId, { id: featureId })
        dispatch(storeFeatureDelete({ productId, featureId }))
      } catch (error) {
        console.error('Error deleting feature:', error)
      }
    }

    return (
      <tr>
        <td>
          <span className="fw-normal">{name}</span>
        </td>
        <td
          style={{ minWidth: '410px', maxWidth: '410px', whiteSpace: 'normal' }}
        >
          <DescriptionCell data={{ description }} />
        </td>

        <td>
          <span className={`fw-normal`}>{mappedType}</span>
        </td>
        <td>
          <span className="fw-normal">{mappedUnit}</span>
        </td>
        <td>
          <span className="fw-normal">{mappedReset}</span>
        </td>
        <td>
          <span className="fw-normal">
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
              <Dropdown.Item
                onSelect={() => {
                  editForm(id)
                }}
              >
                <FontAwesomeIcon icon={faEdit} className="me-2" />
                <FormattedMessage id="Edit" />
              </Dropdown.Item>
              <Dropdown.Item
                onClick={() => handleDeleteFeature(productId, id)}
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
                  <FormattedMessage id="Date" />
                </th>
                <th className="border-bottom">
                  <FormattedMessage id="Actions" />
                </th>
              </tr>
            </thead>
            <tbody>
              {list?.features && Object.values(list?.features).length
                ? Object.values(list?.features).map((t, index) => {
                    return <TableRow key={`index`} {...t} />
                  })
                : null}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      <ThemeDialog visible={visible} setVisible={setVisible}>
        <>
          <FeatureForm
            productId={productId}
            popupLabel={<FormattedMessage id={popUpLable} />}
            type={type}
            update={update}
            setUpdate={setUpdate}
            setVisible={setVisible}
            sideBar={false}
            featureData={type == 'edit' ? list?.features[currentId] : {}}
          />
        </>
      </ThemeDialog>

      <button
        onClick={() => {
          setVisible(true)
          setPopUpLable('Add-Feature')
          setType('create')
        }}
      >
        Add Feature
      </button>
    </>
  )
}

export default ProductFeaturesList
