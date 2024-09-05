import React from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import useRequest from '../../../../../axios/apis/useRequest.js'
import { Modal, Button, Form } from '@themesberg/react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { FormattedMessage } from 'react-intl'
import { Wrapper } from './FeatureForm.styled.jsx'
import {
  FeatureInfo,
  setAllFeatures,
} from '../../../../../store/slices/products/productsSlice.js'
import { useParams } from 'react-router-dom'

import TextareaAndCounter from '../../../Shared/TextareaAndCounter/TextareaAndCounter.jsx'
import {
  activeIndex,
  featureTypeMap,
  featureUnitMap,
} from '../../../../../const/index.js'
import AutoGenerateInput from '../../../Shared/AutoGenerateInput/AutoGenerateInput.jsx'
import MultilingualInput from '../../../Shared/MultilingualInput/MultilingualInput.jsx' // Import MultilingualInput

const FeatureForm = ({
  type,
  featureData,
  setVisible,
  popupLabel,
  setActiveIndex,
}) => {
  const { createFeatureRequest, editFeatureRequest, getProductFeatures } =
    useRequest()
  const dispatch = useDispatch()
  const routeParams = useParams()
  const productId = routeParams.id
  const allProducts = useSelector((state) => state.products.products)

  const initialValues = {
    displayNameEn: featureData?.displayNameLocalizations?.en || '',
    displayNameAr: featureData?.displayNameLocalizations?.ar || '',
    descriptionEn: featureData?.descriptionLocalizations?.en || '',
    descriptionAr: featureData?.descriptionLocalizations?.ar || '',
    systemName: featureData ? featureData.systemName : '',
    type: featureData ? featureData.type : '',
    displayOrder: featureData ? featureData.displayOrder : '0',
  }

  const validationSchema = Yup.object().shape({
    displayNameEn: Yup.string().test({
      name: 'displayNameRequired',
      message: <FormattedMessage id="Display-Name-is-required" />,
      test: (value, context) => {
        const { parent } = context
        const displayNameEn = parent.displayNameEn
        const displayNameAr = parent.displayNameAr
        return !!displayNameEn || !!displayNameAr
      },
    }),
    displayNameAr: Yup.string().test({
      name: 'displayNameRequired',
      message: <FormattedMessage id="Display-Name-is-required" />,
      test: (value, context) => {
        const { parent } = context
        const displayNameEn = parent.displayNameEn
        const displayNameAr = parent.displayNameAr
        return !!displayNameEn || !!displayNameAr
      },
    }),
    systemName: Yup.string()
      .max(100, <FormattedMessage id="Must-be-maximum-100-digits" />)
      .required(<FormattedMessage id="Unique-Name-is-required" />)
      .matches(
        /^[a-zA-Z0-9_-]+$/,
        <FormattedMessage id="English-Characters,-Numbers,-and-Underscores-are-only-accepted." />
      ),
    descriptionEn: Yup.string().max(
      250,
      <FormattedMessage id="Must-be-maximum-250-digits" />
    ),
    descriptionAr: Yup.string().max(
      250,
      <FormattedMessage id="Must-be-maximum-250-digits" />
    ),
    type: Yup.string().required(
      <FormattedMessage id="This-field-is-required" />
    ),
    displayOrder: Yup.number()
      .typeError('Display Order must be a number')
      .integer('Display Order must be an integer')
      .min(0, 'Display Order must be a positive number')
      .default(0),
  })

  const formik = useFormik({
    initialValues,
    validationSchema: validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      const dataToSubmit = {
        systemName: values.systemName,
        displayNameLocalizations: {
          en: values.displayNameEn,
          ar: values.displayNameAr,
        },
        descriptionLocalizations: {
          en: values.descriptionEn,
          ar: values.descriptionAr,
        },
        type: parseInt(values.type),
        displayOrder: values.displayOrder || 0,
      }

      if (type === 'create') {
        const createFeature = await createFeatureRequest(productId, {
          ...dataToSubmit,
        })

        if (!allProducts[productId].feature) {
          const feature = await getProductFeatures(productId)
          dispatch(
            setAllFeatures({
              productId: productId,
              data: feature.data.data,
            })
          )
        }

        dispatch(
          FeatureInfo({
            featureId: createFeature.data.data.id,
            productId: productId,
            data: {
              ...dataToSubmit,
              id: createFeature.data.data.id,
              editedDate: new Date().toISOString().slice(0, 19),
              createdDate: new Date().toISOString().slice(0, 19),
            },
          })
        )

        if (setActiveIndex) {
          setActiveIndex(activeIndex.features)
        }
      } else {
        await editFeatureRequest(productId, {
          data: dataToSubmit,
          id: featureData.id,
        })

        dispatch(
          FeatureInfo({
            featureId: featureData.id,
            productId: productId,
            data: {
              ...dataToSubmit,
              id: featureData.id,
              editedDate: new Date().toISOString().slice(0, 19),
              createdDate: featureData.createdDate,
            },
          })
        )
      }

      setVisible && setVisible(false)
      setSubmitting(false)
    },
  })

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
          <div className="mb-3">
            <AutoGenerateInput
              label={<FormattedMessage id="System-Name" />}
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

          {/* MultilingualInput for Description */}
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
            values={{
              en: formik.values.descriptionEn,
              ar: formik.values.descriptionAr,
            }}
            onChange={formik.handleChange}
            isRequired={false}
            inputType="TextareaAndCounter"
            maxLength={250}
            errors={{
              en: formik.errors.descriptionEn,
              ar: formik.errors.descriptionAr,
            }}
            touched={{
              en: formik.touched.descriptionEn,
              ar: formik.touched.descriptionAr,
            }}
          />

          {/* Type Field */}
          <Form.Group className="mb-3">
            <Form.Label>
              <FormattedMessage id="Type" />{' '}
              <span style={{ color: 'red' }}>*</span>
            </Form.Label>
            <select
              className="form-control"
              id="type"
              name="type"
              onChange={formik.handleChange}
              value={formik.values.type}
            >
              <option value="">
                <FormattedMessage id="Select-Option" />
              </option>
              {Object.entries(featureTypeMap).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
            {/* Display validation error */}
            {formik.touched.type && formik.errors.type && (
              <Form.Control.Feedback
                type="invalid"
                style={{ display: 'block' }}
              >
                {formik.errors.type}
              </Form.Control.Feedback>
            )}
          </Form.Group>

          {/* Display Order Field */}
          <div>
            <Form.Group className="mb-3">
              <Form.Label>
                <FormattedMessage id="Display-Order" />
              </Form.Label>
              <input
                type="text"
                className="form-control"
                id="displayOrder"
                name="displayOrder"
                onChange={formik.handleChange}
                value={formik.values.displayOrder}
              />

              {formik.touched.displayOrder && formik.errors.displayOrder && (
                <Form.Control.Feedback
                  type="invalid"
                  style={{ display: 'block' }}
                >
                  {formik.errors.displayOrder}
                </Form.Control.Feedback>
              )}
            </Form.Group>
          </div>
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

export default FeatureForm
