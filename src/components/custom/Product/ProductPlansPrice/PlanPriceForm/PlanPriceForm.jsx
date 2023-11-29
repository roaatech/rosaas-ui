import React, { useEffect, useState } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import useRequest from '../../../../../axios/apis/useRequest.js'
import { Modal, Button } from '@themesberg/react-bootstrap'
import { Form } from '@themesberg/react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { FormattedMessage } from 'react-intl'
import { Wrapper } from './PlanPriceForm.styled.jsx'
import { useParams } from 'react-router-dom'
import {
  PlansPriceInfo,
  setAllPlansPrice,
  setAllPlans,
} from '../../../../../store/slices/products/productsSlice.js'

import TextareaAndCounter from '../../../Shared/TextareaAndCounter/TextareaAndCounter.jsx'
import { activeIndex, cycle } from '../../../../../const/index.js'

const PlanPriceForm = ({
  type,
  planPriceData,
  setVisible,
  popupLabel,
  setActiveIndex,
  plan,
  cycleValue,
}) => {
  const {
    createPlanPriceRequest,
    editPlanPriceRequest,
    getProductPlanPriceList,
    getProductPlans,
  } = useRequest()
  const dispatch = useDispatch()
  const routeParams = useParams()
  const productId = routeParams.id
  const [cyclesYouDontHave, setCyclesYouDontHave] = useState([])

  const allPlansPrices = useSelector(
    (state) => state.products.products[productId]?.plansPrice
  )

  useEffect(() => {
    const setHasPlanAndHandleCycle = async () => {
      if (plan) {
        handlePlanCycle(plan)
      }
    }
    setHasPlanAndHandleCycle()
  }, [plan])

  useEffect(() => {
    const setAllPlansPrices = async () => {
      if (!allPlansPrices) {
        try {
          const response = await getProductPlanPriceList(productId)

          dispatch(
            setAllPlansPrice({
              productId: productId,
              data: response.data.data,
            })
          )
        } catch (error) {
          console.error('Error fetching plan prices:', error)
        }
      }
    }

    setAllPlansPrices()
  }, [dispatch, productId, allPlansPrices])

  const handlePlanCycle = async (values) => {
    const usualCycles = Object.keys(cycle).map(Number)
    let cyclesYouHave = []

    try {
      if (allPlansPrices) {
        const planPricesArray = Object.values(allPlansPrices)

        const matchingPlanPrices = planPricesArray.filter((planPrice) => {
          return planPrice.plan.id === values
        })

        if (matchingPlanPrices.length > 0) {
          matchingPlanPrices.forEach((planPrice) => {
            const cycle = parseInt(planPrice.cycle)
            cyclesYouHave.push(cycle)
          })

          const cyclesNotHave = usualCycles.filter((cycle) => {
            return !cyclesYouHave.includes(cycle)
          })

          setCyclesYouDontHave(cyclesNotHave)
        } else {
          setCyclesYouDontHave(usualCycles)
        }
      }
    } catch (error) {
      console.error('Error handling plan cycle:', error)
    }
  }
  const [plansWithAllCyclesAssigned, setPlansWithAllCyclesAssigned] = useState(
    []
  )

  const handlePlansWithAllCyclesAssigned = () => {
    const usualCycles = Object.keys(cycle).map(Number)
    const plansWithAllCyclesAssigned = []

    try {
      if (allPlansPrices) {
        const planPricesArray = Object.values(allPlansPrices)

        Object.keys(allPlans).forEach((planId) => {
          const cyclesAssignedToPlan = planPricesArray
            .filter((planPrice) => planPrice.plan.id === planId)
            .map((planPrice) => parseInt(planPrice.cycle))
          if (
            usualCycles.every((cycle) => cyclesAssignedToPlan.includes(cycle))
          ) {
            plansWithAllCyclesAssigned.push(planId)
          }
        })

        setPlansWithAllCyclesAssigned(plansWithAllCyclesAssigned)
      }
    } catch (error) {
      console.error('Error handling plans with all cycles assigned:', error)
    }
  }

  useEffect(() => {
    handlePlansWithAllCyclesAssigned()
  }, [])

  const initialValues = {
    plan: plan || (planPriceData ? planPriceData.plan.id : ''),
    cycle: cycleValue || (planPriceData ? planPriceData.cycle : ''),
    price: planPriceData ? planPriceData.price : '',
    description: planPriceData ? planPriceData.description : '',
    cyclesYouDontHave: cyclesYouDontHave,
  }

  const allProducts = useSelector((state) => state.products.products)

  const validationSchema = Yup.object().shape({
    plan: Yup.string().required(
      <FormattedMessage id="Please-Select-a-Option" />
    ),
    cycle: Yup.number().required(
      <FormattedMessage id="Please-Select-a-Option" />
    ),
    price: Yup.number()
      .required(<FormattedMessage id="This-field-is-required" />)
      .min(0, <FormattedMessage id="The-price-must-be-0-or-more" />)
      .max(999999, <FormattedMessage id="The-value-must-not-exceed-999,999" />),
  })

  const formik = useFormik({
    initialValues,
    validationSchema: validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      if (type === 'create') {
        const createPlanPrice = await createPlanPriceRequest(productId, {
          planId: values.plan,
          cycle: parseInt(values.cycle),
          price: parseInt(values.price),
          description: values.description,
        })

        if (!allProducts[productId].plansPrice) {
          const plan = await getProductPlanPriceList(productId)
          dispatch(
            setAllPlansPrice({
              productId: productId,
              data: plan.data.data,
            })
          )
        }

        dispatch(
          PlansPriceInfo({
            planPriceId: createPlanPrice.data.data.id,
            productId: productId,
            data: {
              plan: { id: values.plan, title: allPlans[values.plan].title },
              cycle: values.cycle,
              price: values.price,
              description: values.description,
              id: createPlanPrice.data.data.id,
              isPublished: false,
              isSubscribed: false,
              createdDate: new Date().toISOString().slice(0, 19),
              editedDate: new Date().toISOString().slice(0, 19),
            },
          })
        )

        if (setActiveIndex) {
          setActiveIndex(activeIndex.plansPrice)
        }
      } else {
        const editPlan = await editPlanPriceRequest(productId, {
          data: {
            price: parseInt(values.price),
            description: values.description,
            cycle: parseInt(values.cycle),
          },
          id: planPriceData.id,
        })

        dispatch(
          PlansPriceInfo({
            planPriceId: planPriceData.id,
            productId: productId,
            data: {
              plan: { id: values.plan, title: allPlans[values.plan].title },
              cycle: values.cycle,
              price: values.price,
              description: values.description,
              id: planPriceData.id,
              isPublished: planPriceData.isPublished,
              isSubscribed: planPriceData.isSubscribed,
              createdDate: planPriceData.createdDate,
              editedDate: new Date().toISOString().slice(0, 19),
            },
          })
        )
      }

      setVisible && setVisible(false)
      setSubmitting(false)
    },
  })

  const allPlans = allProducts[productId].plans

  let planOptions
  if (allProducts[productId]?.plans) {
    planOptions = Object.values(allPlans).map((item, index) => {
      return { value: item.id, label: item.title }
    })
  } else {
    planOptions = []
  }

  const filteredPlanOptions = planOptions.filter(
    (option) => !plansWithAllCyclesAssigned.includes(option.value)
  )

  useEffect(() => {
    ;(async () => {
      if (!allPlans) {
        const planData = await getProductPlans(productId)
        dispatch(
          setAllPlans({
            productId: productId,
            data: planData.data.data,
          })
        )
      }
    })()
  }, [])

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
          {type !== 'edit' && (
            <>
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
                    onChange={(e) => {
                      const selectedPlan = e.target.value
                      formik.handleChange(e)

                      if (!selectedPlan) {
                        formik.setFieldValue('plan', '')
                      } else {
                        handlePlanCycle(selectedPlan)
                      }
                    }}
                    onBlur={formik.handleBlur}
                  >
                    <option value="">
                      <FormattedMessage id="Select-Option" />
                    </option>
                    {filteredPlanOptions.map((option) => (
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
                    <FormattedMessage id="cycle" />
                    <span style={{ color: 'red' }}> *</span>
                  </Form.Label>
                  <select
                    className="form-control"
                    id="cycle"
                    name="cycle"
                    onChange={formik.handleChange}
                    value={formik.values.cycle}
                    disabled={cyclesYouDontHave.length === 0}
                  >
                    <option value="">
                      <FormattedMessage id="Select-Option" />
                    </option>
                    {cyclesYouDontHave.map((cycleValue) => (
                      <option key={cycleValue} value={cycleValue}>
                        <FormattedMessage id={cycle[cycleValue]} />
                      </option>
                    ))}
                  </select>
                  {formik.touched.cycle && formik.errors.cycle && (
                    <Form.Control.Feedback
                      type="invalid"
                      style={{ display: 'block' }}
                    >
                      {formik.errors.cycle}
                    </Form.Control.Feedback>
                  )}
                  {formik.values.plan && cyclesYouDontHave.length === 0 ? (
                    <div className="assigned-value">
                      <FormattedMessage id="All-values-are-assigned." />
                    </div>
                  ) : null}
                </Form.Group>
              </div>
            </>
          )}

          <div>
            <Form.Group className="mb-3">
              <Form.Label>
                <FormattedMessage id="Price" />{' '}
                <span style={{ color: 'red' }}> *</span>
              </Form.Label>
              <input
                type="text"
                className="form-control"
                id="price"
                name="price"
                onChange={formik.handleChange}
                value={formik.values.price}
              />
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
          <div>
            <Form.Group className="mb-3">
              <Form.Label>
                <FormattedMessage id="Description" />
              </Form.Label>

              <TextareaAndCounter
                addTextarea={formik.setFieldValue}
                maxLength={250}
                showCharCount
                inputValue={formik?.values?.description}
              />

              {formik.touched.description && formik.errors.description && (
                <div className="invalid-feedback">
                  {formik.errors.description}
                </div>
              )}
            </Form.Group>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" type="submit">
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

export default PlanPriceForm
