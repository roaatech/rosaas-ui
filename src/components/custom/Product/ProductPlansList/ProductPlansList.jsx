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
import { deletePlan, setAllPlans } from '../../../../store/slices/products'
import { FormattedMessage } from 'react-intl'
import {
  faEdit,
  faEllipsisH,
  faTrashAlt,
} from '@fortawesome/free-solid-svg-icons'

import DeleteConfirmation from '../../global/DeleteConfirmation/DeleteConfirmation'
import PlanForm from './PlanForm/PlanForm'
import ThemeDialog from '../../Shared/ThemeDialog/ThemeDialog'
import DescriptionCell from '../../Shared/DescriptionCell/DescriptionCell'
import { Wrapper } from './ProductPlansList.styled'

export const ProductPlansList = ({ productId }) => {
  const { getProductPlans, deletePlanReq } = useRequest()
  const [update, setUpdate] = useState(1)
  const dispatch = useDispatch()
  const list = useSelector((state) => state.products.products[productId])
  const [currentId, setCurrentId] = useState('')
  const [confirm, setConfirm] = useState(false)
  const [visible, setVisible] = useState(false)
  const [type, setType] = useState('')
  const [popUpLable, setPopUpLable] = useState('')

  const handleDeletePlan = async () => {
    await deletePlanReq(productId, { id: currentId })
    dispatch(deletePlan({ productId, PlanId: currentId }))
  }

  const deleteConfirm = (id) => {
    setCurrentId(id)
    setConfirm(true)
  }

  const editForm = async (id) => {
    setPopUpLable('Edit-Plan')
    setType('edit')
    setCurrentId(id)
    setVisible(true)
  }

  useEffect(() => {
    ;(async () => {
      if (!list?.plans) {
        const listData = await getProductPlans(productId)
        dispatch(setAllPlans({ productId, data: listData.data.data }))
      }
    })()
  }, [])

  const TableRow = (props) => {
    const { name, description, id, displayOrder, createdDate, editedDate } =
      props

    return (
      <>
        <tr>
          <td>
            <span className="fw-normal">{name}</span>
          </td>
          <td className="description">
            <DescriptionCell data={{ description }} />
          </td>

          <td>
            <span className={`fw-normal`}>{displayOrder}</span>
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
                  <th className="border-bottom">
                    <FormattedMessage id="Name" />
                  </th>
                  <th className="border-bottom">
                    <FormattedMessage id="Description" />
                  </th>

                  <th className="border-bottom">
                    <FormattedMessage id="Display-Order" />
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
                {list?.plans && Object.values(list?.plans).length
                  ? Object.values(list?.plans).map((t, index) => {
                      return <TableRow key={`index`} {...t} />
                    })
                  : null}
              </tbody>
            </Table>
            <DeleteConfirmation
              message={
                <FormattedMessage id="delete-plan-confirmation-message" />
              }
              icon="pi pi-exclamation-triangle"
              confirm={confirm}
              setConfirm={setConfirm}
              confirmFunction={handleDeletePlan}
              sideBar={false}
            />
          </Card.Body>
        </Card>

        <ThemeDialog visible={visible} setVisible={setVisible}>
          <>
            <PlanForm
              popupLabel={<FormattedMessage id={popUpLable} />}
              type={type}
              setVisible={setVisible}
              sideBar={false}
              planData={type == 'edit' ? list?.plans[currentId] : {}}
            />
          </>
        </ThemeDialog>
      </>
    </Wrapper>
  )
}

export default ProductPlansList
