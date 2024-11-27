import React, { useEffect, useState } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import useRequest from '../../../../../../axios/apis/useRequest.js'
import { Modal, Button, Alert } from '@themesberg/react-bootstrap'
import { Form } from '@themesberg/react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { FormattedMessage } from 'react-intl'

import { useParams } from 'react-router-dom'

import { Wrapper } from '../../ClientCredentials.styled.jsx'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faCopy,
  faEye,
  faEyeSlash,
  faTriangleExclamation,
} from '@fortawesome/free-solid-svg-icons'
import {
  clientCredentialsSecrets,
  clientSecretInfo,
} from '../../../../../../store/slices/products/productsSlice.js'
import { BsCheckCircleFill } from 'react-icons/bs'
import SafeFormatMessage from '../../../../Shared/SafeFormatMessage/SafeFormatMessage.jsx'
const CreateSecretForm = ({
  type,
  setVisible,
  popupLabel,
  currentClientId,
  currentId,
}) => {
  const {
    createClientSecret,
    regenerateClientSecret,
    editClientSecret,
    getClientId,
  } = useRequest()
  const dispatch = useDispatch()
  const routeParams = useParams()
  const productId = routeParams.id
  const allProducts = useSelector((state) => state.products.products)

  const id = allProducts[productId]?.client.id
  const secretItem =
    currentClientId &&
    allProducts[productId]?.clientCredentials?.[currentClientId]
      ?.clientCredentialsSecrets?.[currentId]
  const secretList =
    allProducts[productId]?.clientCredentials?.[currentClientId]
      ?.clientCredentialsSecrets

  const firstFieldKey = secretList && Object.keys(secretList)[0]
  const [clientRecordId, setClientRecordId] = useState(
    secretList?.[firstFieldKey]?.clientRecordId || ''
  )
  const [clientId, setClientId] = useState(
    secretList?.[firstFieldKey]?.clientId || ''
  )
  useEffect(() => {
    if (!secretItem?.expiration) {
      return
    }
    setExpirationType('custom')
    setCustomExpirationDate(secretItem?.expiration.split('T')[0])
  }, [secretItem])
  const [customExpirationDate, setCustomExpirationDate] = useState(null)
  const initialValues = {
    displayName: secretItem ? secretItem.description : '',
  }

  const validationSchema = Yup.object().shape({
    displayName: Yup.string()
      .required(<SafeFormatMessage id="Display-Name-is-required" />)
      .max(100, <SafeFormatMessage id="Must-be-maximum-100-digits" />),
  })
  const [nextPage, setNexPage] = useState(false)
  const [clientSecret, setClientSecret] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      if (!clientRecordId || !clientId) {
        try {
          const clientData = await getClientId(productId, currentClientId)
          const curentClientData =
            clientData &&
            clientData.data.data.find((item) => item.id === currentClientId)

          setClientRecordId(curentClientData?.clientRecordId)
          setClientId(curentClientData?.clientId)
        } catch (error) {
          console.error('Error:', error)
        }
      }
    }
    fetchData()
  }, [])
  useEffect(() => {
    const fetchData = async () => {
      if (type === 'regenerate') {
        setNexPage(true)
        try {
          const clientSecretRegenerate = await regenerateClientSecret(
            currentClientId,
            productId,
            currentId
          )
          setClientSecret(clientSecretRegenerate.data.data)
        } catch (error) {
          console.error('Error regenerating client secret:', error)
        }
      }
    }

    fetchData()
  }, [type])
  const [showClientId, setShowClientId] = useState(false)
  useEffect(() => {
    type === 'showClientId' ? setShowClientId(true) : setShowClientId(false)
  }, [type])

  const formik = useFormik({
    initialValues,
    validationSchema: validationSchema,

    onSubmit: async (values, { setSubmitting }) => {
      if (type === 'create') {
        let clientSecret
        if (customExpirationDate) {
          clientSecret = await createClientSecret(productId, currentClientId, {
            description: values.displayName,
            expiration: customExpirationDate,
          })
          dispatch(
            clientCredentialsSecrets({
              productId,
              clientId: currentClientId,
              data: {
                ...secretList,
                ...{
                  [clientSecret.data.data.id]: {
                    id: clientSecret.data.data.id,
                    description: values.displayName,
                    expiration: customExpirationDate,
                    clientRecordId,
                    clientId,
                    created: new Date().toISOString().slice(0, 19),
                  },
                },
              },
            })
          )
        } else {
          clientSecret = await createClientSecret(productId, currentClientId, {
            description: values.displayName,
          })
          dispatch(
            clientCredentialsSecrets({
              productId,
              clientId: currentClientId,
              data: {
                ...secretList,
                ...[
                  {
                    id: clientSecret.data.data.id,
                    description: values.displayName,
                    expiration: customExpirationDate,
                    clientId,
                    clientRecordId,
                    created: new Date().toISOString().slice(0, 19),
                  },
                ],
              },
            })
          )
        }
        setClientSecret(clientSecret.data.data.secrest)
        setNexPage(true)
      }
      if (type === 'edit') {
        let clientSecret
        if (customExpirationDate) {
          clientSecret = await editClientSecret(
            productId,
            currentClientId,
            currentId,
            {
              description: values.displayName,
              expiration: customExpirationDate,
            }
          )

          dispatch(
            clientSecretInfo({
              itemId: currentId,
              clientId: currentClientId,
              productId,
              data: {
                ...secretItem,
                description: values.displayName,
                expiration: customExpirationDate,
              },
            })
          )
        } else {
          clientSecret = await editClientSecret(
            productId,
            currentClientId,
            currentId,
            {
              description: values.displayName,
            }
          )

          dispatch(
            clientSecretInfo({
              itemId: currentId,
              clientId: currentClientId,
              productId,
              data: {
                ...secretItem,
                description: values.displayName,
                expiration: customExpirationDate,
              },
            })
          )
        }
        setVisible(false)
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
  const [expirationType, setExpirationType] = useState('')

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
        {!showClientId && (
          <Alert variant={'warning'}>
            <FontAwesomeIcon icon={faTriangleExclamation} className="mr-2" />
            <strong>
              <SafeFormatMessage id={'Warning'} /> -
            </strong>{' '}
            {<SafeFormatMessage id="warning-messege-secret-copy" />}
          </Alert>
        )}
        <Form.Group className="mb-3">
          <Form.Label>
            <SafeFormatMessage id="Client-ID" />{' '}
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
        {!showClientId && (
          <Form.Group className="mb-3">
            <Form.Label>
              <SafeFormatMessage id="Client-Secret" />{' '}
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
              popupLabel
            ) : (
              <>
                <SafeFormatMessage id="Secret-generated-successfully" />{' '}
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
          {(nextPage || showClientId) && <ClientIdField />}
          {!nextPage && !showClientId && (
            <Form.Group className="mb-3">
              <Form.Label>
                <SafeFormatMessage id="Display-Name" />{' '}
                <span style={{ color: 'red' }}>*</span>
              </Form.Label>

              <input
                className="form-control"
                type="text"
                id="displayName"
                name="displayName"
                onChange={formik.handleChange}
                value={formik.values.displayName}
              />

              {formik.touched.displayName && formik.errors.displayName && (
                <Form.Control.Feedback
                  type="invalid"
                  style={{ display: 'block' }}
                >
                  {formik.errors.displayName}
                </Form.Control.Feedback>
              )}
            </Form.Group>
          )}

          {!nextPage && !showClientId && (
            <Form.Group className="mb-3">
              <Form.Label>
                <SafeFormatMessage id="Expiration" />
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
                      selectedValue === 'custom' ||
                        selectedValue === 'none' ||
                        selectedValue === ''
                        ? null
                        : calculateExpirationDate(e.target.value)
                    )
                  }}
                >
                  {' '}
                  <option value="">
                    <SafeFormatMessage id="Select-Option" />
                  </option>
                  <option value="30">
                    <SafeFormatMessage id="30-days" />
                  </option>
                  <option value="60">
                    <SafeFormatMessage id="60-days" />
                  </option>
                  <option value="90">
                    <SafeFormatMessage id="90-days" />
                  </option>
                  <option value="custom">
                    <SafeFormatMessage id="Custom" />
                  </option>
                  <option value="none">
                    <SafeFormatMessage id="Unlimited" />
                  </option>
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
                      expirationType && expirationType !== 'none'
                        ? calculateExpirationDate()
                        : ''
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
          {!nextPage && !showClientId && (
            <Button variant="secondary" type="submit">
              <SafeFormatMessage id="Submit" />
            </Button>
          )}
          <Button
            variant="link"
            className="text-gray "
            onClick={() => setVisible(false)}
          >
            <SafeFormatMessage id="Close" />
          </Button>
        </Modal.Footer>
      </Form>
    </Wrapper>
  )
}

export default CreateSecretForm
