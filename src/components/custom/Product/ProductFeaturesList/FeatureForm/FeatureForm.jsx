import React from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import useRequest from '../../../../../axios/apis/useRequest.js'
import { Modal, Button } from '@themesberg/react-bootstrap'
import { Form } from '@themesberg/react-bootstrap'
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
    systemName: featureData ? featureData.systemName : '',
    displayName: featureData ? featureData.displayName : '',
    description: featureData ? featureData.description : '',
    type: featureData ? featureData.type : '',
    // unit: featureData ? featureData.unit : undefined,
    displayOrder: featureData ? featureData.displayOrder : '0',
  }

  const validationSchema = Yup.object().shape({
    displayName: Yup.string()
      .required(<FormattedMessage id="Title-is-required" />)
      .max(100, <FormattedMessage id="Must-be-maximum-100-digits" />),
    systemName: Yup.string()
      .max(100, <FormattedMessage id="Must-be-maximum-100-digits" />)
      .required(<FormattedMessage id="Unique-Name-is-required" />)
      .matches(
        /^[a-zA-Z0-9_-]+$/,
        <FormattedMessage id="English-Characters,-Numbers,-and-Underscores-are-only-accepted." />
      ),
    type: Yup.string().required(
      <FormattedMessage id="This-field-is-required" />
    ),
    displayOrder: Yup.number()
      .typeError('Display Order must be a number')
      .integer('Display Order must be an integer')
      .min(0, 'Display Order must be a positive number')
      .default(0),

    // unit: Yup.string().test(
    //   'unit-validation',
    //   'Unit is required when Type is Number',
    //   function (value) {
    //     const type = this.resolve(Yup.ref('type'))
    //     if (type === '1') {
    //       return value !== undefined && value !== ''
    //     }
    //     return true
    //   }
    // ),
  })
  const formik = useFormik({
    initialValues,
    validationSchema: validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      if (type === 'create') {
        const createFeature = await createFeatureRequest(productId, {
          systemName: values.systemName,
          displayName: values.displayName,
          description: values.description,
          type: parseInt(values.type),
          displayOrder: values.displayOrder || 0,
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
              systemName: values.systemName,
              displayName: values.displayName,
              description: values.description,
              type: values.type,
              displayOrder: values.displayOrder || 0,
              // unit: values.unit,
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
        const editFeature = await editFeatureRequest(productId, {
          data: {
            systemName: values.systemName,
            displayName: values.displayName,
            description: values.description,
            type: parseInt(values.type),
            displayOrder: values.displayOrder || 0,
            // unit: parseInt(values.unit),
          },
          id: featureData.id,
        })

        dispatch(
          FeatureInfo({
            featureId: featureData.id,
            productId: productId,
            data: {
              systemName: values.systemName,
              displayName: values.displayName,
              description: values.description,
              type: values.type,
              displayOrder: values.displayOrder || 0,
              // unit: values.unit,
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

            {formik.touched.systemName && formik.errors.systemName && (
              <Form.Control.Feedback
                type="invalid"
                style={{ display: 'block' }}
              >
                {formik.errors.systemName}
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

          {/* Repeat similar code blocks for other fields */}
          <div>
            {/* Type */}
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
                // onChange={(e) => {
                //   formik.handleChange(e)
                //   if (e.target.value === '2') {
                //     formik.setFieldValue('unit', '')
                //   }
                // }}
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
          </div>
          {/* <div>
             <Form.Group className="mb-3">
              <Form.Label>
                <FormattedMessage id="Unit" />
              </Form.Label>
              <select
                className="form-control"
                id="unit"
                name="unit"
                onChange={formik.handleChange}
                value={formik.values.unit}
                disabled={formik.values.type != '1'}
              >
                <option value="">Select Unit</option>
                {Object.entries(featureUnitMap).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
               {formik.touched.unit && formik.errors.unit && (
                <Form.Control.Feedback
                  type="invalid"
                  style={{ display: 'block' }}
                >
                  {formik.errors.unit}
                </Form.Control.Feedback>
              )}
               {formik.values.type === '1' &&
                formik.touched.unit &&
                !formik.values.unit && (
                  <div className="invalid-feedback">
                    Unit is required when Type is Number
                  </div>
                )}
            </Form.Group>
          </div> */}

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
