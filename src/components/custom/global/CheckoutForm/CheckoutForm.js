import React from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { Button, Modal } from '@themesberg/react-bootstrap'

const CheckoutForm = () => {
  const stripe = useStripe()
  const elements = useElements()

  const initialValues = {
    name: '',
  }

  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
  })

  const handleSubmit = async (values, { setSubmitting, setStatus }) => {
    if (!stripe || !elements) {
      return
    }

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: elements.getElement(CardElement),
      billing_details: {
        name: values.name,
      },
    })

    if (error) {
      setStatus({ success: false, message: error.message })
    } else {
      setStatus({ success: true, message: 'Card saved successfully' })
    }

    setSubmitting(false)
  }

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting, status }) => (
        <Form>
          <Modal.Body>
            <div className="mb-3">
              <label htmlFor="name">Name</label>
              <Field
                type="text"
                name="name"
                id="name"
                className="form-control"
                placeholder="Enter your name"
              />
              <ErrorMessage
                name="name"
                component="div"
                className="text-danger"
              />
            </div>

            <div className="mb-3">
              <label htmlFor="card">Card Details</label>
              <CardElement id="card" className="form-control" />
            </div>

            {status && status.message && (
              <div className={status.success ? 'text-success' : 'text-danger'}>
                {status.message}
              </div>
            )}

            <Button
              variant="primary"
              type="submit"
              disabled={!stripe || isSubmitting}
            >
              {isSubmitting ? 'Processing...' : 'Pay'}
            </Button>
          </Modal.Body>
        </Form>
      )}
    </Formik>
  )
}

export default CheckoutForm
