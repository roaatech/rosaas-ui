import React from 'react'
import LoginWrapper from './LoginWrapper.styled'
import { FormattedMessage } from 'react-intl'
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { BsFillEnvelopeOpenFill, BsUnlockFill } from 'react-icons/bs'
// import { faEnvelope, faUnlockAlt } from "@fortawesome/free-solid-svg-icons";
import { Button } from '@themesberg/react-bootstrap'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import { InputText } from 'primereact/inputtext'
import * as Yup from 'yup'
import useRequest from '../../../axios/apis/useRequest.js'
import { Routes } from '../../../routes'
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
const Login = () => {
  let redirectPath = useSelector(
    (state) => state.auth.redirectPath?.redirectPath
  )
  let userRole = useSelector((state) => state.auth.userInfo.role)
  console.log({ userRole })

  const { signIn } = useRequest()
  const navigate = useNavigate()
  const initialValues = {
    email: '',
    password: '',
  }

  const validationSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email').required('Email is required'),
    password: Yup.string().required('Password is required'),
  })

  const handleSubmit = async (values, { setSubmitting }) => {
    const loginPass = await signIn(values)
    if (loginPass) {
      redirectPath
        ? navigate(redirectPath)
        : loginPass.data.data.userAccount.userType == 4
        ? navigate(Routes.workSpace.path)
        : navigate(Routes.Dashboard.path)
    }
  }

  return (
    <LoginWrapper>
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

export default Login
