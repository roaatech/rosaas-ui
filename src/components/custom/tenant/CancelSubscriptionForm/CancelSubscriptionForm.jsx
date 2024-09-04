import React, { useEffect } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { Modal, Button } from '@themesberg/react-bootstrap'
import { Form } from '@themesberg/react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { FormattedMessage } from 'react-intl'
import { Wrapper } from './CancelSubscriptionForm.style.jsx'
import { useNavigate, useParams } from 'react-router-dom'
import useRequest from '../../../../axios/apis/useRequest.js'
import { MdDangerous, MdError } from 'react-icons/md'
import { Routes } from '../../../../routes.js'
import TextareaAndCounter from '../../Shared/TextareaAndCounter/TextareaAndCounter.jsx'

const CancelSubscriptionForm = ({
  setVisible,
  popupLabel,
  updateTenant,
  subscriptionId,
  systemName,
  type,
}) => {
  const { cancelSubscriptionRequest, suspendSubscriptionRequest } = useRequest()
  const dispatch = useDispatch()
  const routeParams = useParams()
  const navigate = useNavigate()
  const params = useParams()
  const currentTenantId = params.id
  const currentTenantsData = useSelector(
    (state) => state.tenants.tenants?.[currentTenantId]
  )
  console.log({
    subscriptionId:
      currentTenantsData?.subscriptions?.[0]?.subscriptionId || subscriptionId,
    systemName,
  })

  const initialValues = {
    systemName: '',
    reason: '',
    comment: '',
  }
  let userInfo = useSelector((state) => state.auth.userInfo)

  let userRole = userInfo.userType

  // Custom validation schema
  const validationSchema = Yup.object().shape({
    systemName:
      type === 'cancel'
        ? Yup.string()
            .required(<FormattedMessage id="System-Name-is-required" />)
            .matches(
              /^[a-zA-Z0-9_-]+$/,
              <FormattedMessage id="Only-English-Characters,-Numbers,-and-Underscores-are-accepted." />
            )
            .test(
              'is-correct-system-name',
              <FormattedMessage id="System-Name-does-not-match" />,
              (value) =>
                value === currentTenantsData?.systemName || value === systemName // Custom validation logic
            )
        : Yup.string(),
    reason: Yup.number().required(<FormattedMessage id="Reason-is-required" />),
    comment:
      type === 'cancel'
        ? Yup.string()
            .max(500, <FormattedMessage id="Must-be-maximum-500-digits" />)
            .required(
              <FormattedMessage id="Comment-is-required-for-cancellation" />
            )
        : Yup.string().max(
            500,
            <FormattedMessage id="Must-be-maximum-500-digits" />
          ),
  })

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        if (type === 'cancel') {
          await cancelSubscriptionRequest({
            reason: parseInt(values.reason),
            comment: values.comment,
            subscriptionId:
              currentTenantsData?.subscriptions?.[0]?.subscriptionId ||
              subscriptionId,
          })
        } else if (type === 'suspend') {
          await suspendSubscriptionRequest({
            reason: parseInt(values.reason),
            comment: values.comment,
            subscriptionId:
              currentTenantsData?.subscriptions?.[0]?.subscriptionId ||
              subscriptionId,
          })
        }

        setVisible && setVisible(false)
        updateTenant && updateTenant()
      } catch (error) {
        console.error(`Error ${type}ing subscription:`, error)
      } finally {
        setSubmitting(false)
      }
    },
  })

  const reasonsOptions =
    userRole == 'clientAdmin'
      ? [
          { value: 1, label: 'Unpaid' },
          { value: 4, label: 'Product-Owner-Request' },
          { value: 5, label: 'Subscriber-Request' },
        ]
      : [
          { value: 1, label: 'Unpaid' },
          { value: 2, label: 'Super-Admin-Request' },
          { value: 3, label: 'External-System-Request' },
          { value: 4, label: 'Product-Owner-Request' },
          { value: 5, label: 'Subscriber-Request' },
          { value: 10, label: 'Other' },
        ]

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
            <div
              className={`alert alert-${
                type === 'cancel' ? 'danger' : 'warning'
              }`}
              role="alert"
            >
              <MdError className="mx-2" />
              <FormattedMessage
                id={
                  type === 'cancel'
                    ? 'Are-you-sure-you-want-to-cancel-this-subscription?'
                    : 'Are-you-sure-you-want-to-suspend-this-subscription?'
                }
              />
            </div>

            {type === 'cancel' && (
              <>
                <Form.Group className="mb-3">
                  <Form.Label>
                    <FormattedMessage id="System-Name" />{' '}
                    <span style={{ color: 'red' }}>*</span>
                  </Form.Label>
                  <div
                    className="text-warning"
                    // style={{ color: 'var(--second-color)' }}
                  >
                    <FormattedMessage id="Enter-the-system-name-of-the-subscription-to-cancel-it." />
                  </div>
                  <input
                    className="form-control"
                    type="text"
                    id="systemName"
                    name="systemName"
                    onChange={formik.handleChange}
                    value={formik.values.systemName}
                  />
                  {formik.touched.systemName && formik.errors.systemName && (
                    <Form.Control.Feedback
                      type="invalid"
                      style={{ display: 'block' }}
                    >
                      {formik.errors.systemName}
                    </Form.Control.Feedback>
                  )}
                </Form.Group>
              </>
            )}
          </div>
          <div>
            <Form.Group className="mb-3">
              <Form.Label>
                <FormattedMessage id="Reason" />{' '}
                <span style={{ color: 'red' }}>*</span>
              </Form.Label>
              <select
                className="form-control"
                name="reason"
                id="reason"
                value={formik.values.reason}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              >
                <option value="">
                  <FormattedMessage id="Select-Option" />
                </option>
                {reasonsOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {<FormattedMessage id={option.label} />}
                  </option>
                ))}
              </select>
              {formik.touched.reason && formik.errors.reason && (
                <Form.Control.Feedback
                  type="invalid"
                  style={{ display: 'block' }}
                >
                  {formik.errors.reason}
                </Form.Control.Feedback>
              )}
            </Form.Group>
          </div>
          <div>
            <Form.Group className="mb-3">
              <Form.Label>
                <FormattedMessage id="Comment" />
                {'  '}
                {type === 'cancel' && <span style={{ color: 'red' }}>*</span>}
              </Form.Label>

              <TextareaAndCounter
                className="form-control"
                id="comment"
                name="comment"
                onChange={formik.handleChange}
                showCharCount={true}
                addTextarea={formik.setFieldValue}
                inputValue={formik.values.comment}
                maxLength={250}
              />
              {formik.touched.comment && formik.errors.comment && (
                <Form.Control.Feedback
                  type="invalid"
                  style={{ display: 'block' }}
                >
                  {formik.errors.comment}
                </Form.Control.Feedback>
              )}
            </Form.Group>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant={type === 'cancel' ? 'danger' : 'warning'}
            type="submit"
          >
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

export default CancelSubscriptionForm
