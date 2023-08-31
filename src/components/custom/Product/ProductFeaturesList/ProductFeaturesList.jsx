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
import {
  deleteFeature,
  setAllFeatures,
} from '../../../../store/slices/products'
import { FormattedMessage } from 'react-intl'
import {
  faEdit,
  faEllipsisH,
  faTrashAlt,
} from '@fortawesome/free-solid-svg-icons'

import DeleteConfirmation from '../../global/DeleteConfirmation/DeleteConfirmation'
import FeatureForm from './FeatureForm/FeatureForm'
import ThemeDialog from '../../Shared/ThemeDialog/ThemeDialog'
import DescriptionCell from '../../Shared/DescriptionCell/DescriptionCell'
import {
  featureResetMap,
  featureTypeMap,
  featureUnitMap,
} from '../../../../const'
import { Wrapper } from './ProductFeaturesList.styled'

export const ProductFeaturesList = ({ productId }) => {
  const { getProductFeatures, deleteFeatureReq } = useRequest()
  const [update, setUpdate] = useState(1)
  const dispatch = useDispatch()
  const list = useSelector((state) => state.products.products[productId])
  const [currentId, setCurrentId] = useState('')
  const [confirm, setConfirm] = useState(false)
  const [visible, setVisible] = useState(false)
  const [type, setType] = useState('')
  const [popUpLable, setPopUpLable] = useState('')

  const handleDeleteFeature = async () => {
    await deleteFeatureReq(productId, { id: currentId })
    dispatch(deleteFeature({ productId, FeatureId: currentId }))
  }

  const deleteConfirm = (id) => {
    setCurrentId(id)
    setConfirm(true)
  }

  const editForm = async (id) => {
    setPopUpLable('Edit-Feature')
    setType('edit')
    setCurrentId(id)
    setVisible(true)
  }

  useEffect(() => {
    ;(async () => {
      if (!list?.features) {
        const listData = await getProductFeatures(productId)
        dispatch(setAllFeatures({ productId, data: listData.data.data }))
      }
    })()
  }, [])

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

    return (
      <>
        <tr>
          <td>
            <span className="fw-normal">{name}</span>
          </td>
          <td className="description">
            <DescriptionCell data={{ description }} maxWidth={410} />
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
      </>
    )
  }

  return (
    <Wrapper>
      <>
        <Card
          border="light"
          className="table-wrapper table-responsive shadow-sm"
        >
          <Card.Body className="pt-0">
            <Table hover className="user-table align-items-center">
              <thead>
                <tr>
                  <th className="border-bottom name">
                    <FormattedMessage id="Name" />
                  </th>
                  <th className="border-bottom description">
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
            <DeleteConfirmation
              message={
                <FormattedMessage id="delete-feature-confirmation-message" />
              }
              icon="pi pi-exclamation-triangle"
              confirm={confirm}
              setConfirm={setConfirm}
              confirmFunction={handleDeleteFeature}
              sideBar={false}
            />
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
      </>
    </Wrapper>
  )
}

export default ProductFeaturesList
