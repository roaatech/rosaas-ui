import React from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { Modal, Button, Form } from '@themesberg/react-bootstrap'
import { useDispatch } from 'react-redux'
import { FormattedMessage } from 'react-intl'
import { Wrapper } from './ProductOwnerForm.styled.jsx'
import useRequest from '../../../axios/apis/useRequest.js'
import TextareaAndCounter from '../Shared/TextareaAndCounter/TextareaAndCounter.jsx'
import AutoGenerateInput from '../Shared/AutoGenerateInput/AutoGenerateInput.jsx'

const ProductOwnerForm = ({
  type,
  poData,
  setVisible,
  popupLabel,
  update,
  setUpdate,
}) => {
  const { createPORequest, editPORequest } = useRequest()
  const dispatch = useDispatch()

  const initialValues = {
    systemName: poData ? poData.systemName : '',
    displayName: poData ? poData.displayName : '',
    description: poData ? poData.description : '',
  }

  const validationSchema = Yup.object().shape({
    systemName: Yup.string()
      .max(100, <FormattedMessage id="Must-be-maximum-100-digits" />)
      .required(<FormattedMessage id="System-Name-is-required" />)
      .matches(
        /^[a-zA-Z0-9_-]+$/,
        <FormattedMessage id="English-Characters,-Numbers,-and-Underscores-are-only-accepted." />
      ),
    displayName: Yup.string()
      .required(<FormattedMessage id="This-field-is-required" />)
      .max(100, <FormattedMessage id="Must-be-maximum-100-digits" />),
    description: Yup.string().max(250),
  })

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      setVisible(false)
      if (type === 'create') {
        const createPO = await createPORequest({
          systemName: values.systemName,
          displayName: values.displayName,
          description: values.description,
        })
        setUpdate(update + 1)
      } else {
        const editPO = await editPORequest({
          id: poData.id,
          systemName: values.systemName,
          displayName: values.displayName,
          description: values.description,
        })
        setUpdate(update + 1)

        // Dispatch any necessary actions after editing
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

          <div>
            <Form.Group className="mb-3">
              <Form.Label>
                <FormattedMessage id="Description" />
              </Form.Label>
              <TextareaAndCounter
                addTextarea={formik.setFieldValue}
                maxLength={250}
                showCharCount
                inputValue={formik.values.description}
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
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" type="submit">
            <FormattedMessage id="Submit" />
          </Button>
          <Button
            variant="link"
            className="text-gray"
            onClick={() => setVisible(false)}
          >
            <FormattedMessage id="Close" />
          </Button>
        </Modal.Footer>
      </Form>
    </Wrapper>
  )
}

export default ProductOwnerForm