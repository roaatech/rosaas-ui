import React from 'react'
import { useFormik } from 'formik'
import { InputText } from 'primereact/inputtext'
import * as Yup from 'yup'
import useRequest from '../../../../axios/apis/useRequest.js'
import { Product_Client_id } from '../../../../const/index.js'
import { Modal, Button } from '@themesberg/react-bootstrap'
import { Form } from '@themesberg/react-bootstrap'
// import { planInfo } from '../../../../store/slices/plans.js'
import { useDispatch } from 'react-redux'
import { FormattedMessage } from 'react-intl'
import { useNavigate } from 'react-router-dom'

const PlanForm = ({
  type,
  planData,
  setVisible,
  popupLabel,
  update,
  setUpdate,
}) => {
  const { createPlanRequest, editPlanRequest } = useRequest()
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const initialValues = {
    systemName: planData ? planData.systemName : '',
    description: planData ? planData.description : '',
    displayOrder: planData ? planData.displayOrder : '0',
  }

  const validationSchema = Yup.object().shape({
    systemName: Yup.string()
      .required('Plan Name is required')
      .max(15, 'Name must be at most 15 characters'),
    description: Yup.string().max(
      250,
      'Description must be at most 250 characters'
    ),
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
      if (!values.displayOrder) {
        values.displayOrder = 0
      }
      if (type == 'create') {
        const createPlan = await createPlanRequest({
          systemName: values.systemName,

          description: values.description,
          displayOrder: values.displayOrder,
        })
        navigate(`/plans/${createPlan.data.data.id}`)
        setUpdate(update + 1)
      } else {
        const editPlan = await editPlanRequest({
          data: {
            systemName: values.systemName,
            description: values.description,
            displayOrder: values.displayOrder,
          },
          id: planData.id,
        })

        dispatch()
        // planInfo({
        //   id: planData.id,
        //   systemName: values.systemName,
        //   description: values.description,
        //   displayOrder: values.displayOrder,
        // })
      }

      setVisible && setVisible(false)
    },
  })

  return (
    <div>
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
                <FormattedMessage id="System-Name" />
                <span style={{ color: 'red' }}>*</span>
              </Form.Label>
              <input
                type="text"
                className="form-control"
                id="systemName"
                name="systemName"
                onChange={formik.handleChange}
                value={formik.values.systemName}
              />

              {formik.touched.systemName && formik.errors.systemName && (
                <Form.Control.Feedback
                  type="invalid"
                  style={{ display: 'block' }}
                >
                  {formik.errors.systemName}
                </Form.Control.Feedback>
              )}
            </Form.Group>
          </div>

          <div>
            <Form.Group className="mb-3">
              <Form.Label>
                <FormattedMessage id="Description" />
              </Form.Label>

              <textarea
                className="form-control"
                id="description"
                name="description"
                onChange={formik.handleChange}
                value={formik.values.description}
                rows={3} // Set the number of rows you want to show initially
                style={{ resize: 'vertical' }} // Allow vertical resizing
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
          <Button
            variant="secondary"
            type="submit"
            // disabled={submitLoading}
          >
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
    </div>
  )
}

export default PlanForm
