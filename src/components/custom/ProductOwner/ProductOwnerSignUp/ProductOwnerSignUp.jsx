import { useNavigate } from 'react-router-dom'
import * as Yup from 'yup'
import { Button, Card } from '@themesberg/react-bootstrap'
import { FormattedMessage } from 'react-intl'
import { ErrorMessage, Field, Form, Formik } from 'formik'
import { InputText } from 'primereact/inputtext'
import {
  BsArrowRight,
  BsFillEnvelopeOpenFill,
  BsPerson,
  BsPhoneFill,
  BsUnlockFill,
} from 'react-icons/bs'
import { useSelector } from 'react-redux'
import useRequest from '../../../../axios/apis/useRequest'
import { Routes } from '../../../../routes'
import Wrapper from './ProductOwnerSignUp.styled'
import { MdOutlineArrowRight } from 'react-icons/md'

const CreateProductOwner = () => {
  let redirectPath = useSelector(
    (state) => state.auth.redirectPath.redirectPath
  )
  const { signUpPOwner } = useRequest()
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
    const productOwnerData = {
      fullName: values.fullName,
      mobileNumber: values.mobileNumber,
      email: values.email,
      password: values.password,
      confirmPassword: values.confirmPassword,
    }
    const createSuccess = await signUpPOwner(productOwnerData)
    if (createSuccess) {
      if (redirectPath) {
        navigate(redirectPath)
      } else if (createSuccess.data.data.userAccount.userType == 4) {
        navigate(Routes.workSpace.path)
      } else {
        navigate(Routes.Dashboard.path)
      }
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
              <Card.Header className="mb-3 ">
                <Card.Title className="mb-0">
                  {/* <MdOutlineArrowRight className="mx-0" /> */}
                  <FormattedMessage id="Admin-Info" />
                  <br className="mt-1" />
                </Card.Title>
              </Card.Header>
              <label htmlFor="fullName" className="pb-2">
                <FormattedMessage id="Admin-Full-Name" />
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
                <FormattedMessage id="Admin-Phone" />
              </label>
              <div className="inputContainer">
                <div className="inputContainerWithIcon">
                  <BsPhoneFill />
                  <Field
                    type="tel"
                    id="mobileNumber"
                    name="mobileNumber"
                    as={InputText}
                  />
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
                <FormattedMessage id="Admin-Email" />
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
                <FormattedMessage id="Password" />
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
                <FormattedMessage id="Confirm-Password" />
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

export default CreateProductOwner
