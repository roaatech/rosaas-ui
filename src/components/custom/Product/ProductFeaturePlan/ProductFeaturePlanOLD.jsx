import React, { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faEdit,
  faEllipsisH,
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
import { useParams } from 'react-router-dom'
import { FormattedMessage } from 'react-intl'
import TableDate from '../../Shared/TableDate/TableDate'
import ThemeDialog from '../../Shared/ThemeDialog/ThemeDialog'
import DeleteConfirmation from '../../global/DeleteConfirmation/DeleteConfirmation'

import {
  deleteFeaturePlan,
  setAllFeaturePlan,
} from '../../../../store/slices/products/productsSlice.js'
import FeaturePlanForm from './FeaturePlanForm/FeaturePlanForm'
import DescriptionCell from '../../Shared/DescriptionCell/DescriptionCell'
import { Wrapper } from './ProductFeaturePlan.styled'

export default function ProductFeaturePlan({ children }) {
  const dispatch = useDispatch()
  const { getFeaturePlanList, deleteFeaturePlanReq } = useRequest()
  const [visible, setVisible] = useState(false)
  const [confirm, setConfirm] = useState(false)
  const [currentId, setCurrentId] = useState('')
  const routeParams = useParams()
  const [type, setType] = useState('')
  const [popUpLable, setPopUpLable] = useState('')

  const productId = routeParams.id
  const listData = useSelector(
    (state) => state.products.products[productId]?.featurePlan
  )
  let list = listData && Object.values(listData)

  const handleDeleteFeaturePlan = async () => {
    try {
      await deleteFeaturePlanReq({ productId, PlanFeatureId: currentId })
      dispatch(deleteFeaturePlan({ productId, PlanFeatureId: currentId }))
    } catch (error) {
      console.error('Error deleting feature:', error)
    }
  }

  const deleteConfirm = (id) => {
    setCurrentId(id)
    setConfirm(true)
  }

  const editForm = async (id) => {
    setPopUpLable('Edit-Feature-Plan')
    setType('edit')
    setCurrentId(id)
    setVisible(true)
  }

  useEffect(() => {
    ;(async () => {
      if (!list) {
        const FeaturePlanData = await getFeaturePlanList(productId)
        dispatch(
          setAllFeaturePlan({
            productId: productId,
            data: FeaturePlanData.data.data,
          })
        )
      }
    })()
  }, [])

  const plansObj = {}
  const featuresObj = {}
  const tableData = {}
  const x = list?.map((item) => {
    if (!plansObj[item.plan.id]) {
      plansObj[item.plan.id] = {
        name: item.plan.name,
        index: Object.keys(plansObj).length,
      }
    }
    if (!plansObj[item.feature.id]) {
      featuresObj[item.feature.id] = {
        name: item.feature.name,
        index: Object.keys(featuresObj).length,
      }
    }
    tableData[
      plansObj[item.plan.id].index + ',' + featuresObj[item.feature.id].index
    ] = item.id
  })

  const TableRow = (props) => {
    const { limit, description, feature, plan, createdDate, editedDate, id } =
      props

    return (
      <tr>
        <td>
          <span className="fw-normal">{feature.name}</span>
        </td>
        <td>
          <span className="fw-normal">{plan.name}</span>
        </td>
        <td className="description">
          <DescriptionCell data={{ description }} />
        </td>
        <td>
          <span className="fw-normal">{limit}</span>
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
              <Dropdown.Item onSelect={() => editForm(id)}>
                <FontAwesomeIcon icon={faEdit} className="mx-2" />
                <FormattedMessage id="Edit" />
              </Dropdown.Item>
              <Dropdown.Item
                onClick={() => deleteConfirm(id)}
                className="text-danger"
              >
                <FontAwesomeIcon icon={faTrashAlt} className="mx-2" />
                <FormattedMessage id="Delete" />
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </td>
      </tr>
    )
  }

  return (
    <Wrapper>
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
                    <FormattedMessage id="Feature" />
                  </th>
                  <th className="border-bottom">
                    <FormattedMessage id="Plan" />
                  </th>
                  <th className="border-bottom description">
                    <FormattedMessage id="Description" />
                  </th>
                  <th className="border-bottom">
                    <FormattedMessage id="Limit" />
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
                {list
                  ? list?.map((t, index) => {
                      return <TableRow key={index} {...t} />
                    })
                  : null}
              </tbody>
            </Table>
            <DeleteConfirmation
              message={
                <FormattedMessage id="delete-feature-plan-confirmation-message" />
              }
              icon="pi pi-exclamation-triangle"
              confirm={confirm}
              setConfirm={setConfirm}
              confirmFunction={handleDeleteFeaturePlan}
              sideBar={false}
            />
          </Card.Body>
        </Card>
      </div>

      <ThemeDialog visible={visible} setVisible={setVisible}>
        <FeaturePlanForm
          popupLabel={<FormattedMessage id={popUpLable} />}
          type={type}
          FeaturePlanData={type == 'edit' ? listData[currentId] : {}}
          setVisible={setVisible}
        />
      </ThemeDialog>
    </Wrapper>
  )
}
