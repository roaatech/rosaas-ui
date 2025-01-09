import React, { useEffect, useState } from 'react'
import useRequest from '../../../../axios/apis/useRequest'
import { useDispatch, useSelector } from 'react-redux'
import {
  deleteDiscountRequirementInfo,
  setAllRequirementsOptions,
  setDiscountRequirement,
} from '../../../../store/slices/discountsSlice'
import { useParams } from 'react-router-dom'
import {
  Button,
  ButtonGroup,
  Card,
  Dropdown,
  Table,
} from '@themesberg/react-bootstrap'
import SafeFormatMessage from '../../Shared/SafeFormatMessage/SafeFormatMessage'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faEdit,
  faEllipsisH,
  faEye,
  faTrashAlt,
} from '@fortawesome/free-solid-svg-icons'
import DataLabelWhite from '../../Shared/DateLabelWhite/DateLabelWhite'
import { getKeyByValueWithFormattedMessage } from '../../Shared/SharedFunctions/SharedFunctions'
import { countryIsoCodes } from '../../../../const/const'
import { Wrapper } from './DiscountRequirements.styled'
import DiscountRequirementsForm from '../DiscountRequirementsForm/DiscountRequirementsForm'
import ThemeDialog from '../../Shared/ThemeDialog/ThemeDialog'
import DeleteConfirmation from '../../global/DeleteConfirmation/DeleteConfirmation'

const DiscountRequirements = () => {
  const dispatch = useDispatch()
  const currentDiscountId = useParams().id
  const {
    getDiscountsRequirementsOptions,
    getDiscountRequirementByDiscountId,
    deleteDiscountRequirementGeoLocation,
  } = useRequest()
  const discountsRequirements = useSelector(
    (state) => state.discountsSlice?.discounts
  )
  const currentDiscountsRequirements =
    discountsRequirements?.[currentDiscountId]?.requirement

  console.log({ currentDiscountsRequirements })
  const [popUpLable, setPopUpLable] = useState('')
  const [type, setType] = useState('')
  const [visible, setVisible] = useState(false)
  const [currentId, setCurrentId] = useState('')
  const [requirementType, setRequirementType] = useState('')
  const [confirm, setConfirm] = useState(false)

  useEffect(() => {
    const sendRequest = () => {
      ;(async () => {
        const listData = await getDiscountsRequirementsOptions()
        dispatch(setAllRequirementsOptions(listData.data.data))
      })()
    }
    sendRequest()
  }, [])
  useEffect(() => {
    const sendRequest = () => {
      ;(async () => {
        const listData =
          await getDiscountRequirementByDiscountId(currentDiscountId)
        console.log({ listData })
        dispatch(
          setDiscountRequirement({
            id: currentDiscountId,
            data: listData.data.data,
          })
        )
      })()
    }
    sendRequest()
  }, [currentDiscountId])
  const editForm = async (id, type) => {
    console.log({ id })
    setPopUpLable('Edit-Specification')
    setType('edit')
    setCurrentId(id)
    setVisible(true)
    setRequirementType(type)
  }
  const deleteConfirm = (id) => {
    setCurrentId(id)
    setConfirm(true)
  }
  const handleDeleteRequirement = async () => {
    await deleteDiscountRequirementGeoLocation(currentDiscountId, currentId)
    dispatch(
      deleteDiscountRequirementInfo({
        discountId: currentDiscountId,
        id: currentId,
      })
    )
  }
  return (
    <Wrapper>
      <Card border="light" className="shadow-sm border-0">
        <Card.Body className="p-0">
          <Table hover className="user-table align-items-center">
            <thead>
              <th>
                <SafeFormatMessage id="Sequence-Number" />
              </th>

              <th>
                <SafeFormatMessage id="Requirement-Rule" />
              </th>
              <th>
                <SafeFormatMessage id="Requirement-Details" />
              </th>
              <th>
                <SafeFormatMessage id="Actions" />
              </th>
            </thead>
            <tbody>
              {currentDiscountsRequirements &&
                Object.values(currentDiscountsRequirements).map(
                  (requirement, index) => (
                    <tr key={index}>
                      <td>{requirement.sequenceNumber}</td>
                      <td>{requirement.systemName}</td>
                      <td>
                        {requirement.countriesIsoCodes.map((country) => (
                          <DataLabelWhite
                            text={getKeyByValueWithFormattedMessage(
                              countryIsoCodes,
                              country
                            )}
                            variant={'gray'}
                            className="mx-1"
                          />
                        ))}
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
                              <FontAwesomeIcon
                                icon={faEllipsisH}
                                className="icon-dark"
                              />
                            </span>
                          </Dropdown.Toggle>
                          <Dropdown.Menu>
                            <Dropdown.Item>
                              <FontAwesomeIcon icon={faEye} className="mx-2" />
                              <SafeFormatMessage id="View-Details" />
                            </Dropdown.Item>
                            <Dropdown.Item
                              onClick={() => deleteConfirm(requirement?.id)}
                              className="text-danger"
                            >
                              <FontAwesomeIcon
                                icon={faTrashAlt}
                                className="mx-2"
                              />
                              <SafeFormatMessage id="Delete" />
                            </Dropdown.Item>
                            <Dropdown.Item
                              onSelect={() => {
                                editForm(
                                  requirement?.id,
                                  requirement?.systemName
                                )
                              }}
                            >
                              <FontAwesomeIcon icon={faEdit} className="mx-2" />
                              <SafeFormatMessage id="Edit" />
                            </Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown>
                      </td>
                    </tr>
                  )
                )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
      <ThemeDialog visible={visible} setVisible={setVisible} size="lg">
        <>
          <DiscountRequirementsForm
            popupLabel={<SafeFormatMessage id={popUpLable} />}
            type={type}
            visible={visible}
            setVisible={setVisible}
            discountData={currentDiscountsRequirements?.[currentId]}
            currentId={currentId}
            requirementType={requirementType}
          />
        </>
      </ThemeDialog>
      <DeleteConfirmation
        message={<SafeFormatMessage id="delete-confirmation-message" />}
        icon="pi pi-exclamation-triangle"
        confirm={confirm}
        setConfirm={setConfirm}
        confirmFunction={handleDeleteRequirement}
        sideBar={false}
      />
    </Wrapper>
  )
}

export default DiscountRequirements
