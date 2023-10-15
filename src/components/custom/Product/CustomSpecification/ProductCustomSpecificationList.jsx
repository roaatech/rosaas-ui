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
  specificationChangeAttr,
  deleteSpecification,
  setAllSpecifications,
} from '../../../../store/slices/products'
import { FormattedMessage, useIntl } from 'react-intl'
import {
  faEdit,
  faEllipsisH,
  faToggleOff,
  faToggleOn,
  faTrashAlt,
} from '@fortawesome/free-solid-svg-icons'

import DeleteConfirmation from '../../global/DeleteConfirmation/DeleteConfirmation'
import CustomSpecificationForm from './CustomSpecificationForm/CustomSpecificationForm'
import ThemeDialog from '../../Shared/ThemeDialog/ThemeDialog'
import DescriptionCell from '../../Shared/DescriptionCell/DescriptionCell'
import { Wrapper } from './ProductCustomSpecification.styled'
import { toast } from 'react-toastify'
import {
  BsCheck,
  BsFillBagCheckFill,
  BsFillBagDashFill,
  BsFillCheckCircleFill,
  BsFillXCircleFill,
  BsShare,
} from 'react-icons/bs'
import Label from '../../Shared/label/Label'

import {
  MdOutlineUnpublished,
  MdOutlinePublishedWithChanges,
} from 'react-icons/md'

import { PublishStatus } from '../../../../const'

export const ProductCustomSpecificationList = ({ productId }) => {
  const {
    getProductSpecification,
    deleteSpecificationReq,
    publishSpecification,
  } = useRequest()
  const [update, setUpdate] = useState(1)
  const dispatch = useDispatch()
  const list = useSelector((state) => state.products.products[productId])
  console.log({ list })
  const [currentId, setCurrentId] = useState('')
  const [confirm, setConfirm] = useState(false)
  const [visible, setVisible] = useState(false)
  const [type, setType] = useState('')
  const [popUpLable, setPopUpLable] = useState('')
  const intl = useIntl()
  const direction = useSelector((state) => state.main.direction)

  const handleDeleteSpecification = async () => {
    if (list?.specifications[currentId]?.isSubscribed) {
      toast.error(
        intl.formatMessage({ id: 'Cannot-delete-a-subscribed-plan.' }),
        {
          position: toast.POSITION.TOP_CENTER,
        }
      )
      return
    }
    await deleteSpecificationReq(productId, { id: currentId })
    dispatch(deleteSpecification({ productId, specificationId: currentId }))
  }

  const deleteConfirm = (id) => {
    setCurrentId(id)
    setConfirm(true)
  }

  const editForm = async (id) => {
    if (list?.specifications[id]?.isSubscribed) {
      toast.error(
        intl.formatMessage({ id: 'Cannot-edit-a-subscribed-plan.' }),
        {
          position: toast.POSITION.TOP_CENTER,
        }
      )
      return
    }
    setPopUpLable('Edit-Specification')
    setType('edit')
    setCurrentId(id)
    console.log({ sss: list.specifications[currentId] })
    setVisible(true)
  }

  useEffect(() => {
    ;(async () => {
      if (!list?.plans) {
        const listData = await getProductSpecification(productId)
        dispatch(setAllSpecifications({ productId, data: listData.data.data }))
      }
    })()
  }, [])

  const togglePublishSpecifications = async (id, isPublished) => {
    await publishSpecification(productId, {
      id,
      isPublished: !isPublished,
    })

    dispatch(
      specificationChangeAttr({
        productId,
        specificationId: id,
        attr: 'isPublished',
        value: !isPublished,
      })
    )
  }

  const TableRow = (props) => {
    const {
      name,
      displayName,
      description,
      id,
      createdDate,
      isPublished,
      editedDate,
      permissions,
      isRequired,
      isUserEditable,
      regularExpression,
      validationFailureDescription,
    } = props
    const publishStatus = isPublished ? true : false

    return (
      <>
        <tr>
          <td>
            <span className="fw-normal">{name}</span>
          </td>
          <td>
            <span className="fw-normal">
              {direction === 'rtl'
                ? displayName.ar
                  ? displayName.ar
                  : displayName.en
                : displayName.en
                ? displayName.en
                : displayName.ar}
            </span>
          </td>
          <td>
            <span>
              <Label {...PublishStatus[publishStatus]} />
            </span>
          </td>

          <td className="description">
            {direction === 'rtl'
              ? description.ar
                ? description.ar
                : description.en
              : description.en
              ? description.en
              : description.ar}
          </td>

          <td>
            <span className="fw-normal">{isRequired ? 'True' : 'False'}</span>
          </td>
          <td>
            <span className="fw-normal">
              {isUserEditable ? 'True' : 'False'}
            </span>
          </td>
          <td>
            <span className="fw-normal">
              {regularExpression ? regularExpression : '-'}
            </span>
          </td>
          <td>
            <span className="fw-normal">
              {direction === 'rtl'
                ? validationFailureDescription.ar
                  ? validationFailureDescription.ar
                  : validationFailureDescription.en
                : validationFailureDescription.en
                ? validationFailureDescription.en
                : validationFailureDescription.ar}
            </span>
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
                  onClick={() => togglePublishSpecifications(id, isPublished)}
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
                    <FormattedMessage id="Display-Name" />
                  </th>
                  <th className="border-bottom">
                    <FormattedMessage id="Status" />
                  </th>
                  <th className="border-bottom">
                    <FormattedMessage id="Description" />
                  </th>

                  <th className="border-bottom">
                    <FormattedMessage id="Is-Required" />
                  </th>
                  <th className="border-bottom">
                    <FormattedMessage id="Is-User-Editable" />
                  </th>
                  <th className="border-bottom">
                    <FormattedMessage id="Regular-Expression" />
                  </th>
                  <th className="border-bottom">
                    <FormattedMessage id="Validation-Failure-Description" />
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
                {list?.specifications &&
                Object.values(list?.specifications).length
                  ? Object.values(list?.specifications).map((t, index) => {
                      return <TableRow key={index} {...t} />
                    })
                  : null}
              </tbody>
            </Table>
            <DeleteConfirmation
              message={
                <FormattedMessage id="delete-specification-confirmation-message" />
              }
              icon="pi pi-exclamation-triangle"
              confirm={confirm}
              setConfirm={setConfirm}
              confirmFunction={handleDeleteSpecification}
              sideBar={false}
            />
          </Card.Body>
        </Card>

        <ThemeDialog visible={visible} setVisible={setVisible} size="lg">
          <>
            <CustomSpecificationForm
              popupLabel={<FormattedMessage id={popUpLable} />}
              type={type}
              setVisible={setVisible}
              sideBar={false}
              specificationData={
                type === 'edit' ? list?.specifications[currentId] : {}
              }
            />
          </>
        </ThemeDialog>
      </>
    </Wrapper>
  )
}

export default ProductCustomSpecificationList
