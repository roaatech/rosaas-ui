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
import { cancellationOrSuspensionReasons } from '../../../../const/subscriptionConsts.js'

const CancelSubscriptionForm = ({
  setVisible,
  popupLabel,
  updateTenant,
  subscriptionId,
  systemName,
  type,
  productId,
}) => {
  const {
    cancelSubscriptionRequest,
    suspendSubscriptionRequest,
    activateSubscriptionRequest,
  } = useRequest()

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
    reason:
      type === 'activate'
        ? Yup.number()
        : Yup.number().required(<SafeFormatMessage id="Reason-is-required" />),
    comment: ['cancel', 'activate'].includes(type)
      ? Yup.string()
          .max(500, <SafeFormatMessage id="Must-be-maximum-500-digits" />)
          .required(
            <SafeFormatMessage id={`Comment-is-required-for-${type}`} />
          )
      : Yup.string().max(
          500,
          <SafeFormatMessage id="Must-be-maximum-500-digits" />
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
        } else if (type === 'activate') {
          await activateSubscriptionRequest({
            comment: values.comment,
            subscriptionId:
              currentTenantsData?.subscriptions?.[0]?.subscriptionId ||
              subscriptionId,
          })
        }

        if (subscriptionId && productId) {
          dispatch(
            changeSubscriptionAttr({
              productId: productId,
              subscriptionId: subscriptionId,
              attr: 'subscriptionStatus',
              value: type === 'cancel' ? 3 : type === 'suspend' ? 2 : 1,
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
    userRole === 'clientAdmin' && type !== 'activate'
      ? [1, 4, 5].map((key) => ({
          value: key,
          label: cancellationOrSuspensionReasons[key].displayName, // or reasons[key].value if you need JSX
        }))
      : Object.entries(cancellationOrSuspensionReasons).map(
          ([key, reason]) => ({
            value: parseInt(key),
            label: reason.displayName, // or reason.value if you need JSX
          })
        )

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
                type === 'cancel'
                  ? 'danger'
                  : type === 'activate'
                  ? 'success'
                  : 'warning'
              }`}
              role="alert"
            >
              <MdError className="mx-2" />
              <SafeFormatMessage
                id={
                  type === 'cancel'
                    ? 'Are-you-sure-you-want-to-cancel-this-subscription?'
                    : type === 'suspend'
                    ? 'Are-you-sure-you-want-to-suspend-this-subscription?'
                    : 'Are-you-sure-you-want-to-activate-this-subscription?'
                }
              />
            </div>

            {type === 'cancel' && (
              <Form.Group className="mb-3">
                <Form.Label>
                  <SafeFormatMessage id="System-Name" />{' '}
                  <span style={{ color: 'red' }}>*</span>
                </Form.Label>
                <div className="text-warning">
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
            )}

            {type !== 'activate' && (
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
                      {option.label}
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
            )}
            <Form.Group className="mb-3">
              <Form.Label>
                <SafeFormatMessage id="Comment" />
                {['cancel', 'activate'].includes(type) && (
                  <span style={{ color: 'red' }}>*</span>
                )}
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
            variant={
              type === 'cancel'
                ? 'danger'
                : type === 'activate'
                ? 'success'
                : 'warning'
            }
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
