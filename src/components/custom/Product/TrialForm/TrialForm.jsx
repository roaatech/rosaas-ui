import React, { useEffect, useState } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import useRequest from '../../../../axios/apis/useRequest.js'
import { cycle } from '../../../../const/index.js'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { Form } from '@themesberg/react-bootstrap'
import { Modal, Button } from '@themesberg/react-bootstrap'
import {
  deleteAllPlan,
  deleteAllPlanPrice,
  setAllPlans,
  setAllSpecifications,
  setAllProduct,
} from '../../../../store/slices/products/productsSlice.js'
import { Wrapper } from './TrialForm.styled.jsx'
import { FormattedMessage, useIntl } from 'react-intl'
import SpecificationInput from '../../Product/CustomSpecification/SpecificationInput/SpecificationInput.jsx'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faToggleOff, faToggleOn } from '@fortawesome/free-solid-svg-icons'
import AutoGenerateInput from '../../Shared/AutoGenerateInput/AutoGenerateInput.jsx'
import { setAllPlansPrice } from '../../../../store/slices/products/productsSlice.js'
import { ProductTrialType } from '../../../../const/product.js'

const TrialForm = ({
  type,
  trialData,
  update,
  updateTenant,
  setVisible,
  popupLabel,
}) => {
  const {
    createTenantRequest,
    editTenantRequest,
    getProductPlans,
    getProductPlanPriceList,
    getProductSpecification,
  } = useRequest()
  const [submitLoading, setSubmitLoading] = useState()
  const [priceList, setPriceList] = useState([])
  const navigate = useNavigate()

  const dispatch = useDispatch()
  const { getProductList } = useRequest()
  const params = useParams()
  const productId = params.id

  const listData = useSelector((state) => state.products.products)

  let list = Object.values(listData)

  useEffect(() => {
    if (!listData) {
      let query = `?page=1&pageSize=50&filters[0].Field=SearchTerm`
      ;(async () => {
        const productList = await getProductList(query)
        dispatch(setAllProduct(productList.data.data.items))
      })()
    }
  }, [])

  const createValidation = {
    trialType: Yup.number().required(),
    plan: Yup.string().required(<FormattedMessage id="Please-select-a-plan" />),
  }
  const editValidation = {
    trialType: Yup.number().required(),
    plan: Yup.string().required(<FormattedMessage id="Please-select-a-plan" />),
  }
  const validationSchema = Yup.object().shape(
    type === 'create' ? createValidation : editValidation
  )

  const selectedProduct = trialData?.subscriptions?.map((product) => {
    return product.productId
  })

  const initialValues = {
    trialType: trialData ? trialData.trialType : '',
    plan: trialData ? trialData.plan : '',
    price: trialData ? trialData.price : '',
    product: trialData ? selectedProduct : '',
  }

  const formik = useFormik({
    initialValues,
    validationSchema: validationSchema,

    onSubmit: async (values) => {
      const specificationsArray = productData?.specifications
        ? Object.values(productData.specifications).map((specification) => {
            const specificationId = specification.id
            const value =
              specificationValues[specificationId] !== undefined
                ? specificationValues[specificationId]
                : ''
            return {
              specificationId,
              value,
              productId: values.product,
            }
          })
        : []

      if (type == 'create') {
        const createTenant = await createTenantRequest({
          subscriptions: [
            {
              productId: values.product,
              planId: values.plan,
              planPriceId: values.price,
              specifications: specificationsArray,
            },
          ],
          systemName: values.systemName,
          displayName: values.displayName,
        })

        dispatch(
          deleteAllPlan({
            productId: values.product,
          })
        )
        dispatch(
          deleteAllPlanPrice({
            productId: values.product,
          })
        )

        navigate(`/tenants/${createTenant.data.data.id}`)
      } else {
        const editTenant = await editTenantRequest({
          displayName: values.displayName,
          id: trialData.id,
        })
        updateTenant()
      }
      setVisible && setVisible(false)
      setVisible && setVisible(false)
    },
  })

  const intl = useIntl()
  let planOptions
  if (listData[productId]?.plans) {
    planOptions = Object.values(listData[productId].plans)
      .filter((item) => item.isPublished === true)
      .map((item, index) => ({
        value: item.id,
        label: item.displayName,
      }))
  } else {
    planOptions = []
  }

  const options = list.map((item) => {
    return { value: item.id, label: item.systemName }
  })
  const [specificationValues, setSpecificationValues] = useState({})

  useEffect(() => {
    ;(async () => {
      formik.setFieldValue('plan', '')
      formik.setFieldValue('price', '')
      if (listData[productId]) {
        if (!listData[productId].plans) {
          const planData = await getProductPlans(productId)
          dispatch(
            setAllPlans({
              productId: productId,
              data: planData.data.data,
            })
          )
        }
      }
    })()
  }, [productId])

  const productData = listData[productId]

  const allSpecificationsArray = productData?.specifications
    ? Object.values(productData.specifications)
    : []

  const filteredSpecificationsArray = allSpecificationsArray.filter(
    (spec) => spec.isPublished === true
  )

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
                <FormattedMessage id="Trial-Type" />{' '}
                <span style={{ color: 'red' }}>*</span>
              </Form.Label>
              <select
                className="form-control"
                name="trialType"
                id="trialType"
                value={formik.values.trialType}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              >
                <option value="">
                  <FormattedMessage id="Select-Option" />{' '}
                </option>
                {Object.entries(ProductTrialType).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label && <FormattedMessage id={label} />}
                  </option>
                ))}
              </select>
              {formik.touched.trialType && formik.errors.trialType && (
                <Form.Control.Feedback
                  type="invalid"
                  style={{ display: 'block' }}
                >
                  {formik.errors.trialType}
                </Form.Control.Feedback>
              )}
            </Form.Group>
          </div>

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
                disabled={!productId}
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

export default TrialForm
