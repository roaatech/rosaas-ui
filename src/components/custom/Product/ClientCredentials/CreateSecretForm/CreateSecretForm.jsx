import React, { useState } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import useRequest from '../../../../../axios/apis/useRequest.js'
import { Modal, Button, Alert } from '@themesberg/react-bootstrap'
import { Form } from '@themesberg/react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { FormattedMessage } from 'react-intl'

import { useParams } from 'react-router-dom'

import { Wrapper } from '../ClientCredentials.styled.jsx'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faCopy,
  faEye,
  faEyeSlash,
  faTriangleExclamation,
} from '@fortawesome/free-solid-svg-icons'
const CreateSecretForm = ({ type, setVisible, popupLabel, clientId }) => {
  const { createClientSecret } = useRequest()
  const dispatch = useDispatch()
  const routeParams = useParams()
  const productId = routeParams.id
  const allProducts = useSelector((state) => state.products.products)
  const id = allProducts[productId]?.client.id

  const initialValues = {}

  const validationSchema = Yup.object().shape({
    title: Yup.string()
      .required(<FormattedMessage id="Title-is-required" />)
      .max(100, <FormattedMessage id="Must-be-maximum-100-digits" />),
  })
  const [nextPage, setNexPage] = useState(false)
  const [clientSecret, setClientSecret] = useState(false)
  const formik = useFormik({
    initialValues,
    validationSchema: validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      if (type === 'create') {
        let createFeature
        if (customExpirationDate) {
          createFeature = await createClientSecret(productId, id, {
            description: values.title,
            expiration: customExpirationDate,
          })
        } else {
          createFeature = await createClientSecret(productId, id, {
            description: values.title,
          })
        }
        setClientSecret(createFeature.data.data.secrest)
      }
      setNexPage(true)

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
  const [expirationType, setExpirationType] = useState('')
  const [customExpirationDate, setCustomExpirationDate] = useState(new Date())

  const calculateExpirationDate = (data) => {
    const currentDate = new Date()

    switch (data || expirationType) {
      case '30':
        currentDate.setDate(currentDate.getDate() + 30)
        break
      case '60':
        currentDate.setDate(currentDate.getDate() + 60)
        break
      case '90':
        currentDate.setDate(currentDate.getDate() + 90)
        break
      default:
        break
    }

    const year = currentDate.getUTCFullYear()
    const month = String(currentDate.getUTCMonth() + 1).padStart(2, '0')
    const day = String(currentDate.getUTCDate()).padStart(2, '0')

    return `${year}-${month}-${day}`
  }

  const ClientIdField = () => {
    return (
      <>
        <Alert variant={'warning'}>
          <FontAwesomeIcon icon={faTriangleExclamation} className="mr-2" />
          <strong>
            <FormattedMessage id={'Warning'} /> -
          </strong>{' '}
          {
            "make sure you copy the Client Secret now. We don't store it and you will not be able to see it again."
          }
        </Alert>
        <Form.Group className="mb-3">
          <Form.Label>
            <FormattedMessage id="Client-ID" />{' '}
          </Form.Label>

          <div
            className="input-group"
            style={{ borderRight: '1px solid #ced4da' }}
          >
            <input
              type="text"
              className="form-control"
              value={clientId}
              readOnly
            />
            <span className="input-group-text  ">
              <FontAwesomeIcon
                icon={faCopy}
                onClick={() => handleCopyToClipboard(clientId)}
                style={{ cursor: 'pointer' }}
              />
            </span>{' '}
          </div>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>
            <FormattedMessage id="Client-Secret" />{' '}
          </Form.Label>
          <div
            className="input-group border-right-1"
            style={{ borderRight: '1px solid #ced4da' }}
          >
            <input
              type={showSecret ? 'text' : 'password'}
              value={showSecret ? clientSecret : '******'}
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
                onClick={() => handleCopyToClipboard(clientSecret)}
                style={{ cursor: 'pointer' }}
              />{' '}
            </span>
          </div>
        </Form.Group>
      </>
    )
  }
  return (
    <Wrapper>
      <Form onSubmit={formik.handleSubmit}>
        <Modal.Header>
          <Modal.Title className="h6">{popupLabel}</Modal.Title>
          <Button
            variant="close"
            aria-label="Close"
            onClick={() => setVisible(false)}
          />
        </Modal.Header>

        <Modal.Body>
          {nextPage && <ClientIdField />}
          {!nextPage && (
            <Form.Group className="mb-3">
              <Form.Label>
                <FormattedMessage id="Title" />{' '}
                <span style={{ color: 'red' }}>*</span>
              </Form.Label>

              <input
                className="form-control"
                type="text"
                id="title"
                name="title"
                onChange={formik.handleChange}
                value={formik.values.title}
              />

              {formik.touched.name && formik.errors.name && (
                <Form.Control.Feedback
                  type="invalid"
                  style={{ display: 'block' }}
                >
                  {formik.errors.name}
                </Form.Control.Feedback>
              )}
            </Form.Group>
          )}

          {!nextPage && (
            <Form.Group className="mb-3">
              <Form.Label>
                <FormattedMessage id="Expiration" />
              </Form.Label>

              <div className="d-flex align-items-center">
                <Form.Control
                  as="select"
                  className="mr-2"
                  value={expirationType}
                  onChange={(e) => {
                    const selectedValue = e.target.value
                    setExpirationType(e.target.value)
                    setCustomExpirationDate(
                      selectedValue === 'custom' || selectedValue === 'none'
                        ? ''
                        : calculateExpirationDate(e.target.value)
                    )
                    console.log(
                      selectedValue === 'custom' || selectedValue === 'none'
                    )
                  }}
                >
                  {' '}
                  <option value="">
                    <FormattedMessage id="Select-Option" />
                  </option>
                  <option value="30">30 days</option>
                  <option value="60">60 days</option>
                  <option value="90">90 days</option>
                  <option value="custom">Custom</option>
                  <option value="none">None</option>
                </Form.Control>

                {expirationType === 'custom' ? (
                  <input
                    type="date"
                    className="form-control"
                    value={customExpirationDate || ''}
                    onChange={(e) => {
                      setCustomExpirationDate(e.target.value)
                    }}
                    min={new Date().toISOString().split('T')[0] || ''}
                  />
                ) : (
                  <input
                    type="date"
                    className="form-control"
                    id="expiration"
                    name="expiration"
                    value={
                      expirationType !== 'none' ? calculateExpirationDate() : ''
                    }
                    onChange={(e) => {
                      setExpirationType('custom')
                      setCustomExpirationDate(e.target.value)
                    }}
                    disabled={expirationType === 'none'}
                    min={new Date().toISOString().split('T')[0] || ''}
                  />
                )}
              </div>
            </Form.Group>
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

export default CreateSecretForm
