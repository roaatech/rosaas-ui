import React, { useState } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import useRequest from '../../../../axios/apis/useRequest.js'
import {
  Modal,
  Button,
  Form,
  Tooltip,
  OverlayTrigger,
  Row,
  Col,
  Card,
} from '@themesberg/react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { FormattedMessage, useIntl } from 'react-intl'
import { useParams } from 'react-router-dom'
import MultilingualInput from '../../Shared/MultilingualInput/MultilingualInput.jsx'
import { Wrapper } from './TemplateForm.styled.jsx'
import { productsChangeAttr } from '../../../../store/slices/products/productReducers.js'
import SafeFormatMessage from '../../Shared/SafeFormatMessage/SafeFormatMessage.jsx'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { AiFillCopy } from 'react-icons/ai'

const TemplateForm = ({
  type,
  productData,
  setVisible,
  popupLabel,
  setActiveIndex,
}) => {
  const { updateCompositeTemplateRequest } = useRequest()
  const dispatch = useDispatch()
  const routeParams = useParams()
  const productId = routeParams.id
  const allProducts = useSelector((state) => state.products.products)
  const ProductTrialType = allProducts[productId].trialType

  const [selectedLabel, setSelectedLabel] = useState('')

  // Dropdown options as an object
  const labelOptions = {
    ProductOwnerName: '##ProductOwnerName##',
    ProductName: '##ProductName##',
    PlanName: '##PlanName##',
    PlanCycle: '##PlanCycle##',
    ProductOwnerSystemName: '##ProductOwnerSystemName##',
    ProductSystemName: '##ProductSystemName##',
    PlanSystemName: '##PlanSystemName##',
  }

  const initialValues = {
    compositeNameTemplateEn:
      productData?.compositeNameTemplateLocalizations?.en || '',
    compositeNameTemplateAr:
      productData?.compositeNameTemplateLocalizations?.ar || '',
    compositeDescriptionTemplateEn:
      productData?.compositeDescriptionTemplateLocalization?.en,
    compositeDescriptionTemplateAr:
      productData?.compositeDescriptionTemplateLocalization?.ar,
  }

  const validationSchema = Yup.object().shape({
    // systemName: Yup.string()
    //   .max(100, <SafeFormatMessage id="Must-be-maximum-100-digits" />)
    //   .required(<SafeFormatMessage id="Unique-Name-is-required" />)
    //   .matches(
    //     /^[a-zA-Z0-9_-]+$/,
    //     <SafeFormatMessage id="English-Characters,-Numbers,-and-Underscores-are-only-accepted." />
    //   ),
    // compositeNameTemplateEn: Yup.string().test({
    //   name: 'compositeNameTemplateRequired',
    //   message: <SafeFormatMessage id="Display-Name-is-required" />,
    //   test: (value, context) => {
    //     const { parent } = context
    //     const compositeNameTemplateEn = parent.compositeNameTemplateEn
    //     const compositeNameTemplateAr = parent.compositeNameTemplateAr
    //     return !!compositeNameTemplateEn || !!compositeNameTemplateAr
    //   },
    // }),
    // compositeNameTemplateAr: Yup.string().test({
    //   name: 'compositeNameTemplateRequired',
    //   message: <SafeFormatMessage id="Display-Name-is-required" />,
    //   test: (value, context) => {
    //     const { parent } = context
    //     const compositeNameTemplateEn = parent.compositeNameTemplateEn
    //     const compositeNameTemplateAr = parent.compositeNameTemplateAr
    //     return !!compositeNameTemplateEn || !!compositeNameTemplateAr
    //   },
    // }),
    compositeDescriptionTemplateEn: Yup.string().max(
      250,
      <SafeFormatMessage id="Must-be-maximum-250-digits" />
    ),
    compositeDescriptionTemplateAr: Yup.string().max(
      250,
      <SafeFormatMessage id="Must-be-maximum-250-digits" />
    ),
  })

  const formik = useFormik({
    initialValues,
    validationSchema: validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      const dataToSubmit = {
        compositeNameTemplateLocalizations: {
          en: values.compositeNameTemplateEn,
          ar: values.compositeNameTemplateAr,
        },
        compositeDescriptionTemplateLocalization: {
          en: values.compositeDescriptionTemplateEn,
          ar: values.compositeDescriptionTemplateAr,
        },
      }

      const CompositeTemplateRequest = await updateCompositeTemplateRequest({
        ...dataToSubmit,
        id: productId,
      })

      dispatch(productsChangeAttr({ productId, attributes: dataToSubmit }))

      setVisible && setVisible(false)
      setSubmitting(false)
    },
  })

  const handleDragStart = (event, label) => {
    event.dataTransfer.setData('text/plain', label)
  }

  const handleDrop = (event) => {
    event.preventDefault()

    // Retrieve the label from the drag data
    const label = event.dataTransfer.getData('text/plain')

    if (label) {
      // Format the label with hashes
      const formattedLabel = `${label}`

      // Get the current input field ID and its current value
      const fieldId = event.target.id
      const currentValue = formik.values[fieldId]

      // Get the cursor position
      const inputField = document.getElementById(fieldId)
      const cursorPosition = inputField.selectionStart

      // Insert the formatted label at the cursor position
      const updatedValue =
        currentValue.slice(0, cursorPosition) +
        formattedLabel +
        currentValue.slice(cursorPosition)

      // Update the field value in Formik
      formik.setFieldValue(fieldId, updatedValue)
    }
  }

  const handleDragOver = (event) => {
    event.preventDefault()
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
          {/* Draggable Labels with Copy-to-Clipboard */}
          <Row className="d-flex align-items-center">
            <Col md={12}>
              <Card border="light" className="shadow-sm p-0 m-0">
                <Card.Body className="px-3 py-2 ">
                  <Row>
                    {Object.entries(labelOptions).map(([key, value]) => (
                      <Col md={4} key={key}>
                        <div
                          draggable
                          onDragStart={(event) => handleDragStart(event, value)}
                          className="form-control d-flex justify-content-between align-items-center my-2 mx-0"
                        >
                          <span style={{ marginRight: '5px' }}>{key}</span>

                          <OverlayTrigger
                            key={value}
                            style={{ minWidth: '150px' }}
                            trigger={['hover', 'focus']}
                            placement="top"
                            overlay={
                              <Tooltip>
                                <div style={{ minWidth: '100px' }}>
                                  {
                                    <SafeFormatMessage id="Click-to-copy-label" />
                                  }
                                </div>
                              </Tooltip>
                            }
                          >
                            <CopyToClipboard
                              text={`${labelOptions[key]}`}
                              onCopy={() =>
                                console.log(`Copied ${labelOptions[key]}`)
                              }
                            >
                              <span
                                className="copyItem"
                                style={{
                                  cursor: 'pointer',
                                }}
                              >
                                <AiFillCopy />
                              </span>
                            </CopyToClipboard>
                          </OverlayTrigger>
                        </div>
                      </Col>
                    ))}
                  </Row>
                </Card.Body>
              </Card>
            </Col>
            <Col md={12}>
              {/* MultilingualInput for Display Name */}
              <MultilingualInput
                inputLabel="composite-Name-Template"
                languages={[
                  { code: 'en', name: 'English' },
                  { code: 'ar', name: 'Arabic' },
                ]}
                inputIds={{
                  en: 'compositeNameTemplateEn',
                  ar: 'compositeNameTemplateAr',
                }}
                placeholder={{
                  en: 'English-Name',
                  ar: 'Arabic-Name',
                }}
                values={{
                  en: formik.values.compositeNameTemplateEn,
                  ar: formik.values.compositeNameTemplateAr,
                }}
                onChange={formik.handleChange}
                isRequired={true}
                inputType="input"
                errors={{
                  en: formik.errors.compositeNameTemplateEn,
                  ar: formik.errors.compositeNameTemplateAr,
                }}
                touched={{
                  en: formik.touched.compositeNameTemplateEn,
                  ar: formik.touched.compositeNameTemplateAr,
                }}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
              />

              {/* MultilingualInput for Description with Tooltip */}
              <MultilingualInput
                inputLabel="compositeDescriptionTemplateEn"
                languages={[
                  { code: 'en', name: 'English' },
                  { code: 'ar', name: 'Arabic' },
                ]}
                tooltipMessageId={
                  !formik.values.isAvailableForSelection &&
                  'The-word-enclosed-between-##-will-be-related-to-the-redirection-link.-for-example,-to-##Contact-Us##.'
                }
                inputIds={{
                  en: 'compositeDescriptionTemplateEn',
                  ar: 'compositeDescriptionTemplateAr',
                }}
                placeholder={{
                  en: 'English-Description',
                  ar: 'Arabic-Description',
                }}
                values={{
                  en: formik.values.compositeDescriptionTemplateEn,
                  ar: formik.values.compositeDescriptionTemplateAr,
                }}
                onChange={formik.handleChange}
                isRequired={false}
                inputType="textareaApperance"
                textareaApperance={true}
                errors={{
                  en: formik.errors.compositeDescriptionTemplateEn,
                  ar: formik.errors.compositeDescriptionTemplateAr,
                }}
                touched={{
                  en: formik.touched.compositeDescriptionTemplateEn,
                  ar: formik.touched.compositeDescriptionTemplateAr,
                }}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
              />
            </Col>
          </Row>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={() => setVisible(false)}>
            <FormattedMessage id="Close" />
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={formik.isSubmitting}
          >
            <FormattedMessage id="Save" />
          </Button>
        </Modal.Footer>
      </Form>
    </Wrapper>
  )
}

export default TemplateForm
