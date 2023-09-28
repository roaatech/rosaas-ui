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
import { FormattedMessage, useIntl } from 'react-intl'
import ThemeDialog from '../../Shared/ThemeDialog/ThemeDialog'
import DeleteConfirmation from '../../global/DeleteConfirmation/DeleteConfirmation'
import { BsToggleOff, BsToggleOn } from 'react-icons/bs'

import {
  PlansChangeAttr,
  deleteFeaturePlan,
  setAllFeaturePlan,
  setAllPlans,
} from '../../../../store/slices/products'
import FeaturePlanForm from './FeaturePlanForm/FeaturePlanForm'
import { Wrapper } from './ProductFeaturePlan.styled'
import { featureResetMap, featureUnitMap } from '../../../../const'
import { DataTransform } from '../../../../lib/sharedFun/Time'
import ShowDetails from '../../Shared/ShowDetails/ShowDetails'
import { toast } from 'react-toastify'

export default function ProductFeaturePlan({ children }) {
  const [currentPlanId, setCurrentPlanId] = useState('')
  const [currentFeatureId, setCurrentFeatureId] = useState('')
  let direction = useSelector((state) => state.main.direction)

  const dispatch = useDispatch()
  const {
    getFeaturePlanList,
    deleteFeaturePlanReq,
    publishPlan,
    getProductPlans,
  } = useRequest()
  const [visible, setVisible] = useState(false)
  const [confirm, setConfirm] = useState(false)
  const [currentId, setCurrentId] = useState('')
  const routeParams = useParams()
  const [type, setType] = useState('')
  const [show, setShow] = useState(false)
  const [popUpLable, setPopUpLable] = useState('')

  const productId = routeParams.id
  const listDataStore = useSelector(
    (state) => state.products.products[productId]?.featurePlan
  )
  const planList = useSelector(
    (state) => state.products.products[productId]?.plans
  )
  // delete default key from list
  const listData = { ...listDataStore }
  const intl = useIntl()
  // const defaultData = {}
  listData['00000000-0000-0000-0000-000000000000'] &&
    delete listData['00000000-0000-0000-0000-000000000000']
  let list = listData && Object.values(listData)
  console.log({ list })

  const handleDeleteFeaturePlan = async () => {
    try {
      if (listData[currentId]?.plan?.isSubscribed) {
        toast.error(
          intl.formatMessage({
            id: 'Cannot-delete-a-subscribed-feature-plan.',
          }),
          {
            position: toast.POSITION.TOP_CENTER,
          }
        )
        return
      }

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
    if (listData[id]?.plan?.isSubscribed) {
      toast.error(
        intl.formatMessage({ id: 'Cannot-edit-a-subscribed-feature-plan.' }),
        {
          position: toast.POSITION.TOP_CENTER,
        }
      )
      return
    }

    setShow(false)
    setPopUpLable('Edit-Feature-Plan')
    setType('edit')
    setCurrentId(id)
    setVisible(true)
  }

  const descriptionPop = async (id) => {
    setShow(true)
    setType('edit')
    setCurrentId(id)
    setVisible(true)
    setPopUpLable('View-Details')
  }

  const handleData = (data) => {
    return {
      Feature: data.feature.name,
      Plan: data.plan.name,
      Limit: data.limit,
      // Reset: data.feature.reset,
      Unit: data.unit,
      Description: data.description,
      'Created-Date': DataTransform(data.createdDate),
      'Edited-Date': DataTransform(data.editedDate),
    }
  }
  useEffect(() => {
    ;(async () => {
      if (!list || list.length == 0) {
        const FeaturePlanData = await getFeaturePlanList(productId)
        dispatch(
          setAllFeaturePlan({
            productId: productId,
            data: FeaturePlanData.data.data,
          })
        )
      }
      if (!planList || planList.length == 0) {
        const AllPlanData = await getProductPlans(productId)
        dispatch(
          setAllPlans({
            productId: productId,
            data: AllPlanData.data.data,
          })
        )
      }
    })()
  }, [])

  const featuresObj = {}
  const tableData = {}

  const generateTableData = list?.map((item) => {
    if (!featuresObj[item.feature.id]) {
      featuresObj[item.feature.id] = {
        featureId: item.feature.id,
        name: item.feature.name,
        type: item.feature.type,
        reset: item.feature.reset,
        index: Object.keys(featuresObj).length,
      }
      console.log({ reset: item.feature.reset })
    }
    tableData[item.plan.id + ',' + item.feature.id] = item.id
  })

  const TableRow = () => {
    return (
      <>
        {featuresObj &&
          Object.values(featuresObj).length != 0 &&
          Object.values(featuresObj).map((item) => (
            <tr key={item.featureId}>
              <td>
                <span className="fw-bolder">{item.name}</span>
              </td>

              {planList &&
                Object.keys(planList).length !== 0 &&
                Object.keys(planList).map((planId, planIndex) => (
                  <td key={planIndex}>
                    <span className="fw-normal">
                      {tableData[planId + ',' + item.featureId] ? (
                        <Dropdown as={ButtonGroup}>
                          <Dropdown.Toggle
                            as={Button}
                            split
                            variant="link"
                            className="text-dark m-0 p-0 planFeatureButton"
                          >
                            {listData[tableData[planId + ',' + item.featureId]]
                              .limit ? (
                              listData[tableData[planId + ',' + item.featureId]]
                                .limit +
                              ' ' +
                              featureUnitMap[
                                listData[
                                  tableData[planId + ',' + item.featureId]
                                ].unit
                              ] +
                              ' / ' +
                              (
                                <FormattedMessage
                                  id={featureResetMap[item.reset]}
                                />
                              )
                            ) : (
                              <FormattedMessage id="Yes" />
                            )}
                          </Dropdown.Toggle>
                          <Dropdown.Menu>
                            <Dropdown.Item
                              onSelect={() =>
                                descriptionPop(
                                  tableData[planId + ',' + item.featureId]
                                )
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
                                editForm(
                                  tableData[planId + ',' + item.featureId]
                                )
                              }
                            >
                              <FontAwesomeIcon icon={faEdit} className="mx-2" />
                              <FormattedMessage id="Edit" />
                            </Dropdown.Item>
                            <Dropdown.Item
                              onClick={() =>
                                deleteConfirm(
                                  tableData[planId + ',' + item.featureId]
                                )
                              }
                              className="text-danger"
                            >
                              <FontAwesomeIcon
                                icon={faTrashAlt}
                                className="mx-2"
                              />
                              <FormattedMessage id="Delete" />
                            </Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown>
                      ) : item.type == 2 ? (
                        <span
                          className="clickable-text"
                          onClick={() =>
                            handleCreateFeaturePlan(item.featureId, planId)
                          }
                        >
                          <FormattedMessage id="No" />
                        </span>
                      ) : (
                        <span
                          className="clickable-text"
                          onClick={() =>
                            handleCreateFeaturePlan(item.featureId, planId)
                          }
                        >
                          ــــ
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

  const handleCreateFeaturePlan = (featureId, planId) => {
    console.log('listData:', listData)

    const matchingPlan = Object.values(listData).find(
      (item) => item.plan.id === planId
    )

    if (matchingPlan && matchingPlan.plan.isSubscribed) {
      toast.error(
        intl.formatMessage({
          id: "Cannot-create-a-Plan's-Feature-while-it-is-subscribed.",
        }),
        {
          position: toast.POSITION.TOP_CENTER,
        }
      )
      return
    }
    setCurrentPlanId(planId)
    setCurrentFeatureId(featureId)
    setVisible(true)
    setPopUpLable('Add-Plan-Feature')
    setType('create')
    setShow(false)
  }

  return (
    <Wrapper direction={direction}>
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
                  {planList &&
                    Object.keys(planList)?.map((item, index) => (
                      <th
                        className="border-bottom clickable-icon"
                        key={index}
                        onClick={() =>
                          togglePublishPlan(item, planList[item].isPublished)
                        }
                      >
                        {planList[item].isPublished ? (
                          <span className="label green">
                            <BsToggleOn />
                          </span>
                        ) : (
                          <span className="label grey">
                            <BsToggleOff />
                          </span>
                        )}
                        {planList[item].name}
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
        {show ? (
          <ShowDetails
            popupLabel={<FormattedMessage id={popUpLable} />}
            data={handleData(listData[currentId])}
            setVisible={setVisible}
          />
        ) : (
          <FeaturePlanForm
            popupLabel={<FormattedMessage id={popUpLable} />}
            type={type}
            FeaturePlanData={type == 'edit' ? listData[currentId] : {}}
            setVisible={setVisible}
            plan={currentPlanId}
            feature={currentFeatureId}
          />
        )}
      </ThemeDialog>
    </Wrapper>
  )
}
