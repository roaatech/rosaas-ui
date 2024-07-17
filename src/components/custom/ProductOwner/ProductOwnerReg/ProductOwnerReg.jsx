import React from 'react'
import { useNavigate } from 'react-router-dom'
import * as Yup from 'yup'
import { Button, Card } from '@themesberg/react-bootstrap'
import { FormattedMessage } from 'react-intl'
import { ErrorMessage, Field, Form, Formik } from 'formik'
import { InputText } from 'primereact/inputtext'
import { useDispatch, useSelector } from 'react-redux'
import useRequest from '../../../../axios/apis/useRequest'
import { Routes } from '../../../../routes'
import Wrapper from './ProductOwnerReg.styled'
import { updateUserInfoAttribute } from '../../../../store/slices/auth'

const ProductOwnerReg = () => {
  const navigate = useNavigate()
  const { createPORequest } = useRequest()
  let userInfo = useSelector((state) => state.auth.userInfo)
  const dispatch = useDispatch()
  const initialValues = {
    systemName: '',
    displayName: '',
    description: '',
  }

  const validationSchema = Yup.object().shape({
    systemName: Yup.string()
      .max(100, <FormattedMessage id="Must-be-maximum-100-digits" />)
      .required(<FormattedMessage id="Unique-Name-is-required" />)
      .matches(
        /^[a-zA-Z0-9_-]+$/,
        <FormattedMessage id="English-Characters-Numbers-and-Underscores-are-only-accepted" />
      ),
    displayName: Yup.string().required('Display Name is required'),
  })

  const handleSubmit = async (values, { setSubmitting }) => {
    const productOwnerData = {
      systemName: values.systemName,
      displayName: values.displayName,
      description: values.description,
      createdByUserId: userInfo.id,
    }
    const createSuccess = await createPORequest(productOwnerData)
    if (createSuccess) {
      dispatch(
        updateUserInfoAttribute({
          key: 'ProductOwnerInfo',
          value: createSuccess.data.data,
        })
      )
      navigate(Routes.Dashboard.path)
    }
  }

  const generateUniqueName = (displayName) => {
    let uniqueNameTitle =
      displayName &&
      displayName
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-zA-Z0-9_-]/g, '')
    if (uniqueNameTitle) {
      return uniqueNameTitle.replace(/^-+|-+$/g, '')
    }
    return ''
  }

  const generateRandomUniqueName = () => {
    return Math.random().toString(36).substring(2, 20)
  }

  return (
    <Wrapper>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ values, setFieldValue, isSubmitting }) => {
          return (
            <Form className="mt-4">
              <div>
                <Card.Header className="mb-3 ">
                  <Card.Title className="mb-0">
                    {/* <MdOutlineArrowRight className="mx-0" /> */}
                    <FormattedMessage id="Company-Info" />
                    <br className="mt-1" />
                  </Card.Title>
                </Card.Header>

                <label htmlFor="displayName" className="pb-2">
                  <FormattedMessage id="Company-Name" />
                </label>
                <div className="inputContainer">
                  <div className="inputContainerWithIcon">
                    <Field
                      type="text"
                      id="displayName"
                      name="displayName"
                      as={InputText}
                      onChange={(e) => {
                        const displayName = e.target.value
                        setFieldValue('displayName', displayName)
                        const uniqueName = generateUniqueName(displayName)
                        setFieldValue('systemName', uniqueName)
                      }}
                    />
                  </div>
                  <ErrorMessage
                    name="displayName"
                    component="div"
                    className="error-message"
                  />
                </div>
              </div>
              <label htmlFor="systemName" className="pb-2">
                <FormattedMessage id="Company-System-Name" />
              </label>
              <div className="inputContainer">
                <div className="inputContainerWithIcon">
                  <Field
                    type="text"
                    id="systemName"
                    name="systemName"
                    as={InputText}
                  />
                </div>
                <ErrorMessage
                  name="systemName"
                  component="div"
                  className="error-message"
                />
              </div>

              <div>
                <label htmlFor="description" className="pb-2">
                  <FormattedMessage id="Description" />
                </label>
                <div className="inputContainer">
                  <div className="inputContainerWithIcon">
                    <Field
                      type="text"
                      id="description"
                      name="description"
                      as={InputText}
                    />
                  </div>
                  <ErrorMessage
                    name="description"
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
                  <FormattedMessage id="Register-Product-Owner-Info" />
                </Button>
              </div>
            </Form>
          )
        }}
      </Formik>
    </Wrapper>
  )
}

export default ProductOwnerReg
