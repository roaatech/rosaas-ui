import React from 'react'
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
  const initialValues = {
    title: planData ? planData.title : '',
    name: planData ? planData.name : '',
    description: planData ? planData.description : '',
    displayOrder: planData ? planData.displayOrder : '0',
  }
  const allProducts = useSelector((state) => state.products.products)

  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .max(100, <FormattedMessage id="Must-be-maximum-100-digits" />)
      .required(<FormattedMessage id="Unique-Name-is-required" />)
      .matches(
        /^[a-zA-Z0-9_-]+$/,
        <FormattedMessage id="English-Characters,-Numbers,-and-Underscores-are-only-accepted." />
      ),

    title: Yup.string()
      .required(<FormattedMessage id="Title-is-required" />)
      .max(100, <FormattedMessage id="Must-be-maximum-100-digits" />),

    displayOrder: Yup.number()
      .typeError(<FormattedMessage id="Display-Order-must-be-a-number" />)
      .integer(<FormattedMessage id="Display-Order-must-be-an-integer" />)
      .min(0, <FormattedMessage id="Display-Order-must-be-a-positive-number" />)
      .default(0),
  })

  const formik = useFormik({
    initialValues,
    validationSchema: validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      if (type === 'create') {
        const createPlan = await createPlanRequest(productId, {
          name: values.name,
          title: values.title,
          productId: productId,
          description: values.description,
          displayOrder: values.displayOrder || 0,
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
              name: values.name,
              title: values.title,
              description: values.description,
              displayOrder: values.displayOrder || 0,
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
            name: values.name,
            title: values.title,
            description: values.description,
            displayOrder: values.displayOrder || 0,
          },
          id: planData.id,
        })

        dispatch(
          PlanInfo({
            planId: planData.id,
            productId: productId,
            data: {
              name: values.name,
              title: values.title,
              description: values.description,
              displayOrder: values.displayOrder || 0,
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
                <FormattedMessage id="Title" />{' '}
                <span style={{ color: 'red' }}>*</span>
              </Form.Label>
              <input
                className="form-control"
                type="text"
                id="title"
                name="title"
                onChange={formik.handleChange}
                value={formik.values.title}
              />

              {formik.touched.title && formik.errors.title && (
                <Form.Control.Feedback
                  type="invalid"
                  style={{ display: 'block' }}
                >
                  {formik.errors.title}
                </Form.Control.Feedback>
              )}
            </Form.Group>
          </div>
          <div className="mb-3">
            {type === 'create' && (
              <AutoGenerateInput
                label={<FormattedMessage id="Name" />}
                id="name"
                value={formik.values.title}
                name={formik.values.name}
                onChange={formik.handleChange}
                onGenerateUniqueName={(generatedUniqueName) => {
                  formik.setFieldValue('name', generatedUniqueName)
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
            {formik.touched.name && formik.errors.name && (
              <Form.Control.Feedback
                type="invalid"
                style={{ display: 'block' }}
              >
                {formik.errors.name}
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
