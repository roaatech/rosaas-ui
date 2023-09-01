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
} from '../../../../../store/slices/products.js'
import { useParams } from 'react-router-dom'

import TextareaAndCounter from '../../../Shared/TextareaAndCounter/TextareaAndCounter.jsx'

import {
  featureResetMap,
  featureTypeMap,
  featureUnitMap,
} from '../../../../../const/index.js'
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
    name: featureData ? featureData.name : '',
    description: featureData ? featureData.description : '',
    type: featureData ? featureData.type : '',
    unit: featureData ? featureData.unit : undefined,
    reset: featureData ? featureData.reset : '',
  }

  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Feature Name is required'),
    description: Yup.string().required('Description is required'),
    type: Yup.string().required('Type is required'),
    unit: Yup.string().test(
      'unit-validation',
      'Unit is required when Type is Number',
      function (value) {
        const type = this.resolve(Yup.ref('type'))
        if (type === '1') {
          return value !== undefined && value !== ''
        }
        return true
      }
    ),
  })
  const formik = useFormik({
    initialValues,
    validationSchema: validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      if (type === 'create') {
        const createFeature = await createFeatureRequest(productId, {
          name: values.name,
          description: values.description,
          type: parseInt(values.type),
          unit: parseInt(values.unit),
          reset: parseInt(values.reset) || 1,
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
              name: values.name,
              description: values.description,
              type: values.type,
              unit: values.unit,
              reset: values.reset || 1,
              id: createFeature.data.data.id,
              editedDate: new Date().toISOString().slice(0, 19),
              createdDate: new Date().toISOString().slice(0, 19),
            },
          })
        )

        if (setActiveIndex) {
          setActiveIndex(3)
        }
      } else {
        const editFeature = await editFeatureRequest(productId, {
          data: {
            name: values.name,
            description: values.description,
            type: parseInt(values.type),
            unit: parseInt(values.unit),
            reset: parseInt(values.reset) || 1,
          },
          id: featureData.id,
        })

        dispatch(
          FeatureInfo({
            featureId: featureData.id,
            productId: productId,
            data: {
              name: values.name,
              description: values.description,
              type: values.type,
              unit: values.unit,
              reset: values.reset || 1,
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
          <div>
            {/* Name */}
            <Form.Group className="mb-3">
              <Form.Label>
                <FormattedMessage id="Name" />{' '}
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
              {/* Display validation error */}
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
          <Form.Group className="mb-3">
            <Form.Label>
              <FormattedMessage id="Description" />{' '}
              <span style={{ color: 'red' }}>*</span>
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
                onChange={(e) => {
                  formik.handleChange(e)
                  if (e.target.value === '2') {
                    formik.setFieldValue('unit', '')
                  }
                }}
                value={formik.values.type}
              >
                <option value="">Select Type</option>
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
          <div>
            {/* Unit */}
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
                disabled={formik.values.type === 2}
              >
                <option value="">Select Unit</option>
                {Object.entries(featureUnitMap).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
              {/* Display validation error */}
              {formik.touched.unit && formik.errors.unit && (
                <Form.Control.Feedback
                  type="invalid"
                  style={{ display: 'block' }}
                >
                  {formik.errors.unit}
                </Form.Control.Feedback>
              )}
              {/* Show error message for conditional validation */}
              {formik.values.type === '1' &&
                formik.touched.unit &&
                !formik.values.unit && (
                  <div className="invalid-feedback">
                    Unit is required when Type is Number
                  </div>
                )}
            </Form.Group>
          </div>
          <div>
            {/* Reset */}
            <Form.Group className="mb-3">
              <Form.Label>
                <FormattedMessage id="Reset" />
              </Form.Label>
              <select
                className="form-control"
                id="reset"
                name="reset"
                onChange={formik.handleChange}
                value={formik.values.reset}
              >
                <option value="">Select Reset</option>
                {Object.entries(featureResetMap).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
              {/* Display validation error */}
              {formik.touched.reset && formik.errors.reset && (
                <Form.Control.Feedback
                  type="invalid"
                  style={{ display: 'block' }}
                >
                  {formik.errors.reset}
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

export default FeatureForm
