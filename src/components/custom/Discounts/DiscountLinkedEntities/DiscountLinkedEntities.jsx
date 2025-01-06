import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { setAllPlansLookup } from '../../../../store/slices/products/productsSlice'
import useRequest from '../../../../axios/apis/useRequest'
import {
  deleteDiscountLinkedByEntityId,
  setDiscountAllocation,
} from '../../../../store/slices/discountsSlice'
import { use } from 'react'
import { discountTypes, entityTypes } from '../../../../const/const'
import { Wrapper } from './DiscountLinkedEntities.styled'
import {
  Button,
  ButtonGroup,
  Card,
  Dropdown,
  Table,
} from '@themesberg/react-bootstrap'
import { Tab } from 'bootstrap'
import { getKeyByValueWithFormattedMessage } from '../../Shared/SharedFunctions/SharedFunctions'
import SafeFormatMessage from '../../Shared/SafeFormatMessage/SafeFormatMessage'
import { BsFillTrash3Fill } from 'react-icons/bs'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEllipsisH } from '@fortawesome/free-solid-svg-icons'
import DeleteConfirmation from '../../global/DeleteConfirmation/DeleteConfirmation'

const DiscountLinkedEntities = () => {
  const dispatch = useDispatch()
  const {
    getPlanFilteredList,
    discountEntityLinks,
    deleteDiscountLinkedEntityId,
  } = useRequest()
  const currentId = useParams().id
  const discountsData = useSelector((state) => state?.discountsSlice?.discounts)
  const [entityType, setEntityType] = useState(null)
  const [currentAllocationId, setCurrentAllocationId] = useState(null)
  console.log({ currentAllocationId })

  const [confirm, setConfirm] = useState(false)

  const currentDiscount = discountsData[currentId]
  const productsLookup = useSelector(
    (state) => state.products?.lookup?.productsLookup
  )
  const plansLookup = useSelector(
    (state) => state?.products.lookup?.plansLookup
  )
  const productOwnersLookup = useSelector(
    (state) => state.productsOwners.lookup
  )
  const DiscountAllocation = useSelector(
    (state) => state.discountsSlice.discounts[currentId]?.allocations
  )
  console.log({ DiscountAllocation })

  useEffect(() => {
    if (
      !currentDiscount ||
      (currentDiscount && Object.keys(currentDiscount).length === 0)
    ) {
      return
    }
    if (currentDiscount?.discountType == discountTypes.assignedToPlans) {
      setEntityType(entityTypes.Plan)
    } else if (
      currentDiscount?.discountType == discountTypes.assignedToProducts
    ) {
      setEntityType(entityTypes.Product)
    } else if (
      currentDiscount?.discountType == discountTypes.assignedToProductOwners
    ) {
      setEntityType(entityTypes.ProductOwner)
    }
  }, [currentDiscount, currentDiscount && Object.keys(currentDiscount).length])

  const currentEntityArray = (() => {
    switch (entityType) {
      case entityTypes.Plan:
        return plansLookup ? Object.values(plansLookup) : []
      case entityTypes.Product:
        return productsLookup ? Object.values(productsLookup) : []
      case entityTypes.ProductOwner:
        return productOwnersLookup ? Object.values(productOwnersLookup) : []
      default:
        return []
    }
  })()

  useEffect(() => {
    if (
      plansLookup &&
      Object.keys(plansLookup).length > 0 &&
      entityType == entityTypes.Plan
    ) {
      return
    }

    const sendRequest = () => {
      ;(async () => {
        const listData = await getPlanFilteredList()

        dispatch(
          setAllPlansLookup(
            listData.data.data && Object.values(listData.data.data)
          )
        )
      })()
    }
    sendRequest()
  }, [plansLookup && Object.keys(plansLookup).length > 0, entityType])

  useEffect(() => {
    if (
      (DiscountAllocation && Object.keys(DiscountAllocation).length > 0) ||
      !currentId ||
      !entityType
    ) {
      return
    }
    const sendRequest = () => {
      ;(async () => {
        const listData = await discountEntityLinks(currentId, entityType)
        console.log({ listData })

        dispatch(
          setDiscountAllocation({
            id: currentId,
            data: listData.data.data,
          })
        )
      })()
    }
    sendRequest()
  }, [
    DiscountAllocation && Object.keys(DiscountAllocation).length,
    currentId,
    entityType,
  ])

  const deleteDiscountLinkedEntityFun = async () => {
    console.log({ currentAllocationId, currentId, sss: 'sss' })

    const deleteDiscount = await deleteDiscountLinkedEntityId(
      currentId,
      currentAllocationId
    )
    dispatch(
      deleteDiscountLinkedByEntityId({
        id: currentId,
        data: currentAllocationId,
      })
    )
    setConfirm(false)
  }

  return (
    <Wrapper>
      <Card border="light" className="shadow-sm border-0">
        <Card.Body className="p-0">
          <Table hover className="user-table align-items-center">
            <thead>
              <th>
                {getKeyByValueWithFormattedMessage(entityTypes, entityType)}
              </th>
              <th>
                <SafeFormatMessage id="Actions" />
              </th>
            </thead>
            <tbody>
              {DiscountAllocation &&
                Object.values(DiscountAllocation).map((entityId, index) => (
                  <tr key={index}>
                    <td>
                      {currentEntityArray &&
                        currentEntityArray.find((item) => item.id == entityId)
                          ?.systemName}
                    </td>
                    <td>
                      <Dropdown as={ButtonGroup}>
                        <Dropdown.Toggle
                          as={Button}
                          split
                          variant="link"
                          className="text-dark m-0"
                        >
                          <span className="icon icon-sm">
                            <span className="icon icon-sm">
                              <FontAwesomeIcon
                                icon={faEllipsisH}
                                className="icon-dark"
                              />
                            </span>{' '}
                          </span>
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                          <Dropdown.Item
                            onClick={() => {
                              setCurrentAllocationId(entityId)
                              setConfirm(true)
                            }}
                          >
                            <BsFillTrash3Fill className="mx-2 text-danger" />
                            <SafeFormatMessage id="Delete" />
                          </Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                    </td>
                  </tr>
                ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
      <DeleteConfirmation
        message={<SafeFormatMessage id="delete-confirmation-message" />}
        icon="pi pi-exclamation-triangle"
        confirm={confirm}
        setConfirm={setConfirm}
        confirmFunction={deleteDiscountLinkedEntityFun}
        sideBar={false}
      />
    </Wrapper>
  )
}

export default DiscountLinkedEntities
