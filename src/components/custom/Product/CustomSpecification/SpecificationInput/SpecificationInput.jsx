import React from 'react'
import { Form, OverlayTrigger, Tooltip } from '@themesberg/react-bootstrap'
import { BsFillQuestionCircleFill } from 'react-icons/bs'
import * as Yup from 'yup'
import { useFormik } from 'formik'

const SpecificationInput = ({
  specifications,
  specificationValues,
  handleSpecificationChange,
  specValidationErrors,
  intl,
}) => {
  const formik = useFormik({
    initialValues: {
      specifications: Array.isArray(specificationValues)
        ? specificationValues.map((value, id) => ({
            id: id,
            value: value || '',
          }))
        : [],
    },
    onSubmit: (values) => {},
  })

  const getInputComponent = (dataType) => {
    switch (dataType) {
      case 1:
        return (props) => (
          <input
            type="text"
            value={props.value}
            onChange={props.onChange}
            className={props.className}
          />
        )
      default:
        return (props) => (
          <input
            type="text"
            value={props.value}
            onChange={props.onChange}
            className={props.className}
          />
        )
    }
  }

  return (
    <Form>
      {specifications.map((specification) => {
        const {
          id,
          displayName,
          isRequired,
          regularExpression,
          validationFailureDescription,
          description,
          dataType,
        } = specification

        const InputComponent = getInputComponent(dataType)
        const fieldName = `specifications[${id}].value`
        const error = specValidationErrors[id]

        return (
          <Form.Group className="mb-3" key={id}>
            <Form.Label>
              {displayName[`${intl.locale}`] ||
                (intl.locale === 'ar' && displayName['en']) ||
                (intl.locale === 'en' && displayName['ar'])}
              {isRequired && <span style={{ color: 'red' }}>*</span>}
            </Form.Label>{' '}
            {description && (
              <span className="fw-normal">
                <OverlayTrigger
                  trigger={['hover', 'focus']}
                  overlay={
                    <Tooltip>
                      {description?.[intl.locale] ||
                        (intl.locale === 'ar' && description['en']) ||
                        (intl.locale === 'en' && description['ar'])}
                    </Tooltip>
                  }
                >
                  <span>
                    <BsFillQuestionCircleFill style={{ width: '12px' }} />
                  </span>
                </OverlayTrigger>
              </span>
            )}
            <div>
              <InputComponent
                value={specificationValues[id] || ''}
                className="form-control"
                onChange={(event) => {
                  handleSpecificationChange(id, event)
                  formik.handleChange(event)
                }}
              />
              {error && <div className="text-danger">{error}</div>}
            </div>
          </Form.Group>
        )
      })}
    </Form>
  )
}

export default SpecificationInput
