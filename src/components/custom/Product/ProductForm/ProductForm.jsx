import React, { useState } from 'react'
import { useFormik } from 'formik'
import { InputText } from 'primereact/inputtext'
import * as Yup from 'yup'
import useRequest from '../../../../axios/apis/useRequest.js'
import {
  Modal,
  Button,
  OverlayTrigger,
  Tooltip,
} from '@themesberg/react-bootstrap'
import { Form } from '@themesberg/react-bootstrap'
import { productInfo } from '../../../../store/slices/products/productsSlice.js'
import { useDispatch, useSelector } from 'react-redux'
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
import { Routes } from '../../../../routes.js'
import { Product_Client_id } from '../../../../const/product.js'

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
  const listData = useSelector((state) => state.productsOwners.productsOwners)
  let userInfo = useSelector((state) => state.auth.userInfo)
  const initialValues = {
    displayName: productData ? productData.displayName : '',
    description: productData ? productData.description : '',
    systemName: productData ? productData.systemName : '',
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
    clientId:
      productData && userInfo.userType != 'clientAdmin'
        ? productData?.client?.id
        : userInfo.userType == 'clientAdmin'
        ? userInfo.ProductOwnerInfo?.id
        : '',
  }

  const validationSchema = Yup.object().shape({
    displayName: Yup.string()
      .required(<FormattedMessage id="This-field-is-required" />)
      .max(100, <FormattedMessage id="Must-be-maximum-100-digits" />),

    systemName: Yup.string()
      .max(100, <FormattedMessage id="Must-be-maximum-100-digits" />)
      .required(<FormattedMessage id="System-Name-is-required" />)
      .matches(
        /^[a-zA-Z0-9_-]+$/,
        <FormattedMessage id="English-Characters,-Numbers,-and-Underscores-are-only-accepted." />
      ),

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
      if (type == 'create') {
        const createProduct = await createProductRequest({
          displayName: values.displayName,
          description: values.description,
          isPublished: values.isPublished || false,
          systemName: values.systemName,
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
          clientId:
            userInfo.userType == 'clientAdmin'
              ? userInfo.ProductOwnerInfo?.id
              : values.clientId
              ? values.clientId
              : Product_Client_id,
        })
        if (sideBar) {
          navigate(`${Routes.products.path}/${createProduct.data.data.id}`)
        }
        setUpdate && setUpdate(update + 1)
        setVisible && setVisible(false)
      } else {
        const editProduct = await editProductRequest({
          data: {
            displayName: values.displayName,
            description: values.description,
            systemName: values.systemName,
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
            systemName: values.systemName,
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
            clientId: {
              id:
                userInfo.userType == 'clientAdmin'
                  ? userInfo.ProductOwnerInfo?.id
                  : values.clientId
                  ? values.clientId
                  : Product_Client_id,
            },
          })
        )
        setVisible && setVisible(false)
      }
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
                label={<FormattedMessage id="System-Name" />}
                id="systemName"
                value={formik.values.displayName}
                name={formik.values.systemName}
                onChange={formik.handleChange}
                onGenerateUniqueName={(generatedUniqueName) => {
                  formik.setFieldValue('systemName', generatedUniqueName)
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
            {formik.touched.systemName && formik.errors.systemName && (
              <Form.Control.Feedback
                type="invalid"
                style={{ display: 'block' }}
              >
                {formik.errors.systemName}
              </Form.Control.Feedback>
            )}
          </div>
          {userInfo.userType == 'superAdmin' && type === 'create' && (
            <div>
              <Form.Group className="mb-3">
                <Form.Label>
                  <FormattedMessage id="ProductOwner" />{' '}
                  <span style={{ color: 'red' }}>*</span>
                </Form.Label>
                <select
                  className="form-control"
                  name="clientId"
                  id="clientId"
                  value={formik.values.clientId}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                >
                  <option value="">
                    <FormattedMessage id="Select-Option" />
                  </option>
                  {listData &&
                    Object.values(listData).map((option) => {
                      return (
                        <option key={option.id} value={option.id}>
                          {option.displayName}
                        </option>
                      )
                    })}
                </select>
                {formik.touched.clientId && formik.errors.clientId && (
                  <Form.Control.Feedback
                    type="invalid"
                    style={{ display: 'block' }}
                  >
                    {formik.errors.clientId}
                  </Form.Control.Feedback>
                )}
              </Form.Group>
            </div>
          )}

          {/* <div className="card toggle-container p-2 mb-3">
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
          </div> */}
          <div>
            <Form.Group className="mb-3">
              <Form.Label>
                <FormattedMessage id="Description" />
              </Form.Label>

              <TextareaAndCounter
                addTextarea={formik.setFieldValue}
                maxLength={120}
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
