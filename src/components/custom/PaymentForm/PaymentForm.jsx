// import { useEffect, useState } from 'react'

// import {
//   Elements,
//   LinkAuthenticationElement,
//   PaymentElement,
//   useElements,
//   useStripe,
// } from '@stripe/react-stripe-js'
// import { loadStripe } from '@stripe/stripe-js'
// import useRequest from '../../../axios/apis/useRequest'
// import { ErrorMessage, Field, Formik } from 'formik'
// import { Form } from '@themesberg/react-bootstrap'
// import * as Yup from 'yup'

// function PaymentForm(props) {
//   const [stripePromise, setStripePromise] = useState(null)
//   const { getConfig, fetchPaymentIntent } = useRequest()

//   useEffect(() => {
//     ;(async () => {
//       const featurePlan = await getConfig()
//       const { publishableKey } = featurePlan
//       setStripePromise(loadStripe(publishableKey))
//     })()
//   }, [])

//   const [clientSecret, setClientSecret] = useState('')

//   useEffect(() => {
//     ;(async () => {
//       const PaymentIntent = await fetchPaymentIntent()
//       const { clientSecret } = PaymentIntent
//       setClientSecret(clientSecret)
//     })()
//   }, [])
//   const CheckoutForm = () => {
//     const stripe = useStripe()
//     const elements = useElements()
//     const [message, setMessage] = useState(null)
//     const [isLoading, setIsLoading] = useState(false)

//     const initialValues = {
//       email: '', // Add any other fields you want to collect here
//     }

//     const validationSchema = Yup.object().shape({
//       email: Yup.string().email('Invalid email').required('Email is required'),
//       // Add validation for other fields if needed
//     })

//     const handleSubmit = async (values, { setSubmitting }) => {
//       setSubmitting(true)
//       setIsLoading(true)

//       if (!stripe || !elements) {
//         return
//       }

//       const { error } = await stripe.confirmPayment({
//         elements,
//         confirmParams: {
//           return_url: `${window.location.origin}/completion`,
//         },
//       })

//       if (error) {
//         setMessage(error.message)
//       } else {
//         setMessage('An unexpected error occurred.')
//       }

//       setIsLoading(false)
//       setSubmitting(false)
//     }

//     return (
//       <Formik
//         initialValues={initialValues}
//         validationSchema={validationSchema}
//         onSubmit={handleSubmit}
//       >
//         {({ isSubmitting }) => (
//           <Form id="payment-form">
//             <div className="mb-3">
//               <label htmlFor="email">Email</label>
//               <Field
//                 type="email"
//                 name="email"
//                 id="email"
//                 className="form-control"
//               />
//               <ErrorMessage
//                 name="email"
//                 component="div"
//                 className="text-danger"
//               />
//             </div>

//             <LinkAuthenticationElement id="link-authentication-element" />

//             <div className="mb-3">
//               <label htmlFor="card">Card Details</label>
//               <PaymentElement id="payment-element" />
//             </div>

//             <button
//               type="submit"
//               disabled={isLoading || isSubmitting || !stripe || !elements}
//               id="submit"
//               className="btn btn-primary"
//             >
//               {isLoading ? <div className="spinner"></div> : 'Pay Now'}
//             </button>

//             {message && <div id="payment-message">{message}</div>}
//           </Form>
//         )}
//       </Formik>
//     )
//   }

//   return (
//     <>
//       <h1>Payment</h1>
//       {/* {clientSecret && stripePromise && ( */}
//       <Elements stripe={stripePromise} options={{ clientSecret }}>
//         <CheckoutForm />
//       </Elements>
//       {/* )} */}
//     </>
//   )
// }

// export default PaymentForm
