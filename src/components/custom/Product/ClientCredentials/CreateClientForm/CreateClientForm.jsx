import React, { useEffect, useState } from 'react'
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
import {
  clientCredentialsInfo,
  clientCredentials,
} from '../../../../../store/slices/products/productsSlice.js'
import { BsCheckCircleFill } from 'react-icons/bs'
import AutoGenerateInput from '../../../Shared/AutoGenerateInput/AutoGenerateInput.jsx'
import TextareaAndCounter from '../../../Shared/TextareaAndCounter/TextareaAndCounter.jsx'
const CreateClientForm = ({ type, setVisible, popupLabel, currentId }) => {
  const { createClient, regenerateClientSecret, updateClient, getClientId } =
    useRequest()
  const dispatch = useDispatch()
  const routeParams = useParams()
  const productId = routeParams.id
  const allProducts = useSelector((state) => state.products.products)

  const id =
    allProducts[productId]?.client?.id ||
    allProducts[productId]?.productOwner?.id
  const clientItem =
    currentId && allProducts[productId].clientCredentials[currentId]

  const clientList = allProducts[productId].clientCredentials

  const initialValues = {
    displayName: clientItem ? clientItem.displayName : '',
    clientId: clientItem ? clientItem.clientId : '',
    description: clientItem ? clientItem.description : '',
    accessTokenLifetimeInHour: clientItem
      ? clientItem.accessTokenLifetimeInHour
      : '',
  }

  const validationSchema = Yup.object().shape({
    displayName: Yup.string()
      .required(<FormattedMessage id="Display-Name-is-required" />)
      .max(100, <FormattedMessage id="Must-be-maximum-100-digits" />),
    clientId: Yup.string().when('type', {
      is: 'create',
      then: Yup.string()
        .required(<FormattedMessage id="Field-is-required" />)
        .max(100, <FormattedMessage id="Must-be-maximum-100-digits" />),
    }),
    description: Yup.string(),
    accessTokenLifetimeInHour: Yup.number().required(
      <FormattedMessage id="field-is-required" />
    ),
  })

  const [nextPage, setNexPage] = useState(false)

  const formik = useFormik({
    initialValues,
    validationSchema: validationSchema,

    onSubmit: async (values, { setSubmitting }) => {
      if (type === 'create') {
        let clientSecret

        clientSecret = await createClient(productId, id, {
          clientId: values.clientId,
          displayName: values.displayName,
          description: values.description,
          accessTokenLifetimeInHour: values.accessTokenLifetimeInHour,
        })
        dispatch(
          clientCredentials({
            id: productId,
            data: {
              ...clientList,
              ...{
                [clientSecret.data.data.id]: {
                  clientId: values.clientId,
                  displayName: values.displayName,
                  description: values.description,
                  accessTokenLifetimeInHour: values.accessTokenLifetimeInHour,
                  isActive: true,
                  clientType: 102,
                  createdDate: new Date().toISOString().slice(0, 19),
                  id: clientSecret.data.data.id,
                },
              },
            },
          })
        )

        setNexPage(true)
      }
      if (type === 'edit') {
        let clientSecret

        clientSecret = await updateClient(productId, currentId, {
          displayName: values.displayName,
          description: values.description,
          accessTokenLifetimeInHour: values.accessTokenLifetimeInHour,
        })

        dispatch(
          clientCredentialsInfo({
            itemId: currentId,
            productId,
            data: {
              ...clientItem,
              displayName: values.displayName,
              description: values.description,
              accessTokenLifetimeInHour: values.accessTokenLifetimeInHour,
            },
          })
        )
      }
      setVisible(false)
      setSubmitting(false)
    },
  })

  return (
    <Wrapper>
      <Form onSubmit={formik.handleSubmit}>
        <Modal.Header>
          <Modal.Title className="h6">
            {!nextPage ? (
              popupLabel
            ) : (
              <>
                <FormattedMessage id="Secret-generated-successfully" />{' '}
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
          <Form.Group className="mb-3">
            <Form.Label>
              <FormattedMessage id="Display-Name" />{' '}
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
          <div className="mb-3">
            {type === 'create' && (
              <AutoGenerateInput
                label={<FormattedMessage id="Client-Id" />}
                id="clientId"
                value={formik.values.displayName}
                name={formik.values.clientId}
                onChange={formik.handleChange}
                onGenerateUniqueName={(generatedUniqueName) => {
                  formik.setFieldValue('clientId', generatedUniqueName)
                }}
                onAutoGenerateClick={() => {
                  formik.setFieldValue(
                    'isAutoGenerated',
                    !formik.values.isAutoGenerated
                  )
                }}
                isAutoGenerated={formik.values.isAutoGenerated}
              />
            )}
            {formik.touched.clientId && formik.errors.clientId && (
              <Form.Control.Feedback
                type="invalid"
                style={{ display: 'block' }}
              >
                {formik.errors.clientId}
              </Form.Control.Feedback>
            )}
          </div>

          <Form.Group className="mb-3">
            <Form.Label>
              <FormattedMessage id="Description" />
            </Form.Label>

            <TextareaAndCounter
              addTextarea={formik.setFieldValue}
              maxLength={250}
              showCharCount
              inputValue={formik?.values?.description}
            />

            {formik.touched.description && formik.errors.description && (
              <Form.Control.Feedback
                type="invalid"
                style={{ display: 'block' }}
              >
                {formik.errors.description}
              </Form.Control.Feedback>
            )}
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>
              <FormattedMessage id="Access-Token-Lifetime-In-Hour" />{' '}
              <span style={{ color: 'red' }}>*</span>
            </Form.Label>

            <input
              className="form-control"
              type="text"
              id="accessTokenLifetimeInHour"
              name="accessTokenLifetimeInHour"
              onChange={formik.handleChange}
              value={formik.values.accessTokenLifetimeInHour}
            />

            {formik.touched.accessTokenLifetimeInHour &&
              formik.errors.accessTokenLifetimeInHour && (
                <Form.Control.Feedback
                  type="invalid"
                  style={{ display: 'block' }}
                >
                  {formik.errors.accessTokenLifetimeInHour}
                </Form.Control.Feedback>
              )}
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" type="submit">
            <FormattedMessage id="Submit" />
          </Button>

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

export default CreateClientForm
