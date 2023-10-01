import React, { useState } from 'react'
import moment from 'moment-timezone'
import Datetime from 'react-datetime'
import { AiFillSave, AiFillEdit } from 'react-icons/ai'

import {
  Col,
  Row,
  Card,
  Form,
  Button,
  InputGroup,
  OverlayTrigger,
  Tooltip,
} from '@themesberg/react-bootstrap'
import { Wrapper } from './Settings.styled'
import BreadcrumbComponent from '../../components/custom/Shared/Breadcrumb/Breadcrumb'
import {
  BsGearFill,
  BsFillBackspaceFill,
  BsFillQuestionCircleFill,
} from 'react-icons/bs'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { useEffect } from 'react'
import useRequest from '../../axios/apis/useRequest'
import UpperContent from '../../components/custom/Shared/UpperContent/UpperContent'
import { FormattedMessage } from 'react-intl'
import DynamicButtons from '../../components/custom/Shared/DynamicButtons/DynamicButtons'

const Settings = () => {
  const [edit, setEdit] = useState(false)
  const [oldData, setOldData] = useState({})
  const { getHeathCheckSettings, putHeathCheckSettings } = useRequest()

  useEffect(() => {
    ;(async () => {
      const heathCheck = await getHeathCheckSettings()
      setOldData(heathCheck.data.data)
      formik.setValues(heathCheck.data.data)
    })()
  }, [])

  const cancel = () => {
    setEdit(false)
    formik.setValues(oldData)
  }

  const initialValues = {}
  const validationSchema = Yup.object().shape({
    availableCheckTimePeriod: Yup.number()
      .required('The feild is required!')
      .test(
        'Is positive?',
        'Add a valid number',
        (value) => value > 0 && value % 1 == 0
      ),
    unavailableCheckTimePeriod: Yup.number()
      .required('The feild is required!')
      .test(
        'Is positive?',
        'Add a valid number',
        (value) => value > 0 && value % 1 == 0
      ),
    inaccessibleCheckTimePeriod: Yup.number()
      .required('The feild is required!')
      .test(
        'Is positive?',
        'Add a valid number',
        (value) => value > 0 && value % 1 == 0
      ),
    timesNumberBeforeInformExternalSys: Yup.number()
      .required('The feild is required!')
      .test(
        'Is positive?',
        'Add a valid number',
        (value) => value > 0 && value % 1 == 0
      ),
  })
  const formik = useFormik({
    initialValues,
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      putHeathCheckSettings(values)
      setOldData(values)
      setEdit(false)
    },
  })

  const handleSubmit = () => {
    // Manually trigger the form submission
    formik.handleSubmit()
  }
  return (
    <>
      <BreadcrumbComponent breadcrumbInfo={'HealthCheck'} icon={BsGearFill} />
      <Wrapper>
        <Form onSubmit={formik.handleSubmit}>
          <UpperContent>
            <h4 className="m-0">
              <FormattedMessage id="Settings" />
            </h4>
            {/* <div>
              <Button
                className={edit ? 'd-none' : ''}
                variant="primary"
                type="button"
                onClick={() => {
                  setEdit(true)
                }}
              >
                <AiFillEdit /> <FormattedMessage id="Edit" />
              </Button>

              <span className={!edit ? 'd-none' : ''}>
                <Button
                  variant="primary"
                  type="button"
                  onClick={formik.handleSubmit}
                >
                  <AiFillSave /> <FormattedMessage id="Save-All" />
                </Button>
                <Button type="button" className="ml-2 cancel" onClick={cancel}>
                  <BsFillBackspaceFill /> <FormattedMessage id="Cancel" />
                </Button>
              </span>
            </div> */}

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
                <FormattedMessage id="Health-Check-Settings" />
              </h5>
              <Row>
                <Col sm={6} className="mb-3">
                  <Form.Group id="addressNumber">
                    <Form.Label>
                      <FormattedMessage id="Available-Check-Period-minutes" />
                      <span style={{ color: 'red' }}>* </span>
                      <span className="fw-normal">
                        <OverlayTrigger
                          trigger={['hover', 'focus']}
                          overlay={
                            <Tooltip>
                              <FormattedMessage id="Available-Check-Period-description" />
                            </Tooltip>
                          }
                        >
                          <span>
                            <BsFillQuestionCircleFill />
                          </span>
                        </OverlayTrigger>
                      </span>
                    </Form.Label>
                    <input
                      className="form-control"
                      required
                      type="number"
                      id="availableCheckTimePeriod"
                      name="availableCheckTimePeriod"
                      onChange={formik.handleChange}
                      value={formik.values.availableCheckTimePeriod}
                      disabled={!edit}
                    />
                    {formik.touched.availableCheckTimePeriod &&
                      formik.errors.availableCheckTimePeriod && (
                        <Form.Control.Feedback
                          type="invalid"
                          style={{ display: 'block' }}
                        >
                          {formik.errors.availableCheckTimePeriod}
                        </Form.Control.Feedback>
                      )}
                  </Form.Group>
                </Col>
                <Col sm={6} className="mb-3">
                  <Form.Group id="addressNumber">
                    <Form.Label>
                      <FormattedMessage id="Unavailable-Check-Period-minutes" />
                      <span style={{ color: 'red' }}>* </span>
                      <span className="fw-normal">
                        <OverlayTrigger
                          trigger={['hover', 'focus']}
                          overlay={
                            <Tooltip>
                              <FormattedMessage id="Unavailable-Check-Period-description" />
                            </Tooltip>
                          }
                        >
                          <span>
                            <BsFillQuestionCircleFill />
                          </span>
                        </OverlayTrigger>
                      </span>
                    </Form.Label>
                    <input
                      className="form-control"
                      required
                      type="number"
                      id="unavailableCheckTimePeriod"
                      name="unavailableCheckTimePeriod"
                      onChange={formik.handleChange}
                      value={formik.values.unavailableCheckTimePeriod}
                      disabled={!edit}
                    />
                    {formik.touched.unavailableCheckTimePeriod &&
                      formik.errors.unavailableCheckTimePeriod && (
                        <Form.Control.Feedback
                          type="invalid"
                          style={{ display: 'block' }}
                        >
                          {formik.errors.unavailableCheckTimePeriod}
                        </Form.Control.Feedback>
                      )}
                  </Form.Group>
                </Col>
                <Col sm={6} className="mb-3">
                  <Form.Group id="addressNumber">
                    <Form.Label>
                      <FormattedMessage id="Inaccessible-Check-Period-minutes" />
                      <span style={{ color: 'red' }}>* </span>
                      <span className="fw-normal">
                        <OverlayTrigger
                          trigger={['hover', 'focus']}
                          overlay={
                            <Tooltip>
                              <FormattedMessage id="Inaccessible-Check-Period-description" />
                            </Tooltip>
                          }
                        >
                          <span>
                            <BsFillQuestionCircleFill />
                          </span>
                        </OverlayTrigger>
                      </span>
                    </Form.Label>
                    <input
                      className="form-control"
                      required
                      type="number"
                      id="inaccessibleCheckTimePeriod"
                      name="inaccessibleCheckTimePeriod"
                      onChange={formik.handleChange}
                      value={formik.values.inaccessibleCheckTimePeriod}
                      disabled={!edit}
                    />
                    {formik.touched.inaccessibleCheckTimePeriod &&
                      formik.errors.inaccessibleCheckTimePeriod && (
                        <Form.Control.Feedback
                          type="invalid"
                          style={{ display: 'block' }}
                        >
                          {formik.errors.inaccessibleCheckTimePeriod}
                        </Form.Control.Feedback>
                      )}
                  </Form.Group>
                </Col>
                <Col sm={6} className="mb-3">
                  <Form.Group id="addressNumber">
                    <Form.Label>
                      <FormattedMessage id="Notification-Threshold-times" />
                      <span style={{ color: 'red' }}>* </span>
                      <span className="fw-normal">
                        <OverlayTrigger
                          trigger={['hover', 'focus']}
                          overlay={
                            <Tooltip>
                              <FormattedMessage id="Notification-Threshold-description" />
                            </Tooltip>
                          }
                        >
                          <span>
                            <BsFillQuestionCircleFill />
                          </span>
                        </OverlayTrigger>
                      </span>
                    </Form.Label>
                    <input
                      className="form-control"
                      required
                      type="number"
                      id="timesNumberBeforeInformExternalSys"
                      name="timesNumberBeforeInformExternalSys"
                      onChange={formik.handleChange}
                      value={formik.values.timesNumberBeforeInformExternalSys}
                      disabled={!edit}
                    />
                    {formik.touched.timesNumberBeforeInformExternalSys &&
                      formik.errors.timesNumberBeforeInformExternalSys && (
                        <Form.Control.Feedback
                          type="invalid"
                          style={{ display: 'block' }}
                        >
                          {formik.errors.timesNumberBeforeInformExternalSys}
                        </Form.Control.Feedback>
                      )}
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

export default Settings
