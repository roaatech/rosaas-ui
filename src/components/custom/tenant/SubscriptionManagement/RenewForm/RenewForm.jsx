import React, { useEffect, useState } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { Form } from '@themesberg/react-bootstrap'
import { Modal, Button } from '@themesberg/react-bootstrap'
import { Wrapper } from './RenewForm.styled'
import { FormattedMessage, useIntl } from 'react-intl'
import useRequest from '../../../../../axios/apis/useRequest.js'
import { cycle } from '../../../../../const/product.js'
import TextareaAndCounter from '../../../Shared/TextareaAndCounter/TextareaAndCounter.jsx'
import { useDispatch, useSelector } from 'react-redux'
import { setAllPlansPrice } from '../../../../../store/slices/products/productsSlice'
import SafeFormatMessage from '../../../Shared/SafeFormatMessage/SafeFormatMessage.jsx'

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
  const listData = useSelector((state) => state.products.products)
  const dispatch = useDispatch()
  const validationSchema = Yup.object().shape({
    price: Yup.string().required(
      <SafeFormatMessage id="Please-select-a-price" />
    ),
  })

  const initialValues = {
    price: tenantData ? tenantData.price : '',
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
        if (!listData[selectedProduct].plansPrice) {
          const planDataRes = await getProductPlanPriceList(selectedProduct)
          dispatch(
            setAllPlansPrice({
              productId: selectedProduct,
              data: planDataRes.data.data,
            })
          )
        }
        const planData = listData?.[selectedProduct]?.plansPrice
        if (planData) {
          const planDataArray = Object.values(planData)
            .filter(
              (item) =>
                item.plan.id === selectedPlan && item.isPublished === true
            )
            .map((item) => ({
              value: item.id,
              label: `${intl.formatMessage({
                id: cycle[item.cycle],
              })} (${item.price})`,
            }))
          setPriceList(planDataArray)
        }
      } else {
        setPriceList([])
      }
    })()
  }, [selectedPlan, selectedProduct, listData?.[selectedProduct]?.plansPrice])

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
                <SafeFormatMessage id="Subscription-Options" />{' '}
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
                  <SafeFormatMessage id="Select-Option" />{' '}
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
                <SafeFormatMessage id="Comment" />
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

export default RenewForm
