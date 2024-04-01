// Import necessary modules and components
import React, { useEffect, useState } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { useDispatch, useSelector } from 'react-redux'
import { Form } from '@themesberg/react-bootstrap'
import { Modal, Button } from '@themesberg/react-bootstrap'
import { Wrapper } from './WorkspaceUpDowngradeForm.styled.jsx'
import { FormattedMessage, useIntl } from 'react-intl'
import useRequest from '../../../../../axios/apis/useRequest.js'
import { cycle } from '../../../../../const/product.js'
import { ListBox } from 'primereact/listbox'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEllipsisH } from '@fortawesome/free-solid-svg-icons'
import {
  setWorkspaceAllPlanPrices,
  wokspaceSetAllPlans,
  workspaceUpdateProduct,
} from '../../../../../store/slices/workSpace.js'
import { cardInfo } from '../../../../../const/cardPayment.js'

// Define the component
const WorkspaceUpDowngradeForm = ({
  setVisible,
  popupLabel,
  type,
  subscriptionData,
  setEnabledCardId,
  setCanceledCardId,
}) => {
  // Redux state management
  const products = useSelector((state) => state.workspace.products)
  const dispatch = useDispatch()

  // Formik form setup
  const formik = useFormik({
    initialValues,
    validationSchema: validationSchema,

    // Form submission handler
    onSubmit: async (values) => {
      // Set loading state
      setSubmitLoading(true)

      // Upgrade or downgrade subscription based on type
      if (type == 'upgrade') {
        // Upgrade subscription
        const upgradeSubscriptionReq = await upgradeSubscription({
          planPriceId: values.price,
          planId: values.plan,
          subscriptionId: currentSubscriptionId,
          comment: values.comment,
          cardReferenceId: values.card,
          paymentPlatform: 2,
        })
        // Set enabled card ID
        setEnabledCardId(currentSubscriptionId)
        setTimeout(() => {
          setEnabledCardId(null)
        }, 2000)
      } else {
        // Downgrade subscription
        const downgradeSubscriptionReq = await downgradeSubscription({
          planPriceId: values.price,
          planId: values.plan,
          subscriptionId: currentSubscriptionId,
          comment: values.comment,
        })
        // Set canceled card ID
        setCanceledCardId(currentSubscriptionId)

        // Reset canceled card ID after 2 seconds
        setTimeout(() => {
          setCanceledCardId(null)
        }, 2000)
      }
      // Reset loading state
      setSubmitLoading(false)

      // Close modal if setVisible is defined
      setVisible && setVisible(false)
    },
  })

  // Other state variables
  const [submitLoading, setSubmitLoading] = useState()
  const [priceList, setPriceList] = useState([])
  const [cards, setCards] = useState([])
  const [idsWithValues, setIdsWithValues] = useState()
  const [currentSubscriptionId, setCurrentSubscriptionId] = useState('')

  // Other hooks and effects

  // Fetch cards data
  useEffect(() => {
    const fetchCards = async () => {
      try {
        const cardsData = await getPaymentCardsList()
        setCards(cardsData.data.data)
      } catch (error) {
        console.error('Error fetching payment cards:', error)
      }
    }
    fetchCards()
  }, [])

  // Update products state if subscriptionData changes
  useEffect(() => {
    if (!subscriptionData) {
      return
    }
    if (products[subscriptionData?.product.id]) {
      return
    } else {
      dispatch(workspaceUpdateProduct(subscriptionData?.product))
    }
  }, [subscriptionData, products])

  // Destructure functions from the custom hook useRequest
  const {
    upgradeSubscription,
    downgradeSubscription,
    getProductPlansPublic,
    getPaymentCardsList,
    getProductPlanPriceListPublic,
  } = useRequest()

  // Extract data from subscriptionData
  const selectedProduct = subscriptionData?.product?.id
  const currentPlanPrice = subscriptionData?.planPrice.price
  const currentPlanCycle = subscriptionData?.planPrice.cycle
  const currentPlanId = subscriptionData?.plan.id

  // Update currentSubscriptionId when subscriptionData changes
  useEffect(() => {
    setCurrentSubscriptionId(subscriptionData?.subscriptionId)
  }, [subscriptionData?.subscriptionId])

  // Define validation schema for Formik form
  const validationSchema = Yup.object().shape({
    card: Yup.string().required(
      <FormattedMessage id="This-field-is-required" />
    ),
    subscriptionOption: Yup.string().required(
      <FormattedMessage id="This-field-is-required" />
    ),
  })

  // Initial values for Formik form
  const initialValues = {
    plan: '',
    price: '',
    card: '',
    subscriptionOption: '',
    cycle: subscriptionData?.planPrice?.cycle
      ? subscriptionData?.planPrice?.cycle
      : '',
  }

  const intl = useIntl() // Internationalization hook
  let [planOptions, setPlanOptions] = useState([]) // State variable for plan options

  // Effect to update plan options when products or plan IDs change
  useEffect(() => {
    if (products[selectedProduct]?.plans && idsWithValues) {
      // Filter and map plan options
      const planList = Object.values(products[selectedProduct].plans)
        .filter((item) => item.isPublished === true)
        .filter((item) => idsWithValues.includes(item.id))
        .map((item) => ({
          value: item.id,
          label:
            item.id === currentPlanId
              ? `${item.displayName} (Current Plan)`
              : item.displayName,
        }))

      // Find the index of the current plan in the planList
      const currentIndex = planList.findIndex(
        (plan) => plan.value === currentPlanId
      )

      // If the current plan exists, move it to the beginning
      if (currentIndex !== -1) {
        const currentPlan = planList.splice(currentIndex, 1)[0]
        planList.unshift(currentPlan)
      }

      // Set plan options state
      setPlanOptions(planList)
    }
  }, [idsWithValues])

  // Effect to fetch product plans and set initial form values
  useEffect(() => {
    ;(async () => {
      // Reset form values
      formik.setFieldValue('plan', '')
      formik.setFieldValue('price', '')

      // Fetch product plans if not already loaded
      if (products[selectedProduct]) {
        if (!products[selectedProduct].plans) {
          const planData = await getProductPlansPublic(
            subscriptionData.product.systemName
          )

          // Dispatch action to update product plans in Redux store
          dispatch(
            wokspaceSetAllPlans({
              productId: selectedProduct,
              data: planData.data.data,
            })
          )
        }
      }
    })()
  }, [products, selectedProduct])

  // Effect to fetch product plan prices and update plan options based on current cycle
  useEffect(() => {
    ;(async () => {
      // formik.setFieldValue('price', '')
      if (products[selectedProduct]) {
        if (!products[selectedProduct]?.plansPrices) {
          // Fetch product plan prices if not already loaded
          const planPriceDataRes = await getProductPlanPriceListPublic(
            subscriptionData.product.systemName
          )
          // Dispatch action to update product plan prices in Redux store
          dispatch(
            setWorkspaceAllPlanPrices({
              productId: selectedProduct,
              data: planPriceDataRes.data.data,
            })
          )
        }
      }

      // Filter plan data based on cycle and create plan options
      const planDataRes = products?.[selectedProduct]?.plansPrices
      if (planDataRes) {
        const planDataArray = Object.values(planDataRes)
        const currentPlanCycles = Array.isArray(planDataArray)
          ? planDataArray.filter((item) => item.plan.id === currentPlanId)
          : null
        const otherCurrentCycle = Array.isArray(currentPlanCycles)
          ? currentPlanCycles.find(
              (item) => item.price
              // !== currentPlanPrice
            )
          : null
        const planData = planDataArray
          .filter(
            (item) =>
              item.isPublished === true && item.cycle === formik.values.cycle
          )
          .map((item) => ({
            value: item.id,
            label: {
              cycle: intl.formatMessage({
                id: cycle[item.cycle],
              }),
              price: item.price,
            },
            planId: item.plan.id,
          }))

        // Filter and set hidden plan data based on subscription type
        const hidePlanData = planDataArray
          .filter((item) => {
            console.log({ currentPlanPrice })
            if (
              item.isPublished === true &&
              (type === 'downgrade'
                ? item.cycle === currentPlanCycle
                  ? item.price > currentPlanPrice
                  : otherCurrentCycle && item.price > otherCurrentCycle?.price
                : type === 'upgrade'
                ? item.cycle === currentPlanCycle
                  ? item.price < currentPlanPrice
                  : otherCurrentCycle && item.price < otherCurrentCycle?.price
                : type !== 'changeOrderPlan')
            ) {
              return false
            }
            return true
          })
          .map((item) => ({
            value: item.id,
            planId: item.plan.id,
          }))

        // Set IDs with values and price list
        setIdsWithValues(hidePlanData.map((item) => item.planId))
        setPriceList(planData)
      }
    })()
  }, [
    formik.values.plan,
    // selectedProduct,
    products?.[selectedProduct]?.plansPrices,
    products?.[selectedProduct],
    formik.values.cycle,
  ])

  // Effect to set plan and price when subscription option changes
  useEffect(() => {
    if (!formik.values.subscriptionOption) {
      return
    }
    const parts = formik.values.subscriptionOption.split(':')
    if (parts.length !== 2) {
      return
    }
    const [selectedPlan, selectedPrice] = parts

    // Set plan and price form values
    formik.setFieldValue('plan', selectedPlan)
    formik.setFieldValue('price', selectedPrice)
  }, [formik.values.subscriptionOption])

  return (
    // Wrapper component for the WorkspaceUpDowngradeForm
    <Wrapper>
      <Form onSubmit={formik.handleSubmit}>
        <Modal.Header>
          {/* Modal title */}
          <Modal.Title className="h6">{popupLabel}</Modal.Title>
          {/* Close button */}
          <Button
            variant="close"
            aria-label="Close"
            onClick={() => setVisible(false)}
          />
        </Modal.Header>
        <Modal.Body>
          {/* Subscription cycle radio buttons */}
          <Form.Group className="mb-4">
            <Form.Label>
              <FormattedMessage id="Subscription Cycle" />
            </Form.Label>
            <div className="d-flex form-control justify-content-center">
              {/* Monthly cycle radio button */}
              <Form.Check
                inline
                label={<FormattedMessage id="Monthly" />}
                type="radio"
                id="monthlyCycle"
                name="cycle"
                value="monthly"
                checked={formik.values.cycle === 3} // Check if cycle is monthly
                onChange={() => formik.setFieldValue('cycle', 3)} // Set cycle to monthly
                className="px-6"
              />
              {/* Yearly cycle radio button */}
              <Form.Check
                inline
                label={<FormattedMessage id="Yearly" />}
                type="radio"
                id="yearlyCycle"
                name="cycle"
                value="yearly"
                checked={formik.values.cycle === 4} // Check if cycle is yearly
                onChange={() => formik.setFieldValue('cycle', 4)} // Set cycle to yearly
                className="px-6"
              />
            </div>
          </Form.Group>
          {/* Subscription options dropdown */}
          <Form.Group className="mb-4">
            <Form.Label>
              <FormattedMessage id="Subscription-Options" />{' '}
              <span style={{ color: 'red' }}>*</span>
            </Form.Label>
            <ListBox
              value={formik.values.subscriptionOption}
              options={
                formik.values.cycle &&
                planOptions.map((option, index) => ({
                  value: `${option.value}:${
                    priceList.find((price) => price.planId == option.value)
                      ?.value
                  }`,
                  label: (
                    <div
                      className={
                        index === 0
                          ? 'current-plan d-flex justify-content-between align-items-center'
                          : 'd-flex justify-content-between align-items-center'
                      }
                    >
                      <span>{option.label}</span>{' '}
                      {priceList.find((price) => price.planId === option.value)
                        ?.label.price || ''}{' '}
                      $ /{' '}
                      {priceList.find((price) => price.planId === option.value)
                        ?.label.cycle == 3 ? (
                        <FormattedMessage id="Month" />
                      ) : (
                        <FormattedMessage id="Year" />
                      )}
                    </div>
                  ),
                }))
              }
              onChange={(e) => {
                // Check if the selected plan is not the current plan
                if (e.value.split(':')[0] === subscriptionData.plan.id) {
                  // Show an error message
                  formik.setFieldError(
                    'plan',
                    'You cannot select the current plan'
                  )
                } else {
                  // Set the selected option
                  formik.setFieldValue('subscriptionOption', e.value)
                }
              }}
              optionLabel="label"
              className="form-control p-0"
              listStyle={{ maxHeight: '140px' }}
            />
            {/* Display subscription option validation error */}
            {formik.touched.subscriptionOption &&
              formik.errors.subscriptionOption && (
                <Form.Control.Feedback
                  type="invalid"
                  style={{ display: 'block' }}
                >
                  {formik.errors.subscriptionOption}
                </Form.Control.Feedback>
              )}
            {/* Display plan validation error */}
            {formik.touched.plan && formik.errors.plan && (
              <Form.Control.Feedback
                type="invalid"
                style={{ display: 'block' }}
              >
                {formik.errors.plan}
              </Form.Control.Feedback>
            )}
          </Form.Group>
          {/* Payment card dropdown */}
          <Form.Group>
            <Form.Label>
              <FormattedMessage id="Payment-Card" />{' '}
              <span style={{ color: 'red' }}>*</span>
            </Form.Label>
            <ListBox
              value={formik.values.card}
              options={cards.map((card) => ({
                value: card.stripeCardId,
                label: (
                  <div className="d-flex justify-content-between align-items-center">
                    <div
                      className="d-flex align-items-center"
                      style={{ minWidth: '110px' }}
                    >
                      {/* Display card icon */}
                      {cardInfo?.[card.brand]?.icon}
                      <FontAwesomeIcon
                        icon={faEllipsisH}
                        className="icon-dark pl-3"
                      />
                      {/* Display last 4 digits and cardholder name */}
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
                    {/* Display card expiration date */}
                    <div className="d-flex justify-content-between align-items-center">
                      <span>
                        {card.expirationMonth}/{card.expirationYear}
                      </span>
                    </div>
                  </div>
                ),
              }))}
              onChange={(e) => formik.setFieldValue('card', e.value)}
              optionLabel="label"
              className="form-control p-0"
              listStyle={{ maxHeight: '140px' }}
            />
            {/* Display card validation error */}
            {formik.touched.card && formik.errors.card && (
              <Form.Control.Feedback
                type="invalid"
                style={{ display: 'block' }}
              >
                {formik.errors.card}
              </Form.Control.Feedback>
            )}
          </Form.Group>
        </Modal.Body>
        {/* Modal footer */}
        <Modal.Footer>
          {/* Submit button */}
          <Button variant="secondary" type="submit" disabled={submitLoading}>
            <FormattedMessage id="Submit" />
          </Button>
          {/* Close button */}
          <Button
            variant="link"
            className="text-gray "
            onClick={() => setVisible(false)}
          >
            <FormattedMessage id="Close" />
          </Button>
        </Modal.Footer>
      </Form>
    </Wrapper>
  )
}

export default WorkspaceUpDowngradeForm
