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
} from '@themesberg/react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import useRequest from '../../../../axios/apis/useRequest'
import { useParams } from 'react-router-dom'
import { FormattedMessage } from 'react-intl'
import ThemeDialog from '../../Shared/ThemeDialog/ThemeDialog'
import DeleteConfirmation from '../../global/DeleteConfirmation/DeleteConfirmation'

import {
  PlansPricePublished,
  deletePlanPrice,
  setAllPlans,
  setAllPlansPrice,
} from '../../../../store/slices/products'
import PlanPriceForm from './PlanPriceForm/PlanPriceForm'
import { Wrapper } from './ProductPlansPriceList.styled'
import { cycle } from '../../../../const'

import {
  MdOutlineUnpublished,
  MdOutlinePublishedWithChanges,
} from 'react-icons/md'
import { toast } from 'react-toastify'
import { useIntl } from 'react-intl'

export default function ProductPlansPriceList({ children }) {
  const intl = useIntl()
  const dispatch = useDispatch()
  const {
    getProductPlans,
    getProductPlanPriceList,
    deletePlanPriceReq,
    PlansPricePublishedReq,
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
    dispatch(PlansPricePublished({ productId, planPriceId: id, status }))
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

  console.log({ list })
  list?.map((item) => {
    tableData[item.plan?.id + ',' + item.cycle] = item.id
  })

  const handleCreatePlanPrice = (plan, cycle) => {
    setCurrentPlanId(plan)
    setCurrentCycle(cycle)
    setVisible(true)
    setPopUpLable('Add-Plan-Price')
    setType('create')
  }

  const TableRow = () => {
    return (
      <>
        {Object.keys(cycle).map((item, cycleIndex) => (
          <tr key={cycleIndex}>
            <td>
              <span className="fw-bolder">{cycle[item]}</span>
            </td>
            {Object.keys(plansData).map((planItem, planIndex) => (
              <td key={planIndex}>
                <span className="fw-normal">
                  {console.log()}
                  {tableData[planItem + ',' + item] ? (
                    <Dropdown as={ButtonGroup}>
                      <Dropdown.Toggle
                        as={Button}
                        split
                        variant="link"
                        className="text-dark m-0 p-0 planFeatureButton"
                      >
                        {listData[tableData[planItem + ',' + item]]?.price}{' '}
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
                            className="me-2"
                          />

                          <FormattedMessage id="View-Details" />
                        </Dropdown.Item>

                        <Dropdown.Item
                          onSelect={() =>
                            editForm(tableData[planItem + ',' + item])
                          }
                        >
                          <FontAwesomeIcon icon={faEdit} className="me-2" />
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
                              <FormattedMessage id="unPublished" />
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
                          <FontAwesomeIcon icon={faTrashAlt} className="me-2" />
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
      <div>
        <Card
          border="light"
          className="table-wrapper table-responsive shadow-sm"
        >
          <Card.Body className="pt-0">
            <Table hover className="user-table align-items-center">
              <thead>
                <tr>
                  <th className="border-bottom"></th>
                  {Object.values(plansData).map((item, index) => (
                    <th key={index} className="border-bottom">
                      {item.name}
                    </th>
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
        <PlanPriceForm
          popupLabel={<FormattedMessage id={popUpLable} />}
          type={type}
          planPriceData={type == 'edit' ? listData[currentId] : {}}
          setVisible={setVisible}
          show={show}
          setShow={setShow}
          plan={currentPlanId}
          cycleValue={currentCycle}
        />
      </ThemeDialog>
    </Wrapper>
  )
}
