import React, { useEffect, useState } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { FormattedMessage } from 'react-intl'
import { Wrapper } from './DiscountForm.styled'
import { Button, Col, Container, Modal, Row } from '@themesberg/react-bootstrap'
import useRequest from '../../../../axios/apis/useRequest'
import { useDispatch, useSelector } from 'react-redux'
import {
  setAllDiscounts,
  discountInfo,
} from '../../../../store/slices/discountsSlice'
import { Client_id } from '../../../../const'
import SafeFormatMessage from '../../Shared/SafeFormatMessage/SafeFormatMessage'
import { MultiSelect } from 'primereact/multiselect'
import { setAllPlansLookup } from '../../../../store/slices/products/productsSlice'

const DiscountAllocationForm = ({
  type, // 'create' or 'edit'
  setVisible, // Function to toggle modal visibility
  popupLabel, // Title of the modal
  onUpdate, // Callback after form submission
  currentId,
}) => {
  const dispatch = useDispatch()
  const {
    createDiscount,
    editDiscountRequest,
    getDiscountById,
    getPlanFilteredList,
  } = useRequest()
  const discountsData = useSelector((state) => state?.discountsSlice?.discounts)
  const [discountData, setDiscountData] = useState()
  const productsLookup = useSelector(
    (state) => state.products?.lookup?.productsLookup
  )
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
  useEffect(() => {
    const fetchDiscountDetails = async () => {
      if (!currentId || type !== 'edit') {
        return
      }

      try {
        const discountResponse = await getDiscountById(currentId)
        const discountDetails = discountResponse.data.data

        // Set the discount data directly from the response
        setDiscountData(discountDetails)

        // Dispatch the data to the Redux store
        dispatch(
          discountInfo({
            id: currentId,
            data: discountDetails,
          })
        )
      } catch (error) {
        console.error('Error fetching discount details:', error)
      }
    }

    fetchDiscountDetails()
  }, [currentId, type])

  // useEffect to update formik values when discountData changes
  useEffect(() => {
    if (discountData) {
      formik.setValues({
        ...formik.values,
        displayName: discountData.displayName || '',
        discountType: discountData.discountType || '',
        adminComment: discountData.adminComment || '',
        discountPercentage: discountData.discountPercentage || 0,
        discountAmount: discountData.discountAmount || 0,
        maximumDiscountAmount: discountData.maximumDiscountAmount || null,
        startDate: discountData.startDate || null,
        endDate: discountData.endDate || null,
        couponCode: discountData.couponCode || '',
        isCumulative: discountData.isCumulative || false,
        discountLimitation: String(discountData.discountLimitation) || '',
        limitationTimes: discountData.limitationTimes || 0,
      })
      discountData.requiresCouponCode &&
        setRequiresCouponCode(discountData.requiresCouponCode)
      discountData.usePercentage && setUsePercentage(discountData.usePercentage)
    }
  }, [discountData])

  const [usePercentage, setUsePercentage] = useState(
    discountData ? discountData.usePercentage : false
  )
  const [requiresCouponCode, setRequiresCouponCode] = useState(
    discountData ? discountData.requiresCouponCode : false
  )

  const initialValues = {
    activateDiscountFor: discountData ? discountData.activateDiscountFor : [],
  }
  const validationSchema = Yup.object().shape({})
  let userInfo = useSelector((state) => state.auth.userInfo)

  let userRole = userInfo.userType
  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      const payload = {
        ...values,
        discountType: parseInt(values.discountType),
        usePercentage,
        requiresCouponCode,
        discountLimitation: parseInt(values.discountLimitation),
      }

      try {
        if (type === 'create') {
          const response = await createDiscount({
            ...payload,
            productOwnerId:
              userRole == 'clientAdmin' ? userInfo.ProductOwnerInfo?.id : null,
          })
          dispatch(
            discountInfo({
              id: response.data.data.id,
              data: {
                ...payload,
                isActive: false,
                timesUsed: 0,
                id: response.data.data.id,
              },
            })
          )
          setSubmitting(false)
          setVisible(false)
          onUpdate && onUpdate()
        } else {
          const response = await editDiscountRequest(discountData.id, payload)
          dispatch(
            discountInfo({
              id: discountData.id,
              data: { ...discountData, ...payload },
            })
          )
          setSubmitting(false)
          setVisible(false)
          onUpdate && onUpdate()
        }
      } catch (error) {
        console.error('Error submitting form:', error)
      }
    },
  })

  // Options for DiscountType enum
  const discountTypeOptions = [
    { value: 1, label: 'assigned-to-plans' },
    { value: 2, label: 'assigned-to-products' },
    {
      value: 3,
      label:
        userRole === 'productOwner'
          ? 'assigned-to-me'
          : 'assigned-to-products-owners',
    },
    { value: 4, label: 'assigned-to-order-total' },
    { value: 5, label: 'assigned-to-order-subtotal' },
  ]
  const activateDiscountForOptions = [
    { id: 1, array: Object.values(plansLookup) },
    { id: 2, array: Object.values(productsLookup) },
    { id: 3, array: Object.values(productOwnersLookup) },
  ]
  // Options for DiscountLimitationType enum
  const discountLimitationOptions = [
    { value: 1, label: 'unlimited' },
    { value: 2, label: 'n-times-only' },
    { value: 3, label: 'n-times-per-customer' },
  ]
  const handleMultiSelectChange = (e) => {
    const selectedIds = e.value?.map((option) => option)

    formik.setFieldValue('activateDiscountFor', selectedIds || [])
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
                <label htmlFor="discountType">
                  <SafeFormatMessage id="discount-type" />{' '}
                  <span style={{ color: 'red' }}>*</span>
                </label>
                <select
                  name="discountType"
                  id="discountType"
                  value={formik.values.discountType}
                  onChange={formik.handleChange}
                  className={`form-control ${
                    formik.touched.discountType && formik.errors.discountType
                      ? 'is-invalid'
                      : ''
                  }`}
                >
                  <option value="">
                    <SafeFormatMessage id="select-type" />
                  </option>
                  {discountTypeOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      <SafeFormatMessage id={option.label} />
                    </option>
                  ))}
                </select>

                {formik.touched.discountType && formik.errors.discountType && (
                  <div className="invalid-feedback">
                    {formik.errors.discountType}
                  </div>
                )}
              </div>
            </Col>
            <Col md={12}>
              <div className="mb-3">
                <label htmlFor="Activate-Discount-For">
                  <SafeFormatMessage id="Activate-Discount-For" />
                  <span className="mx-1 text-danger">*</span>
                </label>
                <MultiSelect
                  value={
                    !formik.values.discountType
                      ? []
                      : formik.values.activateDiscountFor
                  }
                  options={
                    activateDiscountForOptions &&
                    (
                      Object.values(activateDiscountForOptions).find(
                        (option) => option.id == formik.values.discountType
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
                    formik.touched.activateDiscountFor &&
                    formik.errors.activateDiscountFor
                      ? 'is-invalid'
                      : ''
                  }`}
                  disabled={!formik.values.discountType}
                  maxSelectedLabels={0}
                  selectedItemTemplate={(items) => {
                    const count = formik.values.activateDiscountFor?.length
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
