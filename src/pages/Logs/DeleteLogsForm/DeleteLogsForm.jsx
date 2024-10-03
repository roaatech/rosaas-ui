import React, { useState } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { Modal, Button, Alert } from '@themesberg/react-bootstrap'
import { Form } from '@themesberg/react-bootstrap'
import useRequest from '../../../axios/apis/useRequest'
import SafeFormatMessage from '../../../components/custom/Shared/SafeFormatMessage/SafeFormatMessage'
import { Calendar } from 'primereact/calendar'
import { logLevels } from '../../../const/const'
import { toast } from 'react-toastify'

const DeleteLogsForm = ({ setVisible }) => {
  const { deleteLogBeforeDate } = useRequest()
  const [errorMessage, setErrorMessage] = useState('')

  const initialValues = {
    deleteDate: '',
    confirmation: '',
    level: '',
  }

  const validationSchema = Yup.object().shape({
    deleteDate: Yup.date()
      .required(<SafeFormatMessage id="Date-is-required" />)
      .nullable(),
    level: Yup.string()
      .required(<SafeFormatMessage id="Level-is-required" />)
      .oneOf(
        ['Trace', 'Debug', 'Information', 'Warning', 'Error', 'Critical'],
        <SafeFormatMessage id="Must-enter-Trace" />
      ),
    confirmation: Yup.string()
      .required(<SafeFormatMessage id="Confirmation-is-required" />)
      .oneOf(['DELETE'], <SafeFormatMessage id="Must-enter-DELETE" />),
  })

  const formik = useFormik({
    initialValues,
    validationSchema: validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const deleteLogs = await deleteLogBeforeDate({
          deleteOlderThan: new Date(values.deleteDate).toISOString(),
          level: values.level,
        })

        if (deleteLogs) {
          toast.success('Logs deleted successfully', {
            position: toast.POSITION.TOP_CENTER,
            autoClose: 4000,
          })
        }

        setVisible(false)
      } catch (error) {
        console.error('Error deleting logs:', error)
        setErrorMessage(<SafeFormatMessage id="Error-deleting-logs" />)
      } finally {
        setSubmitting(false)
      }
    },
  })

  const currentDateTime = new Date().toISOString().slice(0, 16)
  return (
    <Form onSubmit={formik.handleSubmit}>
      <Modal.Header style={{ backgroundColor: '#f8d7da', color: '#721c24' }}>
        <Modal.Title className="h6">
          <SafeFormatMessage id="Delete-Logs-older-than-date" />
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
            <SafeFormatMessage id="Delete-older-than-date" />{' '}
            <span style={{ color: 'red' }}>*</span>
          </Form.Label>
          <input
            className="form-control"
            type="datetime-local"
            id="deleteDate"
            name="deleteDate"
            onChange={formik.handleChange}
            value={formik.values.deleteDate}
            max={currentDateTime}
          />

          {formik.touched.deleteDate && formik.errors.deleteDate && (
            <Form.Control.Feedback type="invalid" style={{ display: 'block' }}>
              {formik.errors.deleteDate}
            </Form.Control.Feedback>
          )}
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>
            <SafeFormatMessage id="Level" />{' '}
            <span style={{ color: 'red' }}>*</span>
          </Form.Label>
          <select
            className="form-control"
            name="level"
            id="level"
            value={formik.values.level}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          >
            <option value="">
              <SafeFormatMessage id="Select-Option" />
            </option>
            {logLevels.map((level, index) => (
              <option key={level} value={level}>
                {level}
              </option>
            ))}
          </select>
          {formik.touched.level && formik.errors.level && (
            <Form.Control.Feedback type="invalid" style={{ display: 'block' }}>
              {formik.errors.level}
            </Form.Control.Feedback>
          )}
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>
            <SafeFormatMessage id="type-'DELETE'-to-confirm" />{' '}
            <span style={{ color: 'red' }}>*</span>
          </Form.Label>
          <input
            className="form-control"
            type="text"
            id="confirmation"
            name="confirmation"
            placeholder="Enter 'DELETE' to confirm"
            onChange={formik.handleChange}
            value={formik.values.confirmation}
          />
          {formik.touched.confirmation && formik.errors.confirmation && (
            <Form.Control.Feedback type="invalid" style={{ display: 'block' }}>
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
  )
}

export default DeleteLogsForm
