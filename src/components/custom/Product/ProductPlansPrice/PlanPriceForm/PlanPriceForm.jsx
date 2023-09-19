import React, { useEffect } from 'react'
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
} from '../../../../../store/slices/products.js'

import TextareaAndCounter from '../../../Shared/TextareaAndCounter/TextareaAndCounter.jsx'
import { cycle } from '../../../../../const/index.js'

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

  const initialValues = {
    plan: plan || (planPriceData ? planPriceData.plan.id : ''),
    cycle: cycleValue || (planPriceData ? planPriceData.cycle : ''),
    price: planPriceData ? planPriceData.price : '',
    description: planPriceData ? planPriceData.description : '',
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
      .min(1, <FormattedMessage id="The-price-must-be-more-than-0" />),
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
              // planId: values.plan,
              plan: { id: values.plan, name: allPlans[values.plan].name },
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
          setActiveIndex(4)
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
              plan: { id: values.plan, name: allPlans[values.plan].name },
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
      return { value: item.id, label: item.name }
    })
  } else {
    planOptions = []
  }

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
          {type != 'edit' && (
            <>
              <div>
                <Form.Group className="mb-3">
                  <Form.Label>
                    <FormattedMessage id="Plan" />{' '}
                    <span style={{ color: 'red' }}>*</span>
                  </Form.Label>
                  <select
                    className="form-select"
                    name="plan"
                    id="plan"
                    value={formik.values.plan}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
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
            </>
          )}

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
              >
                <option value="">Select Option</option>
                {Object.entries(cycle).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
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
            </Form.Group>
          </div>

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
            className="text-gray ms-auto"
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
