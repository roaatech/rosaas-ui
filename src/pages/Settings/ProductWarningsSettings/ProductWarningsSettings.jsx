import React, { useState } from 'react'
import moment from 'moment-timezone'
import Datetime from 'react-datetime'
import { AiFillSave, AiFillEdit } from 'react-icons/ai'

import {
  Col,
  Row,
  Card,
  Form,
  OverlayTrigger,
  Tooltip,
} from '@themesberg/react-bootstrap'
import { Wrapper } from './ProductWarningsSettings.styled'
import BreadcrumbComponent from '../../../components/custom/Shared/Breadcrumb/Breadcrumb'
import {
  BsGearFill,
  BsFillBackspaceFill,
  BsFillQuestionCircleFill,
} from 'react-icons/bs'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { useEffect } from 'react'
import useRequest from '../../../axios/apis/useRequest'
import UpperContent from '../../../components/custom/Shared/UpperContent/UpperContent'
import { FormattedMessage } from 'react-intl'
import DynamicButtons from '../../../components/custom/Shared/DynamicButtons/DynamicButtons'
import { WarningType } from '../../../const/WarningsSettings'
import ProductWarnings from '../../../components/custom/Product/ProductWarnings/ProductWarnings'
import { useDispatch } from 'react-redux'
import { removeProductWarningsStore } from '../../../store/slices/products/productsSlice'

const ProductWarningsSettings = () => {
  const [edit, setEdit] = useState(false)
  const [oldData, setOldData] = useState({})
  const { getProductWarningsSettings, putProductWarningsSettings } =
    useRequest()
  const [merged, setMerged] = useState()
  useEffect(() => {
    ;(async () => {
      const warnings = await getProductWarningsSettings()
      const warningsData = Object.keys(warnings.data.data).map((fieldName) => {
        const entry = warnings.data.data[fieldName]

        return {
          [`${fieldName}_messageAr`]: entry?.message.ar || '',
          [`${fieldName}_messageEn`]: entry?.message.en || '',
          [`${fieldName}_typeSelect`]: entry?.type || '',
        }
      })
      const mergedData = warningsData.reduce((acc, curr) => {
        Object.keys(curr).forEach((key) => {
          acc[key] = curr[key]
        })
        return acc
      }, {})
      setMerged(mergedData)
      setOldData(warnings.data.data)
      formik.setValues(mergedData)
    })()
  }, [])

  const cancel = () => {
    setEdit(false)
    formik.setValues(merged)
  }
  const dispatch = useDispatch()
  const initialValues = {}
  const generateValidationSchema = (data) => {
    if (!data || typeof data !== 'object') {
      throw new Error('Invalid data object')
    }
    const validationSchema = {}

    Object.keys(data).forEach((key) => {
      const fieldName = key.includes('_messageEn') ? key : undefined
      const fieldArabicName = key.includes('_messageAr') ? key : undefined
      const fieldType = key.includes('_typeSelect') ? key : undefined

      if (fieldName) {
        validationSchema[fieldName] = Yup.string().required(
          'The field is required'
        )
      }

      if (fieldArabicName) {
        validationSchema[fieldArabicName] = Yup.string().required(
          'The field is required'
        )
      }

      if (fieldType) {
        validationSchema[fieldType] = Yup.number().required(
          'The field is required'
        )
      }
    })

    return Yup.object().shape(validationSchema)
  }

  const validationSchema = merged && generateValidationSchema(merged)

  const formik = useFormik({
    initialValues,
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      putProductWarningsSettings(convertToFirstFormat(values))
      const originalFormatData = convertToFirstFormat(values)
      setOldData(originalFormatData)
      dispatch(removeProductWarningsStore())
      setEdit(false)
    },
  })

  const convertToFirstFormat = (data) => {
    const result = {}

    for (const key in data) {
      const fieldName = key.replace(/_(messageEn|messageAr|typeSelect)$/, '')
      const property = key.split('_')[1]

      if (!result[fieldName]) {
        result[fieldName] = {
          message: {},
          type: 0,
        }
      }

      if (property === 'typeSelect') {
        result[fieldName].type = parseInt(data[key], 10)
      } else if (property === 'messageAr' || property === 'messageEn') {
        result[fieldName].message[
          property.replace('message', '').toLowerCase()
        ] = data[key]
      }
    }

    return result
  }

  return (
    <>
      <BreadcrumbComponent
        breadcrumbInfo={'ProductWarningsSettings'}
        icon={BsGearFill}
      />
      <Wrapper>
        <Form onSubmit={formik.handleSubmit}>
          <UpperContent>
            <h4 className="m-0">
              <FormattedMessage id="Settings" />
            </h4>

            <DynamicButtons
              buttons={
                edit
                  ? [
                      {
                        order: 1,
                        type: 'action',
                        label: 'Save-All',
                        func: formik.handleSubmit,
                        variant: 'secondary',
                        icon: <AiFillSave />,
                      },
                      {
                        order: 1,
                        type: 'action',
                        label: 'Cancel',
                        variant: 'primary',
                        func: () => {
                          cancel(true)
                        },
                        icon: <BsFillBackspaceFill />,
                      },
                    ]
                  : [
                      {
                        order: 1,
                        type: 'action',
                        label: 'Edit',
                        variant: 'secondary',
                        func: () => {
                          setEdit(true)
                        },
                        icon: <AiFillEdit />,
                      },
                    ]
              }
            />
          </UpperContent>

          <Card className="m-3 mt-0">
            <Card.Body>
              <h5 className="mb-4">
                <FormattedMessage id="Product-Warnings-Settings" />
              </h5>

              <Row>
                {Object.keys(oldData).map((fieldName, index) => (
                  <Col key={fieldName} sm={6} className="mb-3">
                    <Form.Group>
                      <div className="border-top-1 border-light pt-2">
                        <Form.Label>
                          <FormattedMessage id={fieldName} />
                          <span style={{ color: 'red' }}>* </span>
                          <span className="fw-normal">
                            <OverlayTrigger
                              trigger={['hover', 'focus']}
                              overlay={
                                <Tooltip>
                                  <FormattedMessage id={`${fieldName}_desc`} />
                                </Tooltip>
                              }
                            >
                              <span>
                                <BsFillQuestionCircleFill />
                              </span>
                            </OverlayTrigger>
                          </span>
                        </Form.Label>
                      </div>
                      {/* <Card className="m-3 mt-0">
                        <Card.Body> */}
                      <div className="small p-2 ">
                        {' '}
                        <FormattedMessage id="Message-En" />
                      </div>
                      <input
                        className="form-control"
                        required
                        type="text"
                        id={`${fieldName}_messageEn`}
                        name={`${fieldName}_messageEn`}
                        onChange={formik.handleChange}
                        value={formik.values[`${fieldName}_messageEn`]}
                        disabled={!edit}
                      />
                      {formik.touched[`${fieldName}_messageEn`] &&
                        formik.errors[`${fieldName}_messageEn`] && (
                          <Form.Control.Feedback
                            type="invalid"
                            style={{ display: 'block' }}
                          >
                            {formik.errors[`${fieldName}_messageEn`]}
                          </Form.Control.Feedback>
                        )}
                      <div className="small p-2">
                        <FormattedMessage id="Message-Ar" />
                      </div>
                      <input
                        className="form-control"
                        required
                        type="text"
                        id={`${fieldName}_messageAr`}
                        name={`${fieldName}_messageAr`}
                        onChange={formik.handleChange}
                        value={formik.values[`${fieldName}_messageAr`]}
                        disabled={!edit}
                      />{' '}
                      {formik.touched[`${fieldName}_messageAr`] &&
                        formik.errors[`${fieldName}_messageAr`] && (
                          <Form.Control.Feedback
                            type="invalid"
                            style={{ display: 'block' }}
                          >
                            {formik.errors[`${fieldName}_messageAr`]}
                          </Form.Control.Feedback>
                        )}
                      <div className="small p-2">
                        {' '}
                        <FormattedMessage id="Type" />
                      </div>
                      <select
                        className="form-select "
                        required
                        id={`${fieldName}_typeSelect`}
                        name={`${fieldName}_typeSelect`}
                        onChange={formik.handleChange}
                        value={formik.values[`${fieldName}_typeSelect`]}
                        disabled={!edit}
                      >
                        <option value="">
                          <FormattedMessage id="Select-Option" />
                        </option>
                        {Object.entries(WarningType).map(([value, label]) => (
                          <option key={value} value={value}>
                            {label}
                          </option>
                        ))}
                      </select>
                      {formik.touched[`${fieldName}_typeSelect`] &&
                        formik.errors[`${fieldName}_typeSelect`] && (
                          <Form.Control.Feedback
                            type="invalid"
                            style={{ display: 'block' }}
                          >
                            {formik.errors[`${fieldName}_typeSelect`]}
                          </Form.Control.Feedback>
                        )}
                      {/* </Card.Body>
                      </Card> */}
                    </Form.Group>
                  </Col>
                ))}
              </Row>
            </Card.Body>
          </Card>
        </Form>
      </Wrapper>
    </>
  )
}

export default ProductWarningsSettings
