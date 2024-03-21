import React, { useEffect, useState } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { Form } from '@themesberg/react-bootstrap'
import { Modal, Button } from '@themesberg/react-bootstrap'
import { Wrapper } from './WorkspaceUpDowngradeForm.styled.jsx'
import { FormattedMessage, useIntl } from 'react-intl'
import useRequest from '../../../../../axios/apis/useRequest.js'
import {
  setAllPlans,
  setAllPlansPrice,
  setAllProduct,
} from '../../../../../store/slices/products/productsSlice.js'
import { setAllSpecifications } from '../../../../../store/slices/products/specificationReducers.js'
import { cycle } from '../../../../../const/product.js'
import TextareaAndCounter from '../../../Shared/TextareaAndCounter/TextareaAndCounter.jsx'
import { changeOrderAttribute } from '../../../../../store/slices/tenants.js'
import { ListBox } from 'primereact/listbox'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEllipsisH } from '@fortawesome/free-solid-svg-icons'
import {
  setWorkspaceAllPlanPrices,
  wokspaceSetAllPlans,
  workspaceUpdateProduct,
} from '../../../../../store/slices/workSpace.js'
import { cardInfo } from '../../../../../const/cardPayment.js'

const WorkspaceUpDowngradeForm = ({
  setVisible,
  popupLabel,
  type,
  subscriptionData,
}) => {
  const products = useSelector((state) => state.workspace.products)
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

  const [submitLoading, setSubmitLoading] = useState()
  const [priceList, setPriceList] = useState([])

  const [cards, setCards] = useState([])
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

  const dispatch = useDispatch()
  const {
    getProductList,
    upgradeSubscription,
    downgradeSubscription,
    getProductPlansPublic,
    getPaymentCardsList,
    getProductPlanPriceListPublic,
  } = useRequest()
  const selectedProduct = subscriptionData?.product?.id
  const currentPlanPrice = subscriptionData?.planPrice.price
  const currentPlanCycle = subscriptionData?.planPrice.cycle
  const currentPlanId = subscriptionData?.plan.id
  const [idsWithValues, setIdsWithValues] = useState()
  console.log({ subscriptionData })
  const [currentSubscriptionId, setCurrentSubscriptionId] = useState('')
  useEffect(() => {
    setCurrentSubscriptionId(subscriptionData?.subscriptionId)
  }, [subscriptionData?.subscriptionId])

  const validationSchema = Yup.object().shape({
    // plan: Yup.string().required(<FormattedMessage id="Please-select-a-plan" />),
    // price: Yup.string().required(
    //   <FormattedMessage id="Please-select-a-price" />
    // ),
    card: Yup.string().required(
      <FormattedMessage id="This-field-is-required" />
    ),
    subscriptionOption: Yup.string().required(
      <FormattedMessage id="This-field-is-required" />
    ),
    // plan: Yup.string()
    //   .test(
    //     'not-current-plan',
    //     'You cannot select the current plan',
    //     function (value) {
    //       const currentPlanId = subscriptionData?.plan.id
    //       return value !== currentPlanId
    //     }
    //   )
    //   .required('Please select a plan'),
  })

  const initialValues = {
    plan: '',
    price: '',
    card: '',
    subscriptionOption: '',
    cycle: subscriptionData?.planPrice?.cycle
      ? subscriptionData?.planPrice?.cycle
      : '',
  }
  const formik = useFormik({
    initialValues,
    validationSchema: validationSchema,

    onSubmit: async (values) => {
      setSubmitLoading(true)

      if (type == 'upgrade') {
        const upgradeSubscriptionReq = await upgradeSubscription({
          planPriceId: values.price,
          planId: values.plan,
          subscriptionId: currentSubscriptionId,
          comment: values.comment,
          cardReferenceId: values.card,
          paymentPlatform: 2,
        })
      } else {
        const downgradeSubscriptionReq = await downgradeSubscription({
          planPriceId: values.price,
          planId: values.plan,
          subscriptionId: currentSubscriptionId,
          comment: values.comment,
        })
      }
      setSubmitLoading(false)

      setVisible && setVisible(false)
    },
  })

  const intl = useIntl()
  let [planOptions, setPlanOptions] = useState([])
  useEffect(() => {
    if (products[selectedProduct]?.plans && idsWithValues) {
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

      setPlanOptions(planList)
    }
  }, [idsWithValues])

  useEffect(() => {
    ;(async () => {
      formik.setFieldValue('plan', '')
      formik.setFieldValue('price', '')
      if (products[selectedProduct]) {
        if (!products[selectedProduct].plans) {
          const planData = await getProductPlansPublic(
            subscriptionData.product.systemName
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
  }, [products, selectedProduct])

  useEffect(() => {
    ;(async () => {
      // formik.setFieldValue('price', '')
      if (products[selectedProduct]) {
        if (!products[selectedProduct]?.plansPrices) {
          const planPriceDataRes = await getProductPlanPriceListPublic(
            subscriptionData.product.systemName
          )
          dispatch(
            setWorkspaceAllPlanPrices({
              productId: selectedProduct,
              data: planPriceDataRes.data.data,
            })
          )
        }
      }
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
  useEffect(() => {
    if (!formik.values.subscriptionOption) {
      return
    }
    const parts = formik.values.subscriptionOption.split(':')
    if (parts.length !== 2) {
      return
    }
    const [selectedPlan, selectedPrice] = parts

    formik.setFieldValue('plan', selectedPlan)
    formik.setFieldValue('price', selectedPrice)
  }, [formik.values.subscriptionOption])

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
          <Form.Group className="mb-4">
            <Form.Label>
              <FormattedMessage id="Subscription Cycle" />
            </Form.Label>
            <div className="d-flex form-control justify-content-center ">
              <Form.Check
                inline
                label={<FormattedMessage id="Monthly" />}
                type="radio"
                id="monthlyCycle"
                name="cycle"
                value="monthly"
                checked={formik.values.cycle === 3} // Checking against the numeric value
                onChange={() => formik.setFieldValue('cycle', 3)}
                className="px-6"
              />
              <Form.Check
                inline
                label={<FormattedMessage id="Yearly" />}
                type="radio"
                id="yearlyCycle"
                name="cycle"
                value="yearly"
                checked={formik.values.cycle === 4} // Checking against the numeric value
                onChange={() => formik.setFieldValue('cycle', 4)} // Setting numeric value
                className="px-6"
              />
            </div>
          </Form.Group>
          <Form.Group className="mb-4">
            <Form.Label>
              <FormattedMessage id="Subscription-Options" />{' '}
              <span style={{ color: 'red' }}>*</span>
            </Form.Label>
            <ListBox
              value={
                // `${formik.values.plan}:${formik.values.price}` ||
                formik.values.subscriptionOption
              }
              options={
                formik.values.cycle &&
                planOptions.map((option, index) => ({
                  value: `${option.value}:${
                    priceList.find((price) => price.planId == option.value)
                      ?.value
                  }`,
                  label: (
                    <div
                      style={{
                        color: index === 0 ? 'var(--passive-color)' : '',
                      }}
                      className="d-flex justify-content-between align-items-center"
                    >
                      <span>{option.label}</span>{' '}
                      {priceList.find((price) => price.planId === option.value)
                        ?.label.price || ''}{' '}
                      $
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
            {formik.touched.subscriptionOption &&
              formik.errors.subscriptionOption && (
                <Form.Control.Feedback
                  type="invalid"
                  style={{ display: 'block' }}
                >
                  {formik.errors.subscriptionOption}
                </Form.Control.Feedback>
              )}{' '}
            {formik.touched.plan && formik.errors.plan && (
              <Form.Control.Feedback
                type="invalid"
                style={{ display: 'block' }}
              >
                {formik.errors.plan}
              </Form.Control.Feedback>
            )}{' '}
          </Form.Group>

          <Form.Group>
            <Form.Label>
              <FormattedMessage id="Payment-Card" />{' '}
              <span style={{ color: 'red' }}>*</span>
            </Form.Label>
            <ListBox
              value={formik.values.card}
              options={cards.map((card) => ({
                // Use the list of cards from state
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
              }))}
              onChange={(e) => formik.setFieldValue('card', e.value)}
              optionLabel="label"
              className="form-control p-0"
              // virtualScrollerOptions={{ itemSize: 300 }}
              listStyle={{ maxHeight: '140px' }}
            />
            {formik.touched.card && formik.errors.card && (
              <Form.Control.Feedback
                type="invalid"
                style={{ display: 'block' }}
              >
                {formik.errors.card}
              </Form.Control.Feedback>
            )}{' '}
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" type="submit" disabled={submitLoading}>
            <FormattedMessage id="Submit" />
          </Button>
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
