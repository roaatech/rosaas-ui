import React from 'react'
import { Form, OverlayTrigger, Tooltip } from '@themesberg/react-bootstrap'
import {
  BsFillQuestionCircleFill,
  BsExclamationTriangleFill,
} from 'react-icons/bs'
import * as Yup from 'yup'
import { useFormik } from 'formik'
import { useIntl } from 'react-intl'

const SpecificationInput = ({
  specifications,
  specificationValues,
  handleSpecificationChange,
  specValidationErrors,
}) => {
  const intl = useIntl()

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
  console.log({ specifications })

  return (
    <div>
      {specifications.map((specification) => {
        const {
          id,
          displayName,
          isRequired,
          regularExpression,
          validationFailureDescription,
          description,
          systemName,
          inlineDescription ,
          dataType,
        } = specification

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
            {description.en || description.ar ? (
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
            ) : (
              ''
            )}
            <div>
              { inlineDescription && 
              (inlineDescription.en || inlineDescription.ar )?(
                <div className="text-warning mt-0 d-flex align-items-center">
                  <BsExclamationTriangleFill
                    style={{ width: '14px', marginRight: '4px' }}
                  />
                  <span> 

                  {inlineDescription?.[intl.locale] ||
                        (intl.locale === 'ar' && inlineDescription['en']) ||
                        (intl.locale === 'en' && inlineDescription['ar'])}

                  </span>
                </div>
              ) : (
                ''
              )} 
              <input
                type="text"
                name={
                  displayName[`${intl.locale}`] ||
                  (intl.locale === 'ar' && displayName['en']) ||
                  (intl.locale === 'en' && displayName['ar'])
                }
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
    </div>
  )
}

export default SpecificationInput
