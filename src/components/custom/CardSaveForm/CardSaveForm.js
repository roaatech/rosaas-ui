import React from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import {
  CardElement,
  useStripe,
  useElements,
  Elements,
} from '@stripe/react-stripe-js'
import { Button, Modal } from '@themesberg/react-bootstrap'
import { loadStripe } from '@stripe/stripe-js'
import { FormattedMessage, useIntl } from 'react-intl'
import useRequest from '../../../axios/apis/useRequest'

const CardSaveFormWithStripe = ({
  setVisible,
  popupLabel,
  visible,

  setCards,
  cards,
}) => {
  const { attachPaymentMethodCard, markCardAsDefault } = useRequest()
  const CardSaveForm = ({ setVisible, popupLabel }) => {
    const stripe = useStripe()
    const elements = useElements()

    const initialValues = {
      name: '',
    }
    const intl = useIntl()

    const validationSchema = Yup.object().shape({
      name: Yup.string().required(<FormattedMessage id="name-required" />),
    })

    const handleSubmit = async (values, { setSubmitting, setStatus }) => {
      if (!stripe || !elements) {
        return
      }

      const stripePayment = await stripe.createPaymentMethod({
        type: 'card',
        card: elements.getElement(CardElement),
        billing_details: {
          name: values.name,
        },
      })

      setCards([
        ...cards,
        {
          stripeCardId: stripePayment?.paymentMethod?.id,
          brand: stripePayment?.paymentMethod?.card?.brand,
          expirationMonth: stripePayment?.paymentMethod?.card?.exp_month,
          expirationYear: stripePayment?.paymentMethod?.card?.exp_year,
          cardholderName: stripePayment?.paymentMethod?.billing_details?.name,
          last4Digits: stripePayment?.paymentMethod?.card?.last4,
        },
      ])

      if (stripePayment.error) {
        setStatus({ success: false, message: stripePayment.error.message })
      } else {
        setStatus({
          success: true,
          message: <FormattedMessage id="card-saved-successfully" />,
        })
        attachPaymentMethodCard(stripePayment?.paymentMethod?.id)
        setVisible(false)
      }

      setSubmitting(false)
    }

    return (
      <>
        {visible && (
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting, status }) => (
              <Form>
                <Modal.Header>
                  <Modal.Title className="h6">{popupLabel}</Modal.Title>
                  <Button
                    variant="close"
                    aria-label="Close"
                    onClick={() => setVisible(false)}
                  />
                </Modal.Header>
                <Modal.Body>
                  <div className="mb-3">
                    <label htmlFor="name">
                      <FormattedMessage id="name" />
                    </label>
                    <Field
                      type="text"
                      name="name"
                      id="name"
                      className="form-control"
                      placeholder={intl.formatMessage({
                        id: 'enter-your-name',
                      })}
                    />
                    <ErrorMessage
                      name="name"
                      component="div"
                      className="text-danger"
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="card">
                      <FormattedMessage id="card-details" />
                    </label>
                    <CardElement id="card" className="form-control" />
                  </div>

                  {status && status.message && (
                    <div
                      className={
                        status.success ? 'text-success' : 'text-danger'
                      }
                    >
                      {status.message}
                    </div>
                  )}

                  <Button
                    variant="primary"
                    type="submit"
                    disabled={!stripe || isSubmitting}
                  >
                    {isSubmitting ? (
                      <FormattedMessage id="processing" />
                    ) : (
                      <FormattedMessage id="pay" />
                    )}
                  </Button>
                </Modal.Body>
              </Form>
            )}
          </Formik>
        )}
      </>
    )
  }
  const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY)

  return (
    <Elements stripe={stripePromise}>
      {visible && (
        <CardSaveForm setVisible={setVisible} popupLabel={popupLabel} />
      )}
    </Elements>
  )
}

export default CardSaveFormWithStripe
