import { useNavigate } from 'react-router-dom'
import useRequest from '../../../axios/apis/useRequest'
import * as Yup from 'yup'
import Wrapper from './SignUp.styled'
import { Button } from '@themesberg/react-bootstrap'
import { FormattedMessage } from 'react-intl'
import { ErrorMessage, Field, Form, Formik } from 'formik'
import { InputText } from 'primereact/inputtext'
import {
  BsFillEnvelopeOpenFill,
  BsPerson,
  BsPhoneFill,
  BsUnlockFill,
} from 'react-icons/bs'
import { Routes } from '../../../routes'
import { useSelector } from 'react-redux'
import ReCAPTCHA from 'react-google-recaptcha'
import { useRef, useState } from 'react'
import SafeFormatMessage from '../Shared/SafeFormatMessage/SafeFormatMessage'

const SignUp = () => {
  const [recaptchaToken, setRecaptchaToken] = useState(null)
  const recaptchaRef = useRef(null)
  const redirectPath = useSelector(
    (state) => state.auth.redirectPath?.redirectPath
  )

  const { signUp } = useRequest()
  const navigate = useNavigate()

  const initialValues = {
    fullName: '',
    mobileNumber: '',
    email: '',
    password: '',
    confirmPassword: '',
  }

  const validationSchema = Yup.object().shape({
    fullName: Yup.string(),
    email: Yup.string().email('Invalid email').required('Email is required'),
    password: Yup.string().required('Password is required'),
    mobileNumber: Yup.string(),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Passwords must match')
      .required('Confirm Password is required'),
  })

  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    if (!recaptchaToken) {
      setErrors({ recaptcha: 'Please complete the reCAPTCHA' })
      setSubmitting(false)
      return
    }

    const signUpSuccess = await signUp({
      ...values,
      recaptchaToken,
    })

    if (signUpSuccess) {
      !signUpSuccess.data.data.userAccount.emailConfirmed
        ? navigate(Routes.EmailConfirmationPage.path)
        : redirectPath
        ? navigate(redirectPath)
        : signUpSuccess.data.data.userAccount.userType == 4
        ? navigate(Routes.workSpace.path)
        : navigate(Routes.Dashboard.path)
    }
  }

  const onRecaptchaChange = (token) => {
    setRecaptchaToken(token)
  }

  return (
    <Wrapper>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, errors }) => (
          <Form className="mt-4">
            <div>
              <label htmlFor="fullName" className="pb-2">
                <SafeFormatMessage id="Your-Full-Name" />
              </label>
              <div className="inputContainer">
                <div className="inputContainerWithIcon">
                  <BsPerson />
                  <Field
                    type="text"
                    id="fullName"
                    name="fullName"
                    as={InputText}
                  />
                </div>
                <ErrorMessage
                  name="fullName"
                  component="div"
                  className="error-message"
                />
              </div>
            </div>
            <div>
              <label htmlFor="mobileNumber" className="pb-2">
                <SafeFormatMessage id="Your-Phone" />
              </label>
              <div className="inputContainer">
                <div className="inputContainerWithIcon">
                  <BsPhoneFill />
                  <Field
                    type="tel"
                    id="mobileNumber"
                    name="mobileNumber"
                    as={InputText}
                  />{' '}
                </div>
                <ErrorMessage
                  name="mobileNumber"
                  component="div"
                  className="error-message"
                />
              </div>
            </div>
            <div>
              <label htmlFor="email" className="pb-2">
                <SafeFormatMessage id="yourEmail" />
                <span className="text-danger px-1">*</span>
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
                <SafeFormatMessage id="yourPassword" />
                <span className="text-danger px-1">*</span>
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
              <label htmlFor="confirmPassword" className="pb-2">
                <SafeFormatMessage id="confirmPassword" />
                <span className="text-danger px-1">*</span>
              </label>
              <div className="inputContainer">
                <div className="inputContainerWithIcon">
                  <BsUnlockFill />
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
                <SafeFormatMessage id="signUp" />
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </Wrapper>
  )
}

export default SignUp
