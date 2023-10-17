import React, { useEffect, useState } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import useRequest from '../../../../axios/apis/useRequest.js'
import { cycle } from '../../../../const/index.js'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { Form, OverlayTrigger, Tooltip } from '@themesberg/react-bootstrap'
import { Modal, Button } from '@themesberg/react-bootstrap'
import {
  deleteAllPlan,
  deleteAllPlanPrice,
  setAllPlans,
  setAllSpecifications,
  setAllProduct,
} from '../../../../store/slices/products.js'
import { Wrapper } from './TenantForm.styled.jsx'
import { FormattedMessage, useIntl } from 'react-intl'
import SpecificationInput from '../../Product/CustomSpecification/SpecificationInput/SpecificationInput.jsx'
import { BsFillQuestionCircleFill } from 'react-icons/bs'

const TenantForm = ({
  type,
  tenantData,
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
  const [specValidationErrors, setSpecValidationErrors] = useState({})

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

  const createValidation = {
    title: Yup.string().max(
      100,
      <FormattedMessage id="Must-be-maximum-100-digits" />
    ),
    product: Yup.string().required(
      <FormattedMessage id="Please-select-a-product" />
    ),
    plan: Yup.string().required(<FormattedMessage id="Please-select-a-plan" />),
    price: Yup.string().required(
      <FormattedMessage id="Please-select-a-price" />
    ),

    uniqueName: Yup.string()
      .max(100, <FormattedMessage id="Must-be-maximum-100-digits" />)
      .required(<FormattedMessage id="Unique-Name-is-required" />)
      .matches(
        /^[a-zA-Z0-9_-]+$/,
        <FormattedMessage id="English-Characters,-Numbers,-and-Underscores-are-only-accepted." />
      ),
  }
  const editValidation = {
    title: Yup.string().max(
      1,
      <FormattedMessage id="Must-be-maximum-100-digits" />
    ),
  }
  const validationSchema = Yup.object().shape(
    type === 'create' ? createValidation : editValidation
  )

  const selectedProduct = tenantData?.subscriptions?.map((product) => {
    return product.productId
  })
  const specificationValuesObject = (tenantData?.subscriptions || [])
    .flatMap((subscription) => subscription?.specifications || [])
    .reduce((acc, specification) => {
      acc[specification.id] = specification.value
      return acc
    }, {})

  const initialValues = {
    title: tenantData ? tenantData.title : '',
    uniqueName: tenantData ? tenantData.uniqueName : '',
    plan: tenantData ? tenantData.plan : '',
    price: tenantData ? tenantData.price : '',
    product: tenantData ? selectedProduct : '',
  }
  const validateSpecifications = () => {
    const validateErrors = {}
    setSpecValidationErrors({})
    filteredSpecificationsArray &&
      filteredSpecificationsArray.forEach((specification) => {
        let {
          id: specificationId,
          isRequired,
          regularExpression,
          validationFailureDescription,
        } = specification

        const value = specificationValues[specificationId] || ''
        if (regularExpression.startsWith('/')) {
          regularExpression = regularExpression.slice(1)
        }
        if (regularExpression.endsWith('/')) {
          regularExpression = regularExpression.slice(0, -1)
        }

        let flags = ''
        if (/[gimus]+$/.test(regularExpression)) {
          flags = regularExpression.slice(-1)
          regularExpression = regularExpression.slice(0, -1)
        }

        let pattern = regularExpression

        let regex = new RegExp(pattern, flags)

        if (isRequired && !value.trim()) {
          validateErrors[specificationId] = 'This field is required'
        } else if (regularExpression && value.trim() && !regex.test(value)) {
          validateErrors[specificationId] = validationFailureDescription.en
        }
      })

    setSpecValidationErrors(validateErrors)
    return { errors: validateErrors }
  }

  const formik = useFormik({
    initialValues,
    validate: (values) => {
      try {
        validationSchema.validateSync(values, { abortEarly: false })
      } catch (validationErrors) {
        return validationErrors.inner.reduce((errors, error) => {
          const specErrors = validateSpecifications()
          formik.setErrors(specErrors.errors)

          return {
            ...errors,
            [error.path]: error.message,
          }
        }, {})
      }
    },

    onSubmit: async (values) => {
      const specificationsArray = filteredSpecificationsArray?.map(
        (specification) => {
          const specificationId = specification.id
          const value = specificationValues[specificationId] || ''
          return {
            specificationId,
            value,
            productId: selectedProduct[0],
          }
        }
      )
      const specErrors = validateSpecifications()
      formik.setErrors(specErrors.errors)

      if (
        Object.keys(formik.errors).length === 0 &&
        Object.keys(specErrors.errors).length === 0
      ) {
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
            uniqueName: values.uniqueName,
            title: values.title,
          })

          navigate(`/tenants/${createTenant.data.data.id}`)
        } else {
          const editTenant = await editTenantRequest({
            title: values.title,
            uniqueName: values.uniqueName,
            id: tenantData.id,
            product: selectedProduct,
            specifications: specificationsArray,
          })
          updateTenant()
        }
        setVisible && setVisible(false)
      }
    },
  })

  const intl = useIntl()
  let planOptions
  if (listData[formik.values.product]?.plans) {
    planOptions = Object.values(listData[formik.values.product].plans)
      .filter((item) => item.isPublished === true)
      .map((item, index) => ({
        value: item.id,
        label: item.name,
      }))
  } else {
    planOptions = []
  }

  const options = list.map((item) => {
    return { value: item.id, label: item.name }
  })
  const [specificationValues, setSpecificationValues] = useState({})

  useEffect(() => {
    ;(async () => {
      formik.setFieldValue('plan', '')
      formik.setFieldValue('price', '')
      if (listData[formik.values.product]) {
        if (!listData[formik.values.product].plans) {
          const planData = await getProductPlans(formik.values.product)
          dispatch(
            setAllPlans({
              productId: formik.values.product,
              data: planData.data.data,
            })
          )
        }
        if (!listData[formik.values.product].specifications) {
          const specifications = await getProductSpecification(
            formik.values.product
          )

          dispatch(
            setAllSpecifications({
              productId: formik.values.product,
              data: specifications.data.data,
            })
          )
        }
      }
    })()
  }, [formik.values.product])

  const productData = listData[formik.values.product]

  const allSpecificationsArray = productData?.specifications
    ? Object.values(productData.specifications)
    : []

  const filteredSpecificationsArray = allSpecificationsArray.filter(
    (spec) => spec.isPublished === true
  )

  useEffect(() => {
    if (type == 'edit' && Object.keys(specificationValuesObject).length > 0) {
      setSpecificationValues((prevValues) => ({
        ...prevValues,
        ...specificationValuesObject,
      }))
    }
  }, [type])
  const handleSpecificationChange = (specificationId, event) => {
    const newValue = event.target.value
    setSpecificationValues((prevValues) => ({
      ...prevValues,
      [specificationId]: newValue,
    }))
  }

  useEffect(() => {
    ;(async () => {
      formik.setFieldValue('price', '')

      if (formik.values.plan) {
        const planDataRes = await getProductPlanPriceList(formik.values.product)
        const planData = planDataRes.data.data
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
        setPriceList(planData)
      } else {
        setPriceList([])
      }
    })()
  }, [formik.values.plan, formik.values.product])

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
                <FormattedMessage id="Title" />
              </Form.Label>
              <input
                className="form-control"
                type="text"
                id="title"
                name="title"
                onChange={formik.handleChange}
                value={formik.values.title}
              />

              {formik.touched.title && formik.errors.title && (
                <Form.Control.Feedback
                  type="invalid"
                  style={{ display: 'block' }}
                >
                  {formik.errors.title}
                </Form.Control.Feedback>
              )}
            </Form.Group>
          </div>
          {type === 'create' && (
            <div>
              <Form.Group className="mb-3">
                <Form.Label>
                  <FormattedMessage id="Unique-Name" />{' '}
                  <span style={{ color: 'red' }}>*</span>
                </Form.Label>
                <input
                  className="form-control"
                  type="text"
                  id="uniqueName"
                  name="uniqueName"
                  onChange={formik.handleChange}
                  value={formik.values.uniqueName}
                />
                {formik.touched.uniqueName && formik.errors.uniqueName && (
                  <Form.Control.Feedback
                    type="invalid"
                    style={{ display: 'block' }}
                  >
                    {formik.errors.uniqueName}
                  </Form.Control.Feedback>
                )}
              </Form.Group>
            </div>
          )}
          {type === 'create' && (
            <div>
              <Form.Group className="mb-3">
                <Form.Label>
                  <FormattedMessage id="Product" />{' '}
                  <span style={{ color: 'red' }}>*</span>
                </Form.Label>
                <select
                  className="form-control"
                  name="product"
                  id="product"
                  value={formik.values.product}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                >
                  <option value="">
                    <FormattedMessage id="Select-Option" />
                  </option>
                  {options.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                {formik.touched.product && formik.errors.product && (
                  <Form.Control.Feedback
                    type="invalid"
                    style={{ display: 'block' }}
                  >
                    {formik.errors.product}
                  </Form.Control.Feedback>
                )}
              </Form.Group>
            </div>
          )}
          {/* ) : (
            <div>
              <Form.Group className="mb-3">
                <Form.Label>
                  <FormattedMessage id="Product" />{' '}
                  <span style={{ color: 'red' }}>*</span>
                </Form.Label>
                <select
                  className="form-control"
                  name="product"
                  id="product"
                  value={selectedProduct}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  disabled={true}
                >
                  <option value="">
                    <FormattedMessage id="Select-Option" />
                  </option>
                  {options.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                {formik.touched.product && formik.errors.product && (
                  <Form.Control.Feedback
                    type="invalid"
                    style={{ display: 'block' }}
                  >
                    {formik.errors.product}
                  </Form.Control.Feedback>
                )}
              </Form.Group>
            </div>
          )} */}
          {type === 'create' && (
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
                  disabled={!formik.values.product}
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
          )}
          {type === 'create' && (
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
                  disabled={!formik.values.plan || !formik.values.product}
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
          )}
          {type === 'create' &&
            Array.isArray(filteredSpecificationsArray) &&
            filteredSpecificationsArray.length > 0 && (
              <>
                <SpecificationInput
                  specifications={filteredSpecificationsArray}
                  specificationValues={specificationValues}
                  handleSpecificationChange={handleSpecificationChange}
                  tenantData={tenantData}
                  intl={intl}
                  specValidationErrors={specValidationErrors}
                />
              </>
            )}

          {/* {formik.errors.specifications && (
            <div className="text-danger">{formik.errors.specifications}</div>
          )} */}
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

export default TenantForm
