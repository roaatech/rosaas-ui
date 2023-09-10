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
  deleteFeaturePlan,
  setAllFeaturePlan,
  setAllPlans,
  setAllPlansPrice,
} from '../../../../store/slices/products'
import PlanPriceForm from './PlanPriceForm/PlanPriceForm'
import { Wrapper } from './ProductPlansPriceList.styled'
import { cycle, featureUnitMap } from '../../../../const'

export default function ProductPlansPriceList({ children }) {
  const dispatch = useDispatch()
  const { getProductPlans, getProductPlanPriceList, deleteFeaturePlanReq } =
    useRequest()
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
    setShow(false)
    setPopUpLable('Edit-Feature-Plan')
    setType('edit')
    setCurrentId(id)
    setVisible(true)
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
        const FeaturePlanData = await getProductPlans(productId)
        dispatch(
          setAllPlans({
            productId: productId,
            data: FeaturePlanData.data.data,
          })
        )
      }

      if (!list || list.length == 0) {
        const FeaturePlanData = await getProductPlanPriceList(productId)
        dispatch(
          setAllPlansPrice({
            productId: productId,
            data: FeaturePlanData.data.data,
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

  const handleCreateFeaturePlan = (featureId, planId) => {
    setCurrentPlanId(planId)
    setCurrentCycle(featureId)
    setVisible(true)
    setPopUpLable('Add-Feature-Plan')
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
            {console.log(plansData, '000000')}
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
                        {listData[tableData[planItem + ',' + item]]?.price}
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
                    //  className="clickable-text"
                    //   onClick={() =>
                    //     handleCreateFeaturePlan(
                    //       item.featureId,
                    //       plansObj[planItem].planId
                    //     )
                    //   }
                    >
                      No
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
