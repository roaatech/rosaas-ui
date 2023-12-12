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
  BsFillPersonFill,
  BsUnlockFill,
} from 'react-icons/bs'
import { Routes } from '../../../routes'

const SignUp = () => {
  const { signUp } = useRequest()
  const navigate = useNavigate()

  const initialValues = {
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  }

  const validationSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email').required('Email is required'),
    password: Yup.string().required('Password is required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Passwords must match')
      .required('Confirm Password is required'),
  })

  const handleSubmit = async (values, { setSubmitting }) => {
    const signUpSuccess = await signUp(values)
    if (signUpSuccess) {
      navigate(Routes.productsList.path)
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
              <label htmlFor="confirmPassword" className="pb-2">
                <FormattedMessage id="confirmPassword" />
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
