import React, { useEffect, useState } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { FormattedMessage } from 'react-intl'
import { Wrapper } from './DiscountAllocationForm.styled'
import { Button, Col, Container, Modal, Row } from '@themesberg/react-bootstrap'
import useRequest from '../../../../axios/apis/useRequest'
import { useDispatch, useSelector } from 'react-redux'
import {
  setAllDiscounts,
  discountInfo,
  setDiscountAllocation,
} from '../../../../store/slices/discountsSlice'
import SafeFormatMessage from '../../Shared/SafeFormatMessage/SafeFormatMessage'
import { MultiSelect } from 'primereact/multiselect'
import { setAllPlansLookup } from '../../../../store/slices/products/productsSlice'
import { discountTypes, entityTypes } from '../../../../const/const'

const DiscountAllocationForm = ({
  setVisible, // Function to toggle modal visibility
  popupLabel, // Title of the modal
  onUpdate, // Callback after form submission
  currentId,
}) => {
  const dispatch = useDispatch()
  const { getPlanFilteredList, linkEntitiesbyDiscountId } = useRequest()
  const discountsData = useSelector((state) => state?.discountsSlice?.discounts)

  const productsLookup = useSelector(
    (state) => state.products?.lookup?.productsLookup
  )
  const currentDiscount = discountsData[currentId]
  console.log({ currentDiscountxxxxx: currentDiscount?.allocations })

  const productOwnersLookup = useSelector(
    (state) => state.productsOwners.lookup
  )
  const plansLookup = useSelector(
    (state) => state?.products.lookup?.plansLookup
  )
  useEffect(() => {
    if (plansLookup && Object.keys(plansLookup).length > 0) {
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
  }, [Object.keys(plansLookup).length > 0])

  const initialValues = {
    entityIds: currentDiscount?.allocations || [],
  }
  const validationSchema = Yup.object().shape({
    entityIds: Yup.array().required(
      <SafeFormatMessage id="the-field-is-required" />
    ),
  })

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      const payload = {
        ...values,
        entityType:
          currentDiscount.discountType == discountTypes.assignedToPlans
            ? entityTypes.Plan
            : currentDiscount.discountType == discountTypes.assignedToProducts
              ? entityTypes.Product
              : currentDiscount.discountType ==
                  discountTypes.assignedToProductOwners
                ? entityTypes.ProductOwner
                : null,
      }

      try {
        const response = await linkEntitiesbyDiscountId(currentId, payload)
        dispatch(
          setDiscountAllocation({
            id: currentId,
            data: payload.entityIds,
          })
        )
        setSubmitting(false)
        setVisible(false)
        onUpdate && onUpdate()
      } catch (error) {
        console.error('Error submitting form:', error)
      }
    },
  })
  console.log({ values: formik.values })

  const entityIdsOptions = [
    { id: 1, array: Object.values(plansLookup) },
    { id: 2, array: Object.values(productsLookup) },
    { id: 3, array: Object.values(productOwnersLookup) },
  ]

  const handleMultiSelectChange = (e) => {
    const selectedIds = e.value?.map((option) => option)

    formik.setFieldValue('entityIds', selectedIds || [])
  }
  return (
    <Wrapper>
      <form onSubmit={formik.handleSubmit}>
        <Modal.Header>
          <Modal.Title className="h6">{popupLabel}</Modal.Title>
          <Button
            variant="close"
            aria-label="Close"
            onClick={() => setVisible(false)}
          />
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col md={12}>
              <div className="mb-3">
                <label htmlFor="Activate-Discount-For">
                  <SafeFormatMessage id="Activate-Discount-For" />
                  <span className="mx-1 text-danger">*</span>
                </label>
                <MultiSelect
                  value={formik.values.entityIds}
                  options={
                    entityIdsOptions &&
                    (
                      Object.values(entityIdsOptions).find(
                        (option) => option.id == currentDiscount?.discountType
                      )?.array || []
                    ).map((item) => ({
                      value: item?.id,
                      label: item?.systemName || item?.displayName,
                    }))
                  }
                  placeholder={SafeFormatMessage({ id: 'Select' })}
                  onChange={handleMultiSelectChange}
                  showSelectAll={true}
                  className={`d-flex p-0 form-control ${
                    formik.touched.entityIds && formik.errors.entityIds
                      ? 'is-invalid'
                      : ''
                  }`}
                  maxSelectedLabels={0}
                  selectedItemTemplate={(items) => {
                    const count = formik.values.entityIds?.length
                    return count === 0 ? (
                      SafeFormatMessage({ id: 'No-items-selected' })
                    ) : (
                      <span>
                        {count} <SafeFormatMessage id={'items-selected'} />
                      </span>
                    )
                  }}
                />
              </div>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            type="submit"
            disabled={formik.isSubmitting}
          >
            <SafeFormatMessage id="submit" />
          </Button>
          <Button
            variant="link"
            className="text-gray"
            onClick={() => setVisible(false)}
          >
            <SafeFormatMessage id="close" />
          </Button>
        </Modal.Footer>
      </form>
    </Wrapper>
  )
}
export default DiscountAllocationForm
