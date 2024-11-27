import React, { useState, useEffect } from 'react'
import {
  Form,
  Button,
  Card,
  Row,
  Col,
  InputGroup,
  OverlayTrigger,
  Tooltip,
} from '@themesberg/react-bootstrap'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { FormattedMessage } from 'react-intl'
import { AiFillSave, AiFillEdit } from 'react-icons/ai'
import {
  BsGearFill,
  BsFillBackspaceFill,
  BsFillQuestionCircleFill,
} from 'react-icons/bs'
import { Wrapper } from './ExchangeRateProvidersSettings.styled'
import useRequest from '../../../axios/apis/useRequest'
import BreadcrumbComponent from '../../../components/custom/Shared/Breadcrumb/Breadcrumb'
import UpperContent from '../../../components/custom/Shared/UpperContent/UpperContent'
import DynamicButtons from '../../../components/custom/Shared/DynamicButtons/DynamicButtons'
import SafeFormatMessage from '../../../components/custom/Shared/SafeFormatMessage/SafeFormatMessage'

const ExchangeRateProvidersSettings = () => {
  const [edit, setEdit] = useState(false)
  const [providers, setProviders] = useState([])
  const [selectedProvider, setSelectedProvider] = useState('')
  const [accessibility, setAccessibility] = useState(false)
  const { getProviders, putProvidersSettings } = useRequest()

  useEffect(() => {
    ;(async () => {
      const response = await getProviders()
      setProviders(response.data.providers)
      // Set initial values here if needed
    })()
  }, [])

  const initialValues = {
    provider: '',
    accessibility: false,
  }

  const validationSchema = Yup.object().shape({
    provider: Yup.string().required('The field is required!'),
    accessibility: Yup.boolean(),
  })

  const formik = useFormik({
    initialValues,
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      await putProvidersSettings(values)
      setEdit(false)
    },
  })

  const cancel = () => {
    setEdit(false)
    formik.resetForm()
  }

  return (
    <>
      <BreadcrumbComponent
        breadcrumbInfo={'ExchangeRateProvidersSettings'}
        icon={BsGearFill}
      />
      <Wrapper>
        <Form onSubmit={formik.handleSubmit}>
          <UpperContent>
            <h4 className="m-0">
              <SafeFormatMessage id="Settings" />
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
                        func: cancel,
                        icon: <BsFillBackspaceFill />,
                      },
                    ]
                  : [
                      {
                        order: 1,
                        type: 'action',
                        label: 'Edit',
                        variant: 'secondary',
                        func: () => setEdit(true),
                        icon: <AiFillEdit />,
                      },
                    ]
              }
            />
          </UpperContent>

          <Card className="m-3 mt-0">
            <Card.Body>
              <h5 className="mb-4">
                <SafeFormatMessage id="ExchangeRateProviders-Settings" />
              </h5>
              <Row>
                <Col sm={12} className="mb-3">
                  <Form.Group id="provider">
                    <Form.Label>
                      <SafeFormatMessage id="Provider" />
                      <span style={{ color: 'red' }}>* </span>
                      <span className="fw-normal">
                        <OverlayTrigger
                          trigger={['hover', 'focus']}
                          overlay={
                            <Tooltip>
                              <SafeFormatMessage id="Provider-desc" />
                            </Tooltip>
                          }
                        >
                          <span>
                            <BsFillQuestionCircleFill />
                          </span>
                        </OverlayTrigger>
                      </span>
                    </Form.Label>
                    <Form.Control
                      as="select"
                      id="provider"
                      name="provider"
                      onChange={formik.handleChange}
                      value={formik.values.provider}
                      disabled={!edit}
                      isInvalid={!!formik.errors.provider}
                    >
                      <option value="">Select a provider</option>
                      {providers.map((provider) => (
                        <option key={provider.id} value={provider.id}>
                          {provider.name}
                        </option>
                      ))}
                    </Form.Control>
                    {formik.errors.provider && formik.touched.provider && (
                      <Form.Control.Feedback
                        type="invalid"
                        style={{ display: 'block' }}
                      >
                        {formik.errors.provider}
                      </Form.Control.Feedback>
                    )}
                  </Form.Group>
                </Col>
                <Col sm={12} className="mb-3">
                  <Form.Group id="accessibility">
                    <Form.Check
                      type="checkbox"
                      id="accessibility"
                      name="accessibility"
                      label={
                        <SafeFormatMessage id="System-Rate-Access-Control" />
                      }
                      onChange={formik.handleChange}
                      checked={formik.values.accessibility}
                      disabled={!edit}
                    />
                  </Form.Group>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Form>
      </Wrapper>
    </>
  )
}

export default ExchangeRateProvidersSettings
