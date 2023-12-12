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
import { productInfo } from '../../../../store/slices/products/productsSlice.js'
import { useDispatch } from 'react-redux'
import { FormattedMessage } from 'react-intl'
import { GiPerspectiveDiceSixFacesRandom } from 'react-icons/gi'
import { Wrapper } from './ProductForm.styled.jsx'
import { generateApiKey } from '../../../../lib/sharedFun/common.js'
import { useNavigate } from 'react-router-dom'
import AutoGenerateInput from '../../Shared/AutoGenerateInput/AutoGenerateInput.jsx'
import { removeSubscriptionDataByProductId } from '../../../../store/slices/tenants.js'
import TextareaAndCounter from '../../Shared/TextareaAndCounter/TextareaAndCounter.jsx'
import { BsFillQuestionCircleFill } from 'react-icons/bs'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faToggleOff, faToggleOn } from '@fortawesome/free-solid-svg-icons'

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
    displayName: productData ? productData.displayName : '',
    description: productData ? productData.description : '',
    name: productData ? productData.name : '',
    isPublished: productData ? productData.isPublished : '',
    apiKey: productData ? productData.apiKey : '',
    defaultHealthCheckUrl: productData ? productData.defaultHealthCheckUrl : '',
    healthStatusChangeUrl: productData ? productData.healthStatusChangeUrl : '',
    subscriptionResetUrl: productData ? productData.subscriptionResetUrl : '',
    subscriptionDowngradeUrl: productData
      ? productData.subscriptionDowngradeUrl
      : '',
    subscriptionUpgradeUrl: productData
      ? productData.subscriptionUpgradeUrl
      : '',
    creationEndpoint: productData ? productData.creationEndpoint : '',
    activationEndpoint: productData ? productData.activationEndpoint : '',
    deactivationEndpoint: productData ? productData.deactivationEndpoint : '',
    deletionEndpoint: productData ? productData.deletionEndpoint : '',
  }

  const validationSchema = Yup.object().shape({
    displayName: Yup.string()
      .required(<FormattedMessage id="This-field-is-required" />)
      .max(100, <FormattedMessage id="Must-be-maximum-100-digits" />),

    // name: Yup.string()
    //   .max(100, <FormattedMessage id="Must-be-maximum-100-digits" />)
    //   .required(<FormattedMessage id="Unique-Name-is-required" />)
    //   .matches(
    //     /^[a-zA-Z0-9_-]+$/,
    //     <FormattedMessage id="English-Characters,-Numbers,-and-Underscores-are-only-accepted." />
    //   ),

    defaultHealthCheckUrl: Yup.string(),
    healthStatusChangeUrl: Yup.string(),
    subscriptionResetUrl: Yup.string(),
    subscriptionDowngradeUrl: Yup.string(),
    subscriptionUpgradeUrl: Yup.string(),
  })

  const formik = useFormik({
    initialValues,
    validationSchema: validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      setVisible(false)
      if (type == 'create') {
        const createProduct = await createProductRequest({
          displayName: values.displayName,
          description: values.description,
          isPublished: values.isPublished || false,
          name: values.name,
          apiKey: values.apiKey,
          defaultHealthCheckUrl: values.defaultHealthCheckUrl,
          healthStatusChangeUrl: values.healthStatusChangeUrl,
          subscriptionResetUrl: values.subscriptionResetUrl,
          subscriptionUpgradeUrl: values.subscriptionUpgradeUrl,
          subscriptionDowngradeUrl: values.subscriptionDowngradeUrl,
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
            displayName: values.displayName,
            description: values.description,
            name: values.name,
            isPublished: values.isPublished || false,
            apiKey: values.apiKey,
            defaultHealthCheckUrl: values.defaultHealthCheckUrl,
            healthStatusChangeUrl: values.healthStatusChangeUrl,
            subscriptionResetUrl: values.subscriptionResetUrl,
            subscriptionUpgradeUrl: values.subscriptionUpgradeUrl,
            subscriptionDowngradeUrl: values.subscriptionDowngradeUrl,
            creationEndpoint: values.creationEndpoint,
            activationEndpoint: values.activationEndpoint,
            deactivationEndpoint: values.deactivationEndpoint,
            deletionEndpoint: values.deletionEndpoint,
            clientId: Product_Client_id,
          },
          id: productData.id,
        })
        dispatch(
          removeSubscriptionDataByProductId({ productId: productData.id })
        )
        dispatch(
          productInfo({
            id: productData.id,
            displayName: values.displayName,
            description: values.description,
            name: values.name,
            isPublished: values.isPublished || false,
            apiKey: values.apiKey,
            defaultHealthCheckUrl: values.defaultHealthCheckUrl,
            healthStatusChangeUrl: values.healthStatusChangeUrl,
            subscriptionResetUrl: values.subscriptionResetUrl,
            subscriptionUpgradeUrl: values.subscriptionUpgradeUrl,
            subscriptionDowngradeUrl: values.subscriptionDowngradeUrl,
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
          </div>
          <div className="mb-3">
            {type === 'create' && (
              <AutoGenerateInput
                label={<FormattedMessage id="Name" />}
                id="name"
                value={formik.values.displayName}
                name={formik.values.name}
                onChange={formik.handleChange}
                onGenerateUniqueName={(generatedUniqueName) => {
                  formik.setFieldValue('name', generatedUniqueName)
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
            {formik.touched.name && formik.errors.name && (
              <Form.Control.Feedback
                type="invalid"
                style={{ display: 'block' }}
              >
                {formik.errors.name}
              </Form.Control.Feedback>
            )}
          </div>
          <div className="card toggle-container p-2 mb-3">
            <div className="d-flex align-items-center justify-content-between ">
              <Form.Label className="flex-grow-1">
                <FormattedMessage id="Is-Published" />{' '}
              </Form.Label>
              <span className="me-2">
                <FontAwesomeIcon
                  icon={formik.values.isPublished ? faToggleOn : faToggleOff}
                  className={
                    formik.values.isPublished
                      ? 'active-toggle fa-lg'
                      : 'passive-toggle fa-lg'
                  }
                  onClick={() =>
                    formik.setFieldValue(
                      'isPublished',
                      !formik.values.isPublished
                    )
                  }
                />{' '}
              </span>
            </div>
          </div>
          <div>
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
                <FormattedMessage id="Subscription-Reset-Url" />
              </Form.Label>
              <input
                type="text"
                className="form-control"
                id="subscriptionResetUrl"
                name="subscriptionResetUrl"
                onChange={formik.handleChange}
                value={formik.values.subscriptionResetUrl}
              />

              {formik.touched.subscriptionResetUrl &&
                formik.errors.subscriptionResetUrl && (
                  <Form.Control.Feedback
                    type="invalid"
                    style={{ display: 'block' }}
                  >
                    {formik.errors.subscriptionResetUrl}
                  </Form.Control.Feedback>
                )}
            </Form.Group>
          </div>
          <div>
            <Form.Group className="mb-3">
              <Form.Label>
                <FormattedMessage id="Subscription-Upgrade-Url" />
              </Form.Label>
              <input
                type="text"
                className="form-control"
                id="subscriptionUpgradeUrl"
                name="subscriptionUpgradeUrl"
                onChange={formik.handleChange}
                value={formik.values.subscriptionUpgradeUrl}
              />

              {formik.touched.subscriptionUpgradeUrl &&
                formik.errors.subscriptionUpgradeUrl && (
                  <Form.Control.Feedback
                    type="invalid"
                    style={{ display: 'block' }}
                  >
                    {formik.errors.subscriptionUpgradeUrl}
                  </Form.Control.Feedback>
                )}
            </Form.Group>
          </div>
          <div>
            <Form.Group className="mb-3">
              <Form.Label>
                <FormattedMessage id="Subscription-Downgrade-Url" />
              </Form.Label>
              <input
                type="text"
                className="form-control"
                id="subscriptionDowngradeUrl"
                name="subscriptionDowngradeUrl"
                onChange={formik.handleChange}
                value={formik.values.subscriptionDowngradeUrl}
              />

              {formik.touched.subscriptionDowngradeUrl &&
                formik.errors.subscriptionDowngradeUrl && (
                  <Form.Control.Feedback
                    type="invalid"
                    style={{ display: 'block' }}
                  >
                    {formik.errors.subscriptionDowngradeUrl}
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

export default ProductForm
