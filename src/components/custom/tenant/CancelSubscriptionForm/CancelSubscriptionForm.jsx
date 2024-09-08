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
import { changeSubscriptionAttr } from '../../../../store/slices/products/productsSlice.js'
import SafeFormatMessage from '../../Shared/SafeFormatMessage/SafeFormatMessage.jsx'

const CancelSubscriptionForm = ({
  setVisible,
  popupLabel,
  updateTenant,
  subscriptionId,
  systemName,
  type,
  productId,
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
            .required(<SafeFormatMessage id="System-Name-is-required" />)
            .matches(
              /^[a-zA-Z0-9_-]+$/,
              <SafeFormatMessage id="Only-English-Characters,-Numbers,-and-Underscores-are-accepted." />
            )
            .test(
              'is-correct-system-name',
              <SafeFormatMessage id="System-Name-does-not-match" />,
              (value) =>
                value === currentTenantsData?.systemName || value === systemName // Custom validation logic
            )
        : Yup.string(),
    reason: Yup.number().required(
      <SafeFormatMessage id="Reason-is-required" />
    ),
    comment:
      type === 'cancel'
        ? Yup.string()
            .max(500, <SafeFormatMessage id="Must-be-maximum-500-digits" />)
            .required(
              <SafeFormatMessage id="Comment-is-required-for-cancellation" />
            )
        : Yup.string().max(
            500,
            <SafeFormatMessage id="Must-be-maximum-500-digits" />
          ),
  })
  const listProduct = useSelector((state) => state.products.products)

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

        if (subscriptionId && productId) {
          console.log('888888888888888')

          dispatch(
            changeSubscriptionAttr({
              productId: productId,
              subscriptionId: subscriptionId,
              attr: 'subscriptionStatus',
              value: type === 'cancel' ? 3 : 2,
            })
          )
          setVisible && setVisible(false)
        } else {
          updateTenant && updateTenant()
          setVisible && setVisible(false)
        }
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
              <SafeFormatMessage
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
                    <SafeFormatMessage id="System-Name" />{' '}
                    <span style={{ color: 'red' }}>*</span>
                  </Form.Label>
                  <div
                    className="text-warning"
                    // style={{ color: 'var(--second-color)' }}
                  >
                    <SafeFormatMessage id="Enter-the-system-name-of-the-subscription-to-cancel-it." />
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
                <SafeFormatMessage id="Reason" />{' '}
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
                  <SafeFormatMessage id="Select-Option" />
                </option>
                {reasonsOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {<SafeFormatMessage id={option.label} />}
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
                <SafeFormatMessage id="Comment" />
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
            <SafeFormatMessage id="Submit" />
          </Button>
          <Button
            variant="link"
            className="text-gray"
            onClick={() => setVisible(false)}
          >
            <SafeFormatMessage id="Close" />
          </Button>
        </Modal.Footer>
      </Form>
    </Wrapper>
  )
}

export default CancelSubscriptionForm
