import React, { useState } from 'react'
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

const CardSaveForm = ({
  setVisible,
  popupLabel,
  setCards,
  cards,
  autoRenewal,
  currentSubscription,
}) => {
  const { attachPaymentMethodCard, markCardAsDefault, setAutoRenewal } =
    useRequest()
  const [errorMessage, setErrorMessage] = useState(null)
  const stripe = useStripe()
  const elements = useElements()
  const intl = useIntl()

  const initialValues = {
    name: '',
  }

  const validationSchema = Yup.object().shape({
    name: Yup.string().required(<FormattedMessage id="name-required" />),
  })
  const handleAutoRenewForm = async (cardReferenceId) => {
    try {
      await setAutoRenewal({
        subscriptionId: currentSubscription,
        cardReferenceId,
        paymentPlatform: 2,
      })
      setVisible && setVisible(false)
    } catch (error) {
      console.error('Error submitting form:', error)
    }
  }
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

    if (stripePayment.error) {
      setStatus({ success: false, message: stripePayment.error.message })
      setErrorMessage(stripePayment.error.message)
    } else {
      setStatus({
        success: true,
        message: <FormattedMessage id="card-saved-successfully" />,
      })
      attachPaymentMethodCard(stripePayment?.paymentMethod?.id)
        .then(() => {
          if (autoRenewal) {
            handleAutoRenewForm(stripePayment?.paymentMethod?.id)
          }
          setCards([
            ...cards,
            {
              stripeCardId: stripePayment?.paymentMethod?.id,
              brand: stripePayment?.paymentMethod?.card?.brand,
              expirationMonth: stripePayment?.paymentMethod?.card?.exp_month,
              expirationYear: stripePayment?.paymentMethod?.card?.exp_year,
              cardholderName:
                stripePayment?.paymentMethod?.billing_details?.name,
              last4Digits: stripePayment?.paymentMethod?.card?.last4,
            },
          ])
        })
        .catch((error) => {
          console.error(error.response.data)
        })

      setVisible(false)
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
              <CardElement
                id="card"
                className="form-control"
                options={{
                  hidePostalCode: true,
                }}
              />
              {errorMessage && (
                <div className="text-danger">{errorMessage}</div>
              )}
            </div>

            <Button
              variant="secondary"
              type="submit"
              disabled={!stripe || isSubmitting || status?.success == false}
            >
              {isSubmitting ? (
                <FormattedMessage id="processing" />
              ) : (
                <FormattedMessage id="Submit" />
              )}
            </Button>
          </Modal.Body>
        </Form>
      )}
    </Formik>
  )
}

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY)

const CardSaveFormWithStripe = ({
  setVisible,
  popupLabel,
  visible,
  setCards,
  cards,
  autoRenewal,
  currentSubscription,
}) => {
  return (
    <Elements stripe={stripePromise}>
      {visible && (
        <CardSaveForm
          setVisible={setVisible}
          popupLabel={popupLabel}
          setCards={setCards}
          cards={cards}
          autoRenewal={autoRenewal}
          currentSubscription={currentSubscription}
        />
      )}
    </Elements>
  )
}

export default CardSaveFormWithStripe
