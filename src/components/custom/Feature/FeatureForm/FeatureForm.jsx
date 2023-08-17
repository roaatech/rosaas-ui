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
import { featureInfo } from '../../../../store/slices/features.js'
import { useDispatch } from 'react-redux'
import { FormattedMessage } from 'react-intl'
import { GiPerspectiveDiceSixFacesRandom } from 'react-icons/gi'
import { Wrapper } from './FeatureForm.styled.jsx'
import { generateApiKey } from '../../../../lib/sharedFun/common.js'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { AiFillCopy } from 'react-icons/ai'

const FeatureForm = ({
  type,
  featureData,
  setVisible,
  popupLabel,
  update,
  setUpdate,
}) => {
  const { createFeatureRequest, editFeatureRequest } = useRequest()
  const dispatch = useDispatch()

  const initialValues = {
    name: featureData ? featureData.name : '',
    description: featureData ? featureData.description : '',
    type: featureData ? featureData.type : '',
    unit: featureData ? featureData.unit : '',
    reset: featureData ? featureData.reset : '',
  }

  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Feature Name is required'),
    // defaultHealthCheckUrl: Yup.string()
    //   .required(<FormattedMessage id="This-field-is-required" />)
    //   .matches(
    //     /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,})(:\d{2,5})?(\/[^\s]*)?$/i,
    //     <FormattedMessage id="Please-enter-a-valid-value" />
    //   ),
    // healthStatusChangeUrl: Yup.string()
    //   .required(<FormattedMessage id="This-field-is-required" />)
    //   .matches(
    //     /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,})(:\d{2,5})?(\/[^\s]*)?$/i,
    //     <FormattedMessage id="Please-enter-a-valid-value" />
    //   ),
  })

  const formik = useFormik({
    initialValues,
    validationSchema: validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      if (type == 'create') {
        const createFeature = await createFeatureRequest({
          name: values.name,
          description: values.description,
          type: values.type,
          unit: values.unit,
          reset: values.reset,
        })
        setUpdate(update + 1)
      } else {
        const editFeature = await editFeatureRequest({
          data: {
            name: values.name,
            description: values.description,
            type: values.type,
            unit: values.unit,
            reset: values.reset,
          },
          id: featureData.id,
        })

        dispatch(
          featureInfo({
            id: featureData.id,
            name: values.name,
            description: values.description,
            type: values.type,
            unit: values.unit,
            reset: values.reset,
            editedDate: new Date().toISOString().slice(0, 19),
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
                <FormattedMessage id="Description" />
              </Form.Label>
              <input
                type="text"
                className="form-control"
                id="description"
                name="description"
                onChange={formik.handleChange}
                value={formik.values.description}
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
                <FormattedMessage id="Type" />
              </Form.Label>
              <input
                type="text"
                className="form-control"
                id="type"
                name="type"
                onChange={formik.handleChange}
                value={formik.values.type}
              />

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
            <Form.Group className="mb-3">
              <Form.Label>
                <FormattedMessage id="Unit" />
              </Form.Label>
              <input
                type="text"
                className="form-control"
                id="unit"
                name="unit"
                onChange={formik.handleChange}
                value={formik.values.unit}
              />

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
            <Form.Group className="mb-3">
              <Form.Label>
                <FormattedMessage id="Reset" />
              </Form.Label>
              <input
                type="text"
                className="form-control"
                id="reset"
                name="reset"
                onChange={formik.handleChange}
                value={formik.values.reset}
              />

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
          {/* <div>
            <Form.Group className="mb-3">
              <Form.Label>
                <FormattedMessage id="Creation-Url" />
              </Form.Label>
              <input
                type="text"
                className="form-control"
                id="reset"
                name="reset"
                onChange={formik.handleChange}
                value={formik.values.reset}
              />

              {formik.touched.reset &&
                formik.errors.reset && (
                  <Form.Control.Feedback
                    type="invalid"
                    style={{ display: 'block' }}
                  >
                    {formik.errors.reset}
                  </Form.Control.Feedback>
                )}
            </Form.Group>
          </div> */}
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

export default FeatureForm
