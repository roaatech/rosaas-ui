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
import { useDispatch } from 'react-redux'
import { FormattedMessage } from 'react-intl'
import { GiPerspectiveDiceSixFacesRandom } from 'react-icons/gi'
import { Wrapper } from './FeatureForm.styled.jsx'
import { generateApiKey } from '../../../../lib/sharedFun/common.js'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { AiFillCopy } from 'react-icons/ai'
import { useParams } from 'react-router-dom'
import { FeatureInfo } from '../../../../store/slices/products.js'
const featureTypeMap = {
  Number: 1,
  Boolean: 2,
}

const featureUnitMap = {
  KB: 1,
  MB: 2,
  GB: 3,
}

const featureResetMap = {
  Never: 1,
  Weekly: 2,
  Monthly: 3,
  Annual: 4,
}
const featureTypeMap_ = {
  1: "Number",
  2:"Boolean",
};

const featureUnitMap_ = {
  1:"KB",
  2:"MB",
  3:"GB",
};

const featureResetMap_ = {
  1:"Never",
  2:"Weekly",
  3:"Monthly",
  4:"Annual",
};

const FeatureForm = ({
  type,
  featureData,
  setVisible,
  popupLabel,
  update,
  setUpdate,
  productId,
}) => {
  // console.log('iiiiiiiiiiiiiiiiiiii', featureData)
  const { createFeatureRequest, editFeatureRequest } = useRequest()
  const dispatch = useDispatch()

  const initialValues = {
    name: featureData ? featureData.name : '',
    description: featureData ? featureData.description : '',
    type: featureData ? featureTypeMap_[featureData.type] : '',
    unit: featureData ? featureUnitMap_[featureData.unit] : '',
    reset: featureData ? featureResetMap_[featureData.reset] : '',
  }

  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Feature Name is required'),
    // description: Yup.string().required('Description is required'),
    // type: Yup.string().required('Feature Type is required'),
    // unit: Yup.string().when('type', {
    //   is: 'Number',
    //   then: Yup.string().required('Feature Unit is required'),
    // }),
    // reset: Yup.string().required('Feature Reset is required'),
  })

  const formik = useFormik({
    initialValues,
    validationSchema: validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      if (type === 'create') {
        const createFeature = await createFeatureRequest(productId, {
          name: values.name,
          description: values.description,
          type: featureTypeMap[values.type],
          unit: featureUnitMap[values.unit],
          reset: featureResetMap[values.reset],
        })
        setUpdate(update + 1)
      } else {
        console.log(productId)
        const editFeature = await editFeatureRequest(productId, {
          data: {
            name: values.name,
            description: values.description,
            type: featureTypeMap[values.type],
          unit: featureUnitMap[values.unit],
          reset: featureResetMap[values.reset],
          },
          id: featureData.id,
        })

        dispatch(
        FeatureInfo({
          featureId: featureData.id,
          productId:productId,
          data:{name: values.name,
            description: values.description,
            type: featureTypeMap[values.type],
          unit: featureUnitMap[values.unit],
          reset: featureResetMap[values.reset],
            editedDate: new Date().toISOString().slice(0, 19),}
        }))
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
        {/* <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>
              <FormattedMessage id="Name" />
            </Form.Label>
            <InputText
              type="text"
              id="name"
              name="name"
              onChange={formik.handleChange}
              value={formik.values.name}
              className={
                formik.touched.name && formik.errors.name ? 'is-invalid' : ''
              }
            />
            {formik.touched.name && formik.errors.name && (
              <div className="invalid-feedback">{formik.errors.name}</div>
            )}
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>
              <FormattedMessage id="Description" />
            </Form.Label>
            <InputText
              type="text"
              id="description"
              name="description"
              onChange={formik.handleChange}
              value={formik.values.description}
              className={
                formik.touched.description && formik.errors.description
                  ? 'is-invalid'
                  : ''
              }
            />
            {formik.touched.description && formik.errors.description && (
              <div className="invalid-feedback">{formik.errors.description}</div>
            )}
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>
              <FormattedMessage id="Type" />
            </Form.Label>
            <InputText
              type="text"
              id="type"
              name="type"
              onChange={formik.handleChange}
              value={formik.values.type}
              className={
                formik.touched.type && formik.errors.type ? 'is-invalid' : ''
              }
            />
            {formik.touched.type && formik.errors.type && (
              <div className="invalid-feedback">{formik.errors.type}</div>
            )}
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>
              <FormattedMessage id="Unit" />
            </Form.Label>
            <InputText
              type="text"
              id="unit"
              name="unit"
              onChange={formik.handleChange}
              value={formik.values.unit}
              className={
                formik.touched.unit && formik.errors.unit ? 'is-invalid' : ''
              }
            />
            {formik.touched.unit && formik.errors.unit && (
              <div className="invalid-feedback">{formik.errors.unit}</div>
            )}
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>
              <FormattedMessage id="Reset" />
            </Form.Label>
            <InputText
              type="text"
              id="reset"
              name="reset"
              onChange={formik.handleChange}
              value={formik.values.reset}
              className={
                formik.touched.reset && formik.errors.reset ? 'is-invalid' : ''
              }
            />
            {formik.touched.reset && formik.errors.reset && (
              <div className="invalid-feedback">{formik.errors.reset}</div>
            )}
          </Form.Group>
        </Modal.Body> */}

        <Modal.Body>
          <div>
            {/* Name */}
            <Form.Group className="mb-3">
              <Form.Label>
                <FormattedMessage id="Name" />
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
              <FormattedMessage id="Description" />
            </Form.Label>
            <InputText
              type="text"
              id="description"
              name="description"
              onChange={formik.handleChange}
              value={formik.values.description}
              className={
                formik.touched.description && formik.errors.description
                  ? 'is-invalid'
                  : ''
              }
            />
            {formik.touched.description && formik.errors.description && (
              <div className="invalid-feedback">
                {formik.errors.description}
              </div>
            )}
          </Form.Group>

          {/* Repeat similar code blocks for other fields */}
          <div>
            {/* Type */}
            <Form.Group className="mb-3">
              <Form.Label>
                <FormattedMessage id="Type" />
              </Form.Label>
              <select
                className="form-control"
                id="type"
                name="type"
                onChange={formik.handleChange}
                value={[formik.values.type]}
              >
                <option value="">Select Type</option>
                {Object.keys(featureTypeMap).map((key) => (
                  <option key={key} value={key}>
                    <FormattedMessage id={key} />
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
              >
                <option value="">Select Unit</option>
                {Object.keys(featureUnitMap).map((key) => (
                  <option key={key} value={key}>
                    <FormattedMessage id={key} />
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
                {Object.keys(featureResetMap).map((key) => (
                  <option key={key} value={key}>
                    <FormattedMessage id={key} />
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
