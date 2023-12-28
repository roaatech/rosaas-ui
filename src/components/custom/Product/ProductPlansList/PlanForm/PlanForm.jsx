import React, { useEffect } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import useRequest from '../../../../../axios/apis/useRequest.js'
import { Modal, Button } from '@themesberg/react-bootstrap'
import { Form } from '@themesberg/react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { FormattedMessage } from 'react-intl'
import { Wrapper } from './PlanForm.styled.jsx'
import { useParams } from 'react-router-dom'
import {
  PlanInfo,
  setAllPlans,
} from '../../../../../store/slices/products/productsSlice.js'

import TextareaAndCounter from '../../../Shared/TextareaAndCounter/TextareaAndCounter.jsx'
import { activeTab } from '../../../../../const/product.js'
import AutoGenerateInput from '../../../Shared/AutoGenerateInput/AutoGenerateInput.jsx'

const PlanForm = ({
  type,
  planData,
  setVisible,
  popupLabel,
  setActiveIndex,
}) => {
  const { createPlanRequest, editPlanRequest, getProductPlans } = useRequest()
  const dispatch = useDispatch()
  const routeParams = useParams()
  const productId = routeParams.id
  const allProducts = useSelector((state) => state.products.products)

  const ProductTrialType = allProducts[productId].trialType

  const initialValues = {
    displayName: planData ? planData.displayName : '',
    systemName: planData ? planData.systemName : '',
    description: planData ? planData.description : '',
    displayOrder: planData ? planData.displayOrder : '0',
    alternativePlanID: planData ? planData.alternativePlanID : '',
    trialPeriodInDays: planData ? planData.trialPeriodInDays : '0',
  }

  const validationSchema = Yup.object().shape({
    systemName: Yup.string()
      .max(100, <FormattedMessage id="Must-be-maximum-100-digits" />)
      .required(<FormattedMessage id="Unique-Name-is-required" />)
      .matches(
        /^[a-zA-Z0-9_-]+$/,
        <FormattedMessage id="English-Characters,-Numbers,-and-Underscores-are-only-accepted." />
      ),

    displayName: Yup.string()
      .required(<FormattedMessage id="displayName-is-required" />)
      .max(100, <FormattedMessage id="Must-be-maximum-100-digits" />),

    displayOrder: Yup.number()
      .typeError(<FormattedMessage id="Display-Order-must-be-a-number" />)
      .integer(<FormattedMessage id="Display-Order-must-be-an-integer" />)
      .min(0, <FormattedMessage id="Display-Order-must-be-a-positive-number" />)
      .default(0),
    alternativePlanID: Yup.string(),
    trialPeriodInDays: Yup.number(),
  })
  useEffect(() => {
    const fetchData = async () => {
      if (!allProducts[productId].plan) {
        try {
          const plan = await getProductPlans(productId)
          dispatch(
            setAllPlans({
              productId: productId,
              data: plan.data.data,
            })
          )
        } catch (error) {
          console.error('Error fetching product plans:', error)
        }
      }
    }

    fetchData()
  }, [])

  const formik = useFormik({
    initialValues,
    validationSchema: validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      if (type === 'create') {
        const createPlan = await createPlanRequest(productId, {
          systemName: values.systemName,
          displayName: values.displayName,
          productId: productId,
          description: values.description,
          displayOrder: values.displayOrder || 0,
          alternativePlanID: values.alternativePlanID,
          trialPeriodInDays: values.trialPeriodInDays || 0,
        })

        if (!allProducts[productId].plan) {
          const plan = await getProductPlans(productId)
          dispatch(
            setAllPlans({
              productId: productId,
              data: plan.data.data,
            })
          )
        }
        dispatch(
          PlanInfo({
            planId: createPlan.data.data.id,
            productId: productId,
            data: {
              systemName: values.systemName,
              displayName: values.displayName,
              description: values.description,
              displayOrder: values.displayOrder || 0,
              alternativePlanID: values.alternativePlanID,
              trialPeriodInDays: values.trialPeriodInDays || 0,
              editedDate: new Date().toISOString().slice(0, 19),
              createdDate: new Date().toISOString().slice(0, 19),
              id: createPlan.data.data.id,
            },
          })
        )

        if (setActiveIndex) {
          setActiveIndex(activeTab.plans)
        }
      } else {
        const editPlan = await editPlanRequest(productId, {
          data: {
            systemName: values.systemName,
            displayName: values.displayName,
            description: values.description,
            displayOrder: values.displayOrder || 0,
            alternativePlanID: values.alternativePlanID,
            trialPeriodInDays: values.trialPeriodInDays || 0,
          },
          id: planData.id,
        })

        dispatch(
          PlanInfo({
            planId: planData.id,
            productId: productId,
            data: {
              systemName: values.systemName,
              displayName: values.displayName,
              description: values.description,
              displayOrder: values.displayOrder || 0,
              alternativePlanID: values.alternativePlanID,
              trialPeriodInDays: values.trialPeriodInDays || 0,
              editedDate: new Date().toISOString().slice(0, 19),
              createdDate: planData.createdDate,
              id: planData.id,
            },
          })
        )
      }

      setVisible && setVisible(false)
      setSubmitting(false)
    },
  })
  let alternativePlanIDOptions

  if (allProducts[productId]?.plans) {
    alternativePlanIDOptions = Object.values(allProducts[productId].plans)
      .filter((item) => item.isPublished === true && planData?.id != item.id)
      .map((item, index) => ({
        value: item.id,
        label: item.displayName,
      }))
  } else {
    alternativePlanIDOptions = []
  }
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
                <FormattedMessage id="Display-Name" />{' '}
                <span style={{ color: 'red' }}>*</span>
              </Form.Label>
              <input
                className="form-control"
                type="text"
                id="displayName"
                name="displayName"
                onChange={formik.handleChange}
                value={formik.values.displayName}
              />

              {formik.touched.displayName && formik.errors.displayName && (
                <Form.Control.Feedback
                  type="invalid"
                  style={{ display: 'block' }}
                >
                  {formik.errors.displayName}
                </Form.Control.Feedback>
              )}
            </Form.Group>
          </div>
          <div className="mb-3">
            {type === 'create' && (
              <AutoGenerateInput
                label={<FormattedMessage id="System-Name" />}
                id="systemName"
                value={formik.values.displayName}
                name={formik.values.systemName}
                onChange={formik.handleChange}
                onGenerateUniqueName={(generatedUniqueName) => {
                  formik.setFieldValue('systemName', generatedUniqueName)
                }}
                onAutoGenerateClick={() => {
                  formik.setFieldValue(
                    'isAutoGenerated',
                    !formik.values.isAutoGenerated
                  )
                }}
                isAutoGenerated={formik.values.isAutoGenerated}
              />
            )}
            {formik.touched.systemName && formik.errors.systemName && (
              <Form.Control.Feedback
                type="invalid"
                style={{ display: 'block' }}
              >
                {formik.errors.systemName}
              </Form.Control.Feedback>
            )}
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
                <Form.Control.Feedback
                  type="invalid"
                  style={{ display: 'block' }}
                >
                  {formik.errors.description}
                </Form.Control.Feedback>
              )}
            </Form.Group>
          </div>
          <div>
            <Form.Group className="mb-3">
              <Form.Label>
                <FormattedMessage id="Display-Order" />
              </Form.Label>
              <input
                type="text"
                className="form-control"
                id="displayOrder"
                name="displayOrder"
                onChange={formik.handleChange}
                value={formik.values.displayOrder}
              />

              {formik.touched.displayOrder && formik.errors.displayOrder && (
                <Form.Control.Feedback
                  type="invalid"
                  style={{ display: 'block' }}
                >
                  {formik.errors.displayOrder}
                </Form.Control.Feedback>
              )}
            </Form.Group>
          </div>
          {ProductTrialType == 3 && (
            <div>
              <Form.Group className="mb-3">
                <Form.Label>
                  <FormattedMessage id="Trial-Period-In-Days" />
                </Form.Label>
                <input
                  type="text"
                  className="form-control"
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
          <div>
            <Form.Group className="mb-3">
              <Form.Label>
                <FormattedMessage id="Alternative-Plan" />{' '}
              </Form.Label>
              <select
                className="form-control"
                name="alternativePlanID"
                id="alternativePlanID"
                value={formik.values.alternativePlanID}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                disabled={!productId}
              >
                <option value="">
                  <FormattedMessage id="Select-Option" />
                </option>
                {alternativePlanIDOptions?.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {formik.touched.alternativePlanID &&
                formik.errors.alternativePlanID && (
                  <Form.Control.Feedback
                    type="invalid"
                    style={{ display: 'block' }}
                  >
                    {formik.errors.alternativePlanID}
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

export default PlanForm
