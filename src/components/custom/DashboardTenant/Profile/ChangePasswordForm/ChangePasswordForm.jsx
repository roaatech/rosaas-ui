import React from 'react'
import * as Yup from 'yup'
import useRequest from '../../../../../axios/apis/useRequest'
import { useFormik } from 'formik'
import { Button, Form, Modal } from '@themesberg/react-bootstrap'
import { FormattedMessage } from 'react-intl'
import SafeFormatMessage from '../../../Shared/SafeFormatMessage/SafeFormatMessage'

const ChangePasswordForm = ({ setVisible, popupLabel }) => {
  const { changePassword } = useRequest()

  const initialValues = {
    currentPassword: '',
    newPassword: '',
    repeatPassword: '',
  }

  const validationSchema = Yup.object().shape({
    currentPassword: Yup.string().required('Current Password is required'),
    newPassword: Yup.string()
      .required('New Password is required')
      .min(8, 'Password must be at least 8 characters long'),
    repeatPassword: Yup.string()
      .required('Repeat Password is required')
      .oneOf([Yup.ref('newPassword'), null], 'Passwords must match'),
  })

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        await changePassword({
          currentPassword: values.currentPassword,
          newPassword: values.newPassword,
        })
        resetForm()
        setVisible(false)
        // Optionally, add success message or redirect to another page
      } catch (error) {
        console.error('Error changing password:', error)
        // Optionally, display error message
      } finally {
        setSubmitting(false)
      }
    },
  })

  return (
    <Form onSubmit={formik.handleSubmit}>
      <Modal.Header closeButton>
        <Modal.Title className="h6">
          {<SafeFormatMessage id={popupLabel} />}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Group className="mb-3">
          <Form.Label>Current Password</Form.Label>
          <Form.Control
            type="password"
            id="currentPassword"
            name="currentPassword"
            value={formik.values.currentPassword}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            isInvalid={
              formik.touched.currentPassword && !!formik.errors.currentPassword
            }
          />
          <Form.Control.Feedback type="invalid">
            {formik.errors.currentPassword}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>New Password</Form.Label>
          <Form.Control
            type="password"
            id="newPassword"
            name="newPassword"
            value={formik.values.newPassword}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            isInvalid={
              formik.touched.newPassword && !!formik.errors.newPassword
            }
          />
          <Form.Control.Feedback type="invalid">
            {formik.errors.newPassword}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Repeat Password</Form.Label>
          <Form.Control
            type="password"
            id="repeatPassword"
            name="repeatPassword"
            value={formik.values.repeatPassword}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            isInvalid={
              formik.touched.repeatPassword && !!formik.errors.repeatPassword
            }
          />
          <Form.Control.Feedback type="invalid">
            {formik.errors.repeatPassword}
          </Form.Control.Feedback>
        </Form.Group>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="secondary"
          type="submit"
          disabled={formik.isSubmitting}
        >
          <SafeFormatMessage id="Submit" />
        </Button>
        <Button
          variant="link"
          className="text-gray"
          onClick={() => setVisible(false)}
          disabled={formik.isSubmitting}
        >
          <SafeFormatMessage id="Close" />
        </Button>
      </Modal.Footer>
    </Form>
  )
}

export default ChangePasswordForm
