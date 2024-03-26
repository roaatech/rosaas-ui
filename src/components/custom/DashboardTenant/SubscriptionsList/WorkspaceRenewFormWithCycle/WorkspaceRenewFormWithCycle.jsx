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
  changeSubscriptionAttribute,
  setAllpaymentCards,
  setWorkspaceAllPlanPrices,
  wokspaceSetAllPlans,
  workspaceUpdateProduct,
} from '../../../../../store/slices/workSpace.js'
import { cycle } from '../../../../../const/product.js'

const WorkspaceRenewFormWithCycle = ({
  setVisible,
  popupLabel,
  currentSubscription,
  referenceId,
  // cards,
  setCards,
  setShowAddCardForm,
}) => {
  const cards = useSelector((state) => state.workspace.paymentCards)
  const autoRenewalData = useSelector(
    (state) => state.workspace.autoRenewalData
  )
  const {
    setAutoRenewal,
    getPaymentCardsList,
    getProductPlansPublic,
    getProductPlanPriceListPublic,
  } = useRequest()
  const intl = useIntl()
  const [submitLoading, setSubmitLoading] = useState()
  const [priceList, setPriceList] = useState({})

  const subscriptionData = useSelector(
    (state) => state.workspace.subscriptionData
  )?.[currentSubscription]
  console.log({ subscriptionData, currentSubscription })
  const validationSchema = Yup.object().shape({
    card: Yup.string().required(<FormattedMessage id="Please-select-a-card" />),

    autoRenewal: Yup.boolean(),
    // cycleCount: Yup.number().when('autoRenewal', {
    //   is: false,
    //   then: Yup.number()
    //     .min(1, 'Cycle count must be greater than 0')
    //     .required('Cycle count is required'),
    // }),
  })
  const selectedPlan = subscriptionData?.plan?.id
  const selectedProduct = subscriptionData?.product?.id
  const selectedPrice = subscriptionData?.planPrice?.id

  const initialValues = {
    card: referenceId ? referenceId : '',
    price: selectedPrice ? selectedPrice : '',
    autoRenewal: true,
  }
  console.log({ cards })
  const dispatch = useDispatch()
  const formik = useFormik({
    initialValues,
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setSubmitLoading(true)
      try {
        await setAutoRenewal({
          subscriptionId: currentSubscription,
          cardReferenceId: values.card,
          price: values.price,
          paymentPlatform: 2,
        })
        dispatch(
          changeSubscriptionAttribute({
            subscriptionId: currentSubscription,
            attributeName: 'autoRenewalIsEnabled',
            attributeValue: true,
          })
        )
        Object.values(autoRenewalData).length > 0 &&
          dispatch(
            addAutoRenewal({
              id: currentSubscription,
              ...{
                plan: subscriptionData?.plan,
                renewalPlanPriceId: values.price,
                enabledDate: new Date(),
                subscriptionRenewalDate: subscriptionData?.endDate,
                subscription: {
                  id: subscriptionData?.id,
                  displayName: subscriptionData?.displayName,
                  systemName: subscriptionData?.systemName,
                },
                product: subscriptionData?.product,
                paymentMethodCard: cards[values.card],
              },
            })
          )
        setVisible && setVisible(false)
      } catch (error) {
        console.error('Error submitting form:', error)
      } finally {
        setSubmitLoading(false)
      }
    },
  })

  useEffect(() => {
    if (Object.keys(cards).length > 0) {
      return
    }
    ;(async () => {
      const fetchedCardsData = await getPaymentCardsList()
      dispatch(setAllpaymentCards(fetchedCardsData.data.data))
    })()
  }, [])
  const products = useSelector((state) => state.workspace.products)
  useEffect(() => {
    if (Object.values(subscriptionData).length < 0) {
      return
    }
    if (products[subscriptionData?.product?.id]) {
      return
    } else {
      dispatch(workspaceUpdateProduct(subscriptionData?.product))
    }
  }, [
    Object.values(subscriptionData).length < 0,
    products[subscriptionData?.product?.id],
  ])
  useEffect(() => {
    ;(async () => {
      formik.setFieldValue('plan', '')
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
  }, [products[selectedProduct]])

  useEffect(() => {
    ;(async () => {
      if (
        products[selectedProduct] &&
        !products[selectedProduct]?.plansPrices
      ) {
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
    })()
  }, [products[selectedProduct]])
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
            <div>
              <Form.Group className="mb-3">
                <Form.Label>
                  <FormattedMessage id="Price" />
                </Form.Label>{' '}
                <ListBox
                  value={formik.values.price}
                  options={Object.values(priceList).map((item) => ({
                    value: item.value,
                    label: `${item.price} $ / ${item.cycle}`,
                  }))}
                  onChange={(e) => formik.setFieldValue('price', e.value)}
                  optionLabel="label"
                  className="form-control p-0"
                  // listStyle={{ height: '200px' }}
                />
              </Form.Group>
            </div>
            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                id="autoRenewal"
                label={
                  <Form.Label>
                    <FormattedMessage id="Auto Renewal" /> -{' '}
                    <FormattedMessage id="Renew Indefinitely" />
                  </Form.Label>
                }
                checked={formik.values.autoRenewal}
                onChange={(e) =>
                  formik.setFieldValue('autoRenewal', e.target.checked)
                }
              />
            </Form.Group>
            {!formik.values.autoRenewal && (
              <Form.Group className="mb-3">
                <Form.Label>
                  <FormattedMessage id="Cycle Count" /> -{' '}
                  <FormattedMessage id="Specify Renewal Period" />
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
                  <span className="cyclePrice">
                    {formik.values.price &&
                      priceList.find(
                        (item) => item.value === formik.values.price
                      )?.cycle}
                  </span>
                </div>
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
            <div>
              <Form.Group className="mb-3">
                <Form.Label>
                  <FormattedMessage id="Payment-Card" />
                </Form.Label>

                <ListBox
                  value={formik.values.card}
                  options={
                    cards &&
                    Object.values(cards).map((card) => ({
                      // Use the list of cards from state
                      value: card.stripeCardId,
                      label: (
                        <div className="d-flex ">
                          <div
                            className="d-flex align-items-center"
                            style={{ minWidth: '110px' }}
                          >
                            {cardInfo?.[card.brand]?.icon}
                            <FontAwesomeIcon
                              icon={faEllipsisH}
                              className="icon-dark pl-3"
                            />
                            <span className="pl-1">{card.last4Digits}</span>
                          </div>
                          <div className="d-flex align-items-center">
                            <span
                              className="px-3"
                              style={{ flex: '0 0 100%', minWidth: '100px' }}
                            >
                              {card.cardholderName}
                            </span>
                            <span className="d-flex justify-content-end">
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
                  // virtualScrollerOptions={{ itemSize: 300 }}
                  listStyle={{ height: '200px' }}
                />
              </Form.Group>
            </div>
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
        <Modal.Footer>
          <Button variant="secondary" type="submit" disabled={submitLoading}>
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

export default WorkspaceRenewFormWithCycle
