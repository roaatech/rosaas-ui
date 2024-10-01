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
} from '../../../../store/slices/products/productsSlice.js'
import { FormattedMessage, useIntl } from 'react-intl'
import {
  faEdit,
  faEllipsisH,
  faTrashAlt,
} from '@fortawesome/free-solid-svg-icons'

import DeleteConfirmation from '../../global/DeleteConfirmation/DeleteConfirmation'
import CustomSpecificationForm from './CustomSpecificationForm/CustomSpecificationForm'
import ThemeDialog from '../../Shared/ThemeDialog/ThemeDialog'
import { Wrapper } from './ProductCustomSpecification.styled'
import { toast } from 'react-toastify'

import Label from '../../Shared/label/Label'

import {
  MdOutlineUnpublished,
  MdOutlinePublishedWithChanges,
  MdEditNote,
  MdAdd,
  MdSort,
} from 'react-icons/md'

import { PublishStatus } from '../../../../const'
import DynamicButtons from '../../Shared/DynamicButtons/DynamicButtons'
import SafeFormatMessage from '../../Shared/SafeFormatMessage/SafeFormatMessage.jsx'
import { size } from 'lodash'
import DataLabelWhite from '../../Shared/DateLabelWhite/DateLabelWhite.jsx'
import { textLocale } from '../../../../const/product.js'

export const ProductCustomSpecificationList = (
  { productId },
  setActiveIndex
) => {
  const {
    getProductSpecification,
    deleteSpecificationReq,
    publishSpecification,
  } = useRequest()
  const [update, setUpdate] = useState(1)
  const dispatch = useDispatch()
  const list = useSelector((state) => state.products.products[productId])
  const [currentId, setCurrentId] = useState('')
  const [confirm, setConfirm] = useState(false)
  const [visible, setVisible] = useState(false)
  const [type, setType] = useState('')
  const [popUpLable, setPopUpLable] = useState('')
  const intl = useIntl()
  const direction = useSelector((state) => state.main.direction)
  const [selectedLanguage, setSelectedLanguage] = useState(intl.locale)

  const handleDeleteSpecification = async () => {
    if (list?.specifications[currentId]?.isSubscribed) {
      toast.error(
        intl.formatMessage({ id: 'Cannot-delete-a-subscribed-specification.' }),
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
        intl.formatMessage({ id: 'Cannot-edit-a-subscribed-specification.' }),
        {
          position: toast.POSITION.TOP_CENTER,
        }
      )
      return
    }
    setPopUpLable('Edit-Specification')
    setType('edit')
    setCurrentId(id)
    setVisible(true)
  }

  useEffect(() => {
    ;(async () => {
      if (!list?.specifications) {
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
      systemName,
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
      displayOrder,
    } = props
    const publishStatus = isPublished ? true : false

    return (
      <>
        <tr>
          <td>
            <span className="fw-normal">{systemName}</span>
          </td>
          <td>
            <span className="fw-normal">
              {textLocale(displayName, selectedLanguage, intl)}
            </span>
          </td>
          <td>
            <span>
              <Label {...PublishStatus[publishStatus]} />
            </span>
          </td>

          <td className="description">
            {textLocale(description, selectedLanguage, intl)}
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
              {textLocale(validationFailureDescription, selectedLanguage, intl)}
            </span>
          </td>
          <td>
            <span className="fw-normal">
              {displayOrder}
              {/* <DataLabelWhite
                variant={'gray'}
                text={
                  <>
                    <MdSort />
                    {'  '}
                    {displayOrder}
                  </>
                }
              /> */}
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
                  <SafeFormatMessage id="Edit" />
                </Dropdown.Item>
                <Dropdown.Item
                  onClick={() => togglePublishSpecifications(id, isPublished)}
                >
                  {isPublished ? (
                    <span className=" ">
                      <MdOutlineUnpublished className="mx-2" />
                      <SafeFormatMessage id="Deactivate" />
                    </span>
                  ) : (
                    <span className=" ">
                      <MdOutlinePublishedWithChanges className="mx-2" />
                      <SafeFormatMessage id="Activate" />
                    </span>
                  )}
                </Dropdown.Item>
                <Dropdown.Item
                  onClick={() => deleteConfirm(id)}
                  className="text-danger"
                >
                  <FontAwesomeIcon icon={faTrashAlt} className="mx-2" />
                  <SafeFormatMessage id="Delete" />
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
            ...Object.keys({ en: 'English', ar: 'Arabic' }).map(
              (lang, index) => ({
                order: 1,
                type: 'toggle',
                label: lang,
                group: 'language',
                toggleValue: selectedLanguage === lang,
                toggleFunc: () => setSelectedLanguage(lang),
                variant: 'primary',
              })
            ),
            {
              order: 1,
              type: 'form',
              id: productId,
              label: 'Add-Specification',
              component: 'addSpecification',
              icon: <MdEditNote />,
              setActiveIndex: setActiveIndex,
              size: 'lg',
            },
            {
              order: 4,
              type: 'form',
              id: productId,
              label: 'Add-Validation-Url',
              component: 'AddValidationUrl',
              icon: <MdAdd />,
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
                    <SafeFormatMessage id="System-Name" />
                  </th>
                  <th className="border-bottom">
                    <SafeFormatMessage id="Display-Name" />
                  </th>
                  <th className="border-bottom">
                    <SafeFormatMessage id="Status" />
                  </th>
                  <th className="border-bottom">
                    <SafeFormatMessage id="Description" />
                  </th>

                  <th className="border-bottom">
                    <SafeFormatMessage id="Is-Required" />
                  </th>
                  <th className="border-bottom">
                    <SafeFormatMessage id="Is-User-Editable" />
                  </th>
                  <th className="border-bottom">
                    <SafeFormatMessage id="Regular-Expression" />
                  </th>
                  <th className="border-bottom">
                    <SafeFormatMessage id="Validation-Failure-Description" />
                  </th>
                  <th className="border-bottom">
                    <SafeFormatMessage id="Display-Order" />
                  </th>
                  <th className="border-bottom">
                    <SafeFormatMessage id="Date" />
                  </th>
                  <th className="border-bottom">
                    <SafeFormatMessage id="Actions" />
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
                <SafeFormatMessage id="delete-specification-confirmation-message" />
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
              popupLabel={<SafeFormatMessage id={popUpLable} />}
              type={type}
              setVisible={setVisible}
              sideBar={false}
              specificationData={
                type === 'edit' ? list?.specifications[currentId] : {}
              }
            />
          </>
        </ThemeDialog>
      </div>
    </Wrapper>
  )
}

export default ProductCustomSpecificationList
