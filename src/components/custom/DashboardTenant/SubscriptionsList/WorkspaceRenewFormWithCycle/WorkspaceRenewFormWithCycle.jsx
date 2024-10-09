// Import necessary dependencies and components
import React, { useEffect, useState } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { Form } from '@themesberg/react-bootstrap'
import { Modal, Button } from '@themesberg/react-bootstrap'
import { Wrapper } from './WorkspaceRenewFormWithCycle.styled.jsx'
import { FormattedMessage, useIntl } from 'react-intl'
import useRequest from '../../../../../axios/apis/useRequest.js'
import { ListBox } from 'primereact/listbox'
import { cardInfo } from '../../../../../const/cardPayment.js'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEllipsisH, faEllipsisV } from '@fortawesome/free-solid-svg-icons'
import { useDispatch, useSelector } from 'react-redux'
import {
  addAutoRenewal,
  addAutoRenewalIds,
  changeSubscriptionAttribute,
  setAllpaymentCards,
  setWorkspaceAllPlanPrices,
  updateAutoRenewal,
  wokspaceSetAllPlans,
  workspaceUpdateProduct,
} from '../../../../../store/slices/workSpace.js'
import { cycle } from '../../../../../const/product.js'
import SafeFormatMessage from '../../../Shared/SafeFormatMessage/SafeFormatMessage.jsx'

// WorkspaceRenewFormWithCycle component
const WorkspaceRenewFormWithCycle = ({
  setVisible,
  popupLabel,
  currentRenewal,
  referenceId,

  // cards,
  setCards,
  setShowAddCardForm,
  setEnabledCardId,
  setUpdate,
  update,
}) => {
  // State variables
  const cards = useSelector((state) => state.workspace.paymentCards)
  const autoRenewalData = useSelector(
    (state) => state.workspace.autoRenewalData
  )
  const [submitLoading, setSubmitLoading] = useState()
  const [priceList, setPriceList] = useState({})

  // Custom hook for handling API requests
  const {
    setAutoRenewal,
    getPaymentCardsList,
    getProductPlansPublic,
    getProductPlanPriceListPublic,
  } = useRequest()

  // Internationalization hook
  const intl = useIntl()

  // Form validation schema
  const validationSchema = Yup.object().shape({
    card: Yup.string().required(
      <SafeFormatMessage id="This-field-is-required" />
    ),
    price: Yup.string().required(
      <SafeFormatMessage id="This-field-is-required" />
    ),
    autoRenewal: Yup.boolean(),
  })

  // Initial form values
  const initialValues = {
    card: cards?.[referenceId] ? referenceId : '',
    price: '',
    autoRenewal: true,
  }

  // Redux dispatch hook
  const dispatch = useDispatch()
  const data = useSelector((state) => state.workspace.subscriptionData)?.[
    currentRenewal
  ]

  // Select subscription data from Redux store based on current subscription ID
  const renewalData = autoRenewalData?.[currentRenewal] || data
  // Extract selected plan, product, and plan price IDs from subscription data
  const selectedPlan = renewalData?.plan?.id
  const selectedProduct = renewalData?.product?.id
  const selectedPrice = renewalData?.planPrice?.id

  // Formik form handling
  const formik = useFormik({
    initialValues,
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      // Set loading state
      setSubmitLoading(true)
      try {
        // Make API call to set auto renewal
        await setAutoRenewal({
          subscriptionId: currentRenewal,
          cardReferenceId: values.card,
          planPriceId: values.price,
          renewalsCount: values.cycleCount,
          isContinuousRenewal: values.autoRenewal,
          paymentPlatform: 2,
        })

        // Update subscription attribute in Redux store
        dispatch(
          changeSubscriptionAttribute({
            subscriptionId: currentRenewal,
            attributeName: 'autoRenewalIsEnabled',
            attributeValue: true,
          })
        )
        setUpdate(update + 1)
        // Dispatch auto renewal data
        if (Object.values(autoRenewalData).length > 1) {
          !autoRenewalData?.[currentRenewal]
            ? dispatch(
                addAutoRenewal({
                  id: currentRenewal,
                  ...{
                    plan: renewalData?.plan,
                    renewalPlanPriceId: values.price,
                    enabledDate: new Date().toISOString().slice(0, 19),
                    subscriptionRenewalDate: renewalData?.endDate,
                    subscription: {
                      id: renewalData?.id,
                      displayName: renewalData?.displayName,
                      systemName: renewalData?.systemName,
                    },
                    product: renewalData?.product,
                    paymentMethodCard: cards[values.card],
                    type: 3,
                    isContinuousRenewal: values.autoRenewal,
                    paymentPlatform: 2,
                    renewalsCount: values.cycleCount,
                  },
                })
              )
            : dispatch(
                updateAutoRenewal({
                  id: renewalData?.id,
                  isContinuousRenewal: values.autoRenewal,
                  renewalsCount: values.cycleCount,
                })
              )
          dispatch(addAutoRenewalIds([currentRenewal]))
        } else {
          dispatch(addAutoRenewalIds([currentRenewal]))
        }

        // Set enabled card ID
        setEnabledCardId(currentRenewal)
        setTimeout(() => {
          setEnabledCardId(null)
        }, 2000)

        // Close modal
        setVisible && setVisible(false)
      } catch (error) {
        console.error('Error submitting form:', error)
      } finally {
        // Reset loading state
        setSubmitLoading(false)
      }
    },
  })

  // Fetch payment cards on component mount
  useEffect(() => {
    if (Object.keys(cards).length > 0) {
      return
    }
    ;(async () => {
      const fetchedCardsData = await getPaymentCardsList()
      dispatch(setAllpaymentCards(fetchedCardsData.data.data))
    })()
  }, [])

  // Fetch product plans if not available in Redux store
  const products = useSelector((state) => state.workspace.products)

  useEffect(() => {
    ;(async () => {
      formik.setFieldValue('plan', '')
      if (products[selectedProduct]) {
        if (!products[selectedProduct].plans) {
          const planData = await getProductPlansPublic(
            renewalData.productOwner.systemName,
            renewalData.product.systemName
          )

          dispatch(
            wokspaceSetAllPlans({
              productId: selectedProduct,
              data: planData.data.data,
            })
          )
        }
      }
    })()
  }, [products[selectedProduct]])

  useEffect(() => {
    if (!renewalData) {
      return
    }
    if (Object.values(renewalData).length < 0) {
      return
    }
    if (products[renewalData?.product?.id]) {
      return
    } else {
      dispatch(workspaceUpdateProduct(renewalData?.product))
    }
  }, [
    renewalData && Object.values(renewalData).length < 0,
    products[renewalData?.product?.id],
  ])

  // Fetch product plan prices if not available in Redux store
  useEffect(() => {
    ;(async () => {
      if (
        products[selectedProduct] &&
        !products[selectedProduct]?.plansPrices
      ) {
        const planPriceDataRes = await getProductPlanPriceListPublic(
          renewalData.productOwner.systemName,
          renewalData.product.systemName
        )
        dispatch(
          setWorkspaceAllPlanPrices({
            productId: selectedProduct,
            data: planPriceDataRes.data.data,
          })
        )
      }
    })()
  }, [products[selectedProduct]])

  // Set price list based on selected product and plan
  useEffect(() => {
    const planData = products?.[selectedProduct]?.plansPrices
    if (planData) {
      const planDataArray = Object.values(planData)
        .filter(
          (item) => item.plan.id === selectedPlan && item.isPublished === true
        )
        .map((item) => ({
          value: item.id,
          cycle: cycle[item.cycle],
          price: item.price,
        }))
      setPriceList(planDataArray)
    } else {
      setPriceList([])
    }
  }, [products?.[selectedProduct]?.plansPrice, products?.[selectedProduct]])

  return (
    <Wrapper>
      {/* Form for submitting renewal details */}
      <Form onSubmit={formik.handleSubmit}>
        {/* Modal Header */}
        <Modal.Header>
          <Modal.Title className="h6">{popupLabel}</Modal.Title>
          {/* Button to close the modal */}
          <Button
            variant="close"
            aria-label="Close"
            onClick={() => setVisible(false)}
          />
        </Modal.Header>
        {/* Modal Body */}
        <Modal.Body>
          <div>
            {/* Display selected plan's price */}
            <div>
              <Form.Group className="mb-3">
                <Form.Label>
                  <SafeFormatMessage id="Price" />
                </Form.Label>{' '}
                {/* ListBox to select price */}
                <ListBox
                  value={formik.values.price}
                  options={Object.values(priceList).map((item) => ({
                    value: item.value,
                    label: (
                      <div className="d-flex justify-content-between align-items-center">
                        <div>{renewalData?.plan?.displayName}</div>{' '}
                        <span>
                          {item.price} $ / {item.cycle}
                        </span>
                      </div>
                    ),
                  }))}
                  onChange={(e) => formik.setFieldValue('price', e.value)}
                  optionLabel="label"
                  className="form-control p-0"
                />
                {/* Display error message if price is not selected */}
                {formik.touched.price && formik.errors.price && (
                  <Form.Control.Feedback
                    type="invalid"
                    style={{ display: 'block' }}
                  >
                    {formik.errors.price}
                  </Form.Control.Feedback>
                )}
              </Form.Group>
            </div>
            {/* Checkbox for auto renewal */}
            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                id="autoRenewal"
                label={
                  <Form.Label>
                    <SafeFormatMessage id="Auto Renewal" /> -{' '}
                    <SafeFormatMessage id="Renew Indefinitely" />
                  </Form.Label>
                }
                checked={formik.values.autoRenewal}
                onChange={(e) =>
                  formik.setFieldValue('autoRenewal', e.target.checked)
                }
              />
            </Form.Group>
            {/* Input for cycle count if auto renewal is not selected */}
            {!formik.values.autoRenewal && formik.values.price && (
              <Form.Group className="mb-3">
                <Form.Label>
                  <SafeFormatMessage id="Cycle Count" /> -{' '}
                  <SafeFormatMessage id="Specify Renewal Period" />
                </Form.Label>
                <div className="cycleCountContainer">
                  <Form.Control
                    type="number"
                    id="cycleCount"
                    name="cycleCount"
                    value={formik.values.cycleCount}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    isInvalid={
                      formik.touched.cycleCount && formik.errors.cycleCount
                    }
                  />
                  {/* Display cycle period based on selected price */}
                  <span className="cyclePrice">
                    {formik.values.price &&
                      priceList.find(
                        (item) => item.value === formik.values.price
                      )?.cycle}
                  </span>
                </div>
                {/* Display error message if cycle count is invalid */}
                {formik.touched.cycleCount && formik.errors.cycleCount && (
                  <Form.Control.Feedback
                    type="invalid"
                    style={{ display: 'block' }}
                  >
                    {formik.errors.cycleCount}
                  </Form.Control.Feedback>
                )}
              </Form.Group>
            )}
            {/* ListBox to select payment card */}
            <div>
              <Form.Group className="mb-3">
                <Form.Label>
                  <SafeFormatMessage id="Payment-Card" />
                </Form.Label>
                <ListBox
                  value={formik.values.card}
                  options={
                    cards &&
                    Object.values(cards).map((card) => ({
                      value: card.stripeCardId,
                      label: (
                        <div className="d-flex justify-content-between align-items-center">
                          <div
                            className="d-flex align-items-center"
                            style={{ minWidth: '110px' }}
                          >
                            {cardInfo?.[card.brand]?.icon}
                            <FontAwesomeIcon
                              icon={faEllipsisH}
                              className="icon-dark pl-3"
                            />
                            <span
                              className="pl-1"
                              style={{ flex: '0 0 50%', minWidth: '100px' }}
                            >
                              {card.last4Digits}
                            </span>
                            <span
                              className="px-3"
                              style={{ flex: '0 0 50%', minWidth: '100px' }}
                            >
                              {card.cardholderName}
                            </span>
                          </div>
                          <div className="d-flex justify-content-between align-items-center">
                            <span>
                              {card.expirationMonth}/{card.expirationYear}
                            </span>
                          </div>
                        </div>
                      ),
                    }))
                  }
                  onChange={(e) => formik.setFieldValue('card', e.value)}
                  optionLabel="label"
                  className="form-control p-0"
                  listStyle={{ height: '200px' }}
                />
                {/* Display error message if card is not selected */}
                {formik.touched.card && formik.errors.card && (
                  <Form.Control.Feedback
                    type="invalid"
                    style={{ display: 'block' }}
                  >
                    {formik.errors.card}
                  </Form.Control.Feedback>
                )}
              </Form.Group>
            </div>
            {/* Link to add another card */}
            <div>
              <Form.Group className="mb-3">
                <span
                  className=""
                  style={{
                    color: 'var(--second-color)',
                    cursor: 'pointer',
                    textDecoration: 'underline',
                  }}
                  onClick={() => {
                    setShowAddCardForm(true)
                    setVisible(false)
                  }}
                >
                  + Add Another Card
                </span>
              </Form.Group>
            </div>
          </div>
        </Modal.Body>
        {/* Modal Footer */}
        <Modal.Footer>
          {/* Submit button */}
          <Button variant="secondary" type="submit" disabled={submitLoading}>
            <SafeFormatMessage id="Submit" />
          </Button>
          {/* Close button */}
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

export default WorkspaceRenewFormWithCycle
