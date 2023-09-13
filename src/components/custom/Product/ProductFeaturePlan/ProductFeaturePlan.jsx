import React, { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faEdit,
  faEllipsisH,
  faTrashAlt,
  faNewspaper,
  faCheckCircle,
  faTimesCircle,
  faCheck,
  faTimes,
} from '@fortawesome/free-solid-svg-icons'
import {
  Card,
  Button,
  ButtonGroup,
  Dropdown,
  Table,
} from '@themesberg/react-bootstrap'

import {
  MdOutlineUnpublished,
  MdOutlinePublishedWithChanges,
} from 'react-icons/md'

import { useDispatch, useSelector } from 'react-redux'
import useRequest from '../../../../axios/apis/useRequest'
import { useParams } from 'react-router-dom'
import { FormattedMessage } from 'react-intl'
import TableDate from '../../Shared/TableDate/TableDate'
import ThemeDialog from '../../Shared/ThemeDialog/ThemeDialog'
import DeleteConfirmation from '../../global/DeleteConfirmation/DeleteConfirmation'
import { BsCardHeading, BsToggleOff, BsToggleOn } from 'react-icons/bs'

import {
  PlanInfo,
  PlansChangeAttr,
  deleteFeaturePlan,
  featurePlanInfo,
  setAllFeaturePlan,
  setAllPlans,
} from '../../../../store/slices/products'
import FeaturePlanForm from './FeaturePlanForm/FeaturePlanForm'
import DescriptionCell from '../../Shared/DescriptionCell/DescriptionCell'
import { Wrapper } from './ProductFeaturePlan.styled'
import InfoPopUp from '../../Shared/InfoPopUp/InfoPopUp'
import { cycle, featureResetMap, featureUnitMap } from '../../../../const'

export default function ProductFeaturePlan({ children }) {
  const [currentPlanId, setCurrentPlanId] = useState('')
  const [currentFeatureId, setCurrentFeatureId] = useState('')
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
  console.log({ listDataStore })
  // delete default key from list
  const listData = { ...listDataStore }

  // const defaultData = {}
  listData['00000000-0000-0000-0000-000000000000'] &&
    delete listData['00000000-0000-0000-0000-000000000000']
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
    setShow(true)
    setType('edit')
    setCurrentId(id)
    setVisible(true)
    setPopUpLable('View-Details')
  }

  useEffect(() => {
    ;(async () => {
      console.log({ list })
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
                              featureResetMap[item.reset]
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
                                className="me-2"
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
                              <FontAwesomeIcon icon={faEdit} className="me-2" />
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
                                className="me-2"
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
                          No
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
    setCurrentPlanId(planId)
    setCurrentFeatureId(featureId)
    setVisible(true)
    setPopUpLable('Add-Feature-Plan')
    setType('create')
    setShow(false)
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
        <FeaturePlanForm
          popupLabel={<FormattedMessage id={popUpLable} />}
          type={type}
          FeaturePlanData={type == 'edit' ? listData[currentId] : {}}
          setVisible={setVisible}
          show={show}
          setShow={setShow}
          plan={currentPlanId}
          feature={currentFeatureId}
        />
      </ThemeDialog>
    </Wrapper>
  )
}
