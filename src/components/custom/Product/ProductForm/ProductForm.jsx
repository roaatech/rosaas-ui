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
import MultilingualInput from '../../Shared/MultilingualInput/MultilingualInput.jsx' // Import MultilingualInput
import { BsFillQuestionCircleFill } from 'react-icons/bs'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faToggleOff, faToggleOn } from '@fortawesome/free-solid-svg-icons'
import { Routes } from '../../../../routes.js'
import { Product_Client_id } from '../../../../const/product.js'
import SafeFormatMessage from '../../Shared/SafeFormatMessage/SafeFormatMessage.jsx'

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
    displayNameEn: productData?.displayNameLocalizations?.en || '',
    displayNameAr: productData?.displayNameLocalizations?.ar || '',
    descriptionEn: productData?.descriptionLocalizations?.en || '',
    descriptionAr: productData?.descriptionLocalizations?.ar || '',
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

  const createValidation = {
    displayNameEn: Yup.string().test({
      name: 'displayNameRequired',
      message: <SafeFormatMessage id="Display-Name-is-required" />,
      test: (value, context) => {
        const { parent } = context
        const displayNameEn = parent.displayNameEn
        const displayNameAr = parent.displayNameAr
        return !!displayNameEn || !!displayNameAr
      },
    }),
    displayNameAr: Yup.string().test({
      name: 'displayNameRequired',
      message: <SafeFormatMessage id="Display-Name-is-required" />,
      test: (value, context) => {
        const { parent } = context
        const displayNameEn = parent.displayNameEn
        const displayNameAr = parent.displayNameAr
        return !!displayNameEn || !!displayNameAr
      },
    }),
    systemName: Yup.string()
      .max(100, <SafeFormatMessage id="Must-be-maximum-100-digits" />)
      .required(<SafeFormatMessage id="System-Name-is-required" />)
      .matches(
        /^[a-zA-Z0-9_-]+$/,
        <SafeFormatMessage id="English-Characters,-Numbers,-and-Underscores-are-only-accepted." />
      ),
  }

  const editValidation = {
    displayNameEn: Yup.string().test({
      name: 'displayNameRequired',
      message: <SafeFormatMessage id="Display-Name-is-required" />,
      test: (value, context) => {
        const { parent } = context
        const displayNameEn = parent.displayNameEn
        const displayNameAr = parent.displayNameAr
        return !!displayNameEn || !!displayNameAr
      },
    }),
    displayNameAr: Yup.string().test({
      name: 'displayNameRequired',
      message: <SafeFormatMessage id="Display-Name-is-required" />,
      test: (value, context) => {
        const { parent } = context
        const displayNameEn = parent.displayNameEn
        const displayNameAr = parent.displayNameAr
        return !!displayNameEn || !!displayNameAr
      },
    }),
  }

  const validationSchema = Yup.object().shape(
    type === 'create' ? createValidation : editValidation
  )

  const formik = useFormik({
    initialValues,
    validationSchema: validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      const dataToSubmit = {
        displayNameLocalizations: {
          en: values.displayNameEn,
          ar: values.displayNameAr,
        },
        descriptionLocalizations: {
          en: values.descriptionEn,
          ar: values.descriptionAr,
        },
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
        clientId:
          userInfo.userType == 'clientAdmin'
            ? userInfo.ProductOwnerInfo?.id
            : values.clientId
            ? values.clientId
            : Product_Client_id,
      }

      if (type == 'create') {
        const createProduct = await createProductRequest(dataToSubmit)
        if (sideBar) {
          navigate(`${Routes.products.path}/${createProduct.data.data.id}`)
        }
        setUpdate && setUpdate(update + 1)
        setVisible && setVisible(false)
      } else {
        await editProductRequest({
          data: dataToSubmit,
          id: productData.id,
        })
        dispatch(
          removeSubscriptionDataByProductId({ productId: productData.id })
        )
        dispatch(
          productInfo({
            id: productData.id,
            ...dataToSubmit,
            editedDate: new Date().toISOString().slice(0, 19),
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
          {/* MultilingualInput for Display Name */}
          <MultilingualInput
            inputLabel="Display-Name"
            languages={[
              { code: 'en', name: 'English' },
              { code: 'ar', name: 'Arabic' },
            ]}
            inputIds={{
              en: 'displayNameEn',
              ar: 'displayNameAr',
            }}
            placeholder={{
              en: 'English-Name',
              ar: 'Arabic-Name',
            }}
            tooltipMessageId="Friendly-Name-Label"
            values={{
              en: formik.values.displayNameEn,
              ar: formik.values.displayNameAr,
            }}
            onChange={formik.handleChange}
            isRequired={true}
            inputType="input"
            errors={{
              en: formik.errors.displayNameEn,
              ar: formik.errors.displayNameAr,
            }}
            touched={{
              en: formik.touched.displayNameEn,
              ar: formik.touched.displayNameAr,
            }}
          />

          {/* System Name Field */}
          {type === 'create' && (
            <div className="mb-3">
              <AutoGenerateInput
                label={<SafeFormatMessage id="System-Name" />}
                id="systemName"
                value={formik.values.displayNameEn}
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
              {formik.touched.systemName && formik.errors.systemName && (
                <Form.Control.Feedback
                  type="invalid"
                  style={{ display: 'block' }}
                >
                  {formik.errors.systemName}
                </Form.Control.Feedback>
              )}
            </div>
          )}

          {userInfo.userType == 'superAdmin' && type === 'create' && (
            <div>
              <Form.Group className="mb-3">
                <Form.Label>
                  <SafeFormatMessage id="ProductOwner" />{' '}
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
                    <SafeFormatMessage id="Select-Option" />
                  </option>
                  {listData &&
                    Object.values(listData).map((option) => (
                      <option key={option.id} value={option.id}>
                        {option.displayName}
                      </option>
                    ))}
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

          {/* Description Field using MultilingualInput */}
          <MultilingualInput
            inputLabel="Description"
            languages={[
              { code: 'en', name: 'English' },
              { code: 'ar', name: 'Arabic' },
            ]}
            inputIds={{
              en: 'descriptionEn',
              ar: 'descriptionAr',
            }}
            placeholder={{
              en: 'English-Description',
              ar: 'Arabic-Description',
            }}
            tooltipMessageId="Description-Tooltip"
            values={{
              en: formik.values.descriptionEn,
              ar: formik.values.descriptionAr,
            }}
            onChange={formik.handleChange}
            isRequired={false}
            inputType="TextareaAndCounter"
            maxLength={450}
            errors={{
              en: formik.errors.descriptionEn,
              ar: formik.errors.descriptionAr,
            }}
            touched={{
              en: formik.touched.descriptionEn,
              ar: formik.touched.descriptionAr,
            }}
          />

          {type !== 'create' && (
            <div>
              <Form.Group className="mb-3">
                <Form.Label>
                  <SafeFormatMessage id="Api-key" />
                </Form.Label>
                <div className="inputIcon">
                  <span className="buttonCont">
                    <OverlayTrigger
                      style={{ minWidth: '150px' }}
                      trigger={['hover', 'focus']}
                      placement="top"
                      overlay={
                        <Tooltip>
                          <SafeFormatMessage id="Random-api-key" />
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
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" type="submit">
            <SafeFormatMessage id="Submit" />
          </Button>
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

export default ProductForm
