import React, { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faEdit,
  faEllipsisH,
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
import TableDate from '../../Shared/TableDate/TableDate'
import ThemeDialog from '../../Shared/ThemeDialog/ThemeDialog'
import DeleteConfirmation from '../../global/DeleteConfirmation/DeleteConfirmation'
import { BsCardHeading } from 'react-icons/bs'

import {
  deleteFeaturePlan,
  setAllFeaturePlan,
} from '../../../../store/slices/products'
import FeaturePlanForm from './FeaturePlanForm/FeaturePlanForm'
import DescriptionCell from '../../Shared/DescriptionCell/DescriptionCell'
import { Wrapper } from './ProductFeaturePlan.styled'
import InfoPopUp from '../../Shared/InfoPopUp/InfoPopUp'
import { featureUnitMap } from '../../../../const'

export default function ProductFeaturePlan({ children }) {
  const [currentPlanId, setCurrentPlanId] = useState('')
  const [currentFeatureId, setCurrentFeatureId] = useState('')
  const dispatch = useDispatch()
  const { getFeaturePlanList, deleteFeaturePlanReq } = useRequest()
  const [visible, setVisible] = useState(false)
  const [InfoVisible, setInfoVisible] = useState(false)
  const [confirm, setConfirm] = useState(false)
  const [currentId, setCurrentId] = useState('')
  const routeParams = useParams()
  const [type, setType] = useState('')
  const [show, setShow] = useState(false)
  const [popUpLable, setPopUpLable] = useState('')

  const productId = routeParams.id
  const listData = useSelector(
    (state) => state.products.products[productId]?.featurePlan
  )
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
    setPopUpLable('Edit-Feature-Plan')
    setType('edit')
    setCurrentId(id)
    setVisible(true)
  }

  const descriptionPop = async (id) => {
    setShow(true)
    editForm(id)
    setPopUpLable('View-Details')
  }

  useEffect(() => {
    ;(async () => {
      if (!list) {
        const FeaturePlanData = await getFeaturePlanList(productId)
        dispatch(
          setAllFeaturePlan({
            productId: productId,
            data: FeaturePlanData.data.data,
          })
        )
      }
    })()
  }, [])

  const plansObj = {}
  const featuresObj = {}
  const tableData = {}
  const generateTableData = list?.map((item) => {
    if (!plansObj[item.plan.id]) {
      plansObj[item.plan.id] = {
        planId: item.plan.id,
        name: item.plan.name,
        index: Object.keys(plansObj).length,
      }
    }
    if (!featuresObj[item.feature.id]) {
      featuresObj[item.feature.id] = {
        featureId: item.feature.id,
        name: item.feature.name,
        type: item.feature.type,
        index: Object.keys(featuresObj).length,
      }
    }
    tableData[
      plansObj[item.plan.id].index + ',' + featuresObj[item.feature.id].index
    ] = item.id
  })

  const TableRow = () => {
    return (
      <>
        {Object.values(featuresObj).map((item, featureIndex) => (
          <tr>
            <td>
              <span className="fw-normal">{item.name}</span>
            </td>

            {Object.keys(plansObj).map((planItem, planIndex) => (
              <td>
                <span className="fw-normal">
                  {tableData[planIndex + ',' + featureIndex] ? (
                    <Dropdown as={ButtonGroup}>
                      <Dropdown.Toggle
                        as={Button}
                        split
                        variant="link"
                        className="text-dark m-0 p-0"
                      >
                        {/* <span className="icon icon-sm">
                        <FontAwesomeIcon icon={faEllipsisH} className="icon-dark" />
                      </span> */}
                        {listData[tableData[planIndex + ',' + featureIndex]]
                          .limit ? (
                          listData[tableData[planIndex + ',' + featureIndex]]
                            .limit +
                          ' ' +
                          featureUnitMap[
                            listData[tableData[planIndex + ',' + featureIndex]]
                              .unit
                          ]
                        ) : (
                          <FormattedMessage id="Yes" />
                        )}
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                        <Dropdown.Item
                          onSelect={() =>
                            descriptionPop(
                              tableData[planIndex + ',' + featureIndex]
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
                            editForm(tableData[planIndex + ',' + featureIndex])
                          }
                        >
                          <FontAwesomeIcon icon={faEdit} className="me-2" />
                          <FormattedMessage id="Edit" />
                        </Dropdown.Item>
                        <Dropdown.Item
                          onClick={() =>
                            deleteConfirm(
                              tableData[planIndex + ',' + featureIndex]
                            )
                          }
                          className="text-danger"
                        >
                          <FontAwesomeIcon icon={faTrashAlt} className="me-2" />
                          <FormattedMessage id="Delete" />
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  ) : item.type == 2 ? (
                    <span
                      className="clickable-text"
                      onClick={() =>
                        handleCreateFeaturePlan(
                          item.featureId,
                          plansObj[planItem].planId,
                          item.name,
                          plansObj[planItem].name
                        )
                      }
                    >
                      No
                    </span>
                  ) : (
                    <span
                      className="clickable-text"
                      onClick={() =>
                        handleCreateFeaturePlan(
                          item.featureId,
                          plansObj[planItem].planId,
                          item.name,
                          plansObj[planItem].name
                        )
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

  const handleCreateFeaturePlan = (
    featureId,
    planId,
    featureName,
    planName
  ) => {
    setCurrentPlanId(planId)
    setCurrentFeatureId(featureId)
    setVisible(true)
    setPopUpLable('Add-Feature-Plan')
    setType('create')
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
                  {Object.values(plansObj).map((item, index) => (
                    <th className="border-bottom" key={index}>
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
      {/* <ThemeDialog visible={InfoVisible} setVisible={setInfoVisible}>
        <InfoPopUp
          setVisible={setInfoVisible}
          popupLabel={<FormattedMessage id={'Description'} />}
          info={
            listData
              ? [currentId]
                ? listData[currentId]?.description
                : ''
              : ''
          }
          // info={listData[currentId] ? listData[currentId].description : ''}
        />
      </ThemeDialog> */}
    </Wrapper>
  )
}
