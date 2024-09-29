import React, { useState } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { Modal, Button, Alert } from '@themesberg/react-bootstrap'
import { Form } from '@themesberg/react-bootstrap'
import useRequest from '../../../axios/apis/useRequest'
import SafeFormatMessage from '../../../components/custom/Shared/SafeFormatMessage/SafeFormatMessage'

const DeleteLogsForm = ({ setVisible }) => {
  const { deleteLogBeforeDate } = useRequest()
  const [errorMessage, setErrorMessage] = useState('')

  const initialValues = {
    deleteDate: '',
    confirmation: '',
  }

  const validationSchema = Yup.object().shape({
    deleteDate: Yup.date()
      .required(<SafeFormatMessage id="Date-is-required" />)
      .nullable(),
    confirmation: Yup.string()
      .required(<SafeFormatMessage id="Confirmation-is-required" />)
      .oneOf(['DELETE'], <SafeFormatMessage id="Must-enter-DELETE" />),
  })

  const formik = useFormik({
    initialValues,
    validationSchema: validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        await deleteLogBeforeDate({ date: values.deleteDate })
        setVisible(false)
      } catch (error) {
        console.error('Error deleting logs:', error)
        setErrorMessage(<SafeFormatMessage id="Error-deleting-logs" />)
      } finally {
        setSubmitting(false)
      }
    },
  })

  return (
    <Modal show onHide={() => setVisible(false)} centered>
      <Form onSubmit={formik.handleSubmit}>
        <Modal.Header style={{ backgroundColor: '#f8d7da', color: '#721c24' }}>
          <Modal.Title className="h6">
            <SafeFormatMessage id="Delete-All-Logs" />
          </Modal.Title>
          <Button
            variant="close"
            aria-label="Close"
            onClick={() => setVisible(false)}
          />
        </Modal.Header>

        <Modal.Body>
          <Alert variant="danger">
            <SafeFormatMessage id="Warning" />:{' '}
            <SafeFormatMessage id="This-action-will-delete-all-logs-before-specified-date-and-cannot-be-undone" />
          </Alert>

          {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}

          <Form.Group className="mb-3">
            <Form.Label>
              <SafeFormatMessage id="Delete-before-date" />{' '}
              <span style={{ color: 'red' }}>*</span>
            </Form.Label>
            <input
              className="form-control"
              type="date"
              id="deleteDate"
              name="deleteDate"
              onChange={formik.handleChange}
              value={formik.values.deleteDate}
            />
            {formik.touched.deleteDate && formik.errors.deleteDate && (
              <Form.Control.Feedback
                type="invalid"
                style={{ display: 'block' }}
              >
                {formik.errors.deleteDate}
              </Form.Control.Feedback>
            )}
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>
              <SafeFormatMessage id="Confirmation" />{' '}
              <span style={{ color: 'red' }}>*</span>
            </Form.Label>
            <input
              className="form-control"
              type="text"
              id="confirmation"
              name="confirmation"
              placeholder="Enter DELETE to confirm"
              onChange={formik.handleChange}
              value={formik.values.confirmation}
            />
            {formik.touched.confirmation && formik.errors.confirmation && (
              <Form.Control.Feedback
                type="invalid"
                style={{ display: 'block' }}
              >
                {formik.errors.confirmation}
              </Form.Control.Feedback>
            )}
          </Form.Group>
        </Modal.Body>

        <Modal.Footer>
          <Button
            variant="danger"
            type="submit"
            disabled={formik.isSubmitting}
            style={{ backgroundColor: '#dc3545', borderColor: '#dc3545' }}
          >
            <SafeFormatMessage id="Delete" />
          </Button>
          <Button
            variant="link"
            className="text-gray"
            onClick={() => setVisible(false)}
          >
            <SafeFormatMessage id="Cancel" />
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  )
}

export default DeleteLogsForm
