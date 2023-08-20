import React from 'react'
import { useFormik } from 'formik'
import { InputText } from 'primereact/inputtext'
import * as Yup from 'yup'
import useRequest from '../../../../axios/apis/useRequest.js'
import { Product_Client_id } from '../../../../const/index.js'
import { Modal, Button } from '@themesberg/react-bootstrap'
import { Form } from '@themesberg/react-bootstrap'
import { planInfo } from '../../../../store/slices/plans.js'
import { useDispatch } from 'react-redux'
import { FormattedMessage } from 'react-intl'

const PlanForm = ({
  type,
  planData,
  setVisible,
  popupLabel,
  update,
  setUpdate,
}) => {
  const { createplanRequest,  editplanRequest } = useRequest()
  const dispatch = useDispatch()

  const initialValues = {
    name: planData ? planData.name : '',
    description: planData ? planData.description : '',
    displayOrder:planData ? planData.displayOrder:'0',
    
  }

  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Plan Name is required').max(15, 'Name must be at most 15 characters'),
    description: Yup.string().max(250, 'Description must be at most 250 characters'),
    displayOrder: Yup.number().typeError('Display Order must be a number').default(0),
      
    
  })

  const formik = useFormik({
    initialValues,
    validationSchema: validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      if (!values.displayOrder) {
        values.displayOrder = 0;
      }
      if (type == 'create') {
        const createPlan = await createplanRequest({
          name: values.name,
          
          description:values.description,
          displayOrder:values.displayOrder
         
        })
        setUpdate(update + 1)
      } else {
        const editPlan = await editplanRequest({
          data: {
            name: values.name,
            description:values.description,
            displayOrder:values.displayOrder
          },
          id: planData.id,
        })

        dispatch(
          planInfo({
            id: planData.id,
            name: values.name,
            description:values.description,
            displayOrder:values.displayOrder
          })
        )
      }

      setVisible && setVisible(false)
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
      <Form.Control.Feedback type="invalid" style={{ display: 'block' }}>
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
            className="text-gray ms-auto"
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
