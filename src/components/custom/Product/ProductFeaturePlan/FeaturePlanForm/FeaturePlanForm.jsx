import React, { useEffect, useState } from 'react'
import { useFormik } from 'formik'
import { InputText } from 'primereact/inputtext'
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
  features,
} from '../../../../../store/slices/products.js'
import { setAllPlans } from '../../../../../store/slices/plans.js'
import TextareaAndCounter from '../../../Shared/TextareaAndCounter/TextareaAndCounter.jsx'

const FeaturePlanForm = ({ type, FeaturePlanData, setVisible, popupLabel }) => {
  const routeParams = useParams()
  const productId = routeParams.id
  const {
    getFeatureList,
    getPlanList,
    createFeaturePlanRequest,
    editFeaturePlanRequest,
  } = useRequest()
  const dispatch = useDispatch()

  const allProducts = useSelector((state) => state.products.products)
  const listFeatureData = allProducts[productId]?.features
  let allFeatureArray = listFeatureData && Object.values(listFeatureData)
  const allPlans = useSelector((state) => state.plans.plans)
  let allPlansArray = allPlans && Object.values(allPlans)

  const featureOptions = listFeatureData
    ? allFeatureArray.map((item, index) => {
        return {
          value: item.id,
          label: item.name,
          type: item.type == 1 ? 'Number' : 'Boolean',
        }
      })
    : []
  const planOptions = allPlans
    ? allPlansArray.map((item, index) => {
        return { value: item.id, label: item.name }
      })
    : []

  useEffect(() => {
    ;(async () => {
      if (!listFeatureData) {
        const featureReq = await getFeatureList(productId)
        dispatch(features({ productId: productId, data: featureReq.data.data }))
      }
      if (allPlansArray.length === 0) {
        const featureReq = await getPlanList(productId)
        dispatch(setAllPlans(featureReq.data.data.items))
      }
    })()
  }, [])

  const initialValues = {
    feature: FeaturePlanData ? FeaturePlanData?.feature?.id : '',
    plan: FeaturePlanData ? FeaturePlanData?.plan?.id : '',
    limit: FeaturePlanData ? FeaturePlanData?.limit : 1,
    description: FeaturePlanData ? FeaturePlanData?.description : '',
  }

  const validationSchema = Yup.object().shape({
    feature: Yup.string().required('Please select a feature'),
    plan: Yup.string().required('Please select a plan'),
    limit: Yup.number()
      .required('This field is required')
      .typeError('Limit must be a number')
      .integer('Limit must be an integer')
      .min(1, 'Limit must be a more than 0'),

    // limit: Yup.string().test(
    //   'limit-validation',
    //   'limit is required when Type is Number',
    //   function (value) {
    //     const feature = this.resolve(Yup.ref('feature'))
    //     if (
    //       featureOptions.find((obj) => obj.value === feature)?.type == 'Boolean'
    //     ) {
    //       return value !== undefined && value !== ''
    //     }
    //     return true
    //   }
    // ),

    // .default(1),
  })

  const formik = useFormik({
    initialValues,
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      if (type == 'create') {
        const info = {
          productId: productId,
          data: {
            description: values.description,
            limit: values.limit,
            feature: {
              id: values.feature,
              name: featureOptions.find((item) => item.value === values.feature)
                .label,
            },
            plan: {
              id: values.plan,
              name: planOptions.find((item) => item.value === values.plan)
                .label,
            },

            editedDate: new Date().toISOString().slice(0, 19),
            createdDate: new Date().toISOString().slice(0, 19),
          },
        }
        const createFeaturePlan = await createFeaturePlanRequest({
          productId: productId,
          data: {
            description: values.description,
            limit: values.limit,
            featureId: values.feature,
            planId: values.plan,
          },
        })
        info.data.id = createFeaturePlan.data.data.id
        dispatch(featurePlanInfo(info))
      } else {
        const editFeaturePlan = await editFeaturePlanRequest({
          productId: productId,
          featurePlanId: FeaturePlanData.id,
          data: {
            description: values.description,
            limit: values.limit,
          },
        })

        const newData = JSON.parse(JSON.stringify(FeaturePlanData))
        newData.description = values.description
        newData.limit = values.limit

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
                Plan <span style={{ color: 'red' }}>*</span>
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
              />

              {formik.touched.description && formik.errors.description && (
                <div className="invalid-feedback">
                  {formik.errors.description}
                </div>
              )}
            </Form.Group>
          </div>
          <div>
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
                  featureOptions.find(
                    (obj) => obj.value === formik.values.feature
                  )?.type == 'Boolean'
                    ? ''
                    : formik.values.limit
                }
                disabled={
                  featureOptions.find(
                    (obj) => obj.value === formik.values.feature
                  )?.type == 'Boolean'
                }
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
        <Modal.Footer>
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
