import React, { useEffect, useState } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import useRequest from '../../../../axios/apis/useRequest.js'
import { cycle } from '../../../../const/index.js'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { Form } from '@themesberg/react-bootstrap'
import { Modal, Button } from '@themesberg/react-bootstrap'
import {
  deleteAllPlan,
  deleteAllPlanPrice,
  setAllPlans,
  setAllSpecifications,
  setAllProduct,
} from '../../../../store/slices/products/productsSlice.js'
import { Wrapper } from './TenantForm.styled.jsx'
import { FormattedMessage, useIntl } from 'react-intl'
import SpecificationInput from '../../Product/CustomSpecification/SpecificationInput/SpecificationInput.jsx'
import { validateSpecifications } from '../validateSpecifications/validateSpecifications.jsx'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faToggleOff, faToggleOn } from '@fortawesome/free-solid-svg-icons'
import AutoGenerateInput from '../../Shared/AutoGenerateInput/AutoGenerateInput.jsx'
import { setAllPlansPrice } from '../../../../store/slices/products/productsSlice.js'

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
    if (!listData) {
      let query = `?page=1&pageSize=50&filters[0].Field=SearchTerm`
      ;(async () => {
        const productList = await getProductList(query)
        dispatch(setAllProduct(productList.data.data.items))
      })()
    }
  }, [])

  const createValidation = {
    displayName: Yup.string()
      .required(<FormattedMessage id="Title-is-required" />)
      .max(100, <FormattedMessage id="Must-be-maximum-100-digits" />),

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
    displayName: Yup.string()
      .required(<FormattedMessage id="Title-is-required" />)
      .max(100, <FormattedMessage id="Must-be-maximum-100-digits" />),
  }
  const validationSchema = Yup.object().shape(
    type === 'create' ? createValidation : editValidation
  )

  const selectedProduct = tenantData?.subscriptions?.map((product) => {
    return product.productId
  })
  const [titleToUnique, setTitleToUnique] = useState('')
  const specificationValuesObject = (tenantData?.subscriptions || [])
    .flatMap((subscription) => subscription?.specifications || [])
    .reduce((acc, specification) => {
      acc[specification.id] = specification.value
      return acc
    }, {})

  const initialValues = {
    displayName: tenantData ? tenantData.displayName : '',

    uniqueName: tenantData ? tenantData.uniqueName : '',
    plan: tenantData ? tenantData.plan : '',
    price: tenantData ? tenantData.price : '',
    product: tenantData ? selectedProduct : '',
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
      const specErrors = validateSpecifications(
        filteredSpecificationsArray,
        specificationValues,
        intl,
        setSpecValidationErrors
      )
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
            id: tenantData.id,
          })
          updateTenant()
        }
      }
      setVisible && setVisible(false)
      setVisible && setVisible(false)
    },
  })

  const intl = useIntl()
  let planOptions
  if (listData[formik.values.product]?.plans) {
    planOptions = Object.values(listData[formik.values.product].plans)
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
        if (!listData[formik.values.product].plansPrice) {
          const planDataRes = await getProductPlanPriceList(
            formik.values.product
          )
          dispatch(
            setAllPlansPrice({
              productId: formik.values.product,
              data: planDataRes.data.data,
            })
          )
        }
        const planData = listData?.[formik.values.product]?.plansPrice
        if (planData) {
          const planDataArray = Object.values(planData)
            .filter(
              (item) =>
                item.plan.id === formik.values.plan && item.isPublished === true
            )
            .map((item) => ({
              value: item.id,
              price: item.price,
              cycle: intl.formatMessage({
                id: cycle[item.cycle],
              }),
            }))
          setPriceList(planDataArray)
        } else {
          setPriceList([])
        }
      }
    })()
  }, [
    formik.values.plan,
    formik.values.product,
    listData?.[formik.values.product]?.plansPrice,
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
                <FormattedMessage id="Display-Name" />{' '}
                <span style={{ color: 'red' }}>*</span>
              </Form.Label>
              <input
                className="form-control"
                type="text"
                id="displayName"
                name="displayName"
                onChange={formik.handleChange}
                value={formik.values.displayName}
              />

              {formik.touched.displayName && formik.errors.displayName && (
                <Form.Control.Feedback
                  type="invalid"
                  style={{ display: 'block' }}
                >
                  {formik.errors.displayName}
                </Form.Control.Feedback>
              )}
            </Form.Group>
          </div>

          <div className="mb-3">
            {type === 'create' && (
              <AutoGenerateInput
                label={<FormattedMessage id="System-Name" />}
                id="systemName"
                value={formik.values.displayName}
                name={formik.values.systemName}
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
              />
            )}
            {formik.touched.systemName && formik.errors.systemName && (
              <Form.Control.Feedback
                type="invalid"
                style={{ display: 'block' }}
              >
                {formik.errors.systemName}
              </Form.Control.Feedback>
            )}
          </div>
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
                      <span className="dolar">$</span>
                      <div className="price">{option.price}</div>/
                      <div className="cycle">{option.cycle}</div>
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

          {formik.errors.specifications && (
            <div className="text-danger">{formik.errors.specifications}</div>
          )}
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
