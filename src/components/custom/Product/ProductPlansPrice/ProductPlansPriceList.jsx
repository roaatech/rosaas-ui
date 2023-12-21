import React, { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faEdit,
  faTrashAlt,
  faNewspaper,
} from '@fortawesome/free-solid-svg-icons'
import {
  Card,
  Button,
  ButtonGroup,
  Dropdown,
  Table,
  OverlayTrigger,
  Tooltip,
} from '@themesberg/react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import useRequest from '../../../../axios/apis/useRequest'
import { useParams } from 'react-router-dom'
import { FormattedMessage } from 'react-intl'
import ThemeDialog from '../../Shared/ThemeDialog/ThemeDialog'
import DeleteConfirmation from '../../global/DeleteConfirmation/DeleteConfirmation'

import {
  PlansChangeAttr,
  PlansPriceChangeAttr,
  deletePlanPrice,
  setAllPlans,
  setAllPlansPrice,
} from '../../../../store/slices/products/productsSlice.js'
import PlanPriceForm from './PlanPriceForm/PlanPriceForm'
import { Wrapper } from './ProductPlansPriceList.styled'
import { cycle } from '../../../../const'

import {
  MdOutlineUnpublished,
  MdOutlinePublishedWithChanges,
} from 'react-icons/md'
import { toast } from 'react-toastify'
import { useIntl } from 'react-intl'
import ShowDetails from '../../Shared/ShowDetails/ShowDetails'
import { DataTransform } from '../../../../lib/sharedFun/Time'
import DynamicButtons from '../../Shared/DynamicButtons/DynamicButtons'
import {
  BsCurrencyDollar,
  BsFillLockFill,
  BsFillUnlockFill,
  BsToggleOff,
  BsToggleOn,
} from 'react-icons/bs'
import { setActiveIndex } from '../../../../store/slices/tenants'
import { GiShadowFollower } from 'react-icons/gi'
export default function ProductPlansPriceList({ children }) {
  const intl = useIntl()
  const dispatch = useDispatch()
  const {
    getProductPlans,
    getProductPlanPriceList,
    deletePlanPriceReq,
    PlansPricePublishedReq,
    publishPlan,
  } = useRequest()
  const [visible, setVisible] = useState(false)
  const [confirm, setConfirm] = useState(false)
  const [currentId, setCurrentId] = useState('')
  const [currentPlanId, setCurrentPlanId] = useState('')
  const [currentCycle, setCurrentCycle] = useState('')
  const routeParams = useParams()
  const [type, setType] = useState('')
  const [show, setShow] = useState(false)
  const [popUpLable, setPopUpLable] = useState('')

  const productId = routeParams.id
  const listProductDataStore = useSelector(
    (state) => state.products.products[productId]
  )

  const plansData = { ...listProductDataStore?.plans }
  // delete default key from list
  const listData = { ...listProductDataStore?.plansPrice }
  // listData['00000000-0000-0000-0000-000000000000'] &&
  //   delete listData['00000000-0000-0000-0000-000000000000']
  let list = listData && Object.values(listData)

  const handleDeletePlanPrice = async () => {
    try {
      await deletePlanPriceReq(productId, currentId)
      dispatch(deletePlanPrice({ productId, PlanPriceId: currentId }))
    } catch (error) {
      console.error('Error deleting planPrice:', error)
    }
  }

  const changePublished = async (id, status) => {
    await PlansPricePublishedReq(productId, {
      id,
      data: { isPublished: status },
    })
    dispatch(
      PlansPriceChangeAttr({
        productId,
        planPriceId: id,
        attr: 'isPublished',
        value: status,
      })
    )
  }

  const deleteConfirm = (id) => {
    if (listData[id].isSubscribed == true) {
      toast.error(
        intl.formatMessage({ id: 'subscribed-plan-price-cannot-be-deleted' }),
        {
          position: toast.POSITION.TOP_CENTER,
        }
      )
    } else {
      setCurrentId(id)
      setConfirm(true)
    }
  }
  const toastError = (message) => {
    return toast.error(intl.formatMessage({ id: message }), {
      position: toast.POSITION.TOP_CENTER,
    })
  }
  const editForm = async (id) => {
    if (listData[id].isSubscribed == true) {
      toast.error(
        intl.formatMessage({ id: 'subscribed-plan-price-cannot-be-modified' }),
        {
          position: toast.POSITION.TOP_CENTER,
        }
      )
    } else {
      setShow(false)
      setPopUpLable('Edit-Plan-Price')
      setType('edit')
      setCurrentId(id)
      setVisible(true)
    }
  }

  const descriptionPop = async (id) => {
    setType('edit')
    setShow(true)
    setCurrentId(id)
    setVisible(true)
    setPopUpLable('View-Details')
  }

  useEffect(() => {
    ;(async () => {
      if (!plansData || Object.keys(plansData).length === 0) {
        const allPlans = await getProductPlans(productId)
        dispatch(
          setAllPlans({
            productId: productId,
            data: allPlans.data.data,
          })
        )
      }

      if (!list || list.length == 0) {
        const allPlansPrices = await getProductPlanPriceList(productId)
        dispatch(
          setAllPlansPrice({
            productId: productId,
            data: allPlansPrices.data.data,
          })
        )
      }
    })()
  }, [])

  const tableData = {}
  list?.map((item) => {
    tableData[item.plan?.id + ',' + item.cycle] = item.id
  })

  const handleCreatePlanPrice = (plan, cycle) => {
    if (plansData?.[plan].tenancyType == 3 && (cycle == 10 || cycle == 11)) {
      toast.error(
        intl.formatMessage({
          id: 'Cannot-add-to-this-type-of-cycle',
        }),
        {
          position: toast.POSITION.TOP_CENTER,
        }
      )
    } else if (plansData?.[plan].tenancyType != 1) {
      setCurrentPlanId(plan)
      setCurrentCycle(cycle)
      setVisible(true)
      setPopUpLable('Add-Plan-Price')
      setType('create')
    } else {
      toast.error(
        intl.formatMessage({
          id: 'Cannot-add-to-this-type-of-plan',
        }),
        {
          position: toast.POSITION.TOP_CENTER,
        }
      )
    }
  }

  const handleData = (data) => {
    console.log({ data })
    return {
      'System-Name': data.systemName,
      'System-Lock-Status': data.isLockedBySystem ? 'Yes' : 'No',
      Plan: data.plan.displayName,
      cycle: cycle[data.cycle],
      Published: data.isPublished ? 'Yes' : 'No',
      Subscribed: data.isSubscribed ? 'Yes' : 'No',
      Description: data.description,

      'Created-Date': DataTransform(data.createdDate),
      'Edited-Date': DataTransform(data.editedDate),
    }
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

  const TableRow = () => {
    return (
      <>
        {Object.keys(cycle).map((item, cycleIndex) => (
          <tr key={cycleIndex}>
            <td>
              <span className="fw-bolder">
                <FormattedMessage id={cycle[item]} />
              </span>
            </td>
            {Object.keys(plansData).map((planItem, planIndex) => (
              <td key={planIndex}>
                <span className="fw-normal">
                  {tableData[planItem + ',' + item] ? (
                    <Dropdown as={ButtonGroup}>
                      <Dropdown.Toggle
                        as={Button}
                        split
                        variant="link"
                        className="text-dark m-0 p-0 planFeatureButton"
                      >
                        {listData[tableData[planItem + ',' + item]]?.price} ${' '}
                        {listData[tableData[planItem + ',' + item]]
                          ?.isPublished ? (
                          <span className="label green">
                            <MdOutlinePublishedWithChanges />
                          </span>
                        ) : (
                          <span className="label red">
                            <MdOutlineUnpublished />
                          </span>
                        )}
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                        <Dropdown.Item
                          onSelect={() =>
                            descriptionPop(tableData[planItem + ',' + item])
                          }
                        >
                          <FontAwesomeIcon
                            icon={faNewspaper}
                            className="mx-2"
                          />

                          <FormattedMessage id="View-Details" />
                        </Dropdown.Item>

                        <Dropdown.Item
                          onSelect={() =>
                            editForm(tableData[planItem + ',' + item])
                          }
                        >
                          <FontAwesomeIcon icon={faEdit} className="mx-2" />
                          <FormattedMessage id="Edit" />
                        </Dropdown.Item>
                        <Dropdown.Item
                          onSelect={() =>
                            changePublished(
                              tableData[planItem + ',' + item],
                              !listData[tableData[planItem + ',' + item]]
                                ?.isPublished
                            )
                          }
                        >
                          {listData[tableData[planItem + ',' + item]]
                            ?.isPublished ? (
                            <span className="label">
                              <MdOutlineUnpublished />{' '}
                              <FormattedMessage id="Unpublished" />
                            </span>
                          ) : (
                            <span className="label">
                              <MdOutlinePublishedWithChanges />{' '}
                              <FormattedMessage id="Published" />
                            </span>
                          )}
                        </Dropdown.Item>
                        <Dropdown.Item
                          onClick={() =>
                            deleteConfirm(tableData[planItem + ',' + item])
                          }
                          className="text-danger"
                        >
                          <FontAwesomeIcon icon={faTrashAlt} className="mx-2" />
                          <FormattedMessage id="Delete" />
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  ) : (
                    <span
                      className="clickable-text cursor-pointer"
                      onClick={() => handleCreatePlanPrice(planItem, item)}
                    >
                      ـــ
                    </span>
                  )}
                </span>
              </td>
            ))}
          </tr>
        ))}
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
              label: 'Add-Plan-Price',
              component: 'addPlanPrice',
              icon: <BsCurrencyDollar />,
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
                  <th className="border-bottom"></th>
                  {Object.keys(plansData).map((item, index) => (
                    <>
                      <th
                        className="clickable-icon"
                        key={index}
                        onClick={() =>
                          togglePublishPlan(item, plansData[item].isPublished)
                        }
                      >
                        <span className="mr-2">
                          {plansData[item].isPublished ? (
                            <span className="label green">
                              <BsToggleOn />
                            </span>
                          ) : (
                            <span className="label grey">
                              <BsToggleOff />
                            </span>
                          )}
                        </span>
                        {plansData[item].displayName}
                        <span className="ml-2 ">
                          <OverlayTrigger
                            trigger={['hover', 'focus']}
                            overlay={
                              <Tooltip>
                                {plansData[item].isLockedBySystem
                                  ? intl.formatMessage({
                                      id: 'Locked-by-system',
                                    })
                                  : intl.formatMessage({
                                      id: 'Not-locked-by-system',
                                    })}
                              </Tooltip>
                            }
                          >
                            <span
                              className={`${
                                plansData[item].isLockedBySystem
                                  ? 'lock-active'
                                  : 'lock-passive'
                              }`}
                            >
                              {plansData[item].isLockedBySystem ? (
                                <BsFillLockFill />
                              ) : (
                                <BsFillUnlockFill />
                              )}
                              <span className="ml-1">
                                {plansData[item].isLockedBySystem}
                              </span>
                            </span>
                          </OverlayTrigger>
                        </span>
                      </th>
                    </>
                  ))}
                </tr>
              </thead>
              <tbody>
                <TableRow />
              </tbody>
            </Table>
            <DeleteConfirmation
              message={
                <FormattedMessage id="delete-plan-price-confirmation-message" />
              }
              icon="pi pi-exclamation-triangle"
              confirm={confirm}
              setConfirm={setConfirm}
              confirmFunction={handleDeletePlanPrice}
              sideBar={false}
            />
          </Card.Body>
        </Card>
      </div>

      <ThemeDialog visible={visible} setVisible={setVisible}>
        {show ? (
          <ShowDetails
            popupLabel={<FormattedMessage id={popUpLable} />}
            data={handleData(listData[currentId])}
            setVisible={setVisible}
          />
        ) : (
          <PlanPriceForm
            popupLabel={<FormattedMessage id={popUpLable} />}
            type={type}
            planPriceData={type == 'edit' ? listData[currentId] : {}}
            setVisible={setVisible}
            plan={currentPlanId}
            cycleValue={currentCycle}
          />
        )}
      </ThemeDialog>
    </Wrapper>
  )
}
