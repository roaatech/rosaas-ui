import React, { useState } from 'react'
import { useFormik } from 'formik'
import { InputText } from 'primereact/inputtext'
import * as Yup from 'yup'
import useRequest from '../../../../axios/apis/useRequest.js'
import { Product_Client_id } from '../../../../const/index.js'
import {
  Modal,
  Button,
  OverlayTrigger,
  Tooltip,
} from '@themesberg/react-bootstrap'
import { Form } from '@themesberg/react-bootstrap'
import { productInfo } from '../../../../store/slices/products.js'
import { useDispatch } from 'react-redux'
import { FormattedMessage } from 'react-intl'
import { GiPerspectiveDiceSixFacesRandom } from 'react-icons/gi'
import { Wrapper } from './ProductForm.styled.jsx'
import { generateApiKey } from '../../../../lib/sharedFun/common.js'
import { useNavigate } from 'react-router-dom'

const ProductForm = ({
  type,
  productData,
  setVisible,
  popupLabel,
  update,
  setUpdate,
  sideBar,
}) => {
  const { createProductRequest, editProductRequest } = useRequest()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const initialValues = {
    name: productData ? productData.name : '',
    apiKey: productData ? productData.apiKey : '',
    defaultHealthCheckUrl: productData ? productData.defaultHealthCheckUrl : '',
    healthStatusChangeUrl: productData ? productData.healthStatusChangeUrl : '',
    creationEndpoint: productData ? productData.creationEndpoint : '',
    activationEndpoint: productData ? productData.activationEndpoint : '',
    deactivationEndpoint: productData ? productData.deactivationEndpoint : '',
    deletionEndpoint: productData ? productData.deletionEndpoint : '',
  }

  const validationSchema = Yup.object().shape({
    name: Yup.string().required(
      <FormattedMessage id="This-field-is-required" />
    ),
    defaultHealthCheckUrl: Yup.string()
      .required(<FormattedMessage id="This-field-is-required" />)
      .matches(
        /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,})(:\d{2,5})?(\/[^\s]*)?$/i,
        <FormattedMessage id="Please-enter-a-valid-value" />
      ),
    healthStatusChangeUrl: Yup.string()
      .required(<FormattedMessage id="This-field-is-required" />)
      .matches(
        /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,})(:\d{2,5})?(\/[^\s]*)?$/i,
        <FormattedMessage id="Please-enter-a-valid-value" />
      ),
  })

  const formik = useFormik({
    initialValues,
    validationSchema: validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      setVisible(false)
      if (type == 'create') {
        const createProduct = await createProductRequest({
          name: values.name,
          apiKey: values.apiKey,
          defaultHealthCheckUrl: values.defaultHealthCheckUrl,
          healthStatusChangeUrl: values.healthStatusChangeUrl,
          creationEndpoint: values.creationEndpoint,
          activationEndpoint: values.activationEndpoint,
          deactivationEndpoint: values.deactivationEndpoint,
          deletionEndpoint: values.deletionEndpoint,
          clientId: Product_Client_id,
        })
        if (sideBar) {
          navigate(`/products/${createProduct.data.data.id}`)
        }
        setUpdate(update + 1)
      } else {
        const editProduct = await editProductRequest({
          data: {
            name: values.name,
            apiKey: values.apiKey,
            defaultHealthCheckUrl: values.defaultHealthCheckUrl,
            healthStatusChangeUrl: values.healthStatusChangeUrl,
            creationEndpoint: values.creationEndpoint,
            activationEndpoint: values.activationEndpoint,
            deactivationEndpoint: values.deactivationEndpoint,
            deletionEndpoint: values.deletionEndpoint,
            clientId: Product_Client_id,
          },
          id: productData.id,
        })

        dispatch(
          productInfo({
            id: productData.id,
            name: values.name,
            apiKey: values.apiKey,
            defaultHealthCheckUrl: values.defaultHealthCheckUrl,
            healthStatusChangeUrl: values.healthStatusChangeUrl,
            creationEndpoint: values.creationEndpoint,
            activationEndpoint: values.activationEndpoint,
            deactivationEndpoint: values.deactivationEndpoint,
            deletionEndpoint: values.deletionEndpoint,
            editedDate: new Date().toISOString().slice(0, 19),
            clientId: { id: Product_Client_id },
          })
        )
      }

      setVisible && setVisible(false)
      setVisible && setVisible(false)
    },
  })
  const RandomApiKey = () => {
    formik.setFieldValue('apiKey', generateApiKey())
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
          <div>
            <Form.Group className="mb-3">
              <Form.Label>
                <FormattedMessage id="Name" />
                <span style={{ color: 'red' }}>*</span>
              </Form.Label>
              <input
                type="text"
                className="form-control"
                id="name"
                name="name"
                onChange={formik.handleChange}
                value={formik.values.name}
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
          </div>
          <div>
            <Form.Group className="mb-3">
              <Form.Label>
                <FormattedMessage id="Api-key" />
              </Form.Label>
              <div className="inputIcon">
                <span className="buttonCont">
                  <OverlayTrigger
                    style={{ minWidth: '150px' }}
                    trigger={['hover', 'focus']}
                    placement="top"
                    overlay={
                      <Tooltip>
                        <FormattedMessage id="Random-api-key" />
                      </Tooltip>
                    }
                  >
                    <button type="button" onClick={RandomApiKey}>
                      <GiPerspectiveDiceSixFacesRandom />
                    </button>
                  </OverlayTrigger>
                </span>

                <input
                  type="text"
                  className="form-control"
                  id="apiKey"
                  name="apiKey"
                  onChange={formik.handleChange}
                  value={formik.values.apiKey}
                />
              </div>

              {formik.touched.apiKey && formik.errors.apiKey && (
                <Form.Control.Feedback
                  type="invalid"
                  style={{ display: 'block' }}
                >
                  {formik.errors.apiKey}
                </Form.Control.Feedback>
              )}
            </Form.Group>
          </div>

          <div>
            <Form.Group className="mb-3">
              <Form.Label>
                <FormattedMessage id="Default-Health-Check-Url" />
                <span style={{ color: 'red' }}>*</span>
              </Form.Label>
              <input
                type="text"
                className="form-control"
                id="defaultHealthCheckUrl"
                name="defaultHealthCheckUrl"
                onChange={formik.handleChange}
                value={formik.values.defaultHealthCheckUrl}
              />

              {formik.touched.defaultHealthCheckUrl &&
                formik.errors.defaultHealthCheckUrl && (
                  <Form.Control.Feedback
                    type="invalid"
                    style={{ display: 'block' }}
                  >
                    {formik.errors.defaultHealthCheckUrl}
                  </Form.Control.Feedback>
                )}
            </Form.Group>
          </div>
          <div>
            <Form.Group className="mb-3">
              <Form.Label>
                <FormattedMessage id="Health-Status-Change-Url" />
                <span style={{ color: 'red' }}>*</span>
              </Form.Label>
              <input
                type="text"
                className="form-control"
                id="healthStatusChangeUrl"
                name="healthStatusChangeUrl"
                onChange={formik.handleChange}
                value={formik.values.healthStatusChangeUrl}
              />

              {formik.touched.healthStatusChangeUrl &&
                formik.errors.healthStatusChangeUrl && (
                  <Form.Control.Feedback
                    type="invalid"
                    style={{ display: 'block' }}
                  >
                    {formik.errors.healthStatusChangeUrl}
                  </Form.Control.Feedback>
                )}
            </Form.Group>
          </div>

          <div>
            <Form.Group className="mb-3">
              <Form.Label>
                <FormattedMessage id="Creation-Url" />
              </Form.Label>
              <input
                type="text"
                className="form-control"
                id="creationEndpoint"
                name="creationEndpoint"
                onChange={formik.handleChange}
                value={formik.values.creationEndpoint}
              />

              {formik.touched.creationEndpoint &&
                formik.errors.creationEndpoint && (
                  <Form.Control.Feedback
                    type="invalid"
                    style={{ display: 'block' }}
                  >
                    {formik.errors.creationEndpoint}
                  </Form.Control.Feedback>
                )}
            </Form.Group>
          </div>
          <div>
            <Form.Group className="mb-3">
              <Form.Label>
                <FormattedMessage id="Activation-Url" />
              </Form.Label>
              <input
                type="text"
                className="form-control"
                id="activationEndpoint"
                name="activationEndpoint"
                onChange={formik.handleChange}
                value={formik.values.activationEndpoint}
              />

              {formik.touched.activationEndpoint &&
                formik.errors.activationEndpoint && (
                  <Form.Control.Feedback
                    type="invalid"
                    style={{ display: 'block' }}
                  >
                    {formik.errors.activationEndpoint}
                  </Form.Control.Feedback>
                )}
            </Form.Group>
          </div>
          <div>
            <Form.Group className="mb-3">
              <Form.Label>
                <FormattedMessage id="Deactivation-Url" />
              </Form.Label>
              <input
                type="text"
                className="form-control"
                id="deactivationEndpoint"
                name="deactivationEndpoint"
                onChange={formik.handleChange}
                value={formik.values.deactivationEndpoint}
              />

              {formik.touched.deactivationEndpoint &&
                formik.errors.deactivationEndpoint && (
                  <Form.Control.Feedback
                    type="invalid"
                    style={{ display: 'block' }}
                  >
                    {formik.errors.deactivationEndpoint}
                  </Form.Control.Feedback>
                )}
            </Form.Group>
          </div>
          <div>
            <Form.Group className="mb-3">
              <Form.Label>
                <FormattedMessage id="Deletion-Url" />
              </Form.Label>
              <input
                type="text"
                className="form-control"
                id="deletionEndpoint"
                name="deletionEndpoint"
                onChange={formik.handleChange}
                value={formik.values.deletionEndpoint}
              />

              {formik.touched.deletionEndpoint &&
                formik.errors.deletionEndpoint && (
                  <Form.Control.Feedback
                    type="invalid"
                    style={{ display: 'block' }}
                  >
                    {formik.errors.deletionEndpoint}
                  </Form.Control.Feedback>
                )}
            </Form.Group>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            type="submit"
            // disabled={submitLoading}
          >
            <FormattedMessage id="Submit" />
          </Button>
          <Button
            variant="link"
            className="text-gray ms-auto"
            onClick={() => setVisible(false)}
          >
            <FormattedMessage id="Close" />
          </Button>
        </Modal.Footer>
      </Form>
    </Wrapper>
  )
}

export default ProductForm
