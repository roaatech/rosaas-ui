import React, { useEffect, useState } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import useRequest from '../../../../../axios/apis/useRequest.js'
import { Modal, Button } from '@themesberg/react-bootstrap'
import { Form } from '@themesberg/react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { FormattedMessage } from 'react-intl'
import { Wrapper } from './FeaturePlanForm.styled.jsx'
import { useParams } from 'react-router-dom'
import {
  featurePlanInfo,
  setAllFeaturePlan,
  setAllFeatures,
} from '../../../../../store/slices/products.js'
import { setAllPlans } from '../../../../../store/slices/products.js'
import TextareaAndCounter from '../../../Shared/TextareaAndCounter/TextareaAndCounter.jsx' // Import the missing component
import { featureUnitMap } from '../../../../../const/index.js'

const FeaturePlanForm = ({
  type,
  FeaturePlanData,
  setVisible,
  popupLabel,
  setActiveIndex,
  show,
  setShow,
  plan,
  feature,
}) => {
  const routeParams = useParams()
  const productId = routeParams.id
  const {
    getProductFeatures,
    getProductPlans,
    createFeaturePlanRequest,
    editFeaturePlanRequest,
    getFeaturePlanList,
  } = useRequest()
  const dispatch = useDispatch()

  const isFeatureBoolean = (value) => {
    return featureOptions.find((obj) => obj.value === value)?.type == 'Boolean'
  }

  const allProducts = useSelector((state) => state.products.products)
  const listFeatureData = allProducts[productId]?.features
  let allFeatureArray = listFeatureData && Object.values(listFeatureData)
  const allPlans = useSelector(
    (state) => state.products.products[productId]?.plans
  )
  let allPlansArray = allPlans && Object.values(allPlans)

  const featureOptions = listFeatureData
    ? allFeatureArray.map((item) => {
        return {
          value: item.id,
          label: item.name,
          type: item.type == 1 ? 'Number' : 'Boolean',
        }
      })
    : []
  const planOptions = allPlans
    ? allPlansArray.map((item) => {
        return { value: item.id, label: item.name }
      })
    : []

  useEffect(() => {
    ;(async () => {
      if (!listFeatureData) {
        const featureReq = await getProductFeatures(productId)
        dispatch(
          setAllFeatures({ productId: productId, data: featureReq.data.data })
        )
      }
      if (!allPlans) {
        const planReq = await getProductPlans(productId)
        dispatch(setAllPlans({ productId: productId, data: planReq.data.data }))
      }
    })()
  }, [])

  const initialValues = {
    feature: feature || (FeaturePlanData ? FeaturePlanData?.feature?.id : ''),
    plan: plan || (FeaturePlanData ? FeaturePlanData?.plan?.id : ''),
    limit: FeaturePlanData ? FeaturePlanData?.limit : '',
    unit: FeaturePlanData ? FeaturePlanData?.unit : '',
    description: FeaturePlanData ? FeaturePlanData?.description : '',
  }

  const validationSchema = Yup.object().shape({
    feature: Yup.string().required(
      <FormattedMessage id="Please-Select-a-Option" />
    ),
    plan: Yup.string().required(
      <FormattedMessage id="Please-Select-a-Option" />
    ),
    limit: Yup.number()
      .nullable()
      .test('', 'Limit must be number more than 0', function (value) {
        const feature = this.resolve(Yup.ref('feature'))
        if (isFeatureBoolean(feature)) {
          return true
        } else {
          const regex = /^[1-9]\d*$/
          return regex.test(value)
        }
      }),
    unit: Yup.number()
      .nullable()
      .test('', 'This field is required', function (value) {
        const feature = this.resolve(Yup.ref('feature'))
        if (isFeatureBoolean(feature)) {
          return true
        } else {
          if (value) {
            return true
          } else {
            return false
          }
        }
      }),
  })

  const formik = useFormik({
    initialValues,
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      if (type === 'create') {
        const dataDetails = {
          description: values.description,
          featureId: values.feature,
          planId: values.plan,
        }
        if (values.limit) dataDetails.limit = values.limit
        if (values.unit) dataDetails.unit = parseInt(values.unit)
        const createFeaturePlan = await createFeaturePlanRequest({
          productId: productId,
          data: dataDetails,
        })

        if (!allProducts[productId].featurePlan) {
          const featurePlan = await getFeaturePlanList(productId)
          dispatch(
            setAllFeaturePlan({
              productId: productId,
              data: featurePlan.data.data,
            })
          )
        }
        dispatch(
          featurePlanInfo({
            productId: productId,
            data: {
              description: values.description,
              limit: values.limit,
              unit: values.unit,
              feature: {
                id: values.feature,
                name: featureOptions.find(
                  (item) => item.value === values.feature
                ).label,
              },
              plan: {
                id: values.plan,
                name: planOptions.find((item) => item.value === values.plan)
                  .label,
              },
              id: createFeaturePlan.data.data.id,
              editedDate: new Date().toISOString().slice(0, 19),
              createdDate: new Date().toISOString().slice(0, 19),
            },
          })
        )

        if (setActiveIndex) {
          setActiveIndex(3)
        }
      } else {
        const dataDetails = {
          description: values.description,
        }
        if (values.limit) dataDetails.limit = values.limit
        if (values.unit) dataDetails.unit = parseInt(values.unit)
        const editFeaturePlan = await editFeaturePlanRequest({
          productId: productId,
          featurePlanId: FeaturePlanData.id,
          data: dataDetails,
        })

        const newData = JSON.parse(JSON.stringify(FeaturePlanData))
        newData.description = values.description
        newData.limit = values.limit
        newData.unit = values.unit

        dispatch(featurePlanInfo({ productId, data: newData }))
      }
      setVisible && setVisible(false)
    },
  })

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
          <div style={{ display: type == 'edit' ? 'none' : 'block' }}>
            <Form.Group className="mb-3">
              <Form.Label>
                Feature <span style={{ color: 'red' }}>*</span>
              </Form.Label>
              <select
                className="form-select"
                name="feature"
                id="feature"
                value={formik.values.feature}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                isInvalid={formik.touched.feature && formik.errors.feature}
              >
                <option value={''}>{'select'}</option>
                {featureOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {`${option.label} (${option.type})`}
                  </option>
                ))}
              </select>
              {formik.touched.feature && formik.errors.feature && (
                <Form.Control.Feedback
                  type="invalid"
                  style={{ display: 'block' }}
                >
                  {formik.errors.feature}
                </Form.Control.Feedback>
              )}
            </Form.Group>
          </div>
          <div style={{ display: type == 'edit' ? 'none' : 'block' }}>
            <Form.Group className="mb-3">
              <Form.Label>
                <FormattedMessage id="Plan" />{' '}
                <span style={{ color: 'red' }}>*</span>
              </Form.Label>
              <select
                className="form-select"
                name="plan"
                id="plan"
                value={formik.values.plan}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                isInvalid={formik.touched.plan && formik.errors.plan}
              >
                <option value={''}>{'select'}</option>
                {planOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {formik.touched.plan && formik.errors.plan && (
                <Form.Control.Feedback
                  type="invalid"
                  style={{ display: 'block' }}
                >
                  {formik.errors.plan}
                </Form.Control.Feedback>
              )}
            </Form.Group>
          </div>
          <div>
            <Form.Group className="mb-3">
              <Form.Label>
                <FormattedMessage id="Description" />
              </Form.Label>

              <TextareaAndCounter
                addTextarea={formik.setFieldValue}
                maxLength={250}
                showCharCount
                inputValue={formik?.values?.description}
                disabled={show}
              />

              {formik.touched.description && formik.errors.description && (
                <div className="invalid-feedback">
                  {formik.errors.description}
                </div>
              )}
            </Form.Group>
          </div>
          <div
            style={{
              display: isFeatureBoolean(formik.values.feature)
                ? 'none'
                : 'block',
            }}
          >
            <Form.Group className="mb-3">
              <Form.Label>
                <FormattedMessage id="Unit" />
                <span style={{ color: 'red' }}> *</span>
              </Form.Label>
              <select
                className="form-control"
                id="unit"
                name="unit"
                onChange={formik.handleChange}
                value={
                  isFeatureBoolean(formik.values.feature)
                    ? ''
                    : formik.values.unit
                }
                disabled={isFeatureBoolean(formik.values.feature) || show}
              >
                <option value="">
                  <FormattedMessage id="Select-Option" />
                </option>
                {Object.entries(featureUnitMap).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
              {formik.touched.unit && formik.errors.unit && (
                <Form.Control.Feedback
                  type="invalid"
                  style={{ display: 'block' }}
                >
                  {formik.errors.unit}
                </Form.Control.Feedback>
              )}
            </Form.Group>
          </div>
          <div
            style={{
              display: isFeatureBoolean(formik.values.feature)
                ? 'none'
                : 'block',
            }}
          >
            <Form.Group className="mb-3">
              <Form.Label>
                <FormattedMessage id="Limit" />
                <span style={{ color: 'red' }}> *</span>
              </Form.Label>
              <input
                type="text"
                className="form-control"
                id="limit"
                name="limit"
                onChange={formik.handleChange}
                value={
                  isFeatureBoolean(formik.values.feature)
                    ? ''
                    : formik.values.limit
                }
                disabled={isFeatureBoolean(formik.values.feature) || show}
              />

              {formik.touched.limit && formik.errors.limit && (
                <Form.Control.Feedback
                  type="invalid"
                  style={{ display: 'block' }}
                >
                  {formik.errors.limit}
                </Form.Control.Feedback>
              )}
            </Form.Group>
          </div>
        </Modal.Body>
        <Modal.Footer style={{ display: show ? 'none' : 'block' }}>
          <Button variant="secondary" type="submit">
            <FormattedMessage id="Submit" />
          </Button>
          <Button
            variant="link"
            className="text-gray ms-auto"
            onClick={() => setVisible(false)}
          >
            <FormattedMessage id="Close" />
          </Button>
        </Modal.Footer>
      </Form>
    </Wrapper>
  )
}

export default FeaturePlanForm
