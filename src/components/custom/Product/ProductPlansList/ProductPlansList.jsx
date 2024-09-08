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
  faEye,
  faEyeSlash,
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
import {
  systemLockStatus,
  tenancyTypeEnum,
  booleanStatus,
  visibilityStatus,
  SelectabilityStatus,
} from '../../../../const/product.js'
import { dynamicButtonsLanguages } from '../../../../const/const.js'
import SafeFormatMessage from '../../Shared/SafeFormatMessage/SafeFormatMessage.jsx'

export const ProductPlansList = ({ productId }) => {
  const { getProductPlans, deletePlanReq, publishPlan, visiblePlan } =
    useRequest()
  const [update, setUpdate] = useState(1)
  const dispatch = useDispatch()
  const list = useSelector((state) => state.products.products[productId])
  const [currentId, setCurrentId] = useState('')
  const [confirm, setConfirm] = useState(false)
  const [visible, setVisible] = useState(false)
  const [type, setType] = useState('')
  const [popUpLable, setPopUpLable] = useState('')
  const intl = useIntl()
  const ProductTrialType = list.trialType
  const [selectedLanguage, setSelectedLanguage] = useState('en')
  console.log({ selectedLanguage })

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
  const toggleVisiblePlan = async (id, isVisible) => {
    await visiblePlan(productId, {
      id,
      isVisible: !isVisible,
    })

    dispatch(
      PlansChangeAttr({
        productId,
        planId: id,
        attr: 'isVisible',
        value: !isVisible,
      })
    )
  }

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
      subscriptionsCount,
      isLockedBySystem,
      tenancyType,
      alternativePlanID,
      trialPeriodInDays,
      descriptionLocalizations,
      displayNameLocalizations,
      isAvailableForSelection,
      isVisible,
    } = props
    const publishStatus = isPublished ? true : false
    console.log(
      displayNameLocalizations?.[selectedLanguage],
      selectedLanguage,
      descriptionLocalizations,
      displayNameLocalizations
    )

    return (
      <tr>
        <td>
          <span className="fw-normal">
            {displayNameLocalizations?.[selectedLanguage] || displayName}
          </span>
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
          <span>
            <Label {...SelectabilityStatus[isAvailableForSelection]} />
          </span>
        </td>
        <td>
          <span>
            <Label {...visibilityStatus[isVisible]} />
          </span>
        </td>
        <td>
          <span>{<SafeFormatMessage id={tenancyTypeEnum[tenancyType]} />}</span>
        </td>
        <td>
          <span
            className={`${
              subscriptionsCount > 0
                ? 'subscribers-active'
                : 'subscribers-passive'
            }`}
          >
            <GiShadowFollower />
            <span className="ml-1">
              {subscriptionsCount ? subscriptionsCount : 0}
            </span>
          </span>
        </td>
        {/*<td className="description">
          <DescriptionCell
            data={{
              description:
                descriptionLocalizations?.[selectedLanguage] || description,
            }}
          />
        </td>*/}
        <td>
          <span className={`fw-normal`}>{displayOrder}</span>
        </td>
        <td>
          <span>{list.plans?.[alternativePlanID]?.displayName}</span>
        </td>
        {ProductTrialType == 3 && (
          <td>
            <span>{trialPeriodInDays}</span>
          </td>
        )}
        <td>
          <span>
            <Label {...systemLockStatus[isLockedBySystem]} />
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
              <Dropdown.Item onSelect={() => editForm(id)}>
                <FontAwesomeIcon icon={faEdit} className="mx-2" />
                <SafeFormatMessage id="Edit" />
              </Dropdown.Item>
              <Dropdown.Item onClick={() => togglePublishPlan(id, isPublished)}>
                {isPublished ? (
                  <span className=" ">
                    <MdOutlineUnpublished className="mx-2" />
                    <SafeFormatMessage id="Unpublish" />
                  </span>
                ) : (
                  <span className=" ">
                    <MdOutlinePublishedWithChanges className="mx-2" />
                    <SafeFormatMessage id="Publish" />
                  </span>
                )}
              </Dropdown.Item>
              <Dropdown.Item onClick={() => toggleVisiblePlan(id, isVisible)}>
                {isVisible ? (
                  <span className=" ">
                    <FontAwesomeIcon icon={faEye} className="mx-2" />
                    <SafeFormatMessage id="Hide-Plan" />
                  </span>
                ) : (
                  <span className=" ">
                    <FontAwesomeIcon icon={faEyeSlash} className="mx-2" />
                    <SafeFormatMessage id="Show-Plan" />
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
    )
  }

  return (
    <Wrapper>
      <div className="dynamicButtons pt-0 mt-0 mb-1 d-flex justify-content-end">
        <DynamicButtons
          buttons={Object.keys(dynamicButtonsLanguages).map((lang, index) => ({
            order: 1,
            type: 'toggle',
            label: lang,
            toggleValue: selectedLanguage === lang,
            toggleFunc: () => setSelectedLanguage(lang), // Update selected language
            variant: 'primary',
          }))}
        />
        <span className="mx-2">
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
        </span>
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
                    <SafeFormatMessage id="Display-Name" />
                  </th>
                  <th className="border-bottom">
                    <SafeFormatMessage id="System-Name" />
                  </th>
                  <th className="border-bottom">
                    <SafeFormatMessage id="Status" />
                  </th>
                  <th className="border-bottom">
                    <SafeFormatMessage id="Selection-Availability" />
                  </th>
                  <th className="border-bottom">
                    <SafeFormatMessage id="Visibility-Status" />
                  </th>
                  <th className="border-bottom">
                    <SafeFormatMessage id="Tenancy-Type" />
                  </th>
                  <th className="border-bottom">
                    <SafeFormatMessage id="Subscribers" />
                  </th>
                  {/*<th className="border-bottom">
                    <SafeFormatMessage id="Description" />
                  </th>*/}
                  <th className="border-bottom">
                    <SafeFormatMessage id="Display-Order" />
                  </th>
                  <th className="border-bottom">
                    <SafeFormatMessage id="Alternative-Plan" />
                  </th>
                  {ProductTrialType == 3 && (
                    <th className="border-bottom">
                      <SafeFormatMessage id="Trial-Period-In-Days" />
                    </th>
                  )}
                  <th className="border-bottom">
                    <SafeFormatMessage id="System-Lock-Status" />
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
                {list?.plans && Object.values(list?.plans).length
                  ? Object.values(list?.plans).map((t, index) => {
                      return <TableRow key={index} {...t} />
                    })
                  : null}
              </tbody>
            </Table>
            <DeleteConfirmation
              message={
                <SafeFormatMessage id="delete-plan-confirmation-message" />
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
              popupLabel={<SafeFormatMessage id={popUpLable} />}
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
