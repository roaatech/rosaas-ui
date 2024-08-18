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

const DiscountForm = ({
  type, // 'create' or 'edit'
  setVisible, // Function to toggle modal visibility
  popupLabel, // Title of the modal
  onUpdate, // Callback after form submission
  currentId,
}) => {
  const dispatch = useDispatch()
  const { createDiscount, editDiscountRequest, getDiscountById } = useRequest()
  const discountsData = useSelector((state) => state?.discountsSlice?.discounts)
  const [discountData, setDiscountData] = useState()

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
        maximumDiscountAmount: discountData.maximumDiscountAmount || 0,
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
    displayName: discountData ? discountData.displayName : '',
    discountType: discountData ? discountData.discountType : '',
    adminComment: discountData ? discountData.adminComment : '',
    discountPercentage: discountData ? discountData.discountPercentage : 0,
    discountAmount: discountData ? discountData.discountAmount : 0,
    maximumDiscountAmount: discountData
      ? discountData.maximumDiscountAmount
      : 0,
    startDate: discountData ? discountData.startDate : null,
    endDate: discountData ? discountData.endDate : null,
    couponCode: discountData ? discountData.couponCode : '',
    isCumulative: discountData ? discountData.isCumulative : false,
    discountLimitation: discountData
      ? String(discountData.discountLimitation)
      : '',
    limitationTimes: discountData ? discountData.limitationTimes : 0,
  }
  const validationSchema = Yup.object().shape({
    displayName: Yup.string()
      .required(<FormattedMessage id="display-name-is-required" />)
      .max(100, <FormattedMessage id="maximum-100-characters-allowed" />),
    discountType: Yup.number().required(
      <FormattedMessage id="discount-type-is-required" />
    ),
    adminComment: Yup.string().max(
      250,
      <FormattedMessage id="maximum-250-characters-allowed" />
    ),
    discountPercentage: usePercentage
      ? Yup.number()
          .min(0, <FormattedMessage id="minimum-value-is-0" />)
          .max(100, <FormattedMessage id="maximum-value-is-100" />)
          .required(<FormattedMessage id="required-when-using-percentage" />)
      : Yup.number().notRequired(),
    discountAmount: !usePercentage
      ? Yup.number()
          .min(0, <FormattedMessage id="minimum-value-is-0" />)
          .required(
            <FormattedMessage id="required-when-not-using-percentage" />
          )
      : Yup.number().notRequired(),
    maximumDiscountAmount: usePercentage
      ? Yup.number()
          .min(0, <FormattedMessage id="minimum-value-is-0" />)
          .notRequired()
      : Yup.number().notRequired(),
    couponCode: requiresCouponCode
      ? Yup.string()
          .required(<FormattedMessage id="coupon-code-is-required" />)
          .max(50, <FormattedMessage id="maximum-50-characters-allowed" />)
      : Yup.string().notRequired(),
    limitationTimes:
      initialValues.discountLimitation === '2' ||
      initialValues.discountLimitation === '3'
        ? Yup.number()
            .min(1, <FormattedMessage id="minimum-value-is-1" />)
            .required(<FormattedMessage id="limitation-times-is-required" />)
        : Yup.number().notRequired(),
    startDate: Yup.date().nullable(), // Not required
    endDate: Yup.date()
      .nullable() // Not required
      .test(
        'is-greater',
        <FormattedMessage id="end-date-should-be-later-than-start-date" />,
        function (value) {
          const { startDate } = this.parent
          return !startDate || !value || value > startDate
        }
      ),
  })
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
    { value: 3, label: 'assigned-to-products-owners' },
    { value: 4, label: 'assigned-to-order-total' },
    { value: 5, label: 'assigned-to-order-subtotal' },
  ]

  // Options for DiscountLimitationType enum
  const discountLimitationOptions = [
    { value: 1, label: 'unlimited' },
    { value: 2, label: 'n-times-only' },
    { value: 3, label: 'n-times-per-customer' },
  ]

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
                <label htmlFor="displayName">
                  <FormattedMessage id="display-name" />{' '}
                  <span style={{ color: 'red' }}>*</span>
                </label>
                <input
                  type="text"
                  name="displayName"
                  id="displayName"
                  value={formik.values.displayName}
                  onChange={formik.handleChange}
                  className={`form-control ${
                    formik.touched.displayName && formik.errors.displayName
                      ? 'is-invalid'
                      : ''
                  }`}
                />
                {formik.touched.displayName && formik.errors.displayName && (
                  <div className="invalid-feedback">
                    {formik.errors.displayName}
                  </div>
                )}
              </div>
            </Col>

            <Col md={12}>
              <div className="mb-3">
                <label htmlFor="discountType">
                  <FormattedMessage id="discount-type" />{' '}
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
                    <FormattedMessage id="select-type" />
                  </option>
                  {discountTypeOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      <FormattedMessage id={option.label} />
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
            <div className="px-2 mb-3">
              <Container className="card pt-2">
                <Row>
                  <Col md={12} className="d-flex align-items-center mb-3">
                    <input
                      type="checkbox"
                      name="usePercentage"
                      id="usePercentage"
                      checked={usePercentage}
                      onChange={(e) => setUsePercentage(e.target.checked)}
                    />
                    <label htmlFor="usePercentage" className="ml-2">
                      <FormattedMessage id="use-percentage" />
                    </label>
                  </Col>
                  {usePercentage ? (
                    <>
                      <Col md={6}>
                        <div className="mb-3">
                          <label htmlFor="discountPercentage">
                            <FormattedMessage id="discount-percentage" />{' '}
                            <span style={{ color: 'red' }}>*</span>
                          </label>
                          <input
                            type="number"
                            name="discountPercentage"
                            id="discountPercentage"
                            value={formik.values.discountPercentage}
                            onChange={formik.handleChange}
                            className={`form-control ${
                              formik.touched.discountPercentage &&
                              formik.errors.discountPercentage
                                ? 'is-invalid'
                                : ''
                            }`}
                          />
                          {formik.touched.discountPercentage &&
                            formik.errors.discountPercentage && (
                              <div className="invalid-feedback">
                                {formik.errors.discountPercentage}
                              </div>
                            )}
                        </div>
                      </Col>
                      <Col md={6}>
                        <div className="mb-3">
                          <label htmlFor="maximumDiscountAmount">
                            <FormattedMessage id="maximum-discount-amount" />
                          </label>
                          <input
                            type="number"
                            name="maximumDiscountAmount"
                            id="maximumDiscountAmount"
                            value={formik.values.maximumDiscountAmount}
                            onChange={formik.handleChange}
                            className={`form-control ${
                              formik.touched.maximumDiscountAmount &&
                              formik.errors.maximumDiscountAmount
                                ? 'is-invalid'
                                : ''
                            }`}
                          />
                          {formik.touched.maximumDiscountAmount &&
                            formik.errors.maximumDiscountAmount && (
                              <div className="invalid-feedback">
                                {formik.errors.maximumDiscountAmount}
                              </div>
                            )}
                        </div>
                      </Col>
                    </>
                  ) : (
                    <Col md={12}>
                      <div className="mb-3">
                        <label htmlFor="discountAmount">
                          <FormattedMessage id="discount-amount" />{' '}
                          <span style={{ color: 'red' }}>*</span>
                        </label>
                        <input
                          type="number"
                          name="discountAmount"
                          id="discountAmount"
                          value={formik.values.discountAmount}
                          onChange={formik.handleChange}
                          className={`form-control ${
                            formik.touched.discountAmount &&
                            formik.errors.discountAmount
                              ? 'is-invalid'
                              : ''
                          }`}
                        />
                        {formik.touched.discountAmount &&
                          formik.errors.discountAmount && (
                            <div className="invalid-feedback">
                              {formik.errors.discountAmount}
                            </div>
                          )}
                      </div>
                    </Col>
                  )}{' '}
                </Row>
              </Container>
            </div>

            <Col md={6}>
              <div className="mb-3">
                <label htmlFor="startDate">
                  <FormattedMessage id="start-date" />
                </label>
                <input
                  type="datetime-local"
                  name="startDate"
                  id="startDate"
                  value={formik.values.startDate}
                  onChange={formik.handleChange}
                  className={`form-control ${
                    formik.touched.startDate && formik.errors.startDate
                      ? 'is-invalid'
                      : ''
                  }`}
                  min={new Date().toISOString().slice(0, 16)}
                />
                {formik.touched.startDate && formik.errors.startDate && (
                  <div className="invalid-feedback">
                    {formik.errors.startDate}
                  </div>
                )}
              </div>
            </Col>

            <Col md={6}>
              <div className="mb-3">
                <label htmlFor="endDate">
                  <FormattedMessage id="end-date" />
                </label>
                <input
                  type="datetime-local"
                  name="endDate"
                  id="endDate"
                  value={formik.values.endDate}
                  onChange={formik.handleChange}
                  className={`form-control ${
                    formik.touched.endDate && formik.errors.endDate
                      ? 'is-invalid'
                      : ''
                  }`}
                  min={new Date().toISOString().slice(0, 16)}
                />
                {formik.touched.endDate && formik.errors.endDate && (
                  <div className="invalid-feedback">
                    {formik.errors.endDate}
                  </div>
                )}
              </div>
            </Col>
            <div className="px-2 mb-3">
              <Container className="card pt-2">
                <Row>
                  <Col md={12} className="d-flex align-items-center mb-3">
                    <input
                      type="checkbox"
                      name="requiresCouponCode"
                      id="requiresCouponCode"
                      checked={requiresCouponCode}
                      onChange={(e) => setRequiresCouponCode(e.target.checked)}
                    />
                    <label htmlFor="requiresCouponCode" className="ml-2">
                      <FormattedMessage id="requires-coupon-code" />
                    </label>
                  </Col>

                  {requiresCouponCode && (
                    <Col md={12}>
                      <div className="mb-3">
                        <label htmlFor="couponCode">
                          <FormattedMessage id="coupon-code" />{' '}
                          <span style={{ color: 'red' }}>*</span>
                        </label>
                        <input
                          type="text"
                          name="couponCode"
                          id="couponCode"
                          value={formik.values.couponCode}
                          onChange={formik.handleChange}
                          className={`form-control ${
                            formik.touched.couponCode &&
                            formik.errors.couponCode
                              ? 'is-invalid'
                              : ''
                          }`}
                        />
                        {formik.touched.couponCode &&
                          formik.errors.couponCode && (
                            <div className="invalid-feedback">
                              {formik.errors.couponCode}
                            </div>
                          )}
                      </div>
                    </Col>
                  )}
                </Row>
              </Container>
            </div>
            <div className="px-2 mb-3">
              <Container className="card pt-2">
                <Row>
                  <Col md={12}>
                    <div className="mb-3">
                      <label htmlFor="discountLimitation">
                        <FormattedMessage id="discount-limitation" />{' '}
                        <span style={{ color: 'red' }}>*</span>
                      </label>
                      <select
                        name="discountLimitation"
                        id="discountLimitation"
                        value={formik.values.discountLimitation}
                        onChange={formik.handleChange}
                        className={`form-control ${
                          formik.touched.discountLimitation &&
                          formik.errors.discountLimitation
                            ? 'is-invalid'
                            : ''
                        }`}
                      >
                        <option value="">
                          <FormattedMessage id="select-limitation" />
                        </option>
                        {discountLimitationOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            <FormattedMessage id={option.label} />
                          </option>
                        ))}
                      </select>
                      {formik.touched.discountLimitation &&
                        formik.errors.discountLimitation && (
                          <div className="invalid-feedback">
                            {formik.errors.discountLimitation}
                          </div>
                        )}
                    </div>
                  </Col>

                  {(formik.values.discountLimitation === '2' ||
                    formik.values.discountLimitation === '3') && (
                    <Col md={12}>
                      <div className="mb-3">
                        <label htmlFor="limitationTimes">
                          <FormattedMessage id="limitation-times" />{' '}
                          <span style={{ color: 'red' }}>*</span>
                        </label>
                        <input
                          type="number"
                          name="limitationTimes"
                          id="limitationTimes"
                          value={formik.values.limitationTimes}
                          onChange={formik.handleChange}
                          className={`form-control ${
                            formik.touched.limitationTimes &&
                            formik.errors.limitationTimes
                              ? 'is-invalid'
                              : ''
                          }`}
                        />
                        {formik.touched.limitationTimes &&
                          formik.errors.limitationTimes && (
                            <div className="invalid-feedback">
                              {formik.errors.limitationTimes}
                            </div>
                          )}
                      </div>
                    </Col>
                  )}
                </Row>
              </Container>
            </div>
            <Col md={12} className="d-flex align-items-center mb-3">
              <input
                type="checkbox"
                name="isCumulative"
                id="isCumulative"
                checked={formik.values.isCumulative}
                onChange={formik.handleChange}
              />
              <label htmlFor="isCumulative" className="ml-2">
                <FormattedMessage id="is-cumulative" />
              </label>
            </Col>
            <Col md={12}>
              <div className="mb-3">
                <label htmlFor="adminComment">
                  <FormattedMessage id="admin-comment" />
                </label>
                <textarea
                  rows={3}
                  name="adminComment"
                  id="adminComment"
                  value={formik.values.adminComment}
                  onChange={formik.handleChange}
                  className={`form-control ${
                    formik.touched.adminComment && formik.errors.adminComment
                      ? 'is-invalid'
                      : ''
                  }`}
                />
                {formik.touched.adminComment && formik.errors.adminComment && (
                  <div className="invalid-feedback">
                    {formik.errors.adminComment}
                  </div>
                )}
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
            <FormattedMessage id="submit" />
          </Button>
          <Button
            variant="link"
            className="text-gray"
            onClick={() => setVisible(false)}
          >
            <FormattedMessage id="close" />
          </Button>
        </Modal.Footer>
      </form>
    </Wrapper>
  )
}

export default DiscountForm
