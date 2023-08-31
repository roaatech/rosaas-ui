import React, { useState } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import useRequest from '../../../../../axios/apis/useRequest.js'
import { Modal, Button } from '@themesberg/react-bootstrap'
import { Form } from '@themesberg/react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { FormattedMessage } from 'react-intl'
import { Wrapper } from './PlanForm.styled.jsx'
import { useParams } from 'react-router-dom'
import { PlanInfo, setAllPlans } from '../../../../../store/slices/products.js'

import TextareaAndCounter from '../../../Shared/TextareaAndCounter/TextareaAndCounter.jsx'

const PlanForm = ({ type, planData, setVisible, popupLabel }) => {
  const { createPlanRequest, editPlanRequest, getProductPlans } = useRequest()
  const dispatch = useDispatch()
  const routeParams = useParams()
  const productId = routeParams.id
  const initialValues = {
    name: planData ? planData.name : '',
    description: planData ? planData.description : '',
    displayOrder: planData ? planData.displayOrder : '0',
  }
  const allProducts = useSelector((state) => state.products.products)

  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .required('Plan Name is required')
      .max(15, 'Name must be at most 15 characters'),

    description: Yup.string().required('Description is required'),
    displayOrder: Yup.number()
      .typeError('Display Order must be a number')
      .integer('Display Order must be an integer')
      .min(0, 'Display Order must be a positive number')
      .default(0),
  })
  const formik = useFormik({
    initialValues,
    validationSchema: validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      if (type === 'create') {
        const createPlan = await createPlanRequest(productId, {
          name: values.name,
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
              description: values.description,
              displayOrder: values.displayOrder || 0,
              editedDate: new Date().toISOString().slice(0, 19),
              createdDate: new Date().toISOString().slice(0, 19),
              id: createPlan.data.data.id,
            },
          })
        )
      } else {
        const editPlan = await editPlanRequest(productId, {
          data: {
            name: values.name,
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
                <FormattedMessage id="Name" />{' '}
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
              {/* Display validation error */}
              {formik.touched.name && formik.errors.name && (
                <Form.Control.Feedback
                  type="invalid"
                  style={{ display: 'block' }}
                >
                  {formik.errors.name}
                </Form.Control.Feedback>
              )}
            </Form.Group>
          </div>
          <div>
            <Form.Group className="mb-3">
              <Form.Label>
                <FormattedMessage id="Description" />{' '}
                <span style={{ color: 'red' }}>*</span>
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

export default PlanForm
