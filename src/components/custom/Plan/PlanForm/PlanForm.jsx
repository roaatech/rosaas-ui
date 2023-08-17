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
    url: planData ? planData.url : '',
    client: planData? planData.client:''
  }

  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Plan Name is required'),
    url: Yup.string()
      .required(<FormattedMessage id="This-field-is-required" />)
      .matches(
        /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,})(:\d{2,5})?(\/[^\s]*)?$/i,
        <FormattedMessage id="Please-enter-a-valid-value" />
      ),
    
  })

  const formik = useFormik({
    initialValues,
    validationSchema: validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      if (type == 'create') {
        const createPlan = await createplanRequest({
          name: values.name,
          url: values.url,
          cleint: values.client,
         
        })
        setUpdate(update + 1)
      } else {
        const editPlan = await editplanRequest({
          data: {
            name: values.name,
            url: values.url,
            cleint: values.client,
          },
          id: planData.id,
        })

        dispatch(
          planInfo({
            id: planData.id,
            name: values.name,
            url: values.url,
            cleint: values.client,
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
                <FormattedMessage id="Url" />
                <span style={{ color: 'red' }}>*</span>
              </Form.Label>
              <input
                type="text"
                className="form-control"
                id="url"
                name="url"
                onChange={formik.handleChange}
                value={formik.values.url}
              />

              {formik.touched.url && formik.errors.url && (
                <Form.Control.Feedback
                  type="invalid"
                  style={{ display: 'block' }}
                >
                  {formik.errors.url}
                </Form.Control.Feedback>
              )}
            </Form.Group>
          </div>
          
          <div>
            <Form.Group className="mb-3">
              <Form.Label>
                <FormattedMessage id="Client" />
                
              </Form.Label>
              <input
                type="text"
                className="form-control"
                id="client"
                name="client"
                onChange={formik.handleChange}
                value={formik.values.client}
              />

              {formik.touched.name && formik.errors.name && (
                <Form.Control.Feedback
                  type="invalid"
                  style={{ display: 'block' }}
                >
                  {formik.errors.url}
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
