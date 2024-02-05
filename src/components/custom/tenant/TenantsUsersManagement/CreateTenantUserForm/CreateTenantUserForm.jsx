import React, { useEffect, useState } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import useRequest from '../../../../../axios/apis/useRequest.js'
import { Modal, Button, Alert } from '@themesberg/react-bootstrap'
import { Form } from '@themesberg/react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { FormattedMessage } from 'react-intl'

import { useParams } from 'react-router-dom'

import { Wrapper } from './CreateTenantUserForm.styled.jsx'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faCopy,
  faEye,
  faEyeSlash,
  faInfo,
  faInfoCircle,
  faTriangleExclamation,
  faWarning,
} from '@fortawesome/free-solid-svg-icons'

import { BsCheckCircleFill } from 'react-icons/bs'
import { AdminPrivileges } from '../../../../../store/slices/tenants.js'
import { Link } from 'react-router-dom'
const CreateTenantUserForm = ({
  type,
  setVisible,
  popupLabel,
  currentId,
  currentUser,
}) => {
  const [currentType, setCurrentType] = useState(type)
  const [currentPopupLabel, setCurrentPopupLabel] = useState(popupLabel)
  const { createTenantAdmin, validateEmail, tenantAdminPrivileges } =
    useRequest()
  const dispatch = useDispatch()
  const routeParams = useParams()
  const tenantId = routeParams.id
  const allTenants = useSelector((state) => state.tenants.tenants)

  const userAdmins =
    currentId && allTenants[tenantId].AdminPrivileges[currentId]
  const adminPrivilegesList = allTenants[tenantId]?.AdminPrivileges
  const initialValues = {
    email: userAdmins ? userAdmins?.email : '',
  }
  const [validEmail, setValidEmail] = useState(currentUser)
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

    if (response && response.data.data.result === true) {
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
          let tenantUser = await createTenantAdmin({
            email: formik.values.email,
            password: formik.values.password,
            tenantId,
          })

          dispatch(
            AdminPrivileges({
              id: tenantId,
              data: {
                ...adminPrivilegesList,
                ...[
                  {
                    createdDate: new Date().toISOString().slice(0, 19),
                    email: formik.values.email,
                    isMajor: false,
                    id: tenantUser.data.data,
                  },
                ],
              },
            })
          )
        }

        setNexPage(true)
      } else {
        let tenantUser = await tenantAdminPrivileges(
          {
            email: formik.values.email,
            isMajor: true,
          },
          tenantId
        )
        dispatch(
          AdminPrivileges({
            id: tenantId,
            data: {
              ...adminPrivilegesList,
              ...[
                {
                  createdDate: new Date().toISOString().slice(0, 19),
                  email: formik.values.email,
                  isMajor: true,
                  id: tenantUser.data.data,
                },
              ],
            },
          })
        )
        setVisible(false)
      }

      setSubmitting(false)
    },
  })

  const [showSecret, setShowSecret] = useState(false)
  const [changing, setChanging] = useState(false)
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

        {currentType === 'create' && validEmail == true && (
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
                onChange={(e) => {
                  formik.handleChange(e)
                  setChanging(true)
                }}
                value={formik.values.email}
                onBlur={(e) => {
                  handleEmailBlur()
                  setChanging(false)
                }}
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

          {!nextPage && currentType == 'create' && (
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
          {formik.values.email &&
            validEmail === false &&
            !nextPage &&
            currentType == 'create' &&
            changing === false && (
              <Alert variant={'warning'}>
                <FontAwesomeIcon icon={faWarning} className="mr-2" />
                <strong>
                  <FormattedMessage id={'warning'} /> -
                </strong>{' '}
                {
                  <FormattedMessage id="warning-message-account-already-exists" />
                }
                <span
                  onClick={() => {
                    setCurrentType('add')
                    setCurrentPopupLabel(<FormattedMessage id="Add-User" />)
                  }}
                  className="link-style"
                >
                  <FormattedMessage id="Navigate" />{' '}
                </span>
                <FormattedMessage id="to-the-appropriate-section-to-manage-privileges" />
              </Alert>
            )}
          {validEmail && currentType != 'create' && (
            <Alert variant={'warning'}>
              <FontAwesomeIcon icon={faWarning} className="mr-2" />
              <strong>
                <FormattedMessage id={'warrning'} /> -
              </strong>
              {<FormattedMessage id="warning-message-account-doesnt-exist" />}{' '}
              <span
                onClick={() => {
                  setCurrentType('create')
                  setCurrentPopupLabel(<FormattedMessage id="New-User" />)
                }}
                className="link-style"
              >
                {' '}
                <FormattedMessage id="click-here" />
              </span>
              <FormattedMessage id="click-here-to-designate-major" />{' '}
            </Alert>
          )}
        </Modal.Body>
        <Modal.Footer>
          {!nextPage && (
            <Button
              variant="secondary"
              type="submit"
              disabled={
                (formik.values.email &&
                  !changing &&
                  currentType == 'create' &&
                  !validEmail) ||
                (formik.values.email && validEmail && currentType != 'create')
              }
            >
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

export default CreateTenantUserForm
