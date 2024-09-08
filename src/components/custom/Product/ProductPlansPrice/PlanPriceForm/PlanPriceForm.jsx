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
import AutoGenerateInput from '../../../Shared/AutoGenerateInput/AutoGenerateInput.jsx'
import MultilingualInput from '../../../Shared/MultilingualInput/MultilingualInput.jsx'
import SafeFormatMessage from '../../../Shared/SafeFormatMessage/SafeFormatMessage.jsx'

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
    systemName: planPriceData ? planPriceData.systemName : '',
    cycle: cycleValue || (planPriceData ? planPriceData.cycle : ''),
    price: planPriceData ? planPriceData.price : '',
    oldPrice: planPriceData ? planPriceData.oldPrice : '',
    descriptionEn: planPriceData?.descriptionLocalizations?.en || '',
    descriptionAr: planPriceData?.descriptionLocalizations?.ar || '',
    cyclesYouDontHave: cyclesYouDontHave,
  }

  const allProducts = useSelector((state) => state.products.products)

  const validationSchema = Yup.object().shape({
    plan: Yup.string().required(
      <SafeFormatMessage id="Please-Select-a-Option" />
    ),
    cycle: Yup.number().required(
      <SafeFormatMessage id="Please-Select-a-Option" />
    ),
    systemName: Yup.string()
      .max(100, <SafeFormatMessage id="Must-be-maximum-100-digits" />)
      .required(<SafeFormatMessage id="System-Name-is-required" />)
      .matches(
        /^[a-zA-Z0-9_-]+$/,
        <SafeFormatMessage id="English-Characters,-Numbers,-and-Underscores-are-only-accepted." />
      ),
    price: Yup.number()
      .required(<SafeFormatMessage id="This-field-is-required" />)
      .min(0, <SafeFormatMessage id="The-price-must-be-0-or-more" />)
      .max(999999, <SafeFormatMessage id="The-value-must-not-exceed-999,999" />)
      .test(
        'is-decimal',
        <SafeFormatMessage id="The-price-must-have-up-to-two-decimal-places" />,
        (value) => (value + '').match(/^\d+(\.\d{1,2})?$/)
      ),
    oldPrice: Yup.number()
      .nullable() // This makes the field optional
      .min(0, <SafeFormatMessage id="The-price-must-be-0-or-more" />)
      .max(999999, <SafeFormatMessage id="The-value-must-not-exceed-999,999" />)
      .test(
        'is-decimal',
        <SafeFormatMessage id="The-price-must-have-up-to-two-decimal-places" />,
        (value) => !value || (value + '').match(/^\d+(\.\d{1,2})?$/) // Validation only applies if a value exists
      ),
  })

  const formik = useFormik({
    initialValues,
    validationSchema: validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      if (type === 'create') {
        const createPlanPrice = await createPlanPriceRequest(productId, {
          systemName: values.systemName,
          planId: values.plan,
          cycle: parseInt(values.cycle),
          price: parseFloat(values.price),
          descriptionLocalizations: {
            en: values.descriptionEn,
            ar: values.descriptionAr,
          },
          oldPrice: parseFloat(values.oldPrice),
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
              plan: {
                id: values.plan,
                displayName: allPlans[values.plan].displayName,
              },
              cycle: values.cycle,
              price: values.price,
              systemName: values.systemName,
              oldPrice: parseFloat(values.oldPrice),
              descriptionLocalizations: {
                en: values.descriptionEn,
                ar: values.descriptionAr,
              },
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
            price: parseFloat(values.price),
            oldPrice: parseFloat(values.oldPrice),
            descriptionLocalizations: {
              en: values.descriptionEn,
              ar: values.descriptionAr,
            },
            cycle: parseInt(values.cycle),
          },
          id: planPriceData.id,
        })

        dispatch(
          PlansPriceInfo({
            planPriceId: planPriceData.id,
            productId: productId,
            data: {
              plan: {
                id: values.plan,
                displayName: allPlans[values.plan].displayName,
              },
              systemName: values.systemName,
              cycle: values.cycle,
              price: values.price,
              oldPrice: values.oldPrice,
              descriptionLocalizations: {
                en: values.descriptionEn,
                ar: values.descriptionAr,
              },
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
  const tenancyType = allPlans?.[formik.values.plan]?.tenancyType

  let planOptions
  if (allProducts[productId]?.plans) {
    planOptions = Object.values(allPlans)
      .filter((option) => option.tenancyType !== 1)
      .map((item, index) => ({
        value: item.id,
        label: item.displayName,
      }))
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
            <div className="mb-3">
              <AutoGenerateInput
                label={<SafeFormatMessage id="System-Name" />}
                id="systemName"
                value={`${
                  formik.values.plan
                    ? allPlans?.[formik.values.plan]?.systemName
                    : ''
                } ${formik.values.cycle ? cycle[formik.values.cycle] : ''} ${
                  formik.values.price ? formik.values.price : ''
                }`}
                name={
                  formik.values.plan &&
                  formik.values.cycle &&
                  formik.values.price
                    ? formik.values.systemName
                    : ''
                }
                onChange={formik.handleChange}
                onGenerateUniqueName={(generatedUniqueName) => {
                  formik.setFieldValue('systemName', generatedUniqueName)
                }}
                onAutoGenerateClick={() => {
                  formik.setFieldValue(
                    'isAutoGenerated',
                    !formik.values.isAutoGenerated
                  )
                }}
                isAutoGenerated={formik.values.isAutoGenerated}
                disabled={
                  !formik.values.plan ||
                  !formik.values.cycle ||
                  !formik.values.price
                }
              />

              {formik.touched.systemName && formik.errors.systemName && (
                <Form.Control.Feedback
                  type="invalid"
                  style={{ display: 'block' }}
                >
                  {formik.errors.systemName}
                </Form.Control.Feedback>
              )}
            </div>
          )}
          {type !== 'edit' && (
            <>
              <div>
                <Form.Group className="mb-3">
                  <Form.Label>
                    <SafeFormatMessage id="Plan" />{' '}
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
                      <SafeFormatMessage id="Select-Option" />
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
                    <SafeFormatMessage id="cycle" />
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
                      <SafeFormatMessage id="Select-Option" />
                    </option>
                    {cyclesYouDontHave.map((cycleValue) => (
                      <option key={cycleValue} value={cycleValue}>
                        <SafeFormatMessage id={cycle[cycleValue]} />
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
                      <SafeFormatMessage id="All-values-are-assigned." />
                    </div>
                  ) : null}
                </Form.Group>
              </div>
            </>
          )}

          <div>
            <Form.Group className="mb-3">
              <Form.Label>
                <SafeFormatMessage id="Price" />{' '}
                <span style={{ color: 'red' }}> *</span>
              </Form.Label>
              <input
                type="text"
                className="form-control"
                id="price"
                name="price"
                onChange={formik.handleChange}
                value={
                  [1, 2].includes(tenancyType)
                    ? (formik.values.price = 0)
                    : formik.values.price
                }
                disabled={[1, 2].includes(tenancyType)}
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
                <SafeFormatMessage id="OldPrice" />{' '}
              </Form.Label>
              <input
                type="text"
                className="form-control"
                id="oldPrice"
                name="oldPrice"
                onChange={formik.handleChange}
                value={formik.values.oldPrice}
                disabled={[1, 2].includes(tenancyType)}
              />
              {formik.touched.oldPrice && formik.errors.oldPrice && (
                <Form.Control.Feedback
                  type="invalid"
                  style={{ display: 'block' }}
                >
                  {formik.errors.oldPrice}
                </Form.Control.Feedback>
              )}
            </Form.Group>
          </div>
          <MultilingualInput
            inputLabel="Description"
            languages={[
              { code: 'en', name: 'English' },
              { code: 'ar', name: 'Arabic' },
            ]}
            inputIds={{
              en: 'descriptionEn',
              ar: 'descriptionAr',
            }}
            placeholder={{
              en: 'English-Description',
              ar: 'Arabic-Description',
            }}
            values={{
              en: formik.values.descriptionEn,
              ar: formik.values.descriptionAr,
            }}
            onChange={formik.handleChange}
            isRequired={false}
            inputType="TextareaAndCounter"
            maxLength={250}
            errors={{
              en: formik.errors.descriptionEn,
              ar: formik.errors.descriptionAr,
            }}
            touched={{
              en: formik.touched.descriptionEn,
              ar: formik.touched.descriptionAr,
            }}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" type="submit">
            <SafeFormatMessage id="Submit" />
          </Button>
          <Button
            variant="link"
            className="text-gray "
            onClick={() => setVisible(false)}
          >
            <SafeFormatMessage id="Close" />
          </Button>
        </Modal.Footer>
      </Form>
    </Wrapper>
  )
}

export default PlanPriceForm
