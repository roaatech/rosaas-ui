import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import { InputText } from 'primereact/inputtext'
import { Button } from '@themesberg/react-bootstrap'
import { FormattedMessage } from 'react-intl'
import * as Yup from 'yup'
import ReCAPTCHA from 'react-google-recaptcha'
import useRequest from '../../../axios/apis/useRequest.js'
import { Routes } from '../../../routes.js'
import LoginWrapper from './ResetPassword.styled.jsx'

const ResetPassword = () => {
  const [step, setStep] = useState(null)
  const [recaptchaToken, setRecaptchaToken] = useState(null)
  const recaptchaRef = React.createRef()
  const navigate = useNavigate()
  const location = useLocation()
  const { requestPasswordReset, resetPassword } = useRequest()
  useEffect(() => {
    if (location.pathname == Routes.ResetPasswordRequest.path) {
      setStep(1)
    } else if (location.pathname == Routes.ResetPasswordConfirm.path) {
      setStep(2)
    }
  }, [location.pathname])

  const initialValues = {
    email: '',
    password: '',
    confirmPassword: '',
  }

  const validationSchemaEmail = Yup.object().shape({
    email: Yup.string().email('Invalid email').required('Email is required'),
  })

  const validationSchemaPassword = Yup.object().shape({
    password: Yup.string().required('Password is required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Passwords must match')
      .required('Confirm password is required'),
  })
  const [confirm, setConfirm] = useState(false)
  const handleSubmitEmail = async (values, { setSubmitting, setErrors }) => {
    if (!recaptchaToken) {
      setErrors({ recaptcha: 'Please complete the reCAPTCHA' })
      setSubmitting(false)
      return
    }

    const response = await requestPasswordReset({
      email: values.email,
      recaptchaToken,
    })
    response.status == 200 && navigate(Routes.ResetPasswordConfirmPage.path)
  }

  const handleSubmitPassword = async (values, { setSubmitting, setErrors }) => {
    const code = new URLSearchParams(window.location.search).get('code')
    const email = new URLSearchParams(window.location.search).get('email')
    const ut = new URLSearchParams(window.location.search).get('ut')
    if (!code || !email) {
      setErrors({ code: 'Invalid or missing code' })
      setSubmitting(false)
      return
    }

    const response = await resetPassword({
      email: email,
      newPassword: values.password,
      code,
    })
    if (response) {
      ut == 'TenantAdmin'
        ? navigate(Routes.SignInTenantAdmin.path)
        : navigate(Routes.ProductManagementSignIn.path)
    }
    setSubmitting(false)
  }

  const onRecaptchaChange = (token) => {
    setRecaptchaToken(token)
  }
  return (
    <LoginWrapper>
      <Formik
        initialValues={initialValues}
        validationSchema={
          step === 1 ? validationSchemaEmail : validationSchemaPassword
        }
        onSubmit={step === 1 ? handleSubmitEmail : handleSubmitPassword}
      >
        {({ isSubmitting, errors }) => {
          return (
            <Form className="mt-4">
              {step === 1 ? (
                <>
                  <div>
                    <label htmlFor="email" className="pb-2">
                      <FormattedMessage id="yourEmail" />
                    </label>
                    <div className="inputContainer">
                      <div className="inputContainerWithIcon">
                        <Field
                          type="email"
                          id="email"
                          name="email"
                          as={InputText}
                        />
                      </div>
                      <ErrorMessage
                        name="email"
                        component="div"
                        className="error-message"
                      />
                    </div>
                  </div>
                  <div className="recaptcha-container mt-2 mb-4">
                    <div>
                      <ReCAPTCHA
                        ref={recaptchaRef}
                        sitekey={process.env.REACT_APP_RECAPTCHA_KEY}
                        onChange={onRecaptchaChange}
                      />
                      <div className="error-message">
                        {errors.recaptcha && <div>{errors.recaptcha}</div>}
                      </div>
                    </div>
                  </div>
                  <div className="pt-1">
                    <Button
                      variant="primary"
                      type="submit"
                      className="w-100"
                      disabled={isSubmitting}
                    >
                      <FormattedMessage id="sendResetLink" />
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label htmlFor="password" className="pb-2">
                      <FormattedMessage id="newPassword" />
                    </label>
                    <div className="inputContainer">
                      <div className="inputContainerWithIcon">
                        <Field
                          type="password"
                          id="password"
                          name="password"
                          as={InputText}
                        />
                      </div>
                      <ErrorMessage
                        name="password"
                        component="div"
                        className="error-message"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="confirmPassword" className="pb-2">
                      <FormattedMessage id="confirmPassword" />
                    </label>
                    <div className="inputContainer">
                      <div className="inputContainerWithIcon">
                        <Field
                          type="password"
                          id="confirmPassword"
                          name="confirmPassword"
                          as={InputText}
                        />
                      </div>
                      <ErrorMessage
                        name="confirmPassword"
                        component="div"
                        className="error-message"
                      />
                    </div>
                  </div>
                  <div className="pt-1">
                    <Button
                      variant="primary"
                      type="submit"
                      className="w-100"
                      disabled={isSubmitting}
                    >
                      <FormattedMessage id="resetPassword" />
                    </Button>
                  </div>
                </>
              )}
            </Form>
          )
        }}
      </Formik>
    </LoginWrapper>
  )
}

export default ResetPassword
