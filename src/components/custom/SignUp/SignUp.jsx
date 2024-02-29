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

const SignUp = () => {
  let redirectPath = useSelector(
    (state) => state.auth.redirectPath.redirectPath
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

  const handleSubmit = async (values, { setSubmitting }) => {
    const signUpSuccess = await signUp(values)
    if (signUpSuccess) {
      redirectPath ? navigate(redirectPath) : navigate(Routes.productsList.path)
    }
  }

  return (
    <Wrapper>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form className="mt-4">
            <div>
              <label htmlFor="fullName" className="pb-2">
                <FormattedMessage id="Your-Full-Name" />
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
                <FormattedMessage id="Your-Phone" />
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
                <FormattedMessage id="yourEmail" />
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
                <FormattedMessage id="yourPassword" />
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
                <FormattedMessage id="confirmPassword" />
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
            {/* (Existing code) */}
            <div className="pt-1">
              <Button
                variant="primary"
                type="submit"
                className="w-100"
                disabled={isSubmitting}
              >
                <FormattedMessage id="signUp" />
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </Wrapper>
  )
}

export default SignUp
