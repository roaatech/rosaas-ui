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

const WorkspaceUpDowngradeForm = ({
  setVisible,
  popupLabel,
  type,
  subscriptionData,
}) => {
  const { getProductPlans, getProductPlanPriceList, getPaymentCardsList } =
    useRequest()
  useRequest()
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
  const { getProductList, upgradeSubscription, downgradeSubscription } =
    useRequest()
  const selectedProduct = subscriptionData?.product?.productId
  const listData = useSelector((state) => state.products.products)
  const currentPlanPrice = subscriptionData?.planPrice
  const currentPlanCycle = subscriptionData?.planCycle
  const currentPlanId = subscriptionData?.planId
  const [idsWithValues, setIdsWithValues] = useState()

  useEffect(() => {
    let query = `?page=1&pageSize=50&filters[0].Field=SearchTerm`
    if (!listData[selectedProduct]) {
      ;(async () => {
        const productList = await getProductList(query)
        dispatch(setAllProduct(productList.data.data.items))
      })()
    }
  }, [])
  const [currentSubscriptionId, setCurrentSubscriptionId] = useState('')
  useEffect(() => {
    setCurrentSubscriptionId(subscriptionData?.subscriptionId)
  }, [subscriptionData?.subscriptionId])

  const validationSchema = Yup.object().shape({
    plan: Yup.string().required(<FormattedMessage id="Please-select-a-plan" />),
    price: Yup.string().required(
      <FormattedMessage id="Please-select-a-price" />
    ),
    card: Yup.string().required(<FormattedMessage id="Please-select-a-card" />),
  })

  const initialValues = {
    plan: '',
    price: '',
    card: '',
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
    if (listData[selectedProduct]?.plans && idsWithValues) {
      setPlanOptions(
        Object.values(listData[selectedProduct].plans)
          .filter(
            (item) => item.isPublished === true && item.id !== currentPlanId
          )
          .filter((item) => idsWithValues.includes(item.id))
          .map((item, index) => ({
            value: item.id,
            label: item.displayName,
          }))
      )
    }
  }, [idsWithValues])

  useEffect(() => {
    ;(async () => {
      formik.setFieldValue('plan', '')
      formik.setFieldValue('price', '')
      if (listData[selectedProduct]) {
        if (!listData[selectedProduct].plans) {
          const planData = await getProductPlans(selectedProduct)

          dispatch(
            setAllPlans({
              productId: selectedProduct,
              data: planData.data.data,
            })
          )
        }
      }
    })()
  }, [selectedProduct])

  useEffect(() => {
    ;(async () => {
      formik.setFieldValue('price', '')
      if (listData[selectedProduct]) {
        if (!listData[selectedProduct].plansPrice) {
          const planPriceDataRes =
            await getProductPlanPriceList(selectedProduct)
          dispatch(
            setAllPlansPrice({
              productId: selectedProduct,
              data: planPriceDataRes.data.data,
            })
          )
        }
      }
      const planDataRes = listData?.[selectedProduct]?.plansPrice
      if (planDataRes) {
        const planDataArray = Object.values(planDataRes)
        const currentPlanCycles = Array.isArray(planDataArray)
          ? planDataArray.filter((item) => item.plan.id === currentPlanId)
          : null
        const otherCurrentCycle = Array.isArray(currentPlanCycles)
          ? currentPlanCycles.find((item) => item.price !== currentPlanPrice)
          : null

        const planData = planDataArray
          .filter(
            (item) =>
              item.plan.id === formik.values.plan && item.isPublished === true
          )
          .map((item) => ({
            value: item.id,
            label: `${intl.formatMessage({
              id: cycle[item.cycle],
            })} (${item.price})`,
          }))

        const hidePlanData = planDataArray
          .filter((item) => {
            if (
              item.isPublished === true &&
              (type === 'upgrade'
                ? item.cycle === currentPlanCycle
                  ? item.price > currentPlanPrice
                  : item.price > otherCurrentCycle.price
                : type === 'downgrade'
                ? item.cycle === currentPlanCycle
                  ? item.price < currentPlanPrice
                  : item.price < otherCurrentCycle.price
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
    selectedProduct,
    listData?.[selectedProduct]?.plansPrice,
  ])

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
            <Form.Group className="mb-3">
              <Form.Label>
                <FormattedMessage id="Plan" />{' '}
                <span style={{ color: 'red' }}>*</span>
              </Form.Label>
              <select
                className="form-control"
                name="plan"
                id="plan"
                value={formik.values.plan}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                disabled={!selectedProduct}
              >
                <option value="">
                  <FormattedMessage id="Select-Option" />
                </option>
                {planOptions?.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {formik.touched.plan && formik.errors.plan && (
                <Form.Control.Feedback
                  type="invalid"
                  style={{ display: 'block' }}
                >
                  {formik.errors.plan}
                </Form.Control.Feedback>
              )}
            </Form.Group>
          </div>

          <div>
            <Form.Group className="mb-3">
              <Form.Label>
                <FormattedMessage id="Subscription-Options" />{' '}
                <span style={{ color: 'red' }}>*</span>
              </Form.Label>
              <select
                className="form-control"
                name="price"
                id="price"
                value={formik.values.price}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                disabled={!formik.values.plan || !selectedProduct}
              >
                <option value="">
                  <FormattedMessage id="Select-Option" />{' '}
                </option>
                {priceList.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
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
          <ListBox
            value={formik.values.card}
            options={cards.map((card) => ({
              value: card.stripeCardId,
              label: (
                <div className="d-flex align-items-center">
                  <FontAwesomeIcon
                    icon={faEllipsisH}
                    className="icon-dark pl-3"
                  />
                  <span className="pl-3">{card.last4Digits}</span>
                </div>
              ),
            }))}
            onChange={(e) => formik.setFieldValue('card', e.value)}
            optionLabel="label"
            className="form-control"
          />
          <div>
            <Form.Group className="mb-3">
              <Form.Label>
                <FormattedMessage id="Comment" />
              </Form.Label>
              <TextareaAndCounter
                maxLength="250"
                showCharCount="true"
                id="comment"
                name="comment"
                inputValue={formik.values.comment}
                onChange={formik.handleChange}
                placeholder={'comment'}
              />
            </Form.Group>
          </div>
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
