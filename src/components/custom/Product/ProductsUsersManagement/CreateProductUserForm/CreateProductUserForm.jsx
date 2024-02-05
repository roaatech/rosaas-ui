import React, { useEffect, useState } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import useRequest from '../../../../../axios/apis/useRequest.js'
import { Modal, Button, Alert } from '@themesberg/react-bootstrap'
import { Form } from '@themesberg/react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { FormattedMessage } from 'react-intl'

import { useParams } from 'react-router-dom'

import { Wrapper } from './CreateProductUserForm.styled.jsx'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faCopy,
  faEye,
  faEyeSlash,
  faInfo,
  faInfoCircle,
  faTriangleExclamation,
} from '@fortawesome/free-solid-svg-icons'

import { BsCheckCircleFill } from 'react-icons/bs'
import { AdminPrivileges } from '../../../../../store/slices/products/productsSlice.js'
const CreateProductUserForm = ({ type, setVisible, popupLabel, currentId }) => {
  const [currentPopupLabel, setCurrentPopupLabel] = useState(popupLabel)
  const [currentType, setCurrentType] = useState(type)

  const { createProductAdmin, validateEmail, productAdminPrivileges } =
    useRequest()
  const dispatch = useDispatch()
  const routeParams = useParams()
  const productId = routeParams.id
  const allProducts = useSelector((state) => state.products.products)

  const userAdmins =
    currentId && allProducts[productId].AdminPrivileges[currentId]
  const adminPrivilegesList = allProducts[productId]?.AdminPrivileges
  const initialValues = {
    email: userAdmins ? userAdmins?.email : '',
  }
  const [validEmail, setValidEmail] = useState(true)
  const getValidationSchema = () => {
    if (validEmail) {
      return Yup.object().shape({
        email: Yup.string()
          .email('Invalid email')
          .required('Email is required'),
        password: Yup.string()
          .min(6, 'Password must be at least 6 characters')
          .required('Password is required'),
      })
    } else {
      return Yup.object().shape({
        email: Yup.string()
          .email('Invalid email')
          .required('Email is required'),
      })
    }
  }
  const validationSchema = getValidationSchema()

  const [nextPage, setNexPage] = useState(false)

  const handleEmailBlur = async () => {
    const response = await validateEmail(formik.values.email)

    if (response && response.data.metadata.success === true) {
      setValidEmail(true)
    } else {
      setValidEmail(false)
    }
  }
  const formik = useFormik({
    initialValues,
    validationSchema: validationSchema,

    onSubmit: async (values, { setSubmitting }) => {
      if (currentType === 'create') {
        if (validEmail) {
          let productUser = await createProductAdmin({
            email: formik.values.email,
            password: formik.values.password,
            productId,
          })
          dispatch(
            AdminPrivileges({
              id: productId,

              data: {
                ...adminPrivilegesList,
                ...[
                  {
                    createdDate: new Date().toISOString().slice(0, 19),
                    email: formik.values.email,
                    isMajor: false,
                    id: productUser.data.data,
                  },
                ],
              },
            })
          )
        }

        setNexPage(true)
      } else {
        let productUser = await productAdminPrivileges(
          {
            email: formik.values.email,
            itemId: productUser.data.data,

            isMajor: true,
          },
          productId
        )
        dispatch(
          AdminPrivileges({
            id: productId,
            data: {
              ...adminPrivilegesList,
              ...[
                {
                  createdDate: new Date().toISOString().slice(0, 19),
                  email: formik.values.email,
                  isMajor: true,
                },
              ],
            },
          })
        )
      }

      setSubmitting(false)
    },
  })

  const [showSecret, setShowSecret] = useState(false)

  const handleToggleShowSecret = () => {
    setShowSecret(!showSecret)
  }

  const handleCopyToClipboard = (value) => {
    navigator.clipboard.writeText(value)
  }

  const UserData = () => {
    return (
      <>
        <Alert variant={'warning'}>
          <FontAwesomeIcon icon={faTriangleExclamation} className="mr-2" />
          <strong>
            <FormattedMessage id={'Warning'} /> -
          </strong>{' '}
          {<FormattedMessage id="warning-messege-password-copy" />}
        </Alert>

        <Form.Group className="mb-3">
          <Form.Label>
            <FormattedMessage id="Email" />{' '}
          </Form.Label>

          <div
            className="input-group"
            style={{ borderRight: '1px solid #ced4da' }}
          >
            <input
              type="text"
              className="form-control"
              value={formik.values.email}
              readOnly
            />
            <span className="input-group-text  ">
              <FontAwesomeIcon
                icon={faCopy}
                onClick={() => handleCopyToClipboard(formik.values.email)}
                style={{ cursor: 'pointer' }}
              />
            </span>{' '}
          </div>
        </Form.Group>

        {validEmail && (
          <Form.Group className="mb-3">
            <Form.Label>
              <FormattedMessage id="Password" />{' '}
            </Form.Label>
            <div
              className="input-group border-right-1"
              style={{ borderRight: '1px solid #ced4da' }}
            >
              <input
                type={showSecret ? 'text' : 'password'}
                value={showSecret ? formik.values.password : '******'}
                className="form-control"
                readOnly
              />

              <span className="input-group-text">
                <FontAwesomeIcon
                  icon={showSecret ? faEyeSlash : faEye}
                  onClick={handleToggleShowSecret}
                  className="mr-2"
                  style={{ cursor: 'pointer' }}
                />
                <FontAwesomeIcon
                  icon={faCopy}
                  onClick={() => handleCopyToClipboard(formik.values.password)}
                  style={{ cursor: 'pointer' }}
                />{' '}
              </span>
            </div>
          </Form.Group>
        )}
      </>
    )
  }
  return (
    <Wrapper>
      <Form onSubmit={formik.handleSubmit}>
        <Modal.Header>
          <Modal.Title className="h6">
            {!nextPage ? (
              currentPopupLabel
            ) : (
              <>
                <FormattedMessage id="Admin-created-successfully" />{' '}
                <BsCheckCircleFill
                  style={{ color: 'green', marginLeft: '5px' }}
                />
              </>
            )}
          </Modal.Title>
          <Button
            variant="close"
            aria-label="Close"
            onClick={() => setVisible(false)}
          />
        </Modal.Header>

        <Modal.Body>
          {nextPage && <UserData />}
          {!nextPage && (
            <Form.Group className="mb-3">
              <Form.Label>
                <FormattedMessage id="Email" />{' '}
                <span style={{ color: 'red' }}>*</span>
              </Form.Label>

              <input
                className="form-control"
                type="text"
                id="email"
                name="email"
                onChange={formik.handleChange}
                value={formik.values.email}
                onBlur={handleEmailBlur}
              />

              {formik.touched.email && formik.errors.email && (
                <Form.Control.Feedback
                  type="invalid"
                  style={{ display: 'block' }}
                >
                  {formik.errors.email}
                </Form.Control.Feedback>
              )}
            </Form.Group>
          )}

          {validEmail && !nextPage && (
            <Form.Group className="mb-3">
              <Form.Label>
                <FormattedMessage id="Password" />{' '}
                <span style={{ color: 'red' }}>*</span>
              </Form.Label>

              <input
                className="form-control"
                type="text"
                id="password"
                name="password"
                onChange={formik.handleChange}
                value={formik.values.password}
              />

              {formik.touched.password && formik.errors.password && (
                <Form.Control.Feedback
                  type="invalid"
                  style={{ display: 'block' }}
                >
                  {formik.errors.password}
                </Form.Control.Feedback>
              )}
            </Form.Group>
          )}
          {!validEmail && !nextPage && (
            <Alert variant={'info'}>
              <FontAwesomeIcon icon={faInfoCircle} className="mr-2" />
              <strong>
                <FormattedMessage id={'info'} /> -
              </strong>{' '}
              {<FormattedMessage id="warning-message-account-already-exists" />}
            </Alert>
          )}
        </Modal.Body>
        <Modal.Footer>
          {!nextPage && (
            <Button variant="secondary" type="submit">
              <FormattedMessage id="Submit" />
            </Button>
          )}
          <Button
            variant="link"
            className="text-gray "
            onClick={() => setVisible(false)}
          >
            <FormattedMessage id="Close" />
          </Button>
        </Modal.Footer>
      </Form>
    </Wrapper>
  )
}

export default CreateProductUserForm
