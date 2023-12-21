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
  PlansChangeAttr,
  deletePlan,
  setAllPlans,
} from '../../../../store/slices/products/productsSlice.js'
import { FormattedMessage, useIntl } from 'react-intl'
import {
  faEdit,
  faEllipsisH,
  faToggleOff,
  faToggleOn,
  faTrashAlt,
} from '@fortawesome/free-solid-svg-icons'

import DeleteConfirmation from '../../global/DeleteConfirmation/DeleteConfirmation'
import PlanForm from './PlanForm/PlanForm'
import ThemeDialog from '../../Shared/ThemeDialog/ThemeDialog'
import DescriptionCell from '../../Shared/DescriptionCell/DescriptionCell'
import { Wrapper } from './ProductPlansList.styled'
import { toast } from 'react-toastify'
import {
  BsCheck,
  BsFillBagCheckFill,
  BsFillBagDashFill,
  BsFillCheckCircleFill,
  BsFillXCircleFill,
  BsPencilSquare,
  BsShare,
} from 'react-icons/bs'
import Label from '../../Shared/label/Label'

import {
  MdOutlineUnpublished,
  MdOutlinePublishedWithChanges,
} from 'react-icons/md'

import { PublishStatus } from '../../../../const'
import DynamicButtons from '../../Shared/DynamicButtons/DynamicButtons'
import { setActiveIndex } from '../../../../store/slices/tenants'
import { GiShadowFollower } from 'react-icons/gi'
import { systemLockStatus, tenancyTypeEnum } from '../../../../const/product.js'

export const ProductPlansList = ({ productId }) => {
  const { getProductPlans, deletePlanReq, publishPlan } = useRequest()
  const [update, setUpdate] = useState(1)
  const dispatch = useDispatch()
  const list = useSelector((state) => state.products.products[productId])
  const [currentId, setCurrentId] = useState('')
  const [confirm, setConfirm] = useState(false)
  const [visible, setVisible] = useState(false)
  const [type, setType] = useState('')
  const [popUpLable, setPopUpLable] = useState('')
  const intl = useIntl()
  const handleDeletePlan = async () => {
    if (list?.plans[currentId]?.isSubscribed) {
      toast.error(
        intl.formatMessage({ id: 'Cannot-delete-a-subscribed-plan.' }),
        {
          position: toast.POSITION.TOP_CENTER,
        }
      )
      return
    }
    if (list?.plans[currentId]?.isLockedBySystem) {
      toast.error(intl.formatMessage({ id: 'Cannot-delete-a-locked-plan' }), {
        position: toast.POSITION.TOP_CENTER,
      })
      return
    }
    await deletePlanReq(productId, { id: currentId })
    dispatch(deletePlan({ productId, PlanId: currentId }))
  }

  const deleteConfirm = (id) => {
    setCurrentId(id)
    setConfirm(true)
  }

  const editForm = async (id) => {
    if (list?.plans[id]?.isSubscribed) {
      toast.error(
        intl.formatMessage({ id: 'Cannot-edit-a-subscribed-plan.' }),
        {
          position: toast.POSITION.TOP_CENTER,
        }
      )
      return
    }
    if (list?.plans[id]?.isLockedBySystem) {
      toast.error(intl.formatMessage({ id: 'Cannot-edit-a-locked-plan' }), {
        position: toast.POSITION.TOP_CENTER,
      })
      return
    }
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

  const togglePublishPlan = async (id, isPublished) => {
    await publishPlan(productId, {
      id,
      isPublished: !isPublished,
    })

    dispatch(
      PlansChangeAttr({
        productId,
        planId: id,
        attr: 'isPublished',
        value: !isPublished,
      })
    )
  }

  const TableRow = (props) => {
    const {
      displayName,
      systemName,
      description,
      id,
      displayOrder,
      createdDate,
      isPublished,
      editedDate,
      subscribers,
      isLockedBySystem,
      tenancyType,
    } = props
    const publishStatus = isPublished ? true : false

    return (
      <>
        <tr>
          <td>
            <span className="fw-normal">{displayName}</span>
          </td>
          <td>
            <span className="fw-normal">{systemName}</span>
          </td>
          <td>
            <span>
              <Label {...PublishStatus[publishStatus]} />
            </span>
          </td>
          <td>
            <span>{tenancyTypeEnum[tenancyType]}</span>
          </td>
          <td>
            <span>
              <Label {...systemLockStatus[isLockedBySystem]} />
            </span>
          </td>

          <td>
            <span
              className={`${
                subscribers > 0 ? 'subscribers-active' : 'subscribers-passive'
              }`}
            >
              <GiShadowFollower />
              <span className="ml-1">{subscribers ? subscribers : 0}</span>
            </span>
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
                  <FontAwesomeIcon icon={faEdit} className="mx-2" />
                  <FormattedMessage id="Edit" />
                </Dropdown.Item>
                <Dropdown.Item
                  onClick={() => togglePublishPlan(id, isPublished)}
                >
                  {isPublished ? (
                    <span className=" ">
                      <MdOutlineUnpublished className="mx-2" />
                      <FormattedMessage id="Unpublished" />
                    </span>
                  ) : (
                    <span className=" ">
                      <MdOutlinePublishedWithChanges className="mx-2" />
                      <FormattedMessage id="Published" />
                    </span>
                  )}
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
      </>
    )
  }

  return (
    <Wrapper>
      <div className="dynamicButtons pt-0 mt-0 mb-1 ">
        <DynamicButtons
          buttons={[
            {
              order: 1,
              type: 'form',
              id: productId,
              label: 'Add-Plan',
              component: 'addPlan',
              icon: <BsPencilSquare />,
              setActiveIndex: setActiveIndex,
            },
          ]}
        />
      </div>
      <div className="border-top-1 border-light">
        <Card
          border="light"
          className="table-wrapper table-responsive shadow-sm"
        >
          <Card.Body className="pt-0">
            <Table hover className="user-table align-items-center">
              <thead>
                <tr>
                  <th className="border-bottom">
                    <FormattedMessage id="Display-Name" />
                  </th>
                  <th className="border-bottom">
                    <FormattedMessage id="System-Name" />
                  </th>
                  <th className="border-bottom">
                    <FormattedMessage id="Status" />
                  </th>
                  <th className="border-bottom">
                    <FormattedMessage id="Tenancy-Type" />
                  </th>
                  <th className="border-bottom">
                    <FormattedMessage id="System-Lock-Status" />
                  </th>
                  <th className="border-bottom">
                    <FormattedMessage id="Subscribers" />
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
                      return <TableRow key={index} {...t} />
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
      </div>
    </Wrapper>
  )
}

export default ProductPlansList
