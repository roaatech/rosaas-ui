import React, { useEffect, useState } from 'react'
import { useFormik } from 'formik'
import { InputText } from 'primereact/inputtext'
import * as Yup from 'yup'
import useRequest from '../../../../../axios/apis/useRequest.js'
import {
  Modal,
  Button,
  OverlayTrigger,
  Tooltip,
} from '@themesberg/react-bootstrap'
import { Form } from '@themesberg/react-bootstrap'

import { useDispatch, useSelector } from 'react-redux'
import { FormattedMessage } from 'react-intl'
import { GiPerspectiveDiceSixFacesRandom } from 'react-icons/gi'
import { Wrapper } from './FeaturePlanForm.styled.jsx'
import { AiFillCopy } from 'react-icons/ai'
import { useNavigate, useParams } from 'react-router-dom'
import { features } from '../../../../../store/slices/products.js'
import { setAllPlans } from '../../../../../store/slices/plans.js'

const FeaturePlanForm = ({
  type,
  FeaturePlanData,
  setVisible,
  popupLabel,
  update,
  setUpdate,
}) => {
  const routeParams = useParams()
  const productId = routeParams.id
  const { getFeatureList, getPlanList } = useRequest()
  const dispatch = useDispatch()

  const allProducts = useSelector((state) => state.products.products)
  const listFeatureData = allProducts[productId]?.features
  let allFeatureArray = listFeatureData && Object.values(listFeatureData)
  const allPlans = useSelector((state) => state.plans.plans)
  let allPlansArray = allPlans && Object.values(allPlans)

  const featureOptions = listFeatureData
    ? allFeatureArray.map((item, index) => {
        return { value: item.id, label: item.name }
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
        console.log(featureReq.data.data, 'featureReq')
        dispatch(features({ id: productId, data: featureReq.data.data }))
      }
      if (allPlansArray.length === 0) {
        const featureReq = await getPlanList(productId)
        dispatch(setAllPlans(featureReq.data.data.items))
      }
    })()
  }, [])

  const initialValues = {
    feature: FeaturePlanData ? FeaturePlanData?.feature.id : '',
    plan: FeaturePlanData ? FeaturePlanData?.plans.id : '',
  }

  const validationSchema = Yup.object().shape({
    feature: Yup.string().required('Please select a feature'),
    plan: Yup.string().required('Please select a plan'),
    // name: Yup.string().required('FeaturePlan Name is required'),
    // defaultHealthCheckUrl: Yup.string()
    //   .required(<FormattedMessage id="This-field-is-required" />)
    //   .matches(
    //     /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,})(:\d{2,5})?(\/[^\s]*)?$/i,
    //     <FormattedMessage id="Please-enter-a-valid-value" />
    //   ),
    // healthStatusChangeUrl: Yup.string()
    //   .required(<FormattedMessage id="This-field-is-required" />)
    //   .matches(
    //     /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,})(:\d{2,5})?(\/[^\s]*)?$/i,
    //     <FormattedMessage id="Please-enter-a-valid-value" />
    //   ),
  })

  const formik = useFormik({
    initialValues,
    validationSchema: validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      console.log(values, '88888888888')
      // if (type == 'create') {
      //   const createFeaturePlan = await createFeaturePlanRequest({
      //     name: values.name,
      //   })
      //   setUpdate(update + 1)
      // } else {
      //   const editFeaturePlan = await editFeaturePlanRequest({
      //     data: {
      //       name: values.name,
      //     },
      //   })
      //   dispatch(
      //     FeaturePlanInfo({
      //       id: FeaturePlanData.id,
      //       name: values.name,
      //     })
      //   )
      // }
      // setVisible && setVisible(false)
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
          {/* <div>
            <Form.Group className="mb-3">
              <Form.Label>
                <FormattedMessage id="Name" />
                <span style={{ color: 'red' }}>*</span>
              </Form.Label>
              <input
                type="text"
                className="form-control"
                id="name"
                name="name"
                onChange={formik.handleChange}
                value={formik.values.name}
              />

              {formik.touched.name && formik.errors.name && (
                <Form.Control.Feedback
                  type="invalid"
                  style={{ display: 'block' }}
                >
                  {formik.errors.name}
                </Form.Control.Feedback>
              )}
            </Form.Group>
          </div> */}

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
                    {option.label}
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
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            type="submit"
            // disabled={submitLoading}
          >
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
