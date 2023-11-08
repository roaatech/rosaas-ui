import React, { useEffect, useState } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { Form } from '@themesberg/react-bootstrap'
import { Modal, Button } from '@themesberg/react-bootstrap'
import { Wrapper } from './RenewForm.styled'
import { FormattedMessage, useIntl } from 'react-intl'
import useRequest from '../../../../../axios/apis/useRequest.js'
import {
  setAllPlans,
  setAllProduct,
} from '../../../../../store/slices/products/productsSlice.js'
import { setAllSpecifications } from '../../../../../store/slices/products/specificationReducers.js'
import { cycle } from '../../../../../const/product.js'
import TextareaAndCounter from '../../../Shared/TextareaAndCounter/TextareaAndCounter.jsx'

const RenewForm = ({
  tenantData,
  setVisible,
  popupLabel,
  selectedPlan,
  selectedProduct,
  currentSubscription,
  setUpdate,
  update,
}) => {
  const { getProductPlanPriceList, setAutoRenewal } = useRequest()
  const [submitLoading, setSubmitLoading] = useState()
  const [priceList, setPriceList] = useState([])
  const navigate = useNavigate()

  const dispatch = useDispatch()
  const { getProductList } = useRequest()

  const listData = useSelector((state) => state.products.products)
  let list = Object.values(listData)

  useEffect(() => {
    let query = `?page=1&pageSize=50&filters[0].Field=SearchTerm`

    ;(async () => {
      const productList = await getProductList(query)
      dispatch(setAllProduct(productList.data.data.items))
    })()
  }, [])

  const validationSchema = Yup.object().shape({
    price: Yup.string().required(
      <FormattedMessage id="Please-select-a-price" />
    ),
  })

  const initialValues = {
    plan: selectedPlan,
    price: tenantData ? tenantData.price : '',
    product: selectedProduct,
    comment: tenantData ? tenantData.comment : '',
  }

  const formik = useFormik({
    initialValues,
    validationSchema: validationSchema,

    onSubmit: async (values) => {
      const AutoRenewal = await setAutoRenewal({
        planPriceId: values.price,
        subscriptionId: currentSubscription,
        comment: values.comment,
      })
      setUpdate(update + 1)

      setVisible && setVisible(false)
      setVisible && setVisible(false)
    },
  })

  const intl = useIntl()

  useEffect(() => {
    ;(async () => {
      formik.setFieldValue('price', '')

      if (selectedPlan) {
        const planDataRes = await getProductPlanPriceList(selectedProduct)
        const planData = planDataRes.data.data
          .filter(
            (item) => item.plan.id === selectedPlan && item.isPublished === true
          )
          .map((item) => ({
            value: item.id,
            label: `${intl.formatMessage({
              id: cycle[item.cycle],
            })} (${item.price})`,
          }))
        setPriceList(planData)
      } else {
        setPriceList([])
      }
    })()
  }, [selectedPlan, selectedProduct])

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
                disabled={!selectedPlan || !selectedProduct}
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
          <div>
            <Form.Group className="mb-3">
              <Form.Label>
                <FormattedMessage id="Comment" />
              </Form.Label>
              <TextareaAndCounter
                maxLength="250"
                showCharCount="true"
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

export default RenewForm
