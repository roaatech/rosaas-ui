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
import { Wrapper } from './SubscriptionsSettings.styled'
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

const SubscriptionsSettings = () => {
  const [edit, setEdit] = useState(false)
  const [oldData, setOldData] = useState({})
  const { getSubscriptionsSettings, putSubscriptionsSettings } = useRequest()

  useEffect(() => {
    ;(async () => {
      const subscriptions = await getSubscriptionsSettings()
      setOldData(subscriptions.data.data)
      formik.setValues(subscriptions.data.data)
    })()
  }, [])

  const cancel = () => {
    setEdit(false)
    formik.setValues(oldData)
  }

  const initialValues = {}
  const validationSchema = Yup.object().shape({
    subscriptionWorkerTimePeriod: Yup.number()
      .required('The feild is required!')
      .test(
        'Is positive?',
        'Add a valid number',
        (value) => value > 0 && value % 1 == 0
      ),
    allowedPeriodTimeBeforeDeactivatingSubscriptionforNonPayment: Yup.number()
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
      putSubscriptionsSettings(values)
      setOldData(values)
      setEdit(false)
    },
  })

  return (
    <>
      <BreadcrumbComponent
        breadcrumbInfo={'SubscriptionSettings'}
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
                <FormattedMessage id="Subscriptions-Settings" />
              </h5>
              <Row>
                <Col sm={6} className="mb-3">
                  <Form.Group id="addressNumber">
                    <Form.Label>
                      <FormattedMessage id="subscription-Worker-Time-Period" />
                      <span style={{ color: 'red' }}>* </span>
                      <span className="fw-normal">
                        <OverlayTrigger
                          trigger={['hover', 'focus']}
                          overlay={
                            <Tooltip>
                              <FormattedMessage id="subscription-Worker-Time-Period-desc" />
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
                      id="subscriptionWorkerTimePeriod"
                      name="subscriptionWorkerTimePeriod"
                      onChange={formik.handleChange}
                      value={formik.values.subscriptionWorkerTimePeriod}
                      disabled={!edit}
                    />
                    {formik.touched.subscriptionWorkerTimePeriod &&
                      formik.errors.subscriptionWorkerTimePeriod && (
                        <Form.Control.Feedback
                          type="invalid"
                          style={{ display: 'block' }}
                        >
                          {formik.errors.subscriptionWorkerTimePeriod}
                        </Form.Control.Feedback>
                      )}
                  </Form.Group>
                </Col>
                <Col sm={6} className="mb-3">
                  <Form.Group id="addressNumber">
                    <Form.Label>
                      <FormattedMessage id="Grace-Period" />
                      <span style={{ color: 'red' }}>* </span>
                      <span className="fw-normal">
                        <OverlayTrigger
                          trigger={['hover', 'focus']}
                          overlay={
                            <Tooltip>
                              <FormattedMessage id="Grace-Period-desc" />
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
                      id="allowedPeriodTimeBeforeDeactivatingSubscriptionforNonPayment"
                      name="allowedPeriodTimeBeforeDeactivatingSubscriptionforNonPayment"
                      onChange={formik.handleChange}
                      value={
                        formik.values
                          .allowedPeriodTimeBeforeDeactivatingSubscriptionforNonPayment
                      }
                      disabled={!edit}
                    />
                    {formik.touched
                      .allowedPeriodTimeBeforeDeactivatingSubscriptionforNonPayment &&
                      formik.errors
                        .allowedPeriodTimeBeforeDeactivatingSubscriptionforNonPayment && (
                        <Form.Control.Feedback
                          type="invalid"
                          style={{ display: 'block' }}
                        >
                          {
                            formik.errors
                              .allowedPeriodTimeBeforeDeactivatingSubscriptionforNonPayment
                          }
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

export default SubscriptionsSettings
