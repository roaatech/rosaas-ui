import React, { useEffect, useState } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import {
  Modal,
  Button,
  OverlayTrigger,
  Tooltip,
} from '@themesberg/react-bootstrap'
import { Form } from '@themesberg/react-bootstrap'
import SafeFormatMessage from '../SafeFormatMessage/SafeFormatMessage'
import { set } from 'lodash'
import { BsInfo, BsInfoCircle } from 'react-icons/bs'

const ConfirmationForm = ({
  setVisible,
  popupLabel,
  confirmationValue,
  confirmationMessage,
  setConfirmationValue,
  onConfirm,
  variant,
  tooltipMessage,
  confirmationInputLabel,
}) => {
  const initialValues = {
    confirmationInput: '',
  }
  const [value, setValue] = useState(confirmationValue)
  const [confirmLabel, setConfirmLabel] = useState(confirmationInputLabel)
  const [tooltipConfirmMessage, setTooltipConfirmMessage] =
    useState(tooltipMessage)
  useEffect(() => {
    if (confirmationValue && confirmationValue != value) {
      setValue(confirmationValue)
    } else if (
      confirmationInputLabel &&
      confirmLabel != confirmationInputLabel
    ) {
      setConfirmLabel(confirmationInputLabel)
    } else if (tooltipMessage && tooltipMessage != tooltipConfirmMessage) {
      setTooltipConfirmMessage(tooltipMessage)
    }
  }, [confirmationValue, confirmationInputLabel, tooltipMessage])

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
            {confirmationInputLabel}
            <span style={{ color: 'red' }}>*</span>
            <OverlayTrigger
              trigger={['hover', 'focus']}
              overlay={<Tooltip>{tooltipMessage}</Tooltip>}
            >
              <span>
                <BsInfoCircle
                  className="mx-2"
                  style={{ color: 'var(--slate-gray)' }}
                />
              </span>
            </OverlayTrigger>
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
