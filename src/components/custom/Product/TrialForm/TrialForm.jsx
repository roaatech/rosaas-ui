import React, { useEffect, useState } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import useRequest from '../../../../axios/apis/useRequest.js'
import { cycle } from '../../../../const/index.js'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { Form } from '@themesberg/react-bootstrap'
import { Modal, Button } from '@themesberg/react-bootstrap'
import {
  deleteAllPlan,
  deleteAllPlanPrice,
  setAllPlans,
  setAllSpecifications,
  setAllProduct,
} from '../../../../store/slices/products/productsSlice.js'
import { Wrapper } from './TrialForm.styled.jsx'
import { FormattedMessage, useIntl } from 'react-intl'
import { ProductTrialType } from '../../../../const/product.js'

const TrialForm = ({ type, update, updateTenant, setVisible, popupLabel }) => {
  const { changeProductTrialType, getProductList, getProductPlans } =
    useRequest()
  const [submitLoading, setSubmitLoading] = useState()

  const dispatch = useDispatch()
  const params = useParams()
  const productId = params.id

  const listData = useSelector((state) => state.products.products)

  const trialData = listData[productId]
  console.log(trialData.trialType)
  useEffect(() => {
    if (!listData) {
      let query = `?page=1&pageSize=50&filters[0].Field=SearchTerm`
      ;(async () => {
        const productList = await getProductList(query)
        dispatch(setAllProduct(productList.data.data.items))
      })()
    }
  }, [])

  const createValidation = {
    trialType: Yup.number().required(
      <FormattedMessage id="This-field-is-required" />
    ),
    trialPlanId: Yup.string().test(
      'unit-validation',
      <FormattedMessage id="This-field-is-required" />,
      function (value) {
        const trialType = this.resolve(Yup.ref('trialType'))
        console.log(trialType)
        if (trialType == '2') {
          console.log('*****')
          return value !== undefined && value !== ''
        }
        return true
      }
    ),
    trialPeriodInDays: Yup.number().test(
      'unit-validation',
      <FormattedMessage id="Trial-Period-In-Days-Required-Number" />,
      function (value) {
        const trialType = this.resolve(Yup.ref('trialType'))
        if (trialType == '2') {
          console.log('*****')
          return value !== undefined && value !== ''
        }
        return true
      }
    ),
  }

  const validationSchema = Yup.object().shape(createValidation)

  const initialValues = {
    trialType: trialData ? trialData.trialType : '',
    plan: trialData ? trialData.plan : '',
    trialPeriodInDays: trialData ? trialData.trialPeriodInDays : '',
  }

  const formik = useFormik({
    initialValues,
    validationSchema: validationSchema,

    onSubmit: async (values) => {
      const productTrialType = await changeProductTrialType(productId, {
        trialType: values.trialType,
        trialPlanId: values.trialPlanId,
        trialPeriodInDays: values.trialPeriodInDays,
      })

      updateTenant()

      setVisible && setVisible(false)
      setVisible && setVisible(false)
    },
  })

  let planOptions
  if (listData[productId]?.plans) {
    planOptions = Object.values(listData[productId].plans)
      .filter((item) => item.isPublished === true)
      .map((item, index) => ({
        value: item.id,
        label: item.displayName,
      }))
  } else {
    planOptions = []
  }

  useEffect(() => {
    ;(async () => {
      formik.setFieldValue('plan', '')
      formik.setFieldValue('price', '')
      if (listData[productId]) {
        if (!listData[productId].plans) {
          const planData = await getProductPlans(productId)
          dispatch(
            setAllPlans({
              productId: productId,
              data: planData.data.data,
            })
          )
        }
      }
    })()
  }, [productId])

  return (
    <Wrapper>
      <Form onSubmit={formik.handleSubmit}>
        <Modal.Header>
          <Modal.Title className="h6">{popupLabel}</Modal.Title>
          <Button
            variant="close"
            aria-label="Close"
            onClick={() => setVisible(false)}
          />
        </Modal.Header>
        <Modal.Body>
          <div>
            <Form.Group className="mb-3">
              <Form.Label>
                <FormattedMessage id="Trial-Type" />{' '}
                <span style={{ color: 'red' }}>*</span>
              </Form.Label>
              <select
                className="form-control"
                name="trialType"
                id="trialType"
                value={formik.values.trialType}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              >
                <option value="">
                  <FormattedMessage id="Select-Option" />{' '}
                </option>
                {Object.entries(ProductTrialType).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label && <FormattedMessage id={label} />}
                  </option>
                ))}
              </select>
              {formik.touched.trialType && formik.errors.trialType && (
                <Form.Control.Feedback
                  type="invalid"
                  style={{ display: 'block' }}
                >
                  {formik.errors.trialType}
                </Form.Control.Feedback>
              )}
            </Form.Group>
          </div>

          {formik.values.trialType == 2 && (
            <div>
              <Form.Group className="mb-3">
                <Form.Label>
                  <FormattedMessage id="Trial-Plan" />{' '}
                  <span style={{ color: 'red' }}>*</span>
                </Form.Label>
                <select
                  className="form-control"
                  name="trialPlanId"
                  id="trialPlanId"
                  value={formik.values.trialPlanId}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  disabled={!productId}
                >
                  <option value="">
                    <FormattedMessage id="Select-Option" />
                  </option>
                  {planOptions?.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                {formik.touched.trialPlanId && formik.errors.trialPlanId && (
                  <Form.Control.Feedback
                    type="invalid"
                    style={{ display: 'block' }}
                  >
                    {formik.errors.trialPlanId}
                  </Form.Control.Feedback>
                )}
              </Form.Group>
            </div>
          )}
          {formik.values.trialType == 2 && (
            <div>
              <Form.Group className="mb-3">
                <Form.Label>
                  <FormattedMessage id="Trial-Period-In-Days" />{' '}
                  <span style={{ color: 'red' }}>*</span>
                </Form.Label>
                <input
                  className="form-control"
                  type="text"
                  id="trialPeriodInDays"
                  name="trialPeriodInDays"
                  onChange={formik.handleChange}
                  value={formik.values.trialPeriodInDays}
                />

                {formik.touched.trialPeriodInDays &&
                  formik.errors.trialPeriodInDays && (
                    <Form.Control.Feedback
                      type="invalid"
                      style={{ display: 'block' }}
                    >
                      {formik.errors.trialPeriodInDays}
                    </Form.Control.Feedback>
                  )}
              </Form.Group>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" type="submit" disabled={submitLoading}>
            <FormattedMessage id="Submit" />
          </Button>
          <Button
            variant="link"
            className="text-gray "
            onClick={() => setVisible(false)}
          >
            <FormattedMessage id="Close" />
          </Button>
        </Modal.Footer>
      </Form>
    </Wrapper>
  )
}

export default TrialForm
