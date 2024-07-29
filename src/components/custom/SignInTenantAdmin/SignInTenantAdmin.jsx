import React, { useRef, useState } from 'react'
import LoginWrapper from './SignInTenantAdmin.styled.jsx'
import { FormattedMessage } from 'react-intl'
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { BsFillEnvelopeOpenFill, BsUnlockFill } from 'react-icons/bs'
// import { faEnvelope, faUnlockAlt } from "@fortawesome/free-solid-svg-icons";
import { Button } from '@themesberg/react-bootstrap'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import { InputText } from 'primereact/inputtext'
import * as Yup from 'yup'
import useRequest from '../../../axios/apis/useRequest.js'
import { Routes } from '../../../routes.js'
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import ReCAPTCHA from 'react-google-recaptcha'
const SignInTenantAdmin = () => {
  const [recaptchaToken, setRecaptchaToken] = useState(null)
  const recaptchaRef = useRef(null)
  const redirectPath = useSelector(
    (state) => state.auth.redirectPath?.redirectPath
  )

  const { SignInTenantAdminAsync } = useRequest()
  const navigate = useNavigate()
  const initialValues = {
    email: '',
    password: '',
  }

  const validationSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email').required('Email is required'),
    password: Yup.string().required('Password is required'),
  })

  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    if (!recaptchaToken) {
      setErrors({ recaptcha: 'Please complete the reCAPTCHA' })
      setSubmitting(false)
      return
    }

    const loginPass = await SignInTenantAdminAsync(values)
    if (loginPass) {
      redirectPath
        ? navigate(redirectPath)
        : loginPass.data.data.userAccount.userType === 4
        ? navigate(Routes.workSpace.path)
        : navigate(Routes.Dashboard.path)
    }
  }

  const onRecaptchaChange = (token) => {
    setRecaptchaToken(token)
  }

  return (
    <LoginWrapper>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, errors }) => (
          <Form className="mt-4">
            <div>
              <label htmlFor="email" className="pb-2">
                <FormattedMessage id="yourEmail" />
              </label>
              <div className="inputContainer">
                <div className="inputContainerWithIcon">
                  <BsFillEnvelopeOpenFill />
                  <Field type="email" id="email" name="email" as={InputText} />
                </div>
                <ErrorMessage
                  name="email"
                  component="div"
                  className="error-message"
                />
              </div>
            </div>
            <div>
              <label htmlFor="password" className="pb-2">
                <FormattedMessage id="yourPassword" />
              </label>
              <div className="inputContainer">
                <div className="inputContainerWithIcon">
                  <BsUnlockFill />
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
              <ReCAPTCHA
                ref={recaptchaRef}
                sitekey="6Le6ARIqAAAAAC-nMJ_p2ekGqvMvEt-gqJQwC4HV"
                onChange={onRecaptchaChange}
              />
              <div className="error-message">
                {errors.recaptcha && <div>{errors.recaptcha}</div>}
              </div>
            </div>
            <div className="pt-1">
              <Button
                variant="primary"
                type="submit"
                className="w-100"
                disabled={isSubmitting}
              >
                <FormattedMessage id="signIn" />
              </Button>
            </div>
            <div className="pt-2 text-center">
              <span>
                <FormattedMessage id="not-Registered?" />
              </span>{' '}
              <Link className="fw-bold" to={Routes.SignUp.path}>
                <FormattedMessage id="create-Account" />
              </Link>
            </div>
          </Form>
        )}
      </Formik>
    </LoginWrapper>
  )
}

export default SignInTenantAdmin
