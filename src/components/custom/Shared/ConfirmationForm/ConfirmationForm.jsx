import React, { useEffect, useState } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { Modal, Button } from '@themesberg/react-bootstrap'
import { Form } from '@themesberg/react-bootstrap'
import SafeFormatMessage from '../SafeFormatMessage/SafeFormatMessage'
import { set } from 'lodash'

const ConfirmationForm = ({
  setVisible,
  popupLabel,
  confirmationValue,
  confirmationMessage,
  setConfirmationValue,
  onConfirm,
  variant,
}) => {
  const initialValues = {
    confirmationInput: '',
  }
  const [value, setValue] = useState(confirmationValue)
  useEffect(() => {
    if (confirmationValue == value || !confirmationValue) {
      return
    }

    setValue(confirmationValue)
  }, [confirmationValue])

  const validationSchema = Yup.object().shape({
    confirmationInput: Yup.string()
      .required(<SafeFormatMessage id="This-field-is-required" />)
      .oneOf(
        [confirmationValue],
        <SafeFormatMessage id="Input-does-not-match" />
      ),
  })

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        await onConfirm()
        setConfirmationValue('')
        setVisible(false)
      } catch (error) {
        console.error('Error during confirmation:', error)
      } finally {
        setSubmitting(false)
      }
    },
  })

  return (
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
        <div className={`alert alert-${variant || 'warning'}`} role="alert">
          {confirmationMessage}
        </div>
        <Form.Group className="mb-3">
          <Form.Label>
            <SafeFormatMessage id="Confirmation-Input" />{' '}
            <span style={{ color: 'red' }}>*</span>
          </Form.Label>
          <input
            className="form-control"
            type="text"
            id="confirmationInput"
            name="confirmationInput"
            onChange={formik.handleChange}
            value={formik.values.confirmationInput}
          />
          {formik.touched.confirmationInput &&
            formik.errors.confirmationInput && (
              <Form.Control.Feedback
                type="invalid"
                style={{ display: 'block' }}
              >
                {formik.errors.confirmationInput}
              </Form.Control.Feedback>
            )}
        </Form.Group>
      </Modal.Body>

      <Modal.Footer>
        <Button
          variant={variant || 'primary'}
          type="submit"
          disabled={formik.isSubmitting}
        >
          <SafeFormatMessage id="Confirm" />
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

export default ConfirmationForm
