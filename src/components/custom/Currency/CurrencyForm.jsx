import React, { useEffect, useState } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { FormattedMessage } from 'react-intl'
import { Wrapper } from './CurrencyForm.styled'
import { Button, Col, Container, Modal, Row } from '@themesberg/react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { currencyInfo } from '../../../store/slices/currenciesSlice'
import useRequest from '../../../axios/apis/useRequest'
import { roundingTypeOptions } from '../../../const/const'

// Define your options object with formatted messages

const CurrencyForm = ({
  type, // 'create' or 'edit'
  setVisible, // Function to toggle modal visibility
  popupLabel, // Title of the modal
  onUpdate, // Callback after form submission
  currentId,
}) => {
  const dispatch = useDispatch()
  const { createCurrency, editCurrency, getCurrencyById } = useRequest()
  const currenciesData = useSelector(
    (state) => state?.currenciesSlice?.currencies
  )
  const [currencyData, setCurrencyData] = useState()

  useEffect(() => {
    const fetchCurrencyDetails = async () => {
      if (!currentId || type !== 'edit') {
        return
      }

      try {
        const currencyResponse = await getCurrencyById(currentId)
        const currencyDetails = currencyResponse.data.data

        // Set the currency data directly from the response
        setCurrencyData(currencyDetails)

        // Dispatch the data to the Redux store
        dispatch(
          currencyInfo({
            id: currentId,
            data: currencyDetails,
          })
        )
      } catch (error) {
        console.error('Error fetching currency details:', error)
      }
    }

    fetchCurrencyDetails()
  }, [currentId, type])

  // useEffect to update formik values when currencyData changes
  useEffect(() => {
    if (currencyData) {
      formik.setValues({
        ...formik.values,
        displayName: currencyData.displayName || '',
        currencyCode: currencyData.currencyCode || '',
        rate: currencyData.rate || 0,
        customFormatting: currencyData.customFormatting || '',
        displayOrder: currencyData.displayOrder || 0,
        roundingType:
          currencyData.roundingType !== undefined
            ? parseInt(currencyData.roundingType, 10)
            : 0,
      })
    }
  }, [currencyData])

  const initialValues = {
    displayName: currencyData ? currencyData.displayName : '',
    currencyCode: currencyData ? currencyData.currencyCode : '',
    rate: currencyData ? currencyData.rate : 0,
    customFormatting: currencyData ? currencyData.customFormatting : '',
    displayOrder: currencyData ? currencyData.displayOrder : 0,
    roundingType: currencyData ? parseInt(currencyData.roundingType, 10) : 0,
  }

  const validationSchema = Yup.object().shape({
    displayName: Yup.string()
      .required(<FormattedMessage id="display-name-is-required" />)
      .max(100, <FormattedMessage id="maximum-100-characters-allowed" />),
    currencyCode: Yup.string()
      .required(<FormattedMessage id="currency-code-is-required" />)
      .matches(
        /^[A-Z]{3}$/,
        <FormattedMessage id="currency-code-must-be-3-letters" />
      ),
    rate: Yup.number()
      .required(<FormattedMessage id="rate-is-required" />)
      .min(0.01, <FormattedMessage id="rate-must-be-greater-than-zero" />),
    customFormatting: Yup.string().max(
      100,
      <FormattedMessage id="maximum-100-characters-allowed" />
    ),
    displayOrder: Yup.number().min(
      0,
      <FormattedMessage id="minimum-value-is-0" />
    ),
    roundingType: Yup.number() // Validate as a number
      .required(<FormattedMessage id="rounding-type-is-required" />)
      .oneOf(
        Object.keys(roundingTypeOptions).map(Number),
        <FormattedMessage id="invalid-rounding-type" />
      ),
  })

  const formik = useFormik({
    initialValues,
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        if (type === 'create') {
          const response = await createCurrency(values)
          dispatch(
            currencyInfo({
              id: response.data.data.id,
              data: {
                ...values,
                id: response.data.data.id,
              },
            })
          )
          setSubmitting(false)
          setVisible(false)
          onUpdate && onUpdate()
        } else {
          const response = await editCurrency(currencyData.id, values)
          dispatch(
            currencyInfo({
              id: currencyData.id,
              data: { ...currencyData, ...values },
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
                <label htmlFor="currencyCode">
                  <FormattedMessage id="currency-code" />{' '}
                  <span style={{ color: 'red' }}>*</span>
                </label>
                <input
                  type="text"
                  name="currencyCode"
                  id="currencyCode"
                  value={formik.values.currencyCode}
                  onChange={formik.handleChange}
                  className={`form-control ${
                    formik.touched.currencyCode && formik.errors.currencyCode
                      ? 'is-invalid'
                      : ''
                  }`}
                />
                {formik.touched.currencyCode && formik.errors.currencyCode && (
                  <div className="invalid-feedback">
                    {formik.errors.currencyCode}
                  </div>
                )}
              </div>
            </Col>

            <Col md={12}>
              <div className="mb-3">
                <label htmlFor="rate">
                  <FormattedMessage id="rate" />{' '}
                  <span style={{ color: 'red' }}>*</span>
                </label>
                <input
                  type="number"
                  name="rate"
                  id="rate"
                  value={formik.values.rate}
                  onChange={formik.handleChange}
                  className={`form-control ${
                    formik.touched.rate && formik.errors.rate
                      ? 'is-invalid'
                      : ''
                  }`}
                />
                {formik.touched.rate && formik.errors.rate && (
                  <div className="invalid-feedback">{formik.errors.rate}</div>
                )}
              </div>
            </Col>

            <Col md={12}>
              <div className="mb-3">
                <label htmlFor="customFormatting">
                  <FormattedMessage id="custom-formatting" />
                </label>
                <input
                  type="text"
                  name="customFormatting"
                  id="customFormatting"
                  value={formik.values.customFormatting}
                  onChange={formik.handleChange}
                  className={`form-control ${
                    formik.touched.customFormatting &&
                    formik.errors.customFormatting
                      ? 'is-invalid'
                      : ''
                  }`}
                />
                {formik.touched.customFormatting &&
                  formik.errors.customFormatting && (
                    <div className="invalid-feedback">
                      {formik.errors.customFormatting}
                    </div>
                  )}
              </div>
            </Col>

            <Col md={12}>
              <div className="mb-3">
                <label htmlFor="displayOrder">
                  <FormattedMessage id="display-order" />{' '}
                </label>
                <input
                  type="number"
                  name="displayOrder"
                  id="displayOrder"
                  value={formik.values.displayOrder}
                  onChange={formik.handleChange}
                  className={`form-control ${
                    formik.touched.displayOrder && formik.errors.displayOrder
                      ? 'is-invalid'
                      : ''
                  }`}
                />
                {formik.touched.displayOrder && formik.errors.displayOrder && (
                  <div className="invalid-feedback">
                    {formik.errors.displayOrder}
                  </div>
                )}
              </div>
            </Col>

            <Col md={12}>
              <div className="mb-3">
                <label htmlFor="roundingType">
                  <FormattedMessage id="rounding-type" />{' '}
                  <span style={{ color: 'red' }}>*</span>
                </label>
                <select
                  name="roundingType"
                  id="roundingType"
                  value={formik.values.roundingType}
                  onChange={(e) =>
                    formik.setFieldValue(
                      'roundingType',
                      parseInt(e.target.value, 10)
                    )
                  } // Convert to integer
                  className={`form-control ${
                    formik.touched.roundingType && formik.errors.roundingType
                      ? 'is-invalid'
                      : ''
                  }`}
                >
                  <option value="">
                    <FormattedMessage id="select-option" />
                  </option>
                  {Object.entries(roundingTypeOptions).map(
                    ([value, labelId]) => (
                      <option key={value} value={value}>
                        <FormattedMessage id={labelId} />
                      </option>
                    )
                  )}
                </select>

                {formik.touched.roundingType && formik.errors.roundingType && (
                  <div className="invalid-feedback">
                    {formik.errors.roundingType}
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

export default CurrencyForm
